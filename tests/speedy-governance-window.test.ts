import assert from "node:assert/strict";
import test from "node:test";
import {
  buildReversionRequest,
  revertSpeedyRepositories,
  SPEEDY_WINDOW_END,
  speedyRepositoriesToRevert,
} from "../scripts/revert-speedy-governance.js";

const speedyRepositories = [
  {
    repository_full_name: "Mallow-Dev/zeta",
    properties: [{ property_name: "governance_lane", value: "speedy" }],
  },
  {
    repository_full_name: "Mallow-Dev/alpha",
    properties: [{ property_name: "governance_lane", value: "standard" }],
  },
];

test("reversion refuses to run before the approved expiry", () => {
  assert.throws(
    () => speedyRepositoriesToRevert(speedyRepositories, new Date("2026-08-30T23:59:59Z")),
    new RegExp(SPEEDY_WINDOW_END),
  );
});

test("reversion selects only speedy repositories after expiry", () => {
  assert.deepEqual(
    speedyRepositoriesToRevert(speedyRepositories, new Date("2026-08-31T00:00:00Z")),
    ["Mallow-Dev/zeta"],
  );
});

test("reversion request resets the governance lane to standard", () => {
  assert.deepEqual(buildReversionRequest(["Mallow-Dev/zeta", "Mallow-Dev/zeta"]), {
    repository_names: ["Mallow-Dev/zeta"],
    properties: [{ property_name: "governance_lane", value: "standard" }],
  });
  assert.equal(buildReversionRequest([]), null);
});

test("reversion uses the organization property endpoint", async () => {
  const calls: Array<{ route: string; parameters: Record<string, unknown> }> = [];
  const client = {
    async paginate() {
      return [];
    },
    async request<T = unknown>(route: string, parameters: Record<string, unknown>) {
      calls.push({ route, parameters });
      return { data: [] as T };
    },
  };

  await revertSpeedyRepositories(client, "Mallow-Dev", ["Mallow-Dev/zeta"]);

  assert.deepEqual(calls, [
    {
      route: "PATCH /orgs/{org}/properties/values",
      parameters: {
        org: "Mallow-Dev",
        repository_names: ["Mallow-Dev/zeta"],
        properties: [{ property_name: "governance_lane", value: "standard" }],
      },
    },
  ]);
});
