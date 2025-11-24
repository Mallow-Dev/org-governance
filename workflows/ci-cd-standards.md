# CI/CD Standards

## Overview

Mallow-Dev uses **Reusable Workflows** hosted in the `org-governance` repository to ensure consistent build, test, and security practices across all projects.

## Available Workflows

### 1. Build & Test

**File**: `Mallow-Dev/org-governance/.github/workflows/reusable-build-test.yml@main`

**Usage**:

```yaml
jobs:
  build:
    uses: Mallow-Dev/org-governance/.github/workflows/reusable-build-test.yml@main
    with:
      node-version: "20"
```

### 2. Linting

**File**: `Mallow-Dev/org-governance/.github/workflows/reusable-lint.yml@main`

**Usage**:

```yaml
jobs:
  lint:
    uses: Mallow-Dev/org-governance/.github/workflows/reusable-lint.yml@main
```

### 3. Security Scan (CodeQL)

**File**: `Mallow-Dev/org-governance/.github/workflows/reusable-security.yml@main`

**Usage**:

```yaml
jobs:
  security:
    uses: Mallow-Dev/org-governance/.github/workflows/reusable-security.yml@main
    with:
      language: "javascript"
```

## Enforcement

- All repositories MUST use these workflows for their `main` and `development` branches.
- Branch protection rules require `ci-tests` (Build & Test) and `security-scan` to pass before merging.
