export interface RepositoryPropertyDefinition {
  value_type: "single_select" | "string" | "boolean" | "multi_select";
  description: string;
  allowed_values: string[];
  default_value: string;
  required: boolean;
  values_editable_by: "org_actors" | "org_and_repo_actors";
}

export interface SpeedyDevelopmentProfile {
  repository_property: {
    name: string;
    values: string[];
  };
  branches: {
    include: string[];
  };
  required_approving_review_count: number;
  required_review_thread_resolution: boolean;
  required_status_checks: string[];
  preserve: string[];
}

export interface RulesetPolicySettings {
  repository_properties?: Record<string, RepositoryPropertyDefinition>;
  ruleset_profiles?: {
    "speedy-development"?: SpeedyDevelopmentProfile;
  };
}

export function governanceLaneDefinition(
  settings: RulesetPolicySettings,
): RepositoryPropertyDefinition | undefined {
  return settings.repository_properties?.governance_lane;
}

export function speedyDevelopmentProfile(
  settings: RulesetPolicySettings,
): SpeedyDevelopmentProfile | undefined {
  return settings.ruleset_profiles?.["speedy-development"];
}

export function isSpeedyLane(value: unknown): boolean {
  return value === "speedy";
}
