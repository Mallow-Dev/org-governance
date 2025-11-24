# Pre-commit Hook Setup

## Purpose

Install the organization's standard pre-commit hook to enforce code marker standards across all projects.

## Hook Enforcement

The pre-commit hook **blocks commits** containing:

- `FIXME` - Known issues
- `BUG` - Confirmed bugs
- `SECURITY:critical` - Critical security vulnerabilities

The hook **warns** (non-blocking) about:

- `SECURITY:high` - High-priority security issues

## Installation

### Automated (Recommended)

```bash
# Run from any project root
curl -o .git/hooks/pre-commit \
  https://raw.githubusercontent.com/Mallow-Dev/org-governance/main/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Manual

```bash
# From org-governance repo
cp hooks/pre-commit /path/to/your/project/.git/hooks/
chmod +x /path/to/your/project/.git/hooks/pre-commit
```

### Verify Installation

```bash
# Check if hook is installed and executable
ls -la .git/hooks/pre-commit

# Test the hook
.git/hooks/pre-commit
```

## Usage

The hook runs automatically on every `git commit`. No action needed after installation.

### Example Output

**Blocked commit:**

```
❌ COMMIT BLOCKED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found critical markers that must be resolved before commit:

+  // FIXME: Crashes when user is null
+  // BUG: Off-by-one error

Critical markers found:
  • FIXME - Known issues that need fixing
  • BUG - Confirmed bugs
  • SECURITY:critical - Critical security vulnerabilities

Fix these issues before committing
```

**Warning (non-blocking):**

```
⚠️  WARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found high-priority security markers:

+  // SECURITY:high - Token stored in localStorage

Consider addressing before merge to development or main
```

## Bypass (Not Recommended)

In rare cases where you need to commit with critical markers:

```bash
git commit --no-verify
```

**Warning**: Only use `--no-verify` when absolutely necessary (e.g., work-in-progress branch, documenting existing issues).

## Updating the Hook

When the hook is updated in org-governance:

```bash
# Re-run installation command
curl -o .git/hooks/pre-commit \
  https://raw.githubusercontent.com/Mallow-Dev/org-governance/main/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Organization-Wide Rollout

### Phase 1: New Projects

All new projects must install the hook before first commit.

### Phase 2: Existing Projects

Add to onboarding checklist:

1. Install pre-commit hook
2. Run full codebase marker audit
3. Fix or document existing critical markers

### Phase 3: Enforcement

Branch protection rules require pre-commit hook installation for all contributors.

## Troubleshooting

### Hook not running

```bash
# Check if hook is executable
ls -la .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit
```

### False positives

If the hook incorrectly flags code:

1. Check if marker is in a string or comment
2. Verify you're using the correct marker (e.g., `HACK` vs `FIXME`)
3. File an issue in org-governance if truly a false positive

### Hook too strict

The enforcement levels are intentional:

- **Critical markers** (FIXME, BUG, SECURITY:critical) should not be committed
- Use appropriate markers: `TODO`, `HACK`, `LATER`, `FUTURE`

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-23  
**Related**: `standards/code-markers.md`
