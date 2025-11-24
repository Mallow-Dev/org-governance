# Recommended IDE Extensions

## Purpose

Centralized list of recommended IDE extensions across all organizational projects. Each extension is tagged with the standard or workflow that recommends it.

## VS Code Extensions

**Location**: [`.vscode/extensions.json`](../.vscode/extensions.json)

### Code Quality & Markers

| Extension                                                                                         | Publisher   | Recommended By                                              |
| ------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)            | Gruntfuggly | [`standards/code-markers.md`](../standards/code-markers.md) |
| [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) | Aaron Bond  | [`standards/code-markers.md`](../standards/code-markers.md) |

### Future Extensions

As additional standards are created, extensions will be added here with attribution to the recommending standard.

## JetBrains IDE Plugins

### Built-in Features

JetBrains IDEs have built-in support for:

- **TODO tool window** - Configured via Settings → Editor → TODO
- Custom patterns configured per [`standards/code-markers.md`](../standards/code-markers.md)

### Recommended Plugins

| Plugin                              | Recommended By |
| ----------------------------------- | -------------- |
| _(To be added as standards evolve)_ | -              |

## Installation

### VS Code

**Automatic (Recommended)**:
When opening a project with `.vscode/extensions.json`, VS Code will prompt to install recommended extensions.

**Manual**:

```bash
# Install via command line
code --install-extension gruntfuggly.todo-tree
code --install-extension aaron-bond.better-comments
```

### JetBrains IDEs

1. Open **Settings** → **Editor** → **TODO**
2. Add custom patterns from [`standards/code-markers.md`](../standards/code-markers.md)

## Adding New Extensions

When a new standard recommends an extension:

1. **Update `.vscode/extensions.json`**:

   ```json
   "publisher.extension-name",  // Recommended by: [standard-name]
   ```

2. **Update this document**:
   Add row to appropriate table with link to recommending standard

3. **Update the recommending standard**:
   Add reference to this centralized file

## Extension Configuration

Extension-specific settings should be documented in the standard that recommends them.

Example:

- Todo Tree configuration → [`standards/code-markers.md`](../standards/code-markers.md)
- Linter settings → (future) `standards/code-style.md`

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-23  
**Maintainer**: DevOps Team
