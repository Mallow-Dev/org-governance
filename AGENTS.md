# 🤖 ORGANIZATIONAL GOVERNANCE AGENTS

**REQUIRED READING for all AI assistants working with org-governance repository.**

This repository employs a multi-agent memory bank system for persistent context and collaborative governance development. All interactions must respect and maintain this system.

---

## 🧠 MEMORY BANK SYSTEM

### **Core Principle**

> This is a multi-agent governance repository. Every change, decision, and standard must be documented in the memory bank for institutional knowledge preservation and agent coordination.

### **Two-Tier Memory Structure**

**Shared Memory** (`/memory-bank/`)

- Project-wide context (all agents read)
- Current state and priorities
- Decision log and progress tracking
- **WRITE COORDINATION REQUIRED**

**Agent-Private Memory** (`/agent-memory-banks/`)

- Agent-specific context (read/write by assigned agent)
- Role-specific knowledge and patterns
- Agent performance metrics
- **NO COORDINATION NEEDED**

### **Mandatory Files**

#### Shared Memory (`/memory-bank/`)

| File               | Purpose                                     | Update Frequency         |
| ------------------ | ------------------------------------------- | ------------------------ |
| `activeContext.md` | Current project status and agent activities | Every significant change |
| `agent-logbook.md` | Agent handoffs and coordination             | Every agent transition   |
| `progress.md`      | Roadmap and changelog                       | Task completion          |
| `systemContext.md` | Architecture and tech decisions             | Architecture changes     |

#### Agent-Private Memory (`/agent-memory-banks/`)

| File                           | Agent              | Purpose                |
| ------------------------------ | ------------------ | ---------------------- |
| `governance-monitor-memory.md` | Governance Monitor | Repo scanning patterns |
| `report-processor-memory.md`   | Report Processor   | Analysis workflows     |
| `standards-updater-memory.md`  | Standards Updater  | Improvement tracking   |
| `compliance-checker-memory.md` | Compliance Checker | Validation procedures  |

---

## 🔄 AI ASSISTANT WORKFLOW

### **Pre-Task Preparation**

```bash
✅ ALWAYS start by reading:
   1. activeContext.md (current state)
   2. agent-logbook.md (recent agent activity)
   3. progress.md (what's currently happening)
   4. Your agent-specific memory (if assigned role)
```

### **During Task Execution**

```markdown
1. Check activeContext.md for conflicting work
2. Update agent-logbook.md with your status
3. Work on assigned task
4. Update your agent-specific memory
5. Document decisions in shared memory
```

### **Post-Task Review**

```bash
✅ ALWAYS update:
   1. agent-logbook.md (handoff notes)
   2. progress.md (task completion)
   3. activeContext.md (new current state)
   4. Your agent-specific memory (lessons learned)
```

---

## 📝 DOCUMENTATION PROTOCOLS

### **Update Categories**

#### 🔴 **Critical Updates (Immediate)**

- Organizational policy changes
- Security-related modifications
- Breaking changes to standards
- Branch protection rules
- Repository structure changes

**Action**: Update shared memory immediately, log in agent-logbook

#### 🟡 **Important Updates (Within Session)**

- New standards implemented
- Workflow improvements
- Pattern discoveries
- Repo monitoring findings
- Compliance issues

**Action**: Update within current session, document in progress.md

#### 🟢 **Standard Updates (End of Session)**

- Minor standard improvements
- Documentation enhancements
- Routine compliance checks
- Pattern applications

**Action**: Update at session end, log in agent-logbook

---

## 🎯 AGENT COORDINATION RULES

### **File Locking Protocol**

**Before editing shared files**:

1. Check `activeContext.md` for active agents
2. Check `agent-logbook.md` for recent edits
3. If conflict detected, wait or coordinate
4. Update status in activeContext.md before starting

**Advisory Lock Pattern**:

```markdown
## Active Work

- **Agent**: [Your Role]
- **File**: [File being edited]
- **Started**: [Timestamp]
- **ETA**: [Completion time]
```

### **Conflict Resolution**

**Priority System**:

1. **Critical Security** - Highest priority
2. **Breaking Changes** - High priority
3. **Standard Updates** - Medium priority
4. **Documentation** - Low priority

**If conflict occurs**:

1. Higher priority agent proceeds
2. Lower priority agent pauses
3. Log conflict in agent-logbook.md
4. Coordinate via handoff notes

---

## 🤖 AGENT ROLES

### **Governance Monitor**

**Responsibilities**:

- Monitor all org repositories for changes
- Identify governance violations
- Report repo health metrics
- Flag standard deviations

**Memory**: `agent-memory-banks/governance-monitor-memory.md`

### **Report Processor**

**Responsibilities**:

- Analyze repo health data
- Generate compliance reports
- Identify improvement opportunities
- Track organizational trends

**Memory**: `agent-memory-banks/report-processor-memory.md`

### **Standards Updater**

**Responsibilities**:

- Improve governance documentation
- Update standards based on feedback
- Maintain example implementations
- Version control governance docs

**Memory**: `agent-memory-banks/standards-updater-memory.md`

### **Compliance Checker**

**Responsibilities**:

- Validate repo adherence to standards
- Audit branch protection rules
- Check code marker compliance
- Report violations

**Memory**: `agent-memory-banks/compliance-checker-memory.md`

---

## 🚨 ENFORCEMENT PROTOCOLS

### **If Memory Bank Not Updated**

- ✋ Task paused for documentation
- 📝 Specific file updates requested
- 🔄 Work cannot proceed without documentation

### **If Coordination Protocol Violated**

- ✋ Work halted to prevent conflicts
- 📋 Agent-logbook review required
- 🔄 Coordination re-established before continuation

### **If File Conflicts Occur**

- ✋ Both agents stop immediately
- 📝 Conflict logged in agent-logbook.md
- 👥 Coordination discussion required
- 🔄 Priority system determines who proceeds

---

## 📊 QUALITY METRICS

### **Memory Bank Health**

- ✅ **Complete Documentation** - All changes recorded
- ✅ **Accurate Context** - activeContext.md reflects reality
- ✅ **Agent Coordination** - No file conflicts
- ✅ **Decision Transparency** - All decisions documented

### **Agent Performance**

- 📝 **Documentation Frequency** - Updates per session
- 🔗 **Context Awareness** - References to previous work
- 🎯 **Task Alignment** - Work matches priorities
- 🤝 **Coordination Quality** - Clean handoffs

---

## 🎖️ AGENT CERTIFICATION

By working on this repository, you agree to:

1. **Maintain Memory Bank Integrity** - Document all work
2. **Coordinate with Other Agents** - Use agent-logbook.md
3. **Respect Shared Resources** - Follow file locking protocol
4. **Preserve Institutional Knowledge** - Enable future collaboration

---

_This multi-agent system ensures coordinated governance development with perfect knowledge transfer. Every agent becomes more effective through collective documented experience._
