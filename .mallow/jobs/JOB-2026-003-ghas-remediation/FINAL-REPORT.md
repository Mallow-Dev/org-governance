# Final report

Job: Remove paid GitHub security scans across Mallow-Dev

Job ID: `JOB-2026-003-ghas-remediation`

Generated: 2026-09-06T23:29:38.214Z

## Outcome

All recorded acceptance criteria are supported by evidence and no blocker remains.

## Acceptance-criteria audit

| Criterion | Requirement | Status | Evidence |
|---|---|---|---|
| AC-001 | No private/internal repository has Code Security or Secret Protection enabled, and billing reports zero active paid-product committers. | Satisfied | `evidence-20260906232917-4e82dffd`, `evidence-20260906232917-a8f77593` |
| AC-002 | No private/internal default-branch workflow invokes CodeQL, dependency review, SARIF upload into GitHub code scanning, or `security-events: write`; retained scanners remain outside paid GitHub ingestion. | Satisfied | `evidence-20260906232917-a8f77593`, `evidence-20260906232918-a6d38390`, `evidence-20260906232918-a0b31a55`, `evidence-20260906232918-6fb7ef31` |
| AC-003 | The organisation has no paid-feature security configuration default, and any temporary branch/ruleset bypasses are fully restored and verified. | Satisfied | `evidence-20260906232918-03b7a460`, `evidence-20260906232918-16c80513`, `evidence-20260906232918-6fb7ef31` |
| AC-004 | All remediation PRs and provider/repository setting changes are recorded with live GitHub evidence and free scanner recommendations. | Satisfied | `evidence-20260906232918-a0b31a55`, `evidence-20260906232918-16c80513`, `evidence-20260906232918-76a2d6e9` |

## Evidence summary

- `evidence-20260906232917-4e82dffd` — Live billing verification: Code Security and Secret Protection each report zero active committers and zero repositories. (https://api.github.com/orgs/Mallow-Dev/settings/billing/advanced-security?advanced_security_product=code_security)
- `evidence-20260906232917-a8f77593` — Fresh Mallow-Dev inventory and private-repository setting sweep: 76 repositories, 69 private; every private repository has Code Security absent/disabled and Secret Protection/secret scanning/push protection disabled. (https://api.github.com/orgs/Mallow-Dev/repos?type=all)
- `evidence-20260906232918-a6d38390` — Default-branch source sweep across all 76 repositories found zero workflow files containing CodeQL, dependency review, GitHub SARIF ingestion, security-events write, or GitHub Code Security markers. (https://github.com/Mallow-Dev)
- `evidence-20260906232918-a0b31a55` — Eight remediation pull requests are merged: original five plus mm-smore-platform-v1-main, mm-smore-platform-v2, and newsletter-maker-pro-local. (https://github.com/Mallow-Dev/org-governance/issues/17)
- `evidence-20260906232918-03b7a460` — Organization code-security configuration 17 was explicitly set to default_for_new_repos=none; the defaults endpoint is empty. The immutable global template remains present but is not a default, and GitHub rejected update/delete attempts against it. (https://api.github.com/orgs/Mallow-Dev/code-security/configurations/defaults)
- `evidence-20260906232918-16c80513` — Temporary branch/ruleset bypasses were removed; all ten captured ruleset cores and all five comparable classic branch-protection snapshots match their original settings. Archived repositories were re-archived. (https://github.com/Mallow-Dev/org-governance/issues/17)
- `evidence-20260906232918-6fb7ef31` — GitHub lists 37 historical generated dynamic CodeQL workflow registrations in private repositories. Their Code Security settings are disabled, latest observed runs predate remediation, billing is zero, and GitHub rejects disable/delete operations for these generated registrations. (https://docs.github.com/en/rest/code-scanning/code-scanning)
- `evidence-20260906232918-76a2d6e9` — Org-governance issue 17 updated with the complete change ledger, free scanner baseline, verification results, and the immutable-template limitation. (https://github.com/Mallow-Dev/org-governance/issues/17)

## Decisions and deviations

See `DECISIONS.md` for approved amendments and implementation decisions.

## Remaining blockers

None recorded.

## Completion verdict

COMPLETE
