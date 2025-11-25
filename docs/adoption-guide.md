# Organizational Governance Adoption Guide

## Overview

This guide outlines the process for adopting the organizational governance framework in your repository. By onboarding, you ensure your project complies with security standards, code quality metrics, and development workflows.

## Quick Start

To onboard a repository immediately, run the following command from the `org-governance` root:

```bash
./scripts/onboard-repo.sh /path/to/your/repo
```

This script will:

1.  Install the mandatory **pre-commit hook** (enforces code markers).
2.  Add the **Governance: Active** badge to your README.

## Manual Setup

If you prefer to configure manually:

### 1. Install Pre-commit Hook

Copy the hook from `org-governance/hooks/pre-commit` to your repo's `.git/hooks/` directory and make it executable.

```bash
cp /path/to/org-governance/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### 2. Follow Branching Strategy

Ensure your repository follows the [Git Branching Strategy](../workflows/git-branching-strategy.md):

- `main` for production releases.
- `development` for integration.
- `feature/*` for new work.

### 3. Enable Branch Protection

Configure branch protection rules as defined in [Branch Protection Rules](../github-settings/branch-protection-rules.yaml).

- Require pull request reviews before merging.
- Require status checks to pass.

## Compliance Checks

The **Governance Monitor** agent scans all repositories daily. It checks for:

- **Missing Branch Protection**: Critical violation.
- **Security Markers**: `SECURITY:critical` comments in code.
- **Stale Branches**: Feature branches older than 30 days.

## Support

For questions or issues, please open an issue in the `org-governance` repository or contact the Governance Team.
