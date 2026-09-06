# Mallow Time-Bounded Security Exception Standard

| Field | Value |
|---|---|
| Standard ID | `MTBSE` |
| Version | `1.1` |
| Status | Approved model; repository-baseline extension pending this governed change |
| Approved | 2026-09-05 |
| Governance owner | Mallow technical governance |
| Authority | `Mallow-Dev/org-governance` |
| Engineering control | MEDRPS `SEC-004` in `Mallow-Dev/org-engineering-standards` |

## 1. Purpose

Mallow security controls fail closed by default. MTBSE is the only normal governance mechanism for accepting an identified residual security risk for a bounded period when the underlying finding cannot yet be safely removed.

An MTBSE decision is **not** scanner suppression, a permanent allowlist, a branch-protection bypass, or a declaration that a vulnerability is clean. The scanner continues to run normally and the finding remains visible. MTBSE changes only the final policy decision for the approved finding while every approved fact remains true.

MTBSE supports two applicability modes:

1. **Exact-evaluation** — the original mode used when the risk decision intentionally applies only to named PR/ref/version scope.
2. **Repository-baseline** — one repository-level risk decision for one exact finding identity, reusable across branches and pull requests in that repository while every consuming Security Gate independently proves the current head still satisfies the decision.

Repository-baseline exists to avoid duplicating the same human risk decision for every development branch. It does not weaken per-PR checks, review, signatures, merge freshness, scanner visibility, or fail-closed treatment of any other finding.

## 2. Authority and precedence

`org-governance` owns exception applicability, approval, lifecycle, review boundaries, expiry, revocation and renewal. `org-engineering-standards` owns the technical enforcement contract (`SEC-004`). Repository/shared implementation may enforce those contracts but may not broaden them.

GitHub/provider evidence is authoritative for what ran, who approved, current status and what was enforced.

### 2.1 Public/private data boundary

When repository identity, vulnerability posture, release lane, compensating controls or equivalent operational facts are non-public, the full decision MUST remain in the affected private repository or another approved private store.

Public governance carries only a non-sensitive **authority envelope** containing the exception ID, lifecycle state, cryptographic digest of the private decision, bound standard revision, approval requirements and time boundaries.

Public governance MUST NOT publish private repository names, branches, package/version findings, source paths, mitigation implementation details, internal URLs or equivalent private security posture unless those facts are already intentionally public.

## 3. Applicability modes

### 3.1 Exact-evaluation mode

Exact-evaluation mode preserves the original MTBSE contract. The private decision identifies the exact repository, control/scanner, ecosystem, package/component, installed version set, advisory identities, PR/ref scope and environment. A consuming evaluation matches only that exact scope.

For a `schema_version: 1` decision created under MTBSE v1.0, an absent `scope.mode` MUST be interpreted as `exact-evaluation`. Such a legacy decision does not require migration merely because repository-baseline mode now exists. `schema_version: 2` decisions MUST declare `scope.mode: repository-baseline` explicitly and do not receive this compatibility default.

### 3.2 Repository-baseline mode

Repository-baseline mode authorises **one exact residual finding identity for one repository**, not a branch.

The private decision MUST bind:

- exact repository identity;
- exact control and scanner;
- exact ecosystem and package/component;
- exact advisory identity set;
- repository-level environment classification;
- current approved risk snapshot and remediation state;
- content-addressed compensating controls;
- a content-addressed repository-invariant evaluator or equivalent governed exhaustive check; and
- the normal approval, lifecycle, authority-envelope and boundary evidence.

A repository-baseline decision MUST NOT enumerate pull requests, head refs or base refs as applicability conditions. Those values are **consumption evidence**, not risk-authorisation scope.

The installed version also need not be pre-enumerated. Instead, on every consuming Security Gate the scanner MUST report the current installed version as affected by the exact approved advisory for the exact package/ecosystem. A version that is not currently reported as affected does not consume the exception. If the remediation source reports an approved fix where the decision was authorised on a no-fix basis, the decision fails closed even if an older branch still contains a vulnerable version.

Repository-baseline does not mean “all vulnerabilities in this repository”. Only the exact package/component + advisory identity authorised by the decision may be accepted. Any additional, changed, unmatched or ambiguous finding blocks normally.

### 3.3 Decision scope versus consumption evidence

Risk authorisation and merge evidence are deliberately separate:

- **Risk authorisation** is approved once per decision revision according to its applicability mode.
- **Consumption evidence** is always current-head/current-provider evidence for the branch or PR presently being evaluated.

For repository-baseline mode, the independent private review binds the **decision revision/digest**, not every future consuming PR head. Normal branch protection may still require an independent review of each PR; that is a separate repository rule and is never waived by MTBSE.

A repository-baseline decision SHOULD live on the repository's canonical default branch or another canonical private decision source. A bootstrap PR introducing the decision may consume its candidate decision only when the provider can prove that the reviewed candidate digest is the same decision revision being authorised. After merge, future branches consume the canonical decision rather than carrying branch-local copies.

## 4. Core invariants

A conforming MTBSE decision MUST satisfy all of the following:

1. **Applicability mode.** `schema_version: 1` decisions with no `scope.mode` are treated as `exact-evaluation`; schema v1 decisions that declare a mode may declare only `exact-evaluation`. Repository-baseline decisions require `schema_version: 2` plus explicit `scope.mode: repository-baseline`, match only the exact repository + component/advisory selector and never branch names.
2. **Unsuppressed scanner evidence.** The scanner runs normally and machine-readable evidence is retained.
3. **Exact finding identity.** Control/scanner, ecosystem, package/component and advisory identities match exactly. Exact-evaluation additionally matches its approved versions/refs; repository-baseline proves the current scanner-reported installed version is presently affected by the approved advisory.
4. **No collateral allowance.** Additional, changed, unmatched, malformed or ambiguous findings fail closed.
5. **Provider-authenticated approval.** Self-declared approval metadata is insufficient.
6. **Independent approver authority.** Actor authority is validated against a canonical governance role registry outside the exception decision.
7. **Independent private-decision review.** Required reviewers must review the actual private decision digest and contents. In repository-baseline mode this approval binds the decision revision, not every consumer head.
8. **Immutable governance envelope.** The private decision binds an exact governance commit, path and raw SHA-256.
9. **RFC 8785 digest binding.** The private decision digest is JCS/SHA-256 and must equal the envelope `decision_sha256`.
10. **Bound standard revision.** The envelope carries `standard_commit`; enforcement proves the authority head descends from it and that applicable MTBSE standard content is unchanged.
11. **Merged governance authority.** An open/unmerged governance PR cannot authorise `accepted-risk`.
12. **Independent live status.** Every evaluation checks current governance status plus revocation history.
13. **Terminal revocation.** A post-approval revocation permanently invalidates that decision revision even if a tracking issue is later reopened.
14. **Current risk facts.** Severity, vector, exploitation and equivalent approved facts are re-read from an independent machine-readable source.
15. **Current remediation availability.** Fixed/remediated-version state is re-read independently; a newly available fix invalidates a no-fix decision.
16. **Remediation identity binding.** The remediation advisory must be one of the scanner-scoped advisory IDs and resolve to the same package/ecosystem.
17. **Adoptability evidence.** If a fix exists but is temporarily unusable, content-addressed evidence for that blocker is mandatory.
18. **Content-addressed compensating controls.** Security-significant predicates, dependencies and focused tests are bound to immutable content identities.
19. **Exhaustive affected-surface proof.** Exact-evaluation may bind an affected source tree. Repository-baseline MUST instead use a governed current-head invariant/equivalent exhaustive check that can detect a newly introduced vulnerable call site without invalidating the decision merely because unrelated files changed.
20. **Hard activation/review/expiry boundaries.** `starts_at < review_due_at <= expires_at`; reject before start and at/after review or expiry.
21. **Single effective window.** The digest-bound private `window` is authoritative; any public envelope copy must be semantically identical.
22. **No silent renewal or scope expansion.** Extending time, changing applicability mode, changing repository/component/advisory scope, or materially changing the approved risk requires a new private digest, new envelope and fresh authenticated approval/private review.
23. **Freshness for every mutable input.** Every consuming merge/release uses a freshly rerun exact-head security decision; old green evidence is invalid after material live-state change.
24. **Provider-level boundary invalidation.** Review/expiry boundaries have an auditable mechanism that re-runs or replaces merge-relevant security evidence for affected open consumers.
25. **Fail closed on evidence failure.** Missing, malformed, unreachable, stale or ambiguous scanner/governance/approval/risk/remediation/control/time evidence blocks the exception.

## 5. Eligibility

The normal lane MAY be used where the residual risk is documented and at least one applies:

- no patched release is currently published by the approved source;
- advisory/vulnerability metadata is credibly disputed and correction is pending;
- a patch exists but a verified compatibility or safety blocker prevents safe immediate adoption;
- an urgent release must proceed while bounded remediation is actively in progress.

Repository-baseline mode SHOULD be preferred where the same inherited dependency finding is expected across ordinary development branches and repeatedly creating branch-specific decisions would add no new risk information.

The normal lane MUST NOT be used to avoid ordinary dependency maintenance, failing tests, missing review, secret leakage, malicious-code detection, unexplained scanner errors, or a vulnerability that can be fixed safely.

Critical vulnerabilities are not eligible for the normal lane and require incident/break-glass authority.

## 6. Maximum windows

| Severity | Maximum lifetime | Maximum review interval | Minimum approval |
|---|---:|---:|---|
| Critical | Not eligible | N/A | Break-glass / incident authority |
| High | 7 days | 48 hours | Security owner + organisation release approver |
| Medium | 30 days | 7 days | Project/technical owner + organisation release approver for production-impacting work |
| Low | 90 days | 30 days | Project/technical owner |

Unknown severity is treated as High until classified. Escalation above the approved class invalidates the existing decision immediately.

## 7. Private decision and public authority envelope

### 7.1 Private decision

The repository-local/canonical private decision normally lives at:

```text
.mallow/security-exceptions/<exception-id>.json
```

It contains the applicability mode, exact finding selector, risk/remediation evidence, compensating-control and exhaustive-invariant evidence, approval/private-review references, window, enforcement identities and an `authority` pointer.

### 7.2 Canonical private-decision digest — RFC 8785 JCS

The canonical digest MUST use **RFC 8785 JSON Canonicalization Scheme (JCS)**. Informal “sorted JSON” or implementation-specific compact JSON is prohibited.

Before hashing, remove only the repository-local `authority` pointer. The remaining source MUST satisfy JCS/I-JSON requirements, including no duplicate object property names, valid Unicode scalar strings with no lone surrogates, finite IEEE-754 JSON numbers and no Unicode normalisation/mutation before canonicalisation.

JCS output uses no insignificant whitespace, ECMAScript-compatible primitive serialization, recursive property ordering by raw UTF-16 code units, preserved array order and UTF-8 output bytes. SHA-256 of those bytes is the private `decision_sha256`.

Implementations MUST include RFC 8785 conformance regressions and reject non-I-JSON source before hashing.

### 7.3 Public authority envelope

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

### 7.4 Canonical approver registry

GitHub-backed implementations validate approval authority against:

```text
Mallow-Dev/org-governance:main/standards/security-exception-approvers.json
```

Production-impacting Medium/High decisions require an independent reviewer with organisation release or security authority and distinct from the risk owner. If the registry cannot be fetched/parsed or does not authorise a named actor, the decision fails closed.

## 8. Provider-authenticated approval, private review and revocation

For GitHub-backed MTBSE, enforcement MUST:

- require the declared authority commit to equal the exact governance PR head;
- require that governance PR to be merged to its canonical base before `accepted-risk` can authorise protected work;
- verify actor authority using the canonical merged approver registry;
- require an authenticated risk-owner event bound to exception ID, authority commit, envelope raw hash and private decision digest;
- require every independent reviewer to have a current exact-head `APPROVED` governance review;
- require authenticated private-review evidence naming the configured private-review marker and canonical private-decision digest;
- for exact-evaluation mode, require the configured exact private-review head where that decision specifies one;
- for repository-baseline mode, prove that the approved private-review commit contained the same canonical decision digest, without requiring that review commit to equal a later consuming PR head;
- require reviewer/risk-owner separation;
- read current tracking status and event history; and
- treat any post-approval close/revocation event as terminal for that revision.

## 9. Risk, remediation and control evidence

A current-risk adapter MUST compare the approved independent risk snapshot with current machine-readable authority data. For CVE-backed decisions this includes publication state, CVSS score/severity/vector and available CISA SSVC exploitation/automatable/technical-impact facts.

A dependency decision MUST re-query current remediation/fixed-version state. `risk.remediation_availability.advisory_id` MUST be one of `scope.advisory_ids`; its lookup must resolve to that same advisory and the same scoped package/ecosystem.

A newly published fix invalidates a previous no-fix decision. If a fix already exists but is temporarily unsafe/unusable, the decision additionally binds content-addressed adoptability-blocker evidence; a change to that blocker requires reassessment.

In repository-baseline mode, the current scanner finding itself proves the installed version remains affected. The decision is not a pre-approved list of vulnerable versions.

Security-significant code/test evidence MUST be content-addressed. Repository-baseline additionally requires a content-addressed invariant/evaluator whose current-head execution exhaustively checks the risk-sensitive surface while permitting unrelated repository development.

## 10. Machine-enforcement order

A Security Gate relying on MTBSE MUST:

1. run the scanner normally and retain machine-readable output;
2. load the applicable private decision(s) and reject non-I-JSON source;
3. fetch/hash the immutable public authority envelope;
4. recompute RFC 8785 JCS/SHA-256 of the private decision and match `decision_sha256`;
5. require public/private window equality;
6. validate `standard_commit` ancestry and unchanged standard content;
7. validate actor authority against the canonical role registry;
8. verify risk-owner approval, exact-head governance approval and merged governance authority;
9. verify private-decision approval according to the decision's applicability mode;
10. verify live status and terminal revocation history;
11. verify current risk and current remediation/adoptability evidence;
12. verify content-addressed compensating controls;
13. verify exact-evaluation tree scope or repository-baseline current-head invariant evidence as applicable;
14. enforce applicability plus `starts_at`, review and expiry boundaries;
15. reject collateral findings; and
16. emit `accepted-risk` only for the exact approved finding, otherwise `blocked`.

The aggregate required check MAY be green after this proof but MUST NOT describe the underlying vulnerable scan as clean.

## 11. Repository-baseline discovery and consumption

A repository-baseline decision SHOULD be discovered from the canonical private decision source on the default branch so ordinary feature/release branches do not need to copy the exception file merely to inherit an already-authorised repository risk.

A consuming Security Gate MUST still evaluate the exact current checkout/head and MUST NOT trust default-branch source code as evidence that the consuming branch retains compensating controls.

Bootstrap is permitted when the repository-baseline decision and evaluator are introduced by the same PR, provided:

- the candidate decision digest is independently reviewed;
- governance authorises that exact digest;
- the candidate Security Gate evaluates its own exact head;
- the resulting protected merge still requires all ordinary review/signature/routing gates; and
- after merge, canonical discovery moves to the default-branch decision.

## 12. Merge freshness, scheduled review and automatic expiry

Time and live upstream/governance facts are enforcement inputs, not reminders.

- `starts_at` is a hard not-before boundary.
- `review_due_at` is a hard re-authorisation boundary.
- `expires_at` is a final hard stop.
- A merge/release relying on `accepted-risk` MUST use a fresh exact-head MTBSE evaluation immediately before final merge authorisation. For the initial GitHub implementation the accepted-risk run SHOULD be no more than 30 minutes old.
- The fresh run revalidates live revocation, approver authority/private review, risk, remediation, protected-control/invariant evidence and current time.
- A success recorded before a material live-input change or boundary is not valid evidence afterward.
- The provider implementation MUST also re-run or replace merge-relevant security evidence no later than review and expiry boundaries.
- For repository-baseline decisions, boundary enforcement MUST target affected open repository consumers rather than assuming one original PR is the sole consumer.
- Active exceptions require periodic early-invalidation checks even without source pushes.

A passive reminder does not satisfy MTBSE.

## 13. Renewal and revocation

Renewal is a new risk decision: fresh risk/remediation evidence, fresh protected-control/invariant identities, a new private digest, new immutable envelope and fresh authenticated governance/private review are required. Silent timestamp extension is prohibited.

Changing an exact-evaluation decision into repository-baseline scope, or materially broadening a repository-baseline component/advisory selector, is a new risk decision rather than an in-place edit.

An authorised security owner, release approver or incident commander may revoke immediately. Revocation updates the live governance status source and subsequent evaluations fail closed. Reopening a tracking issue cannot restore a revoked decision revision.

## 14. Audit and retention

Retain, subject to classification boundaries:

- applicability mode and decision revision;
- public authority-envelope revision/raw hash and bound standard revision;
- private RFC 8785 decision revision/digest;
- approver-role evidence;
- authenticated public/private review evidence;
- live status/revocation history;
- scanner output and gate decision;
- current consuming repository/head/ref metadata;
- risk/remediation/adoptability evidence;
- content-addressed compensating-control evidence;
- exact-scope tree evidence or repository-baseline invariant/evaluator evidence;
- merge-freshness/boundary invalidation evidence; and
- renewal/revocation/closure disposition.

Public audit surfaces expose only non-sensitive lifecycle metadata. Detailed security posture remains in approved private systems.

## 15. Initial pilot and compatibility

The first pilot, `MSE-2026-001`, was created as an exact-evaluation decision under the original contract. A schema-v1 decision does not require migration solely because MTBSE v1.1 exists; its independent lifecycle state remains authoritative. In particular, a revoked decision revision remains terminal and cannot be restored by reopening its tracking issue.

Repository-baseline adoption requires a **new** decision revision (for example `MSE-2026-002`) with its own digest, authority envelope and independent approval.

Neither applicability mode waives normal CI, complete code review, independent repository review, verified-signature enforcement, merge-freshness validation or explicit release merge authorisation where those controls otherwise apply.