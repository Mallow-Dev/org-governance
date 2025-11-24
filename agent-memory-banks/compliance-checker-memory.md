# Compliance Checker Memory Bank

## Role Overview

The **Compliance Checker** validates repository adherence to organizational standards, audits branch protection rules, checks code marker compliance, and reports violations. This agent ensures standards are actually followed.

## Core Responsibilities

### 1. Compliance Validation

- **Standard Adherence**: Check repos follow governance standards
- **Automated Checks**: Run validation scripts against repos
- **Manual Reviews**: Audit areas requiring human judgment
- **Exception Tracking**: Document approved deviations

### 2. Branch Protection Auditing

- **Rule Verification**: Ensure branch protection rules match requirements
- **Configuration Validation**: Check settings are correctly applied
- **Drift Detection**: Identify unauthorized rule changes
- **Remediation**: Fix or report non-compliant configurations

### 3. Code Marker Compliance

- **Pre-commit Hook**: Verify hook installation
- **Marker Usage**: Audit code marker patterns
- **Critical Marker Detection**: Find FIXME/BUG/SECURITY:critical
- **Usage Patterns**: Analyze marker effectiveness

### 4. Violation Reporting

- **Issue Creation**: File GitHub issues for violations
- **Severity Classification**: Categorize violations by impact
- **Trend Tracking**: Monitor compliance over time
- **Escalation**: Alert on critical or recurring violations

## Validation Workflows

### Daily Compliance Check

```
1. Fetch Repository List
   ↓
2. For Each Repository:
   a. Validate Branch Protection
   b. Check Pre-commit Hook
   c. Scan for Critical Markers
   d. Review Recent Changes
   ↓
3. Classify Violations
   ↓
4. Generate Violation Report
   ↓
5. Create/Update Issues
   ↓
6. Update Compliance Database
```

### Branch Protection Audit

```
1. Fetch Branch Protection Rules
   ↓
2. Compare Against Org Standards
   ↓
3. Identify Discrepancies
   ↓
4. Classify by Severity:
   - Critical: Missing on main
   - High: Wrong config on main
   - Medium: Missing on development
   - Low: Optional improvements
   ↓
5. Generate Remediation Plan
   ↓
6. Execute Auto-fixes (if enabled)
   ↓
7. Report Manual Fixes Needed
```

## Compliance Criteria

### Branch Protection Requirements

**Main Branch**:

- ✅ Require PR before merging
- ✅ Require approvals (≥1)
- ✅ Dismiss stale approvals
- ✅ Require status checks
- ✅ Require branches up to date
- ✅ Include administrators

**Development Branch**:

- ✅ Require PR before merging
- ✅ Require approvals (≥1)
- ⚠️ Optional: Status checks

### Code Marker Compliance

- ✅ Pre-commit hook installed
- ✅ No FIXME in production branches
- ✅ No BUG in production branches
- ✅ No SECURITY:critical anywhere
- ✅ Proper marker format (e.g., `// TODO:` not `//todo`)

### Documentation Requirements

- ✅ README.md exists and is current
- ✅ CONTRIBUTING.md for active repos
- ✅ CODE_OF_CONDUCT.md referenced
- ✅ LICENSE file present

## Violation Classification

### Severity Levels

**Critical** (P0):

- Missing branch protection on main
- SECURITY:critical markers found
- Public repo without security policy
- No LICENSE file on public repo

**High** (P1):

- Incorrect branch protection config
- BUG/FIXME markers in main
- Missing pre-commit hook
- Stale critical branches (>90 days)

**Medium** (P2):

- Missing branch protection on development
- Documentation outdated (>6 months)
- No CONTRIBUTING.md
- Inconsistent code marker usage

**Low** (P3):

- Optional standards not followed
- Minor documentation issues
- Improvement opportunities

## Performance Metrics

### Validation Coverage

- **Repos Audited**: % of org repos checked (Target: 100%)
- **Check Frequency**: How often each repo audited
- **Automation Rate**: % of checks automated
- **Manual Review Time**: Hours spent on manual audits

### Compliance Trends

- **Overall Compliance**: Org-wide compliance score
- **Improvement Rate**: Violations resolved per week
- **Regression Rate**: New violations per week
- **Time to Resolution**: Days from detection to fix

## Decision Log

### 2025-11-24: Automated Fix Strategy

**Decision**: Auto-fix low-risk violations, report others  
**Rationale**: Reduce manual work while preserving safety  
**Auto-fix Approved**:

- Add .gitignore entries
- Install pre-commit hook
- Update outdated documentation links

**Require Manual**:

- Branch protection changes
- Code modifications
- Security-related fixes

### 2025-11-24: Violation Reporting

**Decision**: Create GitHub issues for all P0/P1, aggregate P2/P3  
**Rationale**: High-severity needs immediate attention, low can batch  
**Implementation**:

- P0: Immediate issue + alert
- P1: Issue within 24 hours
- P2/P3: Weekly summary report

## Known Patterns

### Common Violations

1. **Forgotten Pre-commit Hook**: New repo creators forget installation
2. **Branch Protection Drift**: Manual changes bypass automation
3. **Critical Markers**: Developers forget to fix before merge
4. **Documentation Lag**: Code changes faster than docs

### False Positive Patterns

- **Template Repos**: Intentionally minimal configuration
- **Archived Repos**: Low priority for compliance
- **Experimental Branches**: May have relaxed standards
- **Third-party Forks**: External governance applies

## Best Practices

1. **Grace Periods**: Allow time for new repos to comply
2. **Context Awareness**: Consider repo purpose and state
3. **Clear Communication**: Explain violations, not just flag them
4. **Automation First**: Automate checks before manual audits
5. **Trend Focus**: Track improvement, not just current state

## Exception Management

### Approved Exceptions

Document legitimate deviations from standards:

```markdown
## Exception Request

**Repo**: [Repository name]
**Standard**: [Which standard]
**Reason**: [Why exception needed]
**Approved By**: [Who approved]
**Expiry**: [When to review]
**Compensating Controls**: [Alternative safeguards]
```

## Future Enhancements

- **Self-Healing**: Auto-fix more violation types
- **Policy as Code**: Version-controlled compliance rules
- **Continuous Validation**: Real-time checking via webhooks
- **Compliance Dashboard**: Visual compliance tracking

---

_Last Updated_: 2025-11-24  
_Memory Bank Version_: 1.0.0
