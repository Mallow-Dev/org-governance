# Security Gate Standard

## Decision

Mallow-Dev repositories use a repository-owned `Security Gate` as the default security-check contract. The gate is independent of GitHub Advanced Security licensing and APIs.

The standard gate consists of:

- Semgrep Community Edition for static application security testing;
- Gitleaks for redacted secret detection;
- OSV-Scanner for dependency vulnerability scanning; and
- one aggregate check named exactly `Security Gate`.

The individual tools MAY be implemented differently for a repository's language or runtime, but the aggregate check MUST remain fail-closed and must not report success when a required scanner fails, is skipped unexpectedly, or cannot execute.

## Workflow requirements

The repository-owned workflow MUST:

- run on pull requests and provide a manually dispatchable diagnostic path;
- use least-privilege permissions, normally `contents: read`;
- pin actions and scanner images or downloads immutably, with checksums for downloaded binaries;
- redact secrets in output;
- avoid SARIF upload and GitHub security-scanning APIs;
- avoid production access, deployment mutation, and production publication; and
- document scanner scope, suppression policy, and the exact aggregate check name.

The workflow should also run on a scheduled default-branch scan where the repository runtime permits it.

## Branch-protection enrollment

`Security Gate` MUST be enrolled as a required status check only after the repository has published the workflow, proved a clean exact-head pull-request run, and verified that the protected branch can produce the context. A repository without the workflow MUST NOT be blocked by an unavailable security context.

The organization baseline does not require CodeQL, GHAS, secret-scanning services, dependency-review actions, or SARIF upload. Any repository that retains one of those controls requires an explicit, source-linked exception and a migration plan to this standard.

## Evidence

Security evidence records should include the exact repository head, workflow run IDs, scanner versions/digests, findings or clean results, suppression decisions, and the branch-protection context. A prose claim that a scan occurred is not sufficient when provider or workflow evidence is available.
