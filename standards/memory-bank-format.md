# Memory Bank Format Standard

## Purpose

Define the structure and format for project memory bank files to ensure consistency across projects and enable automated tooling.

## Directory Structure

```
memory-bank/
├── activeContext.md      # Current focus and recent work
├── productContext.md     # Product vision and goals
├── projectbrief.md       # High-level project overview
├── progress.md           # Roadmap and changelog
├── systemContext.md      # Architecture and tech decisions
└── sessions/             # Conversation journals
    ├── YYYY-MM-DD_topic-name.md
    └── YYYY-MM-DD_another-topic.md
```

## File Formats

### activeContext.md

```markdown
# Active Context

## Current Focus: [Phase/Epic Name]

[Brief description of current work focus]

## Recent Accomplishments

- **[Category]**: Description
- **[Category]**: Description

## Active Tasks

- [x] Completed task
- [ ] Pending task

## Open Questions

- **[Question]**: Context
```

### progress.md

```markdown
# Progress: [Project Name]

## High-Level Roadmap

### Phase 1: [Name] (Weeks X-Y) - **IN PROGRESS**

- [x] Completed item
- [ ] Pending item

### Phase 2: [Name] (Weeks X-Y)

- [ ] Future item

## Status

- **Overall**: [On Track/At Risk/Blocked]
- **Risk**: [Low/Medium/High]
- **Blockers**: [None/Description]

## Change Log

> **Policy**: This section is **append-only**. Add new entries to the **top** of the table.

| Date       | Phase      | Change                | Author |
| ---------- | ---------- | --------------------- | ------ |
| YYYY-MM-DD | Phase Name | Description of change | Name   |
```

### sessions/[journal].md

See `workflows/conversation-journaling.md` for detailed format.

**Required sections:**

- Title with date and ID
- Topics Discussed
- Actions Completed
- Security Notes (if applicable)
- References

**Optional sections:**

- Issues Fixed
- Plans Made
- Decisions
- Follow-up Items

## Naming Conventions

### Session Journals

Format: `YYYY-MM-DD_topic-slug.md`

Examples:

- `2025-11-23_branch-protection-setup.md`
- `2025-11-24_mcp-server-deployment.md`
- `2025-11-25_bug-fix-session.md`

**Rules:**

- Use ISO date format (YYYY-MM-DD)
- Lowercase, hyphen-separated topic
- Max 50 characters for topic slug
- Descriptive but concise

### Line References

When referencing conversation lines:

- Format: `(L123)` or `(L123-L145)` for ranges
- Use for traceability back to original conversation
- Optional but recommended for technical decisions

## Update Policies

### Append-Only Sections

These sections must NEVER have entries removed, only added:

- `progress.md` → Change Log table
- `sessions/` → Individual journal files

**Rationale**: Preserve historical context and audit trail.

### Living Document Sections

These sections can be freely edited:

- `activeContext.md` → Current Focus, Active Tasks
- `productContext.md` → Any section
- `systemContext.md` → Any section (but note significant changes in progress.md)

## Security

### Sensitive Information

**NEVER commit to memory bank:**

- API keys, tokens, credentials
- Private URLs or internal IPs
- PII (Personally Identifiable Information)
- Passwords or secrets

**Instead:**

- Use placeholders: `[REDACTED]`
- Log security actions in journal's "Security Notes" section
- Reference files by path only (e.g., `.env` not `.env` contents)

### Safe Information

**Safe to include:**

- Public file paths
- Function/class names
- Public repository URLs
- Design decisions and rationale
- Bug descriptions (without sensitive context)

## Automation

### Auto-Generated Content

Mark auto-generated sections:

```markdown
<!-- AUTO-GENERATED: Do not edit manually -->

## Statistics

- Files: 42
- Lines of Code: 12,345
<!-- END AUTO-GENERATED -->
```

### Manual Updates

All other content should be maintained manually or via approved scripts.

## Integration

### With Conversation Journals

When creating a journal (`scripts/create-journal.py`):

1. Create new file in `sessions/`
2. Update `activeContext.md` → Recent Accomplishments
3. Append to `progress.md` → Change Log (if significant)

### With MCP Server

The MCP server should expose memory bank as resources:

```
memory-bank://active-context
memory-bank://progress
memory-bank://sessions/2025-11-23_topic
```

## Validation

Future: Add validation script to check:

- Required files exist
- Naming conventions followed
- No sensitive data committed
- Proper markdown formatting

```bash
npm run validate:memory-bank
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-23  
**Related**: `workflows/conversation-journaling.md`
