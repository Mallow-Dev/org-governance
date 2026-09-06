# Mallow Time-Bounded Security Exception Standard

| Field | Value |
|---|---|
| Standard ID | `MTBSE` |
| Version | `1.0` |
| Status | Approved for adoption; source merge and rollout remain governed changes |
| Approved | 2026-09-05 |
| Governance owner | Mallow technical governance |
| Authority | `Mallow-Dev/org-governance` |
| Engineering control | MEDRPS `SEC-004` in `Mallow-Dev/org-engineering-standards` |

## 1. Purpose

Mallow security controls fail closed by default. MTBSE is the only normal governance mechanism for accepting one exact residual security risk for a bounded period when the underlying finding cannot yet be safely removed.

An MTBSE decision is **not** scanner suppression, a permanent allowlist, a branch-protection bypass, or a declaration that a vulnerability is clean. The scanner continues to run normally and the finding remains visible. MTBSE changes only the final policy decision for the exact approved finding while every approved fact remains true.

## 2. Authority and precedence

`org-governance` owns exception applicability, approval, lifecycle, review boundaries, expiry, revocation and renewal. `org-engineering-standards` owns the technical enforcement contract (`SEC-004`). Repository/shared implementation may enforce those contracts but may not broaden them.

GitHub/provider evidence is authoritative for what ran, who approved, current status and what was enforced.

### 2.1 Public/private data boundary

When repository identity, vulnerability posture, release lane, compensating controls or equivalent operational facts are non-public, the full decision MUST remain in the affected private repository or another approved private store.

Public governance carries only a non-sensitive **authority envelope** containing the exception ID, lifecycle state, cryptographic digest of the private decision, bound standard revision, approval requirements and time boundaries.

Public governance MUST NOT publish private repository names, branches, package/version findings, source paths, mitigation implementation details, internal URLs or equivalent private security posture unless those facts are already intentionally public.

## 3. Core invariants

A conforming MTBSE decision MUST satisfy all of the following:

1. **Exact scope.** Repository, control/scanner, ecosystem, package/component, exact installed version, advisory identities, PR/ref and environment match the private decision.
2. **Unsuppressed scanner evidence.** The scanner runs normally and machine-readable evidence is retained.
3. **No collateral allowance.** Additional, changed, unmatched, malformed or ambiguous findings fail closed.
4. **Provider-authenticated approval.** Self-declared approval metadata is insufficient.
5. **Independent approver authority.** Actor authority is validated against a canonical governance role registry outside the exception decision.
6. **Independent private-decision review.** Required reviewers must review the actual private decision digest and contents, not only an opaque public envelope.
7. **Immutable governance envelope.** The private decision binds an exact governance commit, path and raw SHA-256.
8. **RFC 8785 digest binding.** The private decision digest is JCS/SHA-256 and must equal the envelope `decision_sha256`.
9. **Bound standard revision.** The envelope carries `standard_commit`; enforcement proves the authority head descends from it and that applicable MTBSE standard content is unchanged.
10. **Merged governance authority.** An open/unmerged governance PR cannot authorise `accepted-risk`.
11. **Independent live status.** Every evaluation checks current governance status plus revocation history.
12. **Terminal revocation.** A post-approval revocation permanently invalidates that decision revision even if a tracking issue is later reopened.
13. **Current risk facts.** Severity, vector, exploitation and equivalent approved facts are re-read from an independent machine-readable source.
14. **Current remediation availability.** Fixed/remediated-version state is re-read independently; a newly available fix invalidates a no-fix decision.
15. **Remediation identity binding.** The remediation advisory must be one of the scanner-scoped advisory IDs and resolve to the same package/ecosystem.
16. **Adoptability evidence.** If a fix exists but is temporarily unusable, content-addressed evidence for that blocker is mandatory.
17. **Content-addressed compensating controls.** Security-significant predicates, dependencies, affected call sites and focused tests are bound to immutable content identities.
18. **Exhaustive affected-surface binding.** A relevant source tree or equivalent exhaustive check prevents new unlisted vulnerable call sites inheriting an old exception.
19. **Hard activation/review/expiry boundaries.** `starts_at < review_due_at <= expires_at`; reject before start and at/after review or expiry.
20. **Single effective window.** The digest-bound private `window` is authoritative; any public envelope copy must be semantically identical.
21. **No silent renewal.** Extending time or scope requires a new private digest, new envelope and fresh authenticated approval/private review.
22. **Freshness for every mutable input.** Merge/release use a freshly rerun exact-head security decision; old green evidence is invalid after material live-state change.
23. **Provider-level boundary invalidation.** Review/expiry boundaries have an auditable mechanism that re-runs or replaces merge-relevant security evidence.
24. **Fail closed on evidence failure.** Missing, malformed, unreachable, stale or ambiguous scanner/governance/approval/risk/remediation/control/time evidence blocks the exception.

## 4. Eligibility

The normal lane MAY be used where the residual risk is documented and at least one applies:

- no patched release is currently published by the approved source;
- advisory/vulnerability metadata is credibly disputed and correction is pending;
- a patch exists but a verified compatibility or safety blocker prevents safe immediate adoption;
- an urgent release must proceed while bounded remediation is actively in progress.

The normal lane MUST NOT be used to avoid ordinary dependency maintenance, failing tests, missing review, secret leakage, malicious-code detection, unexplained scanner errors, or a vulnerability that can be fixed safely in the current release.

Critical vulnerabilities are not eligible for the normal lane and require incident/break-glass authority.

## 5. Maximum windows

| Severity | Maximum lifetime | Maximum review interval | Minimum approval |
|---|---:|---:|---|
| Critical | Not eligible | N/A | Break-glass / incident authority |
| High | 7 days | 48 hours | Security owner + organisation release approver |
| Medium | 30 days | 7 days | Project/technical owner + organisation release approver for production-impacting work |
| Low | 90 days | 30 days | Project/technical owner |

Unknown severity is treated as High until classified. Escalation above the approved class invalidates the existing decision immediately.

## 6. Private decision and public authority envelope

### 6.1 Private decision

The repository-local decision normally lives at:

```text
.mallow/security-exceptions/<exception-id>.json
```

It contains exact finding scope, risk/remediation evidence, compensating-control evidence, approval/private-review references, window, enforcement identities and an `authority` pointer.

### 6.2 Canonical private-decision digest — RFC 8785 JCS

The canonical digest MUST use **RFC 8785 JSON Canonicalization Scheme (JCS)**. Informal “sorted JSON” or implementation-specific compact JSON is prohibited.

Before hashing, remove only the repository-local `authority` pointer. The remaining source MUST satisfy JCS/I-JSON requirements, including no duplicate object property names, valid Unicode scalar strings with no lone surrogates, finite IEEE-754 JSON numbers and no Unicode normalisation/mutation before canonicalisation.

JCS output uses no insignificant whitespace, ECMAScript-compatible primitive serialization, recursive property ordering by raw UTF-16 code units, preserved array order and UTF-8 output bytes. SHA-256 of those bytes is the private `decision_sha256`.

Implementations MUST include RFC 8785 conformance regressions and reject non-I-JSON source before hashing.

### 6.3 Public authority envelope

For a private decision, governance stores only:

```text
exceptions/<exception-id>.json
```

The envelope contains at minimum:

- `schema_version`, `id`, `status`, `subject_visibility`;
- `standard_commit`;
- `decision_sha256`;
- risk owner and required independent reviewers;
- authenticated approval/tracking/governance references; and
- `window.starts_at`, `window.review_due_at`, `window.expires_at`.

The private `authority` pointer identifies the envelope by exact repository, commit, path and raw SHA-256. Enforcement proves both the envelope bytes and the RFC 8785 private digest.

The public envelope window is governance/scheduling metadata only until it is proven exactly equal to the digest-bound private window. It cannot extend an existing decision.

### 6.4 Canonical approver registry

GitHub-backed implementations validate approval authority against:

```text
Mallow-Dev/org-governance:main/standards/security-exception-approvers.json
```

Production-impacting Medium/High decisions require an independent reviewer with organisation release or security authority and distinct from the risk owner. If the registry cannot be fetched/parsed or does not authorise a named actor, the decision fails closed.

## 7. Provider-authenticated approval, private review and revocation

For GitHub-backed MTBSE, enforcement MUST:

- require the declared authority commit to equal the exact governance PR head;
- require that governance PR to be merged to its canonical base before `accepted-risk` can authorise release work;
- verify actor authority using the canonical merged approver registry;
- require an authenticated risk-owner event bound to exception ID, authority commit, envelope raw hash and private decision digest;
- require every independent reviewer to have a current exact-head `APPROVED` governance review;
- require authenticated exact-head private-review evidence naming the configured private-review marker and canonical private decision digest;
- require reviewer/risk-owner separation;
- read current tracking status and event history; and
- treat any post-approval close/revocation event as terminal for that revision.

A later push invalidates exact-head approval until the required reviewers approve the new head.

## 8. Risk, remediation and control evidence

A current-risk adapter MUST compare the approved independent risk snapshot with current machine-readable authority data. For CVE-backed decisions this includes publication state, CVSS score/severity/vector and available CISA SSVC exploitation/automatable/technical-impact facts.

A dependency decision MUST re-query current remediation/fixed-version state. `risk.remediation_availability.advisory_id` MUST be one of `scope.advisory_ids`; its lookup must resolve to that same advisory and the same scoped package/ecosystem.

A newly published fix invalidates a previous no-fix decision. If a fix already exists but is temporarily unsafe/unusable, the decision additionally binds content-addressed adoptability-blocker evidence; a change to that blocker requires reassessment.

Security-significant code/test evidence MUST be content-addressed, and the relevant affected source tree MUST be bound or exhaustively checked.

## 9. Machine-enforcement order

A Security Gate relying on MTBSE MUST:

1. run the scanner normally and retain machine-readable output;
2. load the private decision and reject non-I-JSON source;
3. fetch/hash the immutable public authority envelope;
4. recompute RFC 8785 JCS/SHA-256 of the private decision and match `decision_sha256`;
5. require public/private window equality;
6. validate `standard_commit` ancestry and unchanged standard content;
7. validate actor authority against the canonical role registry;
8. verify risk-owner approval, exact-head governance approval and merged governance authority;
9. verify exact-head private-decision review;
10. verify live status and terminal revocation history;
11. verify current risk and current remediation/adoptability evidence;
12. verify content-addressed compensating controls and exhaustive source-tree identity;
13. enforce exact scope plus `starts_at`, review and expiry boundaries;
14. reject collateral findings; and
15. emit `accepted-risk` only for the exact approved finding, otherwise `blocked`.

The aggregate required check MAY be green after this proof but MUST NOT describe the underlying vulnerable scan as clean.

## 10. Merge freshness, scheduled review and automatic expiry

Time and live upstream/governance facts are enforcement inputs, not reminders.

- `starts_at` is a hard not-before boundary.
- `review_due_at` is a hard re-authorisation boundary.
- `expires_at` is a final hard stop.
- A merge/release relying on `accepted-risk` MUST use a fresh exact-head MTBSE evaluation immediately before final merge authorisation. For the initial GitHub implementation the accepted-risk run SHOULD be no more than 30 minutes old.
- The fresh run revalidates live revocation, approver authority/private review, risk, remediation, content/tree evidence and current time.
- A success recorded before a material live-input change or boundary is not valid evidence afterward.
- The provider implementation MUST also re-run or replace merge-relevant security evidence no later than review and expiry boundaries.
- Active exceptions require periodic early-invalidation checks even without source pushes.

A passive reminder does not satisfy MTBSE.

## 11. Renewal and revocation

Renewal is a new risk decision: fresh risk/remediation evidence, fresh content/tree identities, a new private digest, new immutable envelope and fresh authenticated governance/private review are required. Silent timestamp extension is prohibited.

An authorised security owner, release approver or incident commander may revoke immediately. Revocation updates the live governance status source and subsequent evaluations fail closed. Reopening a tracking issue cannot restore a revoked decision revision.

## 12. Audit and retention

Retain, subject to classification boundaries:

- public authority-envelope revision/raw hash and bound standard revision;
- private RFC 8785 decision revision/digest;
- approver-role evidence;
- authenticated public/private review evidence;
- live status/revocation history;
- scanner output and gate decision;
- risk/remediation/adoptability evidence;
- content-addressed compensating-control and exhaustive-tree evidence;
- merge-freshness/boundary invalidation evidence; and
- renewal/revocation/closure disposition.

Public audit surfaces expose only non-sensitive lifecycle metadata. Detailed security posture remains in approved private systems.

## 13. Initial pilot

The first pilot is `MSE-2026-001`. Its full scope, vulnerability details and mitigation evidence remain private. Public governance exposes only the non-sensitive authority envelope, approver/status lifecycle and time boundaries.

The pilot does not waive normal CI, complete code review, independent last-push approval, verified-signature enforcement, merge-freshness validation or explicit release merge authorisation.
