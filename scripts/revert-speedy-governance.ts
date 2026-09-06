import { Octokit } from "@octokit/rest/dist-node/index.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const ORG_NAME = "Mallow-Dev";
export const GOVERNANCE_LANE_PROPERTY = "governance_lane";
export const STANDARD_LANE = "standard";
export const SPEEDY_LANE = "speedy";
export const SPEEDY_WINDOW_START = "2026-08-14T00:00:00.000Z";
// The approved window includes 30 August and expires at the start of 31 August UTC.
export const SPEEDY_WINDOW_END = "2026-08-31T00:00:00.000Z";

export interface RepositoryPropertyValue {
  property_name: string;
  value: string | string[] | null;
}

export interface RepositoryProperties {
  repository_full_name: string;
  properties: RepositoryPropertyValue[];
}

export interface PropertyReversionRequest {
  repository_names: string[];
  properties: Array<{
    property_name: string;
    value: string;
  }>;
}

export interface ReversionEvidence {
  action: "speedy-governance-reversion";
  org: string;
  window: {
    start: string;
    endExclusive: string;
  };
  executedAt: string;
  dryRun: boolean;
  revertedRepositories: string[];
  request: PropertyReversionRequest | null;
}

export interface PropertiesClient {
  paginate<T>(
    route: string,
    parameters: Record<string, unknown>,
  ): Promise<T[]>;
  request<T = unknown>(
    route: string,
    parameters: Record<string, unknown>,
  ): Promise<{ data: T }>;
}

export function isSpeedyWindowExpired(now: Date = new Date()): boolean {
  return now.getTime() >= Date.parse(SPEEDY_WINDOW_END);
}

export function speedyRepositoriesToRevert(
  repositories: RepositoryProperties[],
  now: Date = new Date(),
): string[] {
  if (!isSpeedyWindowExpired(now)) {
    throw new Error(
      `The speedy governance window does not expire until ${SPEEDY_WINDOW_END}.`,
    );
  }

  return repositories
    .filter((repository) =>
      repository.properties.some(
        (property) =>
          property.property_name === GOVERNANCE_LANE_PROPERTY &&
          property.value === SPEEDY_LANE,
      ),
    )
    .map((repository) => repository.repository_full_name)
    .sort();
}

export function buildReversionRequest(
  repositoryNames: string[],
): PropertyReversionRequest | null {
  if (repositoryNames.length === 0) {
    return null;
  }

  return {
    repository_names: [...new Set(repositoryNames)].sort(),
    properties: [
      {
        property_name: GOVERNANCE_LANE_PROPERTY,
        value: STANDARD_LANE,
      },
    ],
  };
}

export async function revertSpeedyRepositories(
  client: PropertiesClient,
  org: string,
  repositoryNames: string[],
): Promise<PropertyReversionRequest | null> {
  const request = buildReversionRequest(repositoryNames);
  if (!request) {
    return null;
  }

  await client.request("PATCH /orgs/{org}/properties/values", {
    org,
    ...request,
  });
  return request;
}

async function run(): Promise<void> {
  const args = process.argv.slice(2);
  const execute = args.includes("--execute");
  const evidenceIndex = args.indexOf("--evidence-file");
  const evidenceFile =
    evidenceIndex >= 0 && args[evidenceIndex + 1]
      ? args[evidenceIndex + 1]
      : `evidence/speedy-governance-reversion-${new Date().toISOString().slice(0, 10)}.json`;
  const org = process.env.MALLOW_GOVERNANCE_ORG ?? ORG_NAME;
  const now = new Date();

  if (!isSpeedyWindowExpired(now)) {
    throw new Error(
      `Refusing reversion before ${SPEEDY_WINDOW_END}; use the approved expiry runbook.`,
    );
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is required for the organization property read-back.");
  }

  const client = new Octokit({ auth: token }) as unknown as PropertiesClient;
  const repositories = await client.paginate<RepositoryProperties>(
    "GET /orgs/{org}/properties/values",
    { org, per_page: 100 },
  );
  const repositoryNames = speedyRepositoriesToRevert(repositories, now);
  const request = execute
    ? await revertSpeedyRepositories(client, org, repositoryNames)
    : buildReversionRequest(repositoryNames);
  const evidence: ReversionEvidence = {
    action: "speedy-governance-reversion",
    org,
    window: { start: SPEEDY_WINDOW_START, endExclusive: SPEEDY_WINDOW_END },
    executedAt: now.toISOString(),
    dryRun: !execute,
    revertedRepositories: repositoryNames,
    request,
  };

  const outputPath = resolve(evidenceFile);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(evidence, null, 2));
  console.log(`Evidence written to ${outputPath}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
