# Mallow governance policy index

This index records the status and authority of governance documents retained in this repository.
It is the canonical status map referenced by the standards-authority contract.

## Current authority

| Document | Status | Authority |
|---|---|---|
| `docs/standards-authority.md` | Current | Defines the organisation standards authority chain and conflict-resolution boundary. |
| `policies/policy-index.md` | Current | Records which retained governance documents are current, transitional, historical, or implementation guidance. |
| `github-settings/branch-protection-rules.yaml` | Transitional desired-state input | Must be reconciled against live GitHub rulesets before enforcement conclusions are drawn. |

## Transitional or historical guidance

The following retained documents are not independent normative engineering authority. Where they
conflict with MEDRPS in `Mallow-Dev/org-engineering-standards`, MEDRPS governs the engineering
requirement and this repository governs applicability, repository classes, governance profiles,
approval boundaries and exceptions.

| Document | Status | Notes |
|---|---|---|
| `workflows/git-branching-strategy.md` | Transitional / superseded where conflicting | Existing branch/release guidance pending reconciliation with MEDRPS and repository `.github/mallow/repo-runtime.yml` declarations. |
| `workflows/pr-review-guidelines.md` | Transitional | Retained guidance; normative review requirements belong in the engineering standards authority. |
| `standards/*` | Historical / transitional unless explicitly promoted here | Detailed engineering standards belong in `Mallow-Dev/org-engineering-standards`. |
| `templates/*` | Implementation guidance | Templates must conform to current governance and engineering standards. |

## Evidence rule

Live GitHub/provider reads remain the evidence authority for what is actually enforced or deployed.
This index does not turn prose into runtime truth and must not be used to weaken live controls.
