import assert from "node:assert/strict";
import test from "node:test";
import {
  developmentRulesetWithSpeedyExclusion,
  governanceLanePropertySchema,
  speedyDevelopmentRulesetPayload,
  SPEEDY_DEVELOPMENT_RULESET_NAME,
  type OrganizationBranchRuleset,
  type RulesetPolicySettings,
} from "../scripts/ruleset-policies.js";
import { syncOrganizationPolicies } from "../scripts/sync-branch-protection.js";

const speedyLaneSettings: RulesetPolicySettings = {
  branches: {
    development: {
      protection: {
        required_pull_request_reviews: {
          required_approving_review_count: 1,
          dismiss_stale_reviews: true,
          require_code_owner_reviews: false,
          require_last_push_approval: false,
        },
        required_status_checks: {
          strict: true,
          checks: [{ context: "ci-tests", app_id: null }],
        },
        required_conversation_resolution: true,
      },
    },
  },
  repository_properties: {
    governance_lane: {
      value_type: "single_select",
      description: "Development governance lane",
      allowed_values: ["standard", "speedy"],
      default_value: "standard",
      required: true,
      values_editable_by: "org_actors",
    },
  },
  ruleset_profiles: {
    "speedy-development": {
      repository_property: { name: "governance_lane", values: ["speedy"] },
      branches: {
        include: ["refs/heads/develop", "refs/heads/development"],
      },
      required_approving_review_count: 0,
      required_review_thread_resolution: true,
      required_status_checks: ["Fast PR Gate", "Review Gate"],
      preserve: [
        "required_signed_commits",
        "required_linear_history",
        "deletion_protection",
        "force_push_protection",
        "pull_request_required",
      ],
    },
  },
};

test("governance lane schema is emitted for org property sync", () => {
  assert.deepEqual(governanceLanePropertySchema(speedyLaneSettings), {
    property_name: "governance_lane",
    value_type: "single_select",
    description: "Development governance lane",
    allowed_values: ["standard", "speedy"],
    default_value: "standard",
    required: true,
    values_editable_by: "org_actors",
  });
});

test("speedy ruleset payload preserves existing extras while enforcing zero approvals", () => {
  const payload = speedyDevelopmentRulesetPayload(speedyLaneSettings, {
    id: 20696410,
    name: SPEEDY_DEVELOPMENT_RULESET_NAME,
    target: "branch",
    enforcement: "active",
    bypass_actors: [],
    conditions: {
      ref_name: { include: ["refs/heads/develop"], exclude: [] },
    },
    rules: [
      { type: "deletion" },
      { type: "non_fast_forward" },
      { type: "required_linear_history" },
      { type: "required_signatures" },
      {
        type: "pull_request",
        parameters: {
          allowed_merge_methods: ["squash"],
          required_approving_review_count: 2,
          dismiss_stale_reviews_on_push: false,
          require_code_owner_review: true,
          require_last_push_approval: true,
          required_review_thread_resolution: false,
        },
      },
      {
        type: "required_status_checks",
        parameters: {
          do_not_enforce_on_create: true,
          strict_required_status_checks_policy: false,
          required_status_checks: [
            { context: "Fast PR Gate", integration_id: 101 },
            { context: "Legacy Gate", integration_id: 202 },
          ],
        },
      },
    ],
  });

  assert.deepEqual(payload?.conditions, {
    ref_name: {
      include: ["refs/heads/develop", "refs/heads/development"],
      exclude: [],
    },
    repository_property: {
      include: [
        {
          name: "governance_lane",
          source: "custom",
          property_values: ["speedy"],
        },
      ],
      exclude: [],
    },
  });

  assert.deepEqual(
    payload?.rules.find((rule) => rule.type === "pull_request")?.parameters,
    {
      allowed_merge_methods: ["squash"],
      required_approving_review_count: 0,
      dismiss_stale_reviews_on_push: true,
      require_code_owner_review: false,
      require_last_push_approval: false,
      required_review_thread_resolution: true,
    },
  );

  assert.deepEqual(
    payload?.rules.find((rule) => rule.type === "required_status_checks")?.parameters,
    {
      do_not_enforce_on_create: true,
      strict_required_status_checks_policy: true,
      required_status_checks: [
        { context: "Fast PR Gate", integration_id: 101 },
        { context: "Review Gate" },
      ],
    },
  );
});

test("standard development rulesets can exclude speedy repositories", () => {
  const payload = developmentRulesetWithSpeedyExclusion(
    {
      id: 13729613,
      name: "orglevel-development",
      target: "branch",
      enforcement: "active",
      bypass_actors: [],
      conditions: {
        ref_name: {
          include: ["refs/heads/develop", "refs/heads/development"],
          exclude: [],
        },
      },
      rules: [
        {
          type: "pull_request",
          parameters: { required_approving_review_count: 1 },
        },
      ],
    },
    speedyLaneSettings,
  );

  assert.deepEqual(payload?.conditions.repository_property?.exclude, [
    {
      name: "governance_lane",
      source: "custom",
      property_values: ["speedy"],
    },
  ]);
});

test("organization policy sync upserts the property, speedy ruleset, and lane-aware exclusion", async () => {
  const requests: Array<{ route: string; params: Record<string, unknown> }> = [];
  const existingRulesets: OrganizationBranchRuleset[] = [
    {
      id: 13729613,
      name: "orglevel-development",
      target: "branch",
      enforcement: "active",
      bypass_actors: [],
      conditions: {
        ref_name: {
          include: ["refs/heads/develop", "refs/heads/development"],
          exclude: [],
        },
      },
      rules: [
        {
          type: "pull_request",
          parameters: { required_approving_review_count: 1 },
        },
      ],
    },
  ];

  const octokit = {
    repos: {
      async listForOrg() {
        return { data: [] };
      },
      async updateBranchProtection() {
        return {};
      },
    },
    async request(route: string, params: Record<string, unknown>) {
      requests.push({ route, params });

      if (route === "PATCH /orgs/{org}/properties/schema") {
        return { data: params.properties as Array<Record<string, unknown>> };
      }

      if (route === "GET /orgs/{org}/rulesets") {
        return { data: existingRulesets };
      }

      if (route === "POST /orgs/{org}/rulesets") {
        return {
          data: {
            id: 20696410,
            ...params,
          },
        };
      }

      if (route === "PUT /orgs/{org}/rulesets/{ruleset_id}") {
        return {
          data: {
            id: params.ruleset_id,
            ...params,
          },
        };
      }

      throw new Error(`Unexpected request: ${route}`);
    },
  };

  await syncOrganizationPolicies(octokit, speedyLaneSettings, "Mallow-Dev");

  assert.deepEqual(
    requests.map((request) => request.route),
    [
      "PATCH /orgs/{org}/properties/schema",
      "GET /orgs/{org}/rulesets",
      "POST /orgs/{org}/rulesets",
      "PUT /orgs/{org}/rulesets/{ruleset_id}",
    ],
  );

  assert.equal(requests[2]?.params.name, SPEEDY_DEVELOPMENT_RULESET_NAME);
  assert.deepEqual(
    (requests[2]?.params.conditions as Record<string, unknown>).repository_property,
    {
      include: [
        {
          name: "governance_lane",
          source: "custom",
          property_values: ["speedy"],
        },
      ],
      exclude: [],
    },
  );

  assert.deepEqual(
    ((requests[3]?.params.conditions as Record<string, unknown>).repository_property as Record<
      string,
      unknown
    >).exclude,
    [
      {
        name: "governance_lane",
        source: "custom",
        property_values: ["speedy"],
      },
    ],
  );
});
