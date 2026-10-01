/**
 * Retired safety boundary. The former implementation overwrote main protection
 * from transitional YAML. Do not revive it as a compatibility shortcut.
 *
 * Reconcile live rulesets through the read-only standards audit, then propose
 * individually approved provider changes. This entry point deliberately loads
 * no credentials, reads no .env and instantiates no provider client.
 */
console.error(
  "Legacy protection synchronisation is retired: no provider writes performed. " +
    "Read policies/policy-index.md and use the private engineering catalogue's " +
    "read-only capture-provider/audit-provider commands. Approved provider " +
    "changes require their own exact-target review and execution evidence.",
);
process.exitCode = 1;
