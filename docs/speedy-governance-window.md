# Temporary speedy governance window

The approved `speedy` lane is a temporary development/integration profile for **14 August
2026 through 30 August 2026**. It is selected only by the organization custom property
`governance_lane=speedy`; `main`, `master`, and `release/*` remain governed by their standard
rulesets.

## Expiry owner and evidence

Reece is the named governance owner. At `2026-08-31T00:00:00Z` (the exclusive end of the
window), an organization administrator must run the guarded reversion command below. The
command is intentionally manual so the operator can inspect the target repositories and the
provider response before confirming the mutation.

The command defaults to a dry run, refuses to run before the expiry, and changes only repositories
whose live `governance_lane` value is `speedy`. It writes a non-secret JSON evidence report to
`evidence/speedy-governance-reversion-YYYY-MM-DD.json`; attach that report, the post-mutation
provider read-back, and the resulting commit/PR or provider reference to the durable child job.

```bash
node --version # must report v24.x
npm ci
npm test
npm run revert:speedy -- --evidence-file evidence/speedy-governance-reversion-2026-08-31.json
npm run revert:speedy -- --execute --evidence-file evidence/speedy-governance-reversion-2026-08-31.json
```

The second command requires `GITHUB_TOKEN` with organization-property administration. Never put
the token or any other credential in the evidence file, logs, GitHub, Notion, or the durable job.
The evidence file reports repository names, the bounded window, the execution mode, and the
property update request only.

## Post-reversion read-back

After the `--execute` command, read back the provider state and record the output:

```bash
gh api orgs/Mallow-Dev/properties/values --paginate
gh api orgs/Mallow-Dev/rulesets/20696410
```

Every former speedy opt-in must report `governance_lane=standard`. The `speedy-development`
ruleset may remain as a dormant, source-controlled policy definition, but no repository may
remain opted in after expiry without a newly approved governance decision. If the provider
mutation or read-back fails, stop and record the exact error as a blocker rather than retrying
blindly or weakening another ruleset.
