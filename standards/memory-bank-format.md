# Memory Bank Format Standard

## Purpose

Define the structure, format, and maintenance requirements for the organizational governance memory bank system, supporting both single-agent and multi-agent workflows.

## Directory Structure

```
memory-bank/
├── activeContext.md          # Current project state
├── progress.md               # Roadmap and changelog
├── systemContext.md          # Technical architecture
├── decisions.md              # Decision log
├── agent-logbook.md          # Multi-agent handoff tracking
└── sessions/                 # Conversation journals
    └── YYYY-MM-DD_topic.md

agent-memory-banks/           # Agent-specific private memory
├── governance-monitor-memory.md
├── report-processor-memory.md
├── standards-updater-memory.md
├── compliance-checker-memory.md
└── README.md
```

## Shared Memory Files

### activeContext.md

**Purpose**: Current snapshot of project state

**Required Sections**:

```markdown
# Active Context

## Current Focus

[What we're working on now]

## Recent Accomplishments

[Last 3-5 major achievements]

## Active Agents (Multi-Agent Only)

| Agent Role | Status | Current Task | Last Update |
| ---------- | ------ | ------------ | ----------- |
| ...        | ...    | ...          | ...         |

## Active Tasks

- [ ] Task 1
- [ ] Task 2

## Blockers

[Current obstacles]

## Next Steps

[Immediate priorities]
```

**Update Frequency**: Every significant change

**Multi-Agent Extensions**:

- Active Agents table (required)
- File locking status
- Agent-specific notes

### progress.md

**Purpose**: High-level roadmap and changelog

**Required Sections**:

```markdown
# Progress

## High-Level Roadmap

### Phase 1: [Name] - [Status]

- [ ] Milestone 1
- [x] Milestone 2

## Status

- **Overall**: [On Track | At Risk | Blocked]
- **Risk**: [Low | Medium | High]
- **Blockers**: [None | Description]

## Change Log

> **Policy**: Append-only, reverse chronological

| Date       | Phase      | Change      | Author     |
| ---------- | ---------- | ----------- | ---------- |
| YYYY-MM-DD | Phase Name | Description | Name/Agent |
```

**Update Frequency**: Milestone completion, significant changes

### systemContext.md

**Purpose**: Technical architecture and infrastructure

**Required Sections**:

```markdown
# System Context

## Technology Stack

- Platform:
- Languages:
- Key Dependencies:

## Architecture

[High-level architecture description]

## Infrastructure

[Deployment, hosting, services]

## Integration Points

[External systems, APIs]

## Technical Decisions

[Key architectural choices]
```

**Update Frequency**: Architecture changes

### decisions.md

**Purpose**: Decision log with rationale

**Format**:

```markdown
# Decision Log

## [YYYY-MM-DD] Decision Title

**Context**: Why we needed to decide
**Decision**: What we chose
**Rationale**: Why we chose it
**Alternatives Considered**:

- Option A: Pros/Cons
- Option B: Pros/Cons
  **Consequences**: Expected impacts
  **Review Date**: When to revisit (if applicable)
  **Decided By**: Person or Agent
```

**Update Frequency**: Major decisions

### agent-logbook.md (Multi-Agent)

**Purpose**: Agent coordination and handoffs

**Format**:

```markdown
# Agent Coordination Logbook

## [DATE] [TIME] - [FROM_AGENT] → [TO_AGENT/Status]

**Status**: [Current work state]
**Active Priority**: [Current focus]
**Files Modified**: [List]
**Handover Notes**: [Context for next agent]
**Next Actions**: [Tasks to continue]
**Conflicts**: [Any coordination issues]
```

**Update Frequency**: Every agent transition

**Required For**:

- Agent starts work
- Agent completes task
- Agent encounters blocker
- Agent hands off to another

## Agent-Private Memory

### Purpose

Agent-specific context that doesn't require coordination:

- Role-specific workflows
- Decision patterns
- Lessons learned
- Performance metrics

### Format

```markdown
# [Agent Name] Memory Bank

## Role Overview

[Agent purpose and scope]

## Core Responsibilities

1. [Responsibility 1]
2. [Responsibility 2]

## Monitoring Patterns / Workflows

[Role-specific processes]

## Known Patterns

[Recurring situations and solutions]

## Performance Metrics

[Role-specific KPIs]

## Decision Log

### [DATE]: [Decision Title]

**Decision**: ...
**Rationale**: ...

## Lessons Learned

- **Lesson 1**: ...
- **Lesson 2**: ...

## Best Practices

1. [Practice 1]
2. [Practice 2]

## Future Enhancements

- [Enhancement 1]
- [Enhancement 2]

---

**Last Updated**: YYYY-MM-DD
**Memory Bank Version**: X.Y.Z
```

### Update Frequency

- After completing major tasks
- When discovering new patterns
- Monthly review and cleanup
- When role responsibilities change

## Conversation Journals

### sessions/ Directory

**Purpose**: Preserve significant conversations

**File Naming**: `YYYY-MM-DD_topic-description.md`

**Format** (See `workflows/conversation-journaling.md`):

```markdown
# [Topic] - [Date]

## Context

[Why this conversation happened]

## Topics Discussed

- Topic 1
- Topic 2

## Actions Completed

- Action 1
- Action 2

## Decisions Made

- Decision 1: Rationale
- Decision 2: Rationale

## Follow-up Items

- [ ] TODO 1
- [ ] TODO 2

## References

- [Link to related docs]
- [Link to PRs/issues]
```

**Automation**: Use `scripts/create-journal.py`

## Multi-Agent Coordination

### File Locking Protocol

**In activeContext.md**:

```markdown
## Active Work

| Agent            | File        | Action           | Started | ETA   |
| ---------------- | ----------- | ---------------- | ------- | ----- |
| Report Processor | progress.md | Adding changelog | 14:30   | 14:35 |
```

**Process**:

1. Check "Active Work" before editing
2. Add entry if file unlocked
3. Proceed with work
4. Remove entry when done

**Lock Timeout**: 30 minutes (auto-expire)

### Conflict Resolution

**Priority**: Higher priority agent proceeds
**Same Priority**: First to lock proceeds
**Critical Conflict**: Escalate to human

See `standards/multi-agent-protocols.md` for full details.

## Quality Standards

### Markdown Formatting

✅ **Required**:

- Valid Markdown syntax
- Working internal links
- Proper heading hierarchy
- Code blocks with language tags
- Tables properly formatted

❌ **Prohibited**:

- Broken links
- Sensitive data (API keys, credentials)
- Inconsistent heading levels
- Unescaped special characters

### Content Quality

✅ **Required**:

- Clear, concise writing
- Context provided for decisions
- Actionable next steps
- Timestamps for all entries
- Rationale for changes

❌ **Prohibited**:

- Vague descriptions
- Undocumented decisions
- Missing timestamps
- Unexplained changes

## Validation

### Pre-Commit Checks

```bash
# Run before committing memory bank updates
./scripts/validate-memory-bank.sh

# Checks:
# - Markdown syntax
# - Link validity
# - Required sections present
# - Timestamps format
# - No sensitive data
```

### CI/CD Validation

**On Push**:

- Lint all Markdown files
- Validate link integrity
- Check required sections
- Verify timestamps

## Maintenance

### Daily

- Update activeContext.md (if working)
- Log in agent-logbook.md (multi-agent)

### Weekly

- Review and consolidate short-term notes
- Update agent-private memory
- Archive completed sessions

### Monthly

- Audit all memory bank files
- Fix broken links
- Update outdated information
- Consolidate redundant content

### Quarterly

- Review entire memory bank structure
- Archive obsolete sections
- Update format standard if needed
- Document lessons learned

## Migration Guide

### From Single-Agent to Multi-Agent

**Steps**:

1. Create `agent-memory-banks/` directory
2. Add `agent-logbook.md` to `memory-bank/`
3. Update `activeContext.md` with "Active Agents" section
4. Split relevant content into agent-specific memories
5. Document migration in changelog

**Backward Compatibility**: Single-agent systems can ignore multi-agent files

## Examples

### Example: Agent Logbook Entry

```markdown
## 2025-11-25 10:30 - Compliance Checker → Standards Updater

**Status**: Audit complete
**Active Priority**: Documentation improvements
**Files Modified**:

- compliance-data/2025-11-25-audit.json
- memory-bank/activeContext.md

**Handover Notes**:
Detected recurring violations in `workflows/pr-review-guidelines.md`:

- 5 repos confused about approval requirements
- "Require code owner review" section unclear
- Need explicit examples for AI agent approvals

**Next Actions**:

1. Review `workflows/pr-review-guidelines.md` for clarity
2. Add examples section for AI agent approval scenarios
3. Cross-reference with `policies/ai-agent-approval-policy.md`

**Conflicts**: None
```

### Example: Active Agents Table

```markdown
## Active Agents

| Agent Role         | Status | Current Task           | Last Update |
| ------------------ | ------ | ---------------------- | ----------- |
| Governance Monitor | Active | Daily repo scan        | 10:15       |
| Report Processor   | Idle   | -                      | 09:30       |
| Standards Updater  | Active | Updating PR guidelines | 10:30       |
| Compliance Checker | Idle   | -                      | 10:30       |
```

---

**Version**: 2.0.0 (Multi-Agent)  
**Effective Date**: 2025-11-25  
**Last Updated**: 2025-11-25  
**Previous Version**: 1.0.0 (Single-Agent)  
**Related**: `AGENTS.md`, `standards/multi-agent-protocols.md`
