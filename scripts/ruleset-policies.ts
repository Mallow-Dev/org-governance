export type PropertyValuesEditableBy = "org_actors" | "org_and_repo_actors";

interface RepositoryPropertyDefinitionBase {
  description: string;
  required: boolean;
  values_editable_by: PropertyValuesEditableBy;
}

interface SelectPropertyDefinition extends RepositoryPropertyDefinitionBase {
  value_type: "single_select" | "multi_select";
  allowed_values: string[];
  default_value: string;
}

interface StringPropertyDefinition extends RepositoryPropertyDefinitionBase {
  value_type: "string";
  default_value?: string;
}

interface BooleanPropertyDefinition extends RepositoryPropertyDefinitionBase {
  value_type: "boolean";
  default_value?: "true" | "false";
}

export type RepositoryPropertyDefinition =
  | SelectPropertyDefinition
  | StringPropertyDefinition
  | BooleanPropertyDefinition;

export interface BranchProtectionReviewSettings {
  required_approving_review_count?: number;
  dismiss_stale_reviews?: boolean;
  require_code_owner_reviews?: boolean;
  require_last_push_approval?: boolean;
}

export interface BranchProtectionStatusCheck {
  context: string;
  app_id?: number | null;
}

export interface BranchProtectionStatusChecks {
  strict?: boolean;
  checks?: BranchProtectionStatusCheck[];
}

export interface BranchProtectionSettings {
  required_pull_request_reviews?: BranchProtectionReviewSettings;
  required_status_checks?: BranchProtectionStatusChecks;
  required_conversation_resolution?: boolean;
  required_linear_history?: boolean;
  allow_force_pushes?: boolean;
  allow_deletions?: boolean;
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
  branches?: {
    main?: {
      protection?: unknown;
    };
    development?: {
      protection?: BranchProtectionSettings;
    };
  };
  repository_classes?: Record<string, unknown>;
  repository_properties?: Record<string, RepositoryPropertyDefinition>;
  ruleset_profiles?: {
    "speedy-development"?: SpeedyDevelopmentProfile;
  };
}

export interface RepositoryPropertySelector {
  name: string;
  property_values: string[];
  source?: "custom" | "system";
}

export interface RulesetRefNameCondition {
  include: string[];
  exclude?: string[];
}

export interface RulesetRepositoryPropertyCondition {
  include?: RepositoryPropertySelector[];
  exclude?: RepositoryPropertySelector[];
}

export interface RulesetConditions {
  ref_name?: RulesetRefNameCondition;
  repository_name?: {
    include: string[];
    exclude?: string[];
    protected?: boolean;
  };
  repository_property?: RulesetRepositoryPropertyCondition;
}

export interface RulesetRule {
  type: string;
  parameters?: Record<string, unknown>;
}

export interface OrganizationBranchRuleset {
  id?: number;
  name: string;
  target: "branch";
  enforcement: "active" | "disabled" | "evaluate";
  bypass_actors?: Array<Record<string, unknown>>;
  conditions?: RulesetConditions | null;
  rules?: RulesetRule[];
}

export interface OrganizationBranchRulesetRequest {
  name: string;
  target: "branch";
  enforcement: "active" | "disabled" | "evaluate";
  bypass_actors: Array<Record<string, unknown>>;
  conditions: RulesetConditions;
  rules: RulesetRule[];
}

type PropertySchemaBase = {
  property_name: string;
  description: string;
  required: boolean;
  values_editable_by: PropertyValuesEditableBy;
};

export type OrganizationPropertySchema =
  | (PropertySchemaBase & {
      value_type: "single_select" | "multi_select";
      allowed_values: string[];
      default_value: string;
    })
  | (PropertySchemaBase & {
      value_type: "string";
      default_value?: string;
    })
  | (PropertySchemaBase & {
      value_type: "boolean";
      default_value?: "true" | "false";
    });

export const GOVERNANCE_LANE_PROPERTY_NAME = "governance_lane";
export const SPEEDY_DEVELOPMENT_RULESET_NAME = "speedy-development";

const DEFAULT_DEVELOPMENT_BRANCH_REFS = [
  "refs/heads/develop",
  "refs/heads/development",
];
const CUSTOM_PROPERTY_SOURCE = "custom" as const;
const PRESERVED_RULE_TYPES = {
  required_signed_commits: "required_signatures",
  required_linear_history: "required_linear_history",
  deletion_protection: "deletion",
  force_push_protection: "non_fast_forward",
} as const;

export function governanceLaneDefinition(
  settings: RulesetPolicySettings,
): RepositoryPropertyDefinition | undefined {
  return settings.repository_properties?.[GOVERNANCE_LANE_PROPERTY_NAME];
}

export function governanceLanePropertySchema(
  settings: RulesetPolicySettings,
): OrganizationPropertySchema | undefined {
  const definition = governanceLaneDefinition(settings);
  if (!definition) {
    return undefined;
  }

  const base = {
    property_name: GOVERNANCE_LANE_PROPERTY_NAME,
    description: definition.description,
    required: definition.required,
    values_editable_by: definition.values_editable_by,
  };

  if (definition.value_type === "single_select" || definition.value_type === "multi_select") {
    return {
      ...base,
      value_type: definition.value_type,
      allowed_values: definition.allowed_values,
      default_value: definition.default_value,
    };
  }

  return {
    ...base,
    value_type: definition.value_type,
    ...(definition.default_value !== undefined ? { default_value: definition.default_value } : {}),
  };
}

export function speedyDevelopmentProfile(
  settings: RulesetPolicySettings,
): SpeedyDevelopmentProfile | undefined {
  return settings.ruleset_profiles?.["speedy-development"];
}

export function isSpeedyLane(value: unknown): boolean {
  return value === "speedy";
}

export function developmentBranchRefs(settings: RulesetPolicySettings): string[] {
  const refs = speedyDevelopmentProfile(settings)?.branches.include;
  if (!Array.isArray(refs) || refs.length === 0) {
    return DEFAULT_DEVELOPMENT_BRANCH_REFS;
  }

  return [...new Set(refs)];
}

export function organizationRulesetRequest(
  ruleset: OrganizationBranchRuleset,
): OrganizationBranchRulesetRequest {
  return {
    name: ruleset.name,
    target: ruleset.target,
    enforcement: ruleset.enforcement,
    bypass_actors: [...(ruleset.bypass_actors ?? [])],
    conditions: { ...(ruleset.conditions ?? {}) },
    rules: [...(ruleset.rules ?? [])],
  };
}

export function speedyDevelopmentRulesetPayload(
  settings: RulesetPolicySettings,
  existingRuleset?: OrganizationBranchRuleset,
): OrganizationBranchRulesetRequest | undefined {
  const profile = speedyDevelopmentProfile(settings);
  if (!profile) {
    return undefined;
  }

  const developmentProtection = settings.branches?.development?.protection;
  const existingRulesByType = new Map(
    (existingRuleset?.rules ?? []).map((rule) => [rule.type, rule]),
  );

  const rules: RulesetRule[] = [];

  for (const preservedRule of profile.preserve) {
    if (preservedRule === "pull_request_required") {
      continue;
    }

    const mappedRuleType =
      PRESERVED_RULE_TYPES[preservedRule as keyof typeof PRESERVED_RULE_TYPES];
    if (!mappedRuleType) {
      continue;
    }

    rules.push(existingRulesByType.get(mappedRuleType) ?? { type: mappedRuleType });
  }

  rules.push(
    buildSpeedyPullRequestRule(
      profile,
      developmentProtection,
      existingRulesByType.get("pull_request"),
    ),
  );

  const statusChecksRule = buildSpeedyStatusChecksRule(
    profile,
    developmentProtection,
    existingRulesByType.get("required_status_checks"),
  );
  if (statusChecksRule) {
    rules.push(statusChecksRule);
  }

  const preservedRuleTypes = new Set(rules.map((rule) => rule.type));
  for (const existingRule of existingRulesByType.values()) {
    if (!preservedRuleTypes.has(existingRule.type)) {
      rules.push(existingRule);
    }
  }

  return {
    name: SPEEDY_DEVELOPMENT_RULESET_NAME,
    target: "branch",
    enforcement: existingRuleset?.enforcement ?? "active",
    bypass_actors: [...(existingRuleset?.bypass_actors ?? [])],
    conditions: {
      ref_name: {
        include: developmentBranchRefs(settings),
        exclude: [],
      },
      repository_property: {
        include: [speedyRepositoryPropertySelector(profile)],
        exclude: [],
      },
    },
    rules,
  };
}

export function developmentRulesetNeedsSpeedyExclusion(
  ruleset: OrganizationBranchRuleset,
  settings: RulesetPolicySettings,
): boolean {
  if (ruleset.name === SPEEDY_DEVELOPMENT_RULESET_NAME) {
    return false;
  }

  const profile = speedyDevelopmentProfile(settings);
  if (!profile) {
    return false;
  }

  const includedRefs = ruleset.conditions?.ref_name?.include ?? [];
  if (
    !includedRefs.some((refName) =>
      developmentBranchRefs(settings).includes(refName),
    )
  ) {
    return false;
  }

  const pullRequestRule = findRule(ruleset, "pull_request");
  const approvalCount = Number(
    (pullRequestRule?.parameters?.required_approving_review_count as number | undefined) ?? 0,
  );
  if (!Number.isFinite(approvalCount) || approvalCount <= 0) {
    return false;
  }

  const propertyCondition = ruleset.conditions?.repository_property;
  return !containsRepositoryPropertySelector(
    propertyCondition?.exclude,
    speedyRepositoryPropertySelector(profile),
  ) &&
    !containsRepositoryPropertySelector(
      propertyCondition?.include,
      standardRepositoryPropertySelector(settings),
    );
}

export function developmentRulesetWithSpeedyExclusion(
  ruleset: OrganizationBranchRuleset,
  settings: RulesetPolicySettings,
): OrganizationBranchRulesetRequest | undefined {
  if (!developmentRulesetNeedsSpeedyExclusion(ruleset, settings)) {
    return undefined;
  }

  const profile = speedyDevelopmentProfile(settings);
  if (!profile || (ruleset.conditions?.repository_name && !ruleset.conditions?.repository_property)) {
    return undefined;
  }

  const existingRepositoryProperty = ruleset.conditions?.repository_property ?? {};
  return organizationRulesetRequest({
    ...ruleset,
    conditions: {
      ...(ruleset.conditions ?? {}),
      repository_property: {
        ...existingRepositoryProperty,
        exclude: appendRepositoryPropertySelector(
          existingRepositoryProperty.exclude ?? [],
          speedyRepositoryPropertySelector(profile),
        ),
      },
    },
  });
}

function speedyRepositoryPropertySelector(
  profile: SpeedyDevelopmentProfile,
): RepositoryPropertySelector {
  return {
    name: profile.repository_property.name,
    property_values: profile.repository_property.values,
    source: CUSTOM_PROPERTY_SOURCE,
  };
}

function standardRepositoryPropertySelector(
  settings: RulesetPolicySettings,
): RepositoryPropertySelector | undefined {
  const definition = governanceLaneDefinition(settings);
  if (!definition) {
    return undefined;
  }

  return {
    name: GOVERNANCE_LANE_PROPERTY_NAME,
    property_values: [definition.default_value],
    source: CUSTOM_PROPERTY_SOURCE,
  };
}

function appendRepositoryPropertySelector(
  selectors: RepositoryPropertySelector[],
  selector: RepositoryPropertySelector,
): RepositoryPropertySelector[] {
  if (containsRepositoryPropertySelector(selectors, selector)) {
    return selectors;
  }

  return [...selectors, selector];
}

function containsRepositoryPropertySelector(
  selectors: RepositoryPropertySelector[] | undefined,
  selector: RepositoryPropertySelector | undefined,
): boolean {
  if (!selector) {
    return false;
  }

  return (selectors ?? []).some(
    (candidate) =>
      candidate.name === selector.name &&
      (candidate.source ?? CUSTOM_PROPERTY_SOURCE) === selector.source &&
      selector.property_values.every((value) =>
        candidate.property_values.includes(value),
      ),
  );
}

function findRule(
  ruleset: OrganizationBranchRuleset,
  type: string,
): RulesetRule | undefined {
  return ruleset.rules?.find((rule) => rule.type === type);
}

function buildSpeedyPullRequestRule(
  profile: SpeedyDevelopmentProfile,
  developmentProtection: BranchProtectionSettings | undefined,
  existingRule: RulesetRule | undefined,
): RulesetRule {
  const baseReviews = developmentProtection?.required_pull_request_reviews ?? {};
  return {
    type: "pull_request",
    parameters: {
      ...(existingRule?.parameters ?? {}),
      required_approving_review_count: profile.required_approving_review_count,
      dismiss_stale_reviews_on_push: baseReviews.dismiss_stale_reviews ?? false,
      require_code_owner_review: baseReviews.require_code_owner_reviews ?? false,
      require_last_push_approval: baseReviews.require_last_push_approval ?? false,
      required_review_thread_resolution:
        profile.required_review_thread_resolution ??
        developmentProtection?.required_conversation_resolution ??
        false,
    },
  };
}

function buildSpeedyStatusChecksRule(
  profile: SpeedyDevelopmentProfile,
  developmentProtection: BranchProtectionSettings | undefined,
  existingRule: RulesetRule | undefined,
): RulesetRule | undefined {
  if (profile.required_status_checks.length === 0) {
    return undefined;
  }

  const existingParameters = existingRule?.parameters ?? {};
  const existingStatusChecks = Array.isArray(existingParameters.required_status_checks)
    ? (existingParameters.required_status_checks as Array<Record<string, unknown>>)
    : [];
  const integrationIdsByContext = new Map(
    existingStatusChecks
      .map((statusCheck) => {
        if (
          typeof statusCheck.context !== "string" ||
          typeof statusCheck.integration_id !== "number"
        ) {
          return undefined;
        }

        return [statusCheck.context, statusCheck.integration_id] as const;
      })
      .filter((entry): entry is readonly [string, number] => Boolean(entry)),
  );

  return {
    type: "required_status_checks",
    parameters: {
      ...existingParameters,
      do_not_enforce_on_create:
        typeof existingParameters.do_not_enforce_on_create === "boolean"
          ? existingParameters.do_not_enforce_on_create
          : false,
      strict_required_status_checks_policy:
        developmentProtection?.required_status_checks?.strict ?? true,
      required_status_checks: profile.required_status_checks.map((context) => {
        const integrationId = integrationIdsByContext.get(context);
        return integrationId === undefined
          ? { context }
          : { context, integration_id: integrationId };
      }),
    },
  };
}
