import { Octokit } from "@octokit/rest";
import { parse } from "yaml";
import { readFileSync } from "fs";
import * as dotenv from "dotenv";

dotenv.config();

// Configuration
const SETTINGS_FILE = "github-settings/branch-protection-rules.yaml";
const ORG_NAME = "Mallow-Dev";

// CLI Args
const isDryRun = process.argv.includes("--dry-run");

interface ProtectionRules {
  required_pull_request_reviews?: {
    required_approving_review_count: number;
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
    require_last_push_approval: boolean;
  };
  required_status_checks?: {
    strict: boolean;
    checks: Array<{ context: string; app_id: number | null }>;
  };
  enforce_admins: boolean;
  restrictions: null | { users: string[]; teams: string[] };
  required_linear_history: boolean;
  allow_force_pushes: boolean;
  allow_deletions: boolean;
  required_conversation_resolution: boolean;
  lock_branch: boolean;
  allow_fork_syncing: boolean;
}

interface RepoConfig {
  name: string;
  branches: Record<string, { protection: ProtectionRules }>;
}

interface Settings {
  branches: Record<string, { protection: ProtectionRules }>;
  repositories?: RepoConfig[];
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("❌ GITHUB_TOKEN is missing in .env");
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token });

  console.log(`🔍 Reading governance settings from ${SETTINGS_FILE}...`);
  const settingsContent = readFileSync(SETTINGS_FILE, "utf-8");
  const settings = parse(settingsContent) as Settings;

  console.log(`🔍 Fetching repositories for ${ORG_NAME}...`);
  const repos = await octokit.repos.listForOrg({
    org: ORG_NAME,
    type: "all",
    per_page: 100,
  });

  console.log(isDryRun ? "⚠️  DRY RUN MODE - No changes will be applied" : "🚀 EXECUTION MODE - Applying changes...");

  for (const repo of repos.data) {
    if (repo.archived) continue;

    console.log(`\n📦 Processing ${repo.name}...`);

    // 1. Determine Rules (Default vs Override)
    let repoRules = settings.branches; // Default
    const override = settings.repositories?.find((r) => r.name === repo.name);

    if (override) {
      console.log(`   ✨ Found repository-specific overrides`);
      repoRules = override.branches;
    }

    // 2. Apply Rules for each defined branch
    for (const [branchName, config] of Object.entries(repoRules)) {
      const protection = config.protection;
      
      // Transform status checks for Octokit API
      // API expects 'contexts' array of strings, not 'checks' array of objects
      const statusChecksContexts = protection.required_status_checks?.checks.map(c => c.context) || [];
      
      const apiPayload: any = {
        owner: ORG_NAME,
        repo: repo.name,
        branch: branchName,
        required_status_checks: protection.required_status_checks ? {
          strict: protection.required_status_checks.strict,
          contexts: statusChecksContexts
        } : null,
        enforce_admins: protection.enforce_admins,
        required_pull_request_reviews: protection.required_pull_request_reviews,
        restrictions: protection.restrictions,
        required_linear_history: protection.required_linear_history,
        allow_force_pushes: protection.allow_force_pushes,
        allow_deletions: protection.allow_deletions,
        required_conversation_resolution: protection.required_conversation_resolution,
        lock_branch: protection.lock_branch,
        allow_fork_syncing: protection.allow_fork_syncing
      };

      if (isDryRun) {
        console.log(`   [DRY-RUN] Would protect branch '${branchName}':`);
        console.log(`     - Reviews Required: ${protection.required_pull_request_reviews?.required_approving_review_count}`);
        console.log(`     - Status Checks: ${statusChecksContexts.join(", ") || "None"}`);
        console.log(`     - Enforce Admins: ${protection.enforce_admins}`);
      } else {
        try {
          await octokit.repos.updateBranchProtection(apiPayload);
          console.log(`   ✅ Protected branch '${branchName}'`);
        } catch (error: any) {
          if (error.status === 404) {
             console.warn(`   ⚠️  Branch '${branchName}' does not exist. Skipping.`);
          } else {
             console.error(`   ❌ Failed to protect '${branchName}':`, error.message);
          }
        }
      }
    }
  }
}

main().catch(console.error);
