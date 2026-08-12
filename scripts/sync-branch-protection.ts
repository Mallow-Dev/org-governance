import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";
import * as dotenv from "dotenv";
import { pathToFileURL } from "url";
import { parse } from "yaml";
import { protectionRulesForRepository } from "./protection-rules.js";
import {
  developmentRulesetWithSpeedyExclusion,
  governanceLanePropertySchema,
  organizationRulesetRequest,
  speedyDevelopmentRulesetPayload,
  SPEEDY_DEVELOPMENT_RULESET_NAME,
  type OrganizationBranchRuleset,
  type RulesetPolicySettings,
} from "./ruleset-policies.js";

dotenv.config();

export const SETTINGS_FILE = "github-settings/branch-protection-rules.yaml";
export const ORG_NAME = "Mallow-Dev";

type RepositorySummary = {
  name: string;
  archived?: boolean;
};

export interface OctokitLike {
  repos: {
    listForOrg(params: {
      org: string;
      type: string;
      per_page: number;
    }): Promise<{ data: RepositorySummary[] }>;
    updateBranchProtection(
      params: Record<string, unknown>,
    ): Promise<unknown>;
  };
  request<T = unknown>(
    route: string,
    params: Record<string, unknown>,
  ): Promise<{ data: T }>;
}

export function loadGovernanceSettings(
  settingsFile: string = SETTINGS_FILE,
): RulesetPolicySettings {
  return parse(readFileSync(settingsFile, "utf-8"));
}

export async function syncOrganizationPolicies(
  octokit: OctokitLike,
  settings: RulesetPolicySettings,
  org: string = ORG_NAME,
): Promise<void> {
  await syncGovernanceLaneProperty(octokit, settings, org);

  const branchRulesets = await listOrganizationBranchRulesets(octokit, org);

  await syncSpeedyDevelopmentRuleset(octokit, settings, branchRulesets, org);
  await syncDevelopmentRulesetLaneAwareness(
    octokit,
    settings,
    branchRulesets,
    org,
  );
}

export async function syncMainBranchProtection(
  octokit: OctokitLike,
  settings: RulesetPolicySettings,
  org: string = ORG_NAME,
): Promise<void> {
  console.log("🔍 Fetching repositories...");
  const repos = await octokit.repos.listForOrg({
    org,
    type: "all",
    per_page: 100,
  });

  for (const repo of repos.data) {
    if (repo.archived) {
      continue;
    }

    console.log(`⚙️  Syncing ${repo.name}...`);

    try {
      const protectionRules = protectionRulesForRepository(repo.name, settings);
      if (!protectionRules) {
        console.warn(`⚠️  ${repo.name}: No protection rules found for 'main' in YAML.`);
        continue;
      }

      await octokit.repos.updateBranchProtection({
        owner: org,
        repo: repo.name,
        branch: "main",
        ...protectionRules,
      });
      console.log(`✅ ${repo.name}: Protected 'main'`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ ${repo.name}: Failed to protect 'main'`, error.message);
      } else {
        console.error(`❌ ${repo.name}: Failed to protect 'main'`, error);
      }
    }
  }
}

async function syncGovernanceLaneProperty(
  octokit: OctokitLike,
  settings: RulesetPolicySettings,
  org: string,
): Promise<void> {
  const property = governanceLanePropertySchema(settings);
  if (!property) {
    return;
  }

  const response = await octokit.request<
    Array<{ property_name?: string }>
  >("PATCH /orgs/{org}/properties/schema", {
    org,
    properties: [property],
  });
  const syncedProperty = response.data.find(
    (entry) => entry.property_name === property.property_name,
  );

  console.log(
    `✅ Synced organization property '${syncedProperty?.property_name ?? property.property_name}'`,
  );
}

async function listOrganizationBranchRulesets(
  octokit: OctokitLike,
  org: string,
): Promise<OrganizationBranchRuleset[]> {
  const response = await octokit.request<OrganizationBranchRuleset[]>(
    "GET /orgs/{org}/rulesets",
    {
      org,
      targets: "branch",
      per_page: 100,
    },
  );

  const rulesets: OrganizationBranchRuleset[] = [];

  // The list endpoint returns summaries, so hydrate each ruleset before any policy checks.
  for (const ruleset of response.data) {
    if (!ruleset.id) {
      rulesets.push(ruleset);
      continue;
    }

    rulesets.push(await getOrganizationBranchRuleset(octokit, org, ruleset.id));
  }

  return rulesets;
}

async function getOrganizationBranchRuleset(
  octokit: OctokitLike,
  org: string,
  rulesetId: number,
): Promise<OrganizationBranchRuleset> {
  const response = await octokit.request<OrganizationBranchRuleset>(
    "GET /orgs/{org}/rulesets/{ruleset_id}",
    {
      org,
      ruleset_id: rulesetId,
    },
  );

  return response.data;
}

async function syncSpeedyDevelopmentRuleset(
  octokit: OctokitLike,
  settings: RulesetPolicySettings,
  branchRulesets: OrganizationBranchRuleset[],
  org: string,
): Promise<void> {
  const existingRuleset = branchRulesets.find(
    (ruleset) => ruleset.name === SPEEDY_DEVELOPMENT_RULESET_NAME,
  );
  const payload = speedyDevelopmentRulesetPayload(settings, existingRuleset);
  if (!payload) {
    return;
  }

  const syncedRuleset = await upsertOrganizationRuleset(
    octokit,
    payload,
    existingRuleset,
    org,
  );

  if (!existingRuleset) {
    branchRulesets.push(syncedRuleset);
    return;
  }

  Object.assign(existingRuleset, syncedRuleset);
}

async function syncDevelopmentRulesetLaneAwareness(
  octokit: OctokitLike,
  settings: RulesetPolicySettings,
  branchRulesets: OrganizationBranchRuleset[],
  org: string,
): Promise<void> {
  for (const existingRuleset of branchRulesets) {
    if (!existingRuleset.id) {
      continue;
    }

    const payload = developmentRulesetWithSpeedyExclusion(
      existingRuleset,
      settings,
    );
    if (!payload) {
      continue;
    }

    const syncedRuleset = await upsertOrganizationRuleset(
      octokit,
      payload,
      existingRuleset,
      org,
    );
    Object.assign(existingRuleset, syncedRuleset);
  }
}

async function upsertOrganizationRuleset(
  octokit: OctokitLike,
  payload:
    | OrganizationBranchRuleset
    | ReturnType<typeof organizationRulesetRequest>,
  existingRuleset: OrganizationBranchRuleset | undefined,
  org: string,
): Promise<OrganizationBranchRuleset> {
  const requestPayload = organizationRulesetRequest(payload);

  if (existingRuleset?.id) {
    const response = await octokit.request<OrganizationBranchRuleset>(
      "PUT /orgs/{org}/rulesets/{ruleset_id}",
      {
        org,
        ruleset_id: existingRuleset.id,
        ...requestPayload,
      },
    );
    console.log(`✅ Synced org ruleset '${response.data.name}' (#${response.data.id})`);
    return response.data;
  }

  const response = await octokit.request<OrganizationBranchRuleset>(
    "POST /orgs/{org}/rulesets",
    {
      org,
      ...requestPayload,
    },
  );
  console.log(`✅ Synced org ruleset '${response.data.name}' (#${response.data.id})`);
  return response.data;
}

export async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("❌ GITHUB_TOKEN is missing in .env");
    process.exit(1);
  }

  const octokit = new Octokit({ auth: token }) as unknown as OctokitLike;

  console.log("🔍 Reading governance settings...");
  const settings = loadGovernanceSettings();

  await syncOrganizationPolicies(octokit, settings);
  await syncMainBranchProtection(octokit, settings);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
