# Git Workflow & Branch Strategy

## Overview

This document defines the git branching strategy and workflow standards for all repositories. **Branch structure and repository hygiene are HIGH PRIORITY.**

## Branch Structure

### Protected Branches (Constants)

#### `main` Branch

- **Purpose**: Production-ready code only
- **Protection**: Fully protected, no direct commits
- **Source**: Releases come from `main` branch ONLY
- **Merges From**: `development` branch only (via approved PRs)
- **Naming Convention**: `main`
- **CI/CD**: Triggers production deployments
- **Tags**: All release tags (v1.0.0, v1.1.0, etc.) are created on `main`

#### `development` Branch

- **Purpose**: Integration branch for features and hotfixes
- **Protection**: Protected, no direct commits (hard rule!)
- **Source**: Features, hotfixes, and bugfixes merge here first
- **Merges To**: `main` (for releases)
- **Merges From**: Feature branches, hotfix branches
- **CI/CD**: Triggers staging/development environment deployments
- **Stability**: Should always be in a releasable state

### Working Branches

#### Feature Branches

**Pattern**: `feature/<descriptive-name>`

- **Purpose**: Individual features or enhancements
- **Branched From**: `development`
- **Merged To**: `development` (via PR)
- **Lifetime**: Short to medium (delete after merge)
- **Naming Examples**:
  - `feature/user-authentication`
  - `feature/payment-integration`
  - `feature/dashboard-redesign`

**Process**:

1. Branch from `development`
2. Work on feature
3. Create PR to `development`
4. Code review & approval
5. Squash and merge to `development`
6. Delete feature branch

#### Feature Group Branches

**Pattern**: `feature-group/<group-name>` or `epic/<epic-name>`

- **Purpose**: Large features composed of multiple smaller features
- **Branched From**: `development`
- **Strategy**: Multiple feature branches merge into the group, then group merges to `development`
- **Lifetime**: Medium to long (delete after merge)
- **Naming Examples**:
  - `feature-group/admin-panel`
  - `epic/marketplace-launch`
  - `feature-group/api-v2`

**Process**:

1. Create feature group branch from `development`
2. Create individual feature branches from the feature group
3. Merge individual features to feature group via PR
4. When complete, merge feature group to `development` via PR
5. Delete all related branches

#### Hotfix Branches

**Pattern**: `hotfix/<issue-description>`

- **Purpose**: Critical bug fixes that need immediate attention
- **Branched From**: `development` (for testing) OR `main` (for emergency production fixes)
- **Merged To**:
  - `development` first (for quick testing)
  - Then to `main` (for production release)
- **Lifetime**: Very short (delete immediately after merge)
- **Naming Examples**:
  - `hotfix/payment-gateway-error`
  - `hotfix/security-vulnerability-cve-2024-1234`
  - `hotfix/login-crash`

**Process**:

1. Branch from `development` (or `main` if emergency)
2. Fix the issue
3. Test thoroughly
4. PR to `development` for validation
5. After validation, PR from `development` to `main`
6. Tag the release
7. Delete hotfix branch

#### Bugfix Branches

**Pattern**: `fix/<bug-description>` or `bugfix/<bug-description>`

- **Purpose**: Non-critical bug fixes
- **Branched From**: `development`
- **Merged To**: `development`
- **Lifetime**: Short (delete after merge)
- **Naming Examples**:
  - `fix/typo-in-header`
  - `bugfix/incorrect-date-format`
  - `fix/api-response-validation`

#### Chore/Maintenance Branches

**Pattern**: `chore/<description>` or `docs/<description>`

- **Purpose**: Non-feature work (dependencies, docs, refactoring)
- **Branched From**: `development`
- **Merged To**: `development`
- **Naming Examples**:
  - `chore/update-dependencies`
  - `docs/api-documentation`
  - `chore/refactor-auth-module`

## Workflow Diagram

```
main (production) ←──────────── development (staging/integration)
  │                                    ↑
  │                                    │
  ├─ v1.0.0 (tag)                     ├─ feature/user-auth
  ├─ v1.1.0 (tag)                     ├─ feature/dashboard
  │                                    ├─ fix/payment-bug
  │                                    ├─ hotfix/critical-issue
  │                                    │
  │                                    └─ feature-group/admin-panel
  │                                          ├─ feature/user-management
  │                                          ├─ feature/role-permissions
  │                                          └─ feature/audit-logs
```

## Release Process

### Standard Release (from development → main)

1. Ensure `development` branch is stable and tested
2. Create PR from `development` → `main`
3. Perform final review and testing
4. Merge PR (use merge commit, not squash)
5. Tag the commit on `main`: `git tag -a v1.x.x -m "Release v1.x.x"`
6. Push tag: `git push origin v1.x.x`
7. CI/CD automatically deploys to production
8. Create release notes on GitHub

### Hotfix Release (emergency)

1. Branch from `main`: `git checkout -b hotfix/critical-fix main`
2. Fix the issue
3. PR to `development` for testing
4. After validation, PR to `main`
5. Tag immediately: `git tag -a v1.x.1 -m "Hotfix: description"`
6. Backport fix to `development` if not already there
7. Deploy to production

## Pull Request Standards

### Required Elements

- **Title**: Follow conventional commits format
  - `feat: add user authentication`
  - `fix: resolve payment gateway error`
  - `chore: update dependencies`
  - `docs: add API documentation`
- **Description**: Clear explanation of changes
- **Reviews**: Tiered by Target Branch
  - **Target `development`**:
    - Minimum 1 approval required.
    - Can be a Peer OR an AI Agent.
    - Focus: Speed and unblocking.
  - **Target `main` (Releases)**:
    - 3-way voting system (All 3 core devs).
    - Senior Dev (Tech Lead) has tie-breaking vote.
    - Focus: Production safety.
- **CI/CD**: All checks must pass
- **Conflicts**: Must be resolved before merge
- **Base Branch**: Must target correct branch (typically `development`)

### Merge Strategies

- **Feature branches → development**: Squash and merge (clean history)
- **Development → main**: Merge commit (preserve release history)
- **Hotfix → main**: Merge commit (traceability)

## Repository Hygiene Rules

### HARD RULES (Never Break)

1. ✋ **Never commit directly to `main`** - All changes via PR
2. ✋ **Never commit directly to `development`** - All changes via PR
3. ✋ **Never force push to protected branches** - Causes history loss
4. ✋ **Never merge without review** - Code quality gate
5. ✋ **Always delete branches after merge** - Keep repo clean

### Best Practices

- ✅ Keep branches focused and short-lived
- ✅ Sync with `development` regularly (`git pull origin development`)
- ✅ Write clear commit messages
- ✅ Squash commits before PR (clean up work-in-progress commits)
- ✅ Resolve conflicts locally before pushing
- ✅ Tag all releases on `main`
- ✅ Keep `development` always deployable
- ✅ Use conventional commit format
- ✅ Link PRs to issues/tickets

### Branch Cleanup

```bash
# List merged branches
git branch --merged development

# Delete local merged branches
git branch -d feature/completed-feature

# Delete remote branch
git push origin --delete feature/completed-feature

# Prune stale remote tracking branches
git fetch --prune
```

## Rating & Recommendations

### Current Workflow Rating: 8.5/10 ⭐⭐⭐⭐

**Strengths**:

- ✅ Clear separation between production (`main`) and integration (`development`)
- ✅ Feature grouping strategy for large features
- ✅ Hotfix process allows quick testing before production
- ✅ Strong emphasis on branch hygiene

**Suggested Improvements**:

#### 1. **Release Strategy** ("Ready then Release")

- **Philosophy**: `development` should always be stable.
- **Process**:
  1. Features merge to `development`.
  2. When a milestone is reached or sufficient value is added, a release is cut.
  3. No long-lived release branches unless maintaining multiple major versions.
  4. Tag `main` and deploy.

#### 2. **Branch Protection Rules**

Enable on GitHub:

- Require PR reviews (minimum 1-2)
- Require status checks to pass
- Require branches to be up to date before merging
- Require signed commits (for security)
- Lock branch against deletion

#### 3. **Automated Branch Cleanup**

- GitHub Action to auto-delete merged branches
- Periodic cleanup of stale branches (>30 days inactive)

#### 4. **Commit Standards Enforcement**

- Pre-commit hooks for commit message format
- Conventional commits enforcement (`feat:`, `fix:`, etc.)
- Commitlint or similar tool

#### 5. **Changelog Automation**

- Auto-generate changelogs from commit messages
- Release notes automation from PR descriptions
- Semantic versioning based on conventional commits

#### 6. **Development Environment Branches** (Optional)

For testing specific integrations:

- `integration/*` - For testing external service integrations
- `experiment/*` - For experimental features (not merged)

## Git Commands Cheatsheet

```bash
# Start a feature
git checkout development
git pull origin development
git checkout -b feature/my-feature

# Work and commit
git add .
git commit -m "feat: add new capability"

# Keep in sync with development
git fetch origin
git rebase origin/development

# Push and create PR
git push -u origin feature/my-feature
gh pr create --base development

# After PR is merged, cleanup
git checkout development
git pull origin development
git branch -d feature/my-feature

# Start a hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug
# ... fix, test, and merge to development first, then main
```

## Naming Convention Reference

| Type          | Pattern                                 | Example                        |
| ------------- | --------------------------------------- | ------------------------------ |
| Feature       | `feature/<name>`                        | `feature/user-notifications`   |
| Feature Group | `feature-group/<name>` or `epic/<name>` | `feature-group/payment-system` |
| Bugfix        | `fix/<name>` or `bugfix/<name>`         | `fix/login-validation`         |
| Hotfix        | `hotfix/<name>`                         | `hotfix/security-patch`        |
| Chore         | `chore/<name>`                          | `chore/upgrade-node`           |
| Documentation | `docs/<name>`                           | `docs/api-reference`           |
| Refactor      | `refactor/<name>`                       | `refactor/auth-module`         |
| Performance   | `perf/<name>`                           | `perf/database-queries`        |
| Test          | `test/<name>`                           | `test/add-unit-tests`          |

---

**Last Updated**: 2025-11-23  
**Workflow Version**: 2.0
