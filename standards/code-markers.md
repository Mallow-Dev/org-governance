# Code Markers Standard

## Purpose

Standardize code markers (comments like TODO, FIXME, etc.) across all projects to improve code clarity, maintainability, and task prioritization.

## Marker Categories

Code markers are organized into three temporal categories with clear separation:

### IMMEDIATE WORK (Current Sprint/Feature)

Work that must be done now or very soon as part of the current feature or sprint.

| Marker  | Usage                                        | Priority |
| ------- | -------------------------------------------- | -------- |
| `TODO`  | Must do now or ASAP in this feature run      | High     |
| `FIXME` | Known issue that needs fixing before release | High     |
| `BUG`   | Confirmed bug that needs fixing              | High     |
| `WIP`   | Work currently in progress                   | Medium   |

### CODE QUALITY (Current Phase)

Quality improvements needed in the current codebase phase.

| Marker     | Usage                                         | Priority   |
| ---------- | --------------------------------------------- | ---------- |
| `HACK`     | Temporary solution that works but isn't ideal | Medium     |
| `OPTIMIZE` | Performance improvement needed                | Low-Medium |
| `REFACTOR` | Code needs refactoring                        | Low-Medium |

### DEFERRED WORK (Future Cycles)

Work deferred to future sprints, phases, or backlog.

| Marker    | Usage                                      | Priority |
| --------- | ------------------------------------------ | -------- |
| `LATER`   | Deferred to next sprint/phase              | Deferred |
| `FUTURE`  | Longer-term improvement (not next sprint)  | Deferred |
| `BACKLOG` | Move to product backlog for prioritization | Deferred |

### SECURITY (All Phases)

Security-related issues, improvements, or concerns. **Always include severity level.**

| Marker              | Usage                                                   | Priority |
| ------------------- | ------------------------------------------------------- | -------- |
| `SECURITY:critical` | Critical security vulnerability requiring immediate fix | Critical |
| `SECURITY:high`     | High-priority security issue                            | High     |
| `SECURITY:medium`   | Medium-priority security improvement                    | Medium   |
| `SECURITY:low`      | Low-priority security hardening                         | Low      |

**Note**: Security markers should always include a severity suffix (`:critical`, `:high`, `:medium`, `:low`).

### ATTENTION & NOTES

General annotations and warnings.

| Marker | Usage                                    | Priority |
| ------ | ---------------------------------------- | -------- |
| `NOTE` | Important note about the code            | Info     |
| `XXX`  | Needs review/attention (generic warning) | Medium   |

## Format Guidelines

### Basic Format

```
// [MARKER]: Description of what needs to be done
```

### With Context (Recommended)

```
// [MARKER]: Description
// Reason: Why this is needed
// Impact: What happens if not addressed
```

### With Assignee

```
// [MARKER](@username): Description
```

### With Issue Reference

```
// [MARKER](#123): Description linking to issue #123
```

## Language-Specific Syntax

### JavaScript/TypeScript

```javascript
// TODO: Validate user input before processing
function process(data) { ... }

/* FIXME: Crashes when data is null
   Add guard clause before accessing properties */
function parse(json) { ... }
```

### Python

```python
# TODO: Validate user input before processing
def process(data):
    pass

# FIXME: Crashes when data is null - add guard clause
def parse(json_data):
    pass
```

### Go

```go
// TODO: Validate user input before processing
func process(data string) { ... }

// FIXME: Crashes when data is null - add guard clause
func parse(json string) { ... }
```

### Shell/Bash

```bash
# TODO: Add error handling for missing environment variables
process_data() { ... }
```

## Usage Examples

### Immediate Work

```javascript
// TODO: Validate user input before processing
function processPayment(amount) {
  // Currently accepts any value
  return charge(amount);
}

// FIXME: Crashes when user object is null - add guard clause
function getUserEmail(user) {
  return user.email; // Throws if user is null
}

// BUG: Off-by-one error in loop - processes one extra item
for (let i = 0; i <= items.length; i++) {
  process(items[i]);
}

// WIP: Implementing OAuth2 authentication
function authenticate() {
  // Partially complete
}
```

### Code Quality

```javascript
// HACK: Using setTimeout as workaround for async race condition
// TODO: Refactor to use proper async/await pattern
setTimeout(() => update(), 100);

// OPTIMIZE: This loop is O(n²) - convert to Set for O(n)
for (let x of array) {
  for (let y of array) {
    if (x === y) continue;
  }
}

// REFACTOR: Extract this logic into separate validation module
function validateAndProcess(data) {
  // 200 lines of validation logic mixed with business logic
}
```

### Deferred Work

```javascript
// LATER: Add email notifications when user preference is stored
// Blocked by: Email service integration (Q2 2025)
function notifyUser(message) {
  console.log(message); // Placeholder
}

// FUTURE: Implement caching layer for API calls
// Impact: Could improve performance by 50%
function fetchData() {
  return api.get("/data");
}

// BACKLOG: Advanced filtering UI with facets and search
// Product decision: Not prioritized for MVP
function searchProducts() {
  // Basic search only
}
```

### Security

```javascript
// SECURITY:critical - SQL injection vulnerability
// User input directly concatenated into query
function getUserById(id) {
  return db.query("SELECT * FROM users WHERE id = " + id);
  // Fix: Use parameterized queries
}

// SECURITY:high - Authentication token stored in localStorage
// Impact: Vulnerable to XSS attacks
localStorage.setItem("authToken", token);
// Fix: Use httpOnly cookies

// SECURITY:medium - Missing rate limiting on API endpoint
// Could lead to abuse or DoS
app.post("/api/login", (req, res) => {
  // No rate limiting
  authenticate(req.body);
});

// SECURITY:low - Add CSP headers for defense in depth
// Current: No Content-Security-Policy
app.use((req, res, next) => {
  // Missing security headers
  next();
});
```

### Notes & Warnings

```javascript
// NOTE: This must run after database migration v2.1
// See: migrations/002_add_user_roles.sql
function initializeRoles() {
  // ...
}

// XXX: This approach violates SOLID principles
// Consider redesigning when time permits
class GodObject {
  // Does everything
}
```

## Best Practices

### DO ✅

- **Be specific**: `// TODO: Add email validation using regex /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/`
- **Add context**: Explain why, not just what
- **Link issues**: `// TODO(#456): Fix race condition in auth flow`
- **Use appropriate marker**: Don't use TODO for long-term ideas
- **Keep updated**: Remove markers when work is complete

### DON'T ❌

- **Be vague**: `// TODO: Fix this` (What needs fixing?)
- **Ignore them**: Markers without action become noise
- **Overuse**: Not every line needs a marker
- **Mix markers**: Don't combine `// TODO FIXME: ...`
- **Leave orphans**: Remove markers when code is refactored away

## Search and Tracking

### Find All Markers

```bash
# All markers
grep -rn "TODO\|FIXME\|BUG\|HACK\|OPTIMIZE\|SECURITY" src/

# Specific marker
grep -rn "FIXME" src/

# By assignee
grep -rn "TODO(@username)" src/

# Security issues only
grep -rn "SECURITY:" src/

# Critical security issues
grep -rn "SECURITY:critical\|SECURITY:high" src/
```

### Pre-commit Hook (Mandatory)

**Installation**: See [`workflows/pre-commit-hook-setup.md`](../workflows/pre-commit-hook-setup.md)

All projects must install the organization's standard pre-commit hook:

```bash
# Install from org-governance repo
curl -o .git/hooks/pre-commit \
  https://raw.githubusercontent.com/Mallow-Dev/org-governance/main/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

**Enforcement**:

- ❌ **Blocks** commits with: `FIXME`, `BUG`, `SECURITY:critical`
- ⚠️ **Warns** about: `SECURITY:high`

**Bypass** (use sparingly):

```bash
git commit --no-verify  # Only for exceptional cases
```

## IDE Integration

**Centralized Extensions**: See [`standards/recommended-extensions.md`](recommended-extensions.md) for all organizational extension recommendations.

### VS Code

Install recommended extensions:

- **[Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)** - Highlights and organizes markers
- **[Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)** - Color-codes different marker types

**Installation**: These are included in [`.vscode/extensions.json`](../.vscode/extensions.json). VS Code will prompt to install them automatically.

**Configuration** (`.vscode/settings.json`):

```json
{
  "todo-tree.general.tags": [
    "TODO",
    "FIXME",
    "BUG",
    "HACK",
    "OPTIMIZE",
    "REFACTOR",
    "LATER",
    "FUTURE",
    "BACKLOG",
    "SECURITY:critical",
    "SECURITY:high",
    "SECURITY:medium",
    "SECURITY:low",
    "NOTE",
    "XXX"
  ],
  "todo-tree.highlights.customHighlight": {
    "FIXME": { "foreground": "#ff0000", "icon": "alert" },
    "BUG": { "foreground": "#ff0000", "icon": "bug" },
    "SECURITY:critical": { "foreground": "#ff0000", "icon": "shield" },
    "SECURITY:high": { "foreground": "#ff6600", "icon": "shield" },
    "TODO": { "foreground": "#ffcc00", "icon": "check" },
    "HACK": { "foreground": "#ff9900", "icon": "tools" }
  }
}
```

### JetBrains IDEs

Built-in TODO tool window (View → Tool Windows → TODO)

Configure custom patterns:

1. Settings → Editor → TODO
2. Add patterns for: `HACK`, `OPTIMIZE`, `FUTURE`, `SECURITY:.*`, etc.
3. Set colors for different priority levels

**Pattern examples**:

- `\bSECURITY:critical\b.*` (red)
- `\bFIXME\b.*` (red)
- `\bTODO\b.*` (yellow)

## Reporting

### Generate Marker Report

```bash
#!/bin/bash
# scripts/report-markers.sh

echo "Code Markers Report"
echo "==================="
echo ""
echo "CRITICAL SECURITY:"
grep -rn "SECURITY:critical" src/ | wc -l
echo ""
echo "IMMEDIATE (High Priority):"
grep -rn "TODO\|FIXME\|BUG\|SECURITY:high" src/ | wc -l
echo ""
echo "CODE QUALITY:"
grep -rn "HACK\|OPTIMIZE\|REFACTOR" src/ | wc -l
echo ""
echo "DEFERRED:"
grep -rn "LATER\|FUTURE\|BACKLOG" src/ | wc -l
echo ""
echo "SECURITY (All):"
grep -rn "SECURITY:" src/ | wc -l
```

## Migration Guide

### From Old Markers

| Old           | New                     | Reason                     |
| ------------- | ----------------------- | -------------------------- |
| `@todo`       | `TODO`                  | Standardize on uppercase   |
| `FIXME!`      | `FIXME`                 | Remove punctuation         |
| `XXX urgent`  | `FIXME`                 | Be specific about urgency  |
| `@deprecated` | Use `@deprecated` JSDoc | Language feature preferred |
| `TODO: maybe` | `FUTURE`                | Clarify timeline           |

## Enforcement

### Optional Linting

Add to `.eslintrc` or equivalent:

```json
{
  "rules": {
    "no-warning-comments": [
      "warn",
      {
        "terms": ["FIXME", "BUG"],
        "location": "anywhere"
      }
    ]
  }
}
```

### CI/CD Check

```yaml
# .github/workflows/code-markers.yml
- name: Check for critical markers
  run: |
    if grep -rn "FIXME\|BUG" src/; then
      echo "::warning::Critical markers found - review before release"
    fi
```

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-23  
**Related**: `standards/conventional-commits.md`
