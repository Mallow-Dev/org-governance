# Conversation Journaling Workflow

## Purpose

Automatically generate "meeting minutes" style summaries of AI assistant conversations to preserve context without storing massive conversation transcripts. These journals are stored in the project's memory bank for future reference.

## Use Cases

- **Context Preservation**: Retain high-level decisions without full conversation history
- **Quick Reference**: Review what was discussed/decided in previous sessions
- **Handoffs**: Transfer context between team members or agents
- **Audit Trail**: Track decisions and their rationale over time

## Journal Format

Each journal is a structured markdown document stored in `memory-bank/sessions/`:

```
memory-bank/sessions/YYYY-MM-DD_conversation-title.md
```

### Standard Structure

```markdown
# Conversation Journal: [Title]

**Date**: YYYY-MM-DD HH:MM:SS  
**Duration**: [Approximate]  
**Participants**: [User, AI Model]

## Topics Discussed

- Topic 1
- Topic 2
- Topic 3

## Actions Completed

### [Category]

- ✅ Action 1 (Line refs: L123-L145)
- ✅ Action 2

## Issues Fixed

- 🔧 Issue 1: Description
- 🔧 Issue 2: Description

## Plans Made

- 📋 Plan 1
- 📋 Plan 2

## Decisions

- **Decision 1**: Rationale
- **Decision 2**: Rationale

## Follow-up Items

- [ ] Item 1
- [ ] Item 2

## Security Notes

- 🔒 **Action Required**: [Redacted sensitive data - rotate API key in .env]

## References

- Related conversations: [conversation-id]
- Related files: [file paths]
- Related commits: [commit hashes]
```

## Execution

### Manual Trigger

```bash
# From project root
npm run journal:create -- --conversation-id <id>

# Or with Python
python scripts/create-journal.py --conversation-id <id>
```

### Automated Trigger

**Option 1: End-of-conversation hook** (if supported by IDE/platform)

**Option 2: Manual at session end**

```bash
npm run journal:save
```

**Option 3: Scheduled batch processing**

```bash
# Cron job to process conversations from last 24 hours
0 0 * * * cd /path/to/project && npm run journal:batch
```

## Security Guidelines

### Sensitive Information Redaction

The script MUST NOT include:

- API keys, tokens, credentials
- Private URLs or internal IPs
- Personal identifying information (PII)
- Passwords or secrets

Instead, log security actions:

```markdown
## Security Notes

- 🔒 **Action Required**: Rotate GitHub token discussed in lines L234-L245
- 🔒 **Action Required**: Update .env.example to exclude new SECRET_KEY
```

### Safe to Include

- File paths (within project)
- Function/class names
- Public URLs
- Design decisions
- Bug descriptions (without sensitive context)

## LLM Model Selection

Use **GPT-OSS** (or equivalent cheaper model) for journal generation:

- Simple summarization task
- No complex reasoning required
- Preserve premium LLM quota for development work

## Integration with Memory Bank

Journals automatically update related memory bank files:

1. **activeContext.md**: Updated with latest session summary
2. **progress.md**: Appended to changelog
3. **systemContext.md**: Updated if architecture discussed

## Maintenance

- **Retention**: Keep journals indefinitely (they're small)
- **Search**: Use `grep` or future semantic search
- **Cleanup**: None needed unless project archived

## Example Commands

```bash
# Create journal for current conversation
npm run journal:save

# Create journal for specific conversation
npm run journal:create -- --id bb96da52-7612-4881-9362-e34e5a1a9319

# List all journals
ls -lh memory-bank/sessions/

# Search journals
grep -r "branch protection" memory-bank/sessions/
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-23  
**Related**: `standards/memory-bank-format.md` (to be created)
