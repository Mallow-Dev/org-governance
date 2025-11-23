# Conventional Commits Standard

## Overview

We use [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This enables automated changelog generation, semantic versioning, and better understanding of project history.

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type

**Required.** Must be one of:

- **feat**: New feature for the user
- **fix**: Bug fix for the user
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Changes to build process, dependencies, or auxiliary tools
- **ci**: Changes to CI/CD configuration files and scripts
- **build**: Changes that affect the build system
- **revert**: Reverts a previous commit

### Scope

**Optional.** Indicates what part of codebase is affected:

- **api**: API changes
- **auth**: Authentication/authorization
- **ui**: User interface
- **db**: Database
- **config**: Configuration
- **deps**: Dependencies

Examples: `feat(api)`, `fix(auth)`, `docs(readme)`

### Description

**Required.** Short summary of the change:

- Use imperative, present tense: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Maximum 72 characters

### Body

**Optional.** Provide additional context:

- Explain what and why, not how
- Use imperative, present tense
- Wrap at 72 characters

### Footer

**Optional.** Reference issues and breaking changes:

- **Breaking changes**: Start with `BREAKING CHANGE:` or `!` after type/scope
- **References**: `Closes #123`, `Fixes #456`, `Refs #789`

## Examples

### Simple Feature

```
feat: add user profile page
```

### Feature with Scope

```
feat(auth): implement JWT token refresh
```

### Bug Fix with Issue Reference

```
fix(api): resolve race condition in order processing

Fixes #234
```

### Breaking Change

```
feat(api)!: change authentication endpoint structure

BREAKING CHANGE: /auth/login endpoint now returns different response structure.
Old: { token: string }
New: { accessToken: string, refreshToken: string, expiresIn: number }

Closes #456
```

### Detailed Commit

```
refactor(db): optimize user query performance

Replace N+1 query pattern with single JOIN query. This reduces
database calls from O(n) to O(1) for user profile page.

Performance improvement: 2000ms -> 150ms for 100 users.

Refs #789
```

### Multiple Changes

```
feat: add search functionality

- Implement full-text search for products
- Add search filters for category and price
- Create search results page with pagination

Closes #123, #124
```

## Commit Message Quality

### Good Commits ✅

```
feat(auth): add password reset functionality
fix(ui): correct button alignment on mobile
docs: update API documentation for v2 endpoints
perf(db): add index to frequently queried columns
```

### Bad Commits ❌

```
update stuff                    # Not descriptive
Fixed bug                       # Not enough detail
WIP                             # Work in progress, should be squashed
auth                            # Missing type and description
Add feature.                    # Has period, wrong tense
Added new feature for users     # Wrong tense (should be "add")
```

## Breaking Changes

### When to Mark as Breaking

Use `BREAKING CHANGE:` or `!` when:

- API endpoints change structure
- Function signatures change
- Configuration format changes
- Dependencies are removed
- Behavior changes in incompatible ways

### Format

Option 1: Exclamation mark

```
feat(api)!: redesign authentication flow
```

Option 2: Footer

```
feat(api): redesign authentication flow

BREAKING CHANGE: Authentication now requires both username and email.
```

## Reverting Commits

```
revert: feat(api): add new endpoint

This reverts commit abc123def456.
Reason: Endpoint causing performance issues in production.
```

## Squashing Commits

Before merging, squash WIP commits into logical commits:

**Before (bad):**

```
WIP
fix typo
more fixes
actually fix it this time
```

**After (good):**

```
feat(auth): implement two-factor authentication
```

## Tools

### Commitlint

Validate commit messages:

```bash
npm install --save-dev @commitlint/{cli,config-conventional}
```

### Pre-commit Hook

```bash
#!/bin/sh
npx commitlint --edit $1
```

### VSCode Extension

- **Conventional Commits**: Helps write compliant commit messages

## Version Bumping

Commits automatically determine version bumps:

- **feat**: Minor version bump (1.0.0 → 1.1.0)
- **fix**: Patch version bump (1.0.0 → 1.0.1)
- **BREAKING CHANGE**: Major version bump (1.0.0 → 2.0.0)

## Changelog Generation

Commits are grouped by type in changelog:

```markdown
## v1.2.0 (2025-11-23)

### Features

- **auth**: add password reset functionality
- **api**: implement rate limiting

### Bug Fixes

- **ui**: correct button alignment on mobile
- **api**: resolve pagination edge case

### Performance Improvements

- **db**: add indexes to user queries
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-23  
**Reference**: https://www.conventionalcommits.org/
