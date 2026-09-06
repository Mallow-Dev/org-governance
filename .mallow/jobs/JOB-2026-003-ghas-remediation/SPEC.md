# Remove paid GitHub security scans across Mallow-Dev

Job ID: `JOB-2026-003-ghas-remediation`

## Agent operating protocol

This specification is the authoritative execution contract.

At the beginning of every session, after every context compaction, and before producing the final report:

1. Read `JOB.json`.
2. Read this file in full.
3. Read `STATE.json`.
4. Read the relevant entries in `EVIDENCE.jsonl`.
5. Read `DECISIONS.md`.
6. Verify the current repository and GitHub state.
7. Continue from the recorded next action.

After every material action:

1. Update `STATE.json`.
2. Append supporting evidence.
3. Record PR numbers, commit SHAs, workflow run IDs and conclusions.
4. Record failures and abandoned approaches.
5. Set one explicit next action.

Do not alter this approved specification without an explicit recorded amendment.

## Objective

Remove paid GitHub Code Security and Secret Protection use from private/internal Mallow-Dev repositories while retaining free or self-hosted scanning, and prove the provider, repository and workflow state afterward.

## Scope

- Create PRs removing residual CodeQL, dependency-review, SARIF-to-code-scanning and `security-events: write` workflow integrations.
- Disable private-repository Secret Protection settings that remain enabled.
- Amend the organisation security configuration so it cannot enable paid features; preserve free dependency graph and Dependabot controls.
- Temporarily bypass only the branch protections required to merge the remediation PRs, then restore and verify them.
- Record all changed repositories, PRs, settings, rules and validation evidence.

## Out of scope

- Removing free public-repository security features or free organisation risk assessments.
- Disabling npm/pnpm audit, OSV, Semgrep CE, Gitleaks, Trivy, Checkov or self-hosted SonarQube.
- Permanent weakening of branch protection or review controls.

## Ordered tasks

1. Capture live repository, workflow, security-configuration, billing and ruleset state.
2. Prepare and validate workflow PRs for each residual integration.
3. Temporarily bypass protections, merge approved remediation PRs, and restore protections immediately.
4. Disable remaining private Secret Protection and amend the organisation security configuration.
5. Re-scan all repositories and billing state; record free alternatives and close the evidence pack.

## Constraints

- Preserve repository security controls.
- Branch-protection changes are temporary and must be restored before completion.
- Preserve free/self-hosted security assurance.
- Do not silently change the task definition.

## Validation requirements

- Complete default-branch workflow and Actions-registry sweep for all Mallow-Dev repositories.
- Verify `code_security`, CodeQL/default setup, Secret Protection, dependency-review and SARIF state.
- Verify organisation configuration defaults and associated repository statuses.
- Verify Code Security and Secret Protection active-committer billing counts are zero.
- Verify every temporary ruleset/protection mutation matches its pre-change snapshot.

## Acceptance criteria

Use stable criterion IDs. Do not check boxes or edit these criteria to record progress; progress belongs in evidence.

- AC-001: No private/internal repository has Code Security or Secret Protection enabled, and billing reports zero active paid-product committers.
- AC-002: No private/internal default-branch workflow invokes CodeQL, dependency review, SARIF upload into GitHub code scanning, or `security-events: write`; retained scanners remain outside paid GitHub ingestion.
- AC-003: The organisation has no paid-feature security configuration default, and any temporary branch/ruleset bypasses are fully restored and verified.
- AC-004: All remediation PRs and provider/repository setting changes are recorded with live GitHub evidence and free scanner recommendations.

## Final-report requirements

The final report must be generated from the job pack and verified repository state. It must include:

1. Outcome.
2. Acceptance-criteria audit.
3. Pull requests, merge SHAs and workflow evidence.
4. Decisions and deviations.
5. Remaining blockers and risks.
6. An explicit completion verdict.

## Definition of complete

The job is complete only when every acceptance criterion is supported by recorded evidence, no blocker remains, validation passes and the final report has been generated.
