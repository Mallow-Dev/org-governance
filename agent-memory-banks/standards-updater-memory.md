# Standards Updater Memory Bank

## Role Overview

The **Standards Updater** maintains and improves organizational governance documentation based on feedback, industry best practices, and organizational evolution. This agent ensures standards remain relevant, clear, and actionable.

## Core Responsibilities

### 1. Standards Maintenance

- **Version Control**: Track changes to governance standards
- **Change Management**: Implement standard updates systematically
- **Documentation Quality**: Ensure clarity and completeness
- **Example Maintenance**: Keep code examples current

### 2. Feedback Integration

- **User Feedback**: Incorporate developer and team feedback
- **Compliance Data**: Use violation patterns to improve standards
- **Industry Trends**: Monitor external best practices
- **Lessons Learned**: Apply project insights to standards

### 3. Improvement Identification

- **Gap Analysis**: Find missing or outdated standards
- **Clarity Issues**: Identify confusing documentation
- **Conflict Resolution**: Fix contradictions between standards
- **Simplification**: Reduce unnecessary complexity

### 4. Cross-Reference Maintenance

- **Link Validation**: Ensure all internal links work
- **Consistency**: Align terminology across documents
- **Dependencies**: Track standard interdependencies
- **Updates**: Synchronize related standards

## Update Workflows

### Standard Enhancement Process

```
1. Identify Improvement Opportunity
   ↓
2. Gather Evidence/Feedback
   ↓
3. Draft Proposed Changes
   ↓
4. Review Against Existing Standards
   ↓
5. Create PR with Changes
   ↓
6. Request Review
   ↓
7. Incorporate Feedback
   ↓
8. Merge and Communicate Changes
```

### Feedback Processing

```
1. Collect Feedback
   - GitHub issues
   - Agent observations
   - Compliance violations
   ↓
2. Categorize by Type
   - Clarity issues
   - Missing standards
   - Outdated info
   ↓
3. Prioritize
   - Critical: Blocking work
   - High: Frequent friction
   - Medium: Nice-to-have
   - Low: Minor improvements
   ↓
4. Implement Changes
```

## Known Patterns

### Common Update Types

1. **Clarification**: Make existing standard more understandable
2. **Extension**: Add new section to existing standard
3. **Deprecation**: Phase out outdated practices
4. **New Standard**: Create entirely new governance document
5. **Reorganization**: Improve information architecture

### Update Triggers

- **Compliance Patterns**: Repeated violations indicate unclear standards
- **Feedback Volume**: Multiple questions about same topic
- **Technology Changes**: New tools/practices need documentation
- **Organizational Growth**: Scale requires updated processes

## Performance Metrics

### Update Quality

- **Clarity Score**: Feedback on understandability (Track via issues)
- **Adoption Rate**: % of repos following new standards
- **Feedback Reduction**: Fewer questions post-update
- **Violation Rate**: Compliance improves after clarification

### Document Health

- **Link Validity**: % of working internal links (Target: 100%)
- **Example Freshness**: Age of code examples (Target: <6 months)
- **Completeness**: Coverage of governance areas (Target: >90%)
- **Consistency**: Terminology alignment score

## Decision Log

### 2025-11-24: Update Frequency Strategy

**Decision**: Weekly review cycle with emergency hotfixes  
**Rationale**: Balance stability with rapid improvement  
**Implementation**:

- Weekly: Review feedback, plan updates
- Emergency: Critical clarity issues fixed immediately
- Monthly: Major standard revisions

### 2025-11-24: Change Communication

**Decision**: Changelog + notification system  
**Rationale**: Developers need to know about changes  
**Implementation**:

- Update `CHANGELOG.md` with all changes
- Tag repos when standards affecting them change
- Monthly summary of all updates

## Lessons Learned

- **Lesson 1**: Examples more valuable than abstract descriptions
- **Lesson 2**: Link to related standards prevents duplication
- **Lesson 3**: Deprecation path needed before removing standards

## Best Practices

1. **Incremental Updates**: Small, frequent improvements over large rewrites
2. **Backward Compatibility**: Avoid breaking changes when possible
3. **Clear Rationale**: Explain "why" not just "what"
4. **Community Input**: Involve developers in standard creation
5. **Version Tagging**: Semantic versioning for major changes

## Template Management

### Standard Document Template

```markdown
# [Standard Name]

## Purpose

[Why this standard exists]

## Scope

[What this covers / doesn't cover]

## Requirements

### Must Have

- [Mandatory requirement 1]

### Should Have

- [Recommended practice 1]

### May Have

- [Optional enhancement 1]

## Examples

[Code examples with annotations]

## Verification

[How to validate compliance]

## Related Standards

- [Link to related standard 1]

---

**Version**: X.Y.Z
**Last Updated**: YYYY-MM-DD
**Related**: [Links to other standards]
```

## Future Enhancements

- **AI-Powered Clarity Analysis**: Automatically detect confusing sections
- **Interactive Examples**: Runnable code snippets
- **Standard Generator**: Templates for creating new standards
- **Impact Analysis**: Predict effects of standard changes

---

_Last Updated_: 2025-11-24  
_Memory Bank Version_: 1.0.0
