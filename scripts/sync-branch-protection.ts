import { Octokit } from "@octokit/rest";
import { parse } from "yaml";
import { readFileSync } from "fs";
import * as dotenv from "dotenv";

dotenv.config();

// Configuration
const GOVERNANCE_REPO = "Mallow-Dev/org-governance";
const SETTINGS_FILE = "github-settings/branch-protection-rules.yaml";
const ORG_NAME = "Mallow-Dev";

function protectionRulesForRepository(repoName: string, settings: any) {
  for (const classSettings of Object.values(settings.repository_classes ?? {})) {
    const prefix = (classSettings as any)?.name_prefix;
    if (typeof prefix === "string" && repoName.startsWith(prefix)) {
      return (classSettings as any)?.branches?.main?.protection;
    }
  }
  return settings.branches?.main?.protection;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("❌ GITHUB_TOKEN is missing in .env");
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });

  console.log("🔍 Reading governance settings...");
  const settingsContent = readFileSync(SETTINGS_FILE, "utf-8");
  const settings = parse(settingsContent);

  console.log("🔍 Fetching repositories...");
  const repos = await octokit.repos.listForOrg({
    org: ORG_NAME,
    type: "all",
    per_page: 100,
  });

  for (const repo of repos.data) {
    if (repo.archived) continue;

    console.log(`⚙️  Syncing ${repo.name}...`);

    // Apply to 'main' branch
    try {
      const protectionRules = protectionRulesForRepository(repo.name, settings);
      if (!protectionRules) {
        console.warn(`⚠️  ${repo.name}: No protection rules found for 'main' in YAML.`);
        // Skip protection for this branch, but continue processing repository
      } else {
        await octokit.repos.updateBranchProtection({
          owner: ORG_NAME,
          repo: repo.name,
          branch: "main",
          ...protectionRules,
        });
        console.log(`✅ ${repo.name}: Protected 'main'`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ ${repo.name}: Failed to protect 'main'`, error.message);
      } else {
        console.error(`❌ ${repo.name}: Failed to protect 'main'`, error);
      }
    }
}

main().catch(console.error);
