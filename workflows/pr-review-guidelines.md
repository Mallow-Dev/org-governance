# Pull Request Review Guidelines

## Overview

Code reviews are a critical quality gate. This document defines standards for both reviewers and PR authors to ensure consistent, thorough, and constructive reviews.

## Reviewer Responsibilities

### Review Checklist

Before approving a PR, verify:

#### Code Quality

- [ ] Code follows organizational coding standards
- [ ] Logic is clear and understandable
- [ ] No unnecessary complexity
- [ ] Appropriate use of language features
- [ ] Consistent with existing codebase patterns

#### Functionality

- [ ] Changes accomplish stated goal
- [ ] Edge cases are handled
- [ ] Error handling is appropriate
- [ ] No obvious bugs or issues

#### Testing

- [ ] Tests are included for new functionality
- [ ] Tests are meaningful and comprehensive
- [ ] Existing tests still pass
- [ ] Test coverage is maintained or improved

#### Security

- [ ] No security vulnerabilities introduced
- [ ] Input validation is present
- [ ] Sensitive data is properly handled
- [ ] Authentication/authorization is correct

#### Performance

- [ ] No obvious performance regressions
- [ ] Database queries are optimized
- [ ] Algorithms are efficient
- [ ] Resource usage is reasonable

#### Documentation

- [ ] Code comments explain "why", not "what"
- [ ] API documentation is updated
- [ ] README updated if needed
- [ ] Breaking changes are documented

#### Git Hygiene

- [ ] Commit messages follow conventional commits format
- [ ] Commits are logical and atomic
- [ ] Branch is up to date with base branch
- [ ] No merge conflicts

## Review Process

### 1. Initial Review (5-10 minutes)

- Read PR description
- Understand the goal and context
- Review changed files list
- Check CI/CD status

### 2. Detailed Review (15-30 minutes)

- Review code line by line
- Test locally if needed
- Verify tests pass
- Check for edge cases

### 3. Feedback (5-10 minutes)

- Leave constructive comments
- Suggest improvements
- Ask clarifying questions
- Approve or request changes

## Providing Feedback

### Types of Comments

Use prefixes to indicate severity:

- **[BLOCKING]**: Must be fixed before merge
- **[SUGGESTION]**: Nice to have, but optional
- **[QUESTION]**: Seeking clarification
- **[NITPICK]**: Minor style/preference issue
- **[PRAISE]**: Positive feedback (use this!)

### Examples

**Good feedback:**

```
[BLOCKING] This could cause a race condition if two users
update simultaneously. Consider using a transaction here.
```

**Not helpful:**

```
This is wrong.
```

**Good suggestion:**

```
[SUGGESTION] Consider extracting this into a helper function
for better reusability. Not blocking though.
```

**Good question:**

```
[QUESTION] Why did we choose to implement this using X
instead of Y? Just trying to understand the reasoning.
```

## PR Author Responsibilities

### Before Requesting Review

- [ ] Self-review your own code
- [ ] Run all tests locally
- [ ] Update documentation
- [ ] Write clear PR description
- [ ] Link related issues
- [ ] Ensure CI passes
- [ ] Resolve any merge conflicts

### PR Description Template

Use the template in `templates/pull-request-template.md`

### Responding to Feedback

- Address all comments (even if just to acknowledge)
- Don't take feedback personally
- Ask for clarification if needed
- Resolve conversations after addressing
- Re-request review after changes

## Approval Criteria

### When to Approve

- All blocking issues resolved
- Tests pass
- Code quality meets standards
- Security concerns addressed
- Documentation updated

### When to Request Changes

- Blocking issues present
- Tests failing
- Security vulnerabilities
- Major architectural concerns
- Missing critical functionality

### When to Comment Without Approval/Rejection

- Minor suggestions only
- Questions for clarification
- Non-blocking nitpicks
- General discussion

## Review Turnaround Time

### Expectations

- **Small PRs (<100 lines)**: 4 hours
- **Medium PRs (100-500 lines)**: 1 business day
- **Large PRs (>500 lines)**: 2 business days
- **Hotfixes**: ASAP (within 1 hour)

If you can't review in time, comment to let author know.

## Special Cases

### Hotfix Reviews

- Focus on critical functionality
- Security check is mandatory
- Can be expedited but not skipped
- May only need 1 reviewer instead of 2

### Documentation-Only Changes

- Verify accuracy
- Check for clarity
- Ensure proper formatting
- Can be lighter review

### Dependency Updates

- Check changelog for breaking changes
- Verify tests pass
- Look for security advisories
- Can be automated if minor

## Best Practices

### For Reviewers

✅ **Do:**

- Review promptly
- Be constructive and kind
- Explain your reasoning
- Praise good work
- Ask questions to understand
- Test locally when needed

❌ **Don't:**

- Be overly critical or harsh
- Nitpick excessively
- Block on personal preferences
- Assume malice or incompetence
- Approve without actually reviewing

### For Authors

✅ **Do:**

- Keep PRs small and focused
- Write clear descriptions
- Respond to all comments
- Test thoroughly before requesting review
- Update based on feedback

❌ **Don't:**

- Create massive PRs
- Get defensive about feedback
- Ignore comments
- Force push after review started
- Mark conversations resolved without addressing

## Merge Strategies

### When to Use Each

- **Squash and Merge**: Feature branches (keep main history clean)
- **Merge Commit**: Development to main (preserve release history)
- **Rebase and Merge**: Rarely (when linear history is important)

See `workflows/git-branching-strategy.md` for full details.

## Tools and Automation

### GitHub Features to Use

- **Code owners**: Automatic reviewer assignment
- **Required reviews**: Enforce review count
- **Status checks**: Require CI to pass
- **Branch protection**: Prevent direct commits

### Helpful Integrations

- **CodeQL**: Security scanning
- **Dependabot**: Dependency updates
- **Linters**: Automated code style checks
- **Coverage reports**: Test coverage tracking

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-23
