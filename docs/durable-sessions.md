# Mallow Durable Sessions governance

Status: development candidate
Tracking: `Mallow-Dev/org-governance#24`

## Purpose

Mallow Durable Sessions is the organisation's session-continuity layer for long-running agent work. It persists only the compact operational state required to recover from chat/session loss without reconstructing the originating conversation.

Canonical editable skill source is `Mallow-Dev/skills/skills/mallow-durable-sessions/`.

The implementation is governed by Durable Job `JOB-2026-270-mallow-durable-sessions` on `Mallow-Dev/mallow-durable-jobs` project branch `mallow-agents-ops`.

## Authority boundary

Durable Sessions is authoritative only for session-continuity state.

| Domain | Authority |
|---|---|
| Session continuity | Mallow Durable Sessions |
| Executable work contract and task progress | Mallow Durable Jobs |
| Execution evidence | Mallow Durable Results |
| Repository, branch, PR, review and CI truth | GitHub / Mallow Git Gateway |
| Runtime and deployment truth | Owning runtime/provider |
| Human operating projection | Notion |
| Explicit takeover packet | Mallow Session Transfer |

A session checkpoint may retain last-verified identifiers and pointers into these systems. It must not convert copied external state into a competing authority.

## Persistence model

Persist meaningful operational state, not full chat transcripts.

A session record may contain:
- objective and current sub-objective;
- active repository/branch/PR/issue/job/result/workspace pointers;
- last verified identifiers and verification time;
- current blocker and uncertainty state;
- session-only decisions not yet canonical elsewhere;
- exact next action;
- explicit items that must be reverified before a consequential write;
- observable session/tool health events.

## Checkpoint policy

Checkpoint after meaningful operational boundaries, including consequential writes, commits, PR mutations, material CI/review outcomes, durable-job/result transitions, workspace lifecycle events, material user decisions, blocker changes, explicit pauses/transfers and observed session/connector instability.

Do not checkpoint every conversational turn.

Durable-session writes must use optimistic concurrency and fail closed rather than overwrite a newer checkpoint.

## Uncertain operations

When a write may have completed before a connection/tool/session failure:
1. record the operation as uncertain;
2. record the expected precondition/head/version and safe verification step;
3. do not blindly retry;
4. read the authoritative target;
5. reconcile whether the intended state already exists;
6. retry only if the operation is absent and the original safety preconditions still hold.

## Session-health observations

Record observable facts such as connection drops, connector disconnects, tool timeouts, reconnects, explicit session warnings, observed compaction and successful recovery.

Do not infer an internal platform root cause without direct evidence.

## Security boundary

Durable session records must not contain:
- access tokens;
- passwords;
- cookies;
- session/authentication tokens;
- private keys;
- raw credentials;
- secret-bearing connection strings;
- authentication headers.

Persist only the minimum sanitized context needed for continuation.

## Retention, closure and supersession

Durable session records are persistent operational records, not disposable topic-branch state.

A session must have an explicit lifecycle state such as `active`, `recovering`, `blocked`, `closed` or `superseded`.

Closure or supersession must preserve the historical checkpoint/event trail required to explain the final state and must not depend on branch age or prefix alone.

Any dedicated Durable Sessions record repository must be classified as a persistent state store and follow evidence-based retirement/cleanup rules.

## Session Transfer compatibility

`mallow-session-transfer` remains the explicit takeover-packet interface during the initial rollout.

Where a Durable Sessions record exists, Session Transfer should use it as its primary continuity source, supplement it with targeted live verification, and fall back to conversational reconstruction only when durable state is incomplete.

## Governance and engineering references

- Implementation: `Mallow-Dev/skills#3`
- Source PR: `Mallow-Dev/skills#4`
- Organisation governance: `Mallow-Dev/org-governance#24`
- Engineering contract: `Mallow-Dev/org-engineering-standards#15`
- Durable execution: `JOB-2026-270-mallow-durable-sessions`
- Notion control page: `Mallow Durable Sessions`

This document defines organisation applicability and authority/lifecycle boundaries. Normative engineering implementation requirements belong in `Mallow-Dev/org-engineering-standards`.
