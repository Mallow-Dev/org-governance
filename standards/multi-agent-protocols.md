# Multi-Agent Coordination Protocols

## Purpose

Define coordination mechanisms, conflict resolution procedures, and operational protocols for multiple AI agents working simultaneously on organizational governance.

## Core Principles

### 1. Transparency

All agent actions must be visible and traceable:

- Every change logged in `agent-logbook.md`
- Work-in-progress tracked in `activeContext.md`
- Decisions documented with rationale

### 2. Non-Interference

Agents must not block each other:

- Use advisory locks (not exclusive)
- Provide alternative actions when conflicts arise
- Enable concurrent work on different areas

### 3. Knowledge Sharing

Agents build on each other's work:

- Read handoff notes before starting
- Document patterns discovered
- Share insights via memory banks

### 4. Graceful Degradation

System continues even if agents fail:

- No single point of failure
- Manual override always available
- Clear escalation paths

## Coordination Mechanisms

### File Locking (Advisory)

**Before editing shared memory files**:

```markdown
## Active Work (in activeContext.md)

| Agent            | File        | Action           | Started | ETA   |
| ---------------- | ----------- | ---------------- | ------- | ----- |
| Report Processor | progress.md | Adding changelog | 14:30   | 14:35 |
```

**Process**:

1. Read `activeContext.md` → Check "Active Work" section
2. If file unlocked → Add your entry → Proceed
3. If file locked → Check ETA → Wait or work on different file
4. After completion → Remove your entry

**Lock Timeout**: 30 minutes (auto-expire)

### Agent Handoffs

**When transitioning work between agents**:

```markdown
## Agent Logbook Entry

## 2025-11-25 15:30 - Governance Monitor → Report Processor

**Status**: Monitoring scan complete
**Active Priority**: Weekly compliance report
**Files Modified**:

- monitoring-data/2025-11-25-scan.json
- memory-bank/activeContext.md

**Handover Notes**:

- Detected 3 new violations in `stock-v3` repo
- Health score dropped 5 points (85 → 80)
- Branch protection missing on `payments-api` repo (CRITICAL)

**Next Actions**:

1. Generate weekly compliance report
2. Highlight `payments-api` critical issue
3. Include trend analysis (last 4 weeks)

**Conflicts**: None
```

**Required Fields**:

- Timestamp, From/To agents
- Status, Priority
- Files modified
- Handover notes with context
- Next actions list
- Any conflicts encountered

### Conflict Resolution

**Priority Levels** (highest to lowest):

1. **P0 (Critical Security)** - Immediate action required
2. **P1 (Blocking Issues)** - Prevents other work
3. **P2 (Standard Work)** - Normal operations
4. **P3 (Improvements)** - Nice-to-have

**Resolution Process**:

```
Agent A and Agent B both want File X
  ↓
Check Priority Levels
  ↓
Higher Priority Wins
  │
  ├─ If Same Priority → First to lock wins
  ├─ Loser waits or works on alternative
  └─ Log in agent-logbook.md

If Critical Conflict (blocking both)
  ↓
Escalate to Human Review
```

**Escalation Criteria**:

- Both agents at same priority
- Work is interdependent
- Deadline approaching
- Resource contention

## Operational Protocols

### Daily Operations

**Morning (00:00-06:00 UTC)**:

- **Governance Monitor**: Overnight scan results
- **Report Processor**: Generate daily summaries
- **Compliance Checker**: Validate previous day violations

**Business Hours (09:00-17:00 UTC)**:

- **Standards Updater**: Process feedback, update docs
- **Report Processor**: Ad-hoc analysis requests
- **All Agents**: Respond to developer queries

**Evening (18:00-23:59 UTC)**:

- **Governance Monitor**: Final scan of day
- **Compliance Checker**: Auto-remediation runs
- **All Agents**: Consolidate logs

### Weekly Cycle

**Monday**:

- Report Processor generates weekly compliance report
- Standards Updater reviews last week's violations for pattern analysis

**Wednesday**:

- Compliance Checker performs comprehensive audit
- Governance Monitor validates all repo configurations

**Friday**:

- All agents update their memory banks
- Report Processor prepares weekend summary
- Standards Updater commits any pending doc updates

### Performance Monitoring

**Agent Health Checks** (Every 4 hours):

```yaml
health_check:
  last_activity: <timestamp>
  tasks_completed: <count>
  errors_encountered: <count>
  memory_usage: <percentage>
  status: active | idle | error
```

**Metrics Tracked**:

- Task completion rate
- Error frequency
- Response time
- Memory bank update compliance
- Coordination quality

**Alerts**:

- Agent inactive >4 hours
- Error rate >5% in 24h
- Memory bank not updated in 48h
- Coordination conflicts >3 per day

## Communication Patterns

### Inter-Agent Messages

**Via Agent Logbook**:

```markdown
@ReportProcessor: Detected unusual spike in violations for `api-gateway` repo.
Recommend priority analysis. See monitoring-data/2025-11-25-anomaly.json
-- Governance Monitor
```

**Acknowledgment**:

```markdown
@GovernanceMonitor: Acknowledged. Analysis in progress. ETA: 30 min
-- Report Processor
```

### Human Communication

**For Approval/Review**:

- Create GitHub issues with `ai-agent-action` label
- Tag relevant humans
- Provide context and recommendation
- Include rollback procedure

**For Information**:

- Update designated Slack channels
- Email summaries (daily/weekly)
- Dashboard updates (real-time)

## Error Handling

### Agent Failures

**If agent stops responding**:

1. Wait 15 minutes (temporary glitch)
2. Check agent-logbook.md for last activity
3. Attempt restart with clean state
4. Escalate to human if restart fails

**Recovery Process**:

```
1. Load last known good state from memory bank
2. Resume from last logged checkpoint
3. Verify data integrity
4. Continue operations
```

### Data Corruption

**If memory bank corruption detected**:

1. Immediately stop all agent writes
2. Restore from Git history
3. Validate restored state
4. Resume operations with caution

**Prevention**:

- Git-backed persistence
- Atomic writes only
- Validate before commit
- Regular backups

## Quality Assurance

### Self-Validation

**Before each memory bank update**:

- [x] Markdown syntax valid
- [x] Links not broken
- [x] No sensitive data included
- [x] Timestamp present
- [x] Clear rationale provided

### Peer Review

**When agent proposes changes**:

- Another agent reviews (if available)
- Human reviews (if critical)
- AI agent approval counts per policy

### Audit Trail

**All changes tracked with**:

- Who (which agent)
- What (files changed)
- When (timestamp)
- Why (rationale)
- How (method/process)

## Best Practices

### Do's

✅ **Always check agent-logbook before starting**
✅ **Update activeContext when beginning work**
✅ **Document decisions with rationale**
✅ **Provide clear handoff notes**
✅ **Test changes before committing**
✅ **Link to relevant data/evidence**

### Don'ts

❌ **Don't overwrite without checking locks**
❌ **Don't skip logging to agent-logbook**
❌ **Don't make undocumented changes**
❌ **Don't ignore conflicts**
❌ **Don't commit broken links**
❌ **Don't include sensitive data**

## Continuous Improvement

### Learning Loop

**Monthly Review**:

1. Analyze coordination conflicts
2. Identify bottlenecks
3. Update protocols if needed
4. Document lessons learned

**Quarterly Assessment**:

- Review all protocols
- Measure coordination efficiency
- Update based on agent evolution
- Incorporate new best practices

---

**Version**: 1.0.0  
**Effective Date**: 2025-11-25  
**Last Updated**: 2025-11-25  
**Related**: `AGENTS.md`, `standards/memory-bank-format.md`, `memory-bank/agent-logbook.md`
