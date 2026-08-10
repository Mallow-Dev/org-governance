import assert from "node:assert/strict";
import test from "node:test";
import { protectionRulesForRepository } from "../scripts/protection-rules.js";

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
