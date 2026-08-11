import assert from "node:assert/strict";
import test from "node:test";
import { protectionRulesForRepository } from "../scripts/protection-rules.js";
import {
  governanceLaneDefinition,
  isSpeedyLane,
  speedyDevelopmentProfile,
} from "../scripts/ruleset-policies.js";

const defaultProtection = { required_status_checks: { checks: ["ci-tests"] } };
const pluginProtection = {
  required_status_checks: { checks: ["plugin-validation"] },
};
const runtimeProtection = {
  required_status_checks: { checks: ["ci-tests", "security-scan"] },
};

test("agent-plugin repositories select the lightweight class", () => {
  const rules = protectionRulesForRepository("agent-plugin-mallow-code-review", {
    branches: { main: { protection: defaultProtection } },
    repository_classes: {
      plugin: {
        name_prefix: "agent-plugin-",
        branches: { main: { protection: pluginProtection } },
      },
    },
  });

  assert.deepEqual(rules, pluginProtection);
});

test("ordinary agent repositories keep the default rules", () => {
  const rules = protectionRulesForRepository("agent-runtime", {
    branches: { main: { protection: defaultProtection } },
    repository_classes: {
      plugin: {
        name_prefix: "agent-plugin-",
        branches: { main: { protection: pluginProtection } },
      },
    },
  });

  assert.deepEqual(rules, defaultProtection);
});

test("the longest matching prefix wins", () => {
  const rules = protectionRulesForRepository("agent-plugin-example", {
    branches: { main: { protection: defaultProtection } },
    repository_classes: {
      runtime: {
        name_prefix: "agent-",
        branches: { main: { protection: runtimeProtection } },
      },
      plugin: {
        name_prefix: "agent-plugin-",
        branches: { main: { protection: pluginProtection } },
      },
    },
  });

  assert.deepEqual(rules, pluginProtection);
});

test("a matching class without main protection falls back to the default", () => {
  const rules = protectionRulesForRepository("agent-plugin-example", {
    branches: { main: { protection: defaultProtection } },
    repository_classes: {
      plugin: { name_prefix: "agent-plugin-" },
    },
  });

  assert.deepEqual(rules, defaultProtection);
});

test("speedy lane is an explicit, controlled development-only property", () => {
  const settings = {
    repository_properties: {
      governance_lane: {
        value_type: "single_select" as const,
        description: "Development governance lane",
        allowed_values: ["standard", "speedy"],
        default_value: "standard",
        required: true,
        values_editable_by: "org_actors" as const,
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
        required_status_checks: ["Fast PR Gate"],
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

  assert.equal(governanceLaneDefinition(settings)?.default_value, "standard");
  assert.deepEqual(speedyDevelopmentProfile(settings)?.branches.include, [
    "refs/heads/develop",
    "refs/heads/development",
  ]);
  assert.equal(speedyDevelopmentProfile(settings)?.required_approving_review_count, 0);
  assert.equal(isSpeedyLane("speedy"), true);
  assert.equal(isSpeedyLane("standard"), false);
});
