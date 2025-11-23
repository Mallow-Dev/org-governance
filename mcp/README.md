# MCP Integration

## Overview

This governance repository is designed to be consumed by AI agents and automation tools via the **Model Context Protocol (MCP)**. MCP enables structured access to organizational knowledge, allowing agents to query standards, validate work, and self-correct based on policies.

## Architecture

```
┌─────────────────────────┐
│  Governance Repo        │  ← Documentation source (Git)
│  (Markdown/YAML files)  │
└───────────┬─────────────┘
            │ reads
            ▼
┌─────────────────────────┐
│  MCP Server             │  ← Resource provider
│  - File system reader   │     - Exposes docs as resources
│  - Markdown parser      │     - Provides query interface
│  - YAML validator       │     - Caches frequently accessed
└───────────┬─────────────┘
            │ MCP protocol
            ▼
┌─────────────────────────┐
│  AI Agents / Tools      │  ← Context consumers
│  - Code reviewers       │     - Query policies
│  - CI/CD pipelines      │     - Validate compliance
│  - Development  agents   │     - Get guidance
└─────────────────────────┘
```

## Resource Mapping

### Resource URIs

MCP resources follow this naming convention:

```
governance://<category>/<document>
```

Examples:

- `governance://workflows/git-branching-strategy`
- `governance://standards/conventional-commits`
- `governance://policies/security-policy`

### Resource Types

| Category        | Resource Path                                    | Description         |
| --------------- | ------------------------------------------------ | ------------------- |
| workflows       | `governance://workflows/git-branching-strategy`  | Git workflow rules  |
| workflows       | `governance://workflows/pr-review-guidelines`    | PR review standards |
| workflows       | `governance://workflows/release-process`         | Release procedures  |
| workflows       | `governance://workflows/hotfix-procedures`       | Hotfix workflow     |
| standards       | `governance://standards/conventional-commits`    | Commit format       |
| standards       | `governance://standards/api-design-standards`    | API guidelines      |
| templates       | `governance://templates/pull-request-template`   | PR template         |
| policies        | `governance://policies/code-of-conduct`          | Code of conduct     |
| policies        | `governance://policies/security-policy`          | Security policy     |
| github-settings | `governance://github-settings/branch-protection` | Branch rules        |

## Query Interface

### Example Queries

**Q: What's the branch naming convention for features?**

```
Query: governance://workflows/git-branching-strategy#feature-branches
Response: Pattern: feature/<descriptive-name>
```

**Q: How many reviewers required for PRs?**

```
Query: governance://workflows/pr-review-guidelines#approval-criteria
Response: Minimum 1 approval required, 2 for critical changes
```

**Q: What's the commit message format?**

```
Query: governance://standards/conventional-commits#format
Response: <type>(<scope>): <description>
```

## MCP Server Implementation

### Technology Stack: Python (FastAPI + LangChain)

We have selected **Python** as the implementation language for the MCP server to enable advanced intelligence features.

**Stack Components**:

- **Server**: FastAPI (high performance, easy async)
- **MCP SDK**: `mcp` Python package
- **Intelligence**: LangChain (orchestration)
- **Search**: Vector embeddings (ChromaDB/FAISS) for semantic search
- **LLM Integration**: OpenAI/Anthropic via LangChain

**Why Python?**

- Native support for AI/ML libraries
- Rich ecosystem for document parsing (Unstructured, PyPDF)
- Easy integration with vector stores

### Required Capabilities

The MCP server should support:

- ✅ **File system access**: Read governance repo files
- ✅ **Markdown parsing**: Extract structured content
- ✅ **YAML validation**: Parse GitHub settings
- ✅ **Search/query**: Find relevant policies
- ✅ **Versioning**: Access specific doc versions
- ✅ **Caching**: Fast repeated queries
- ✅ **Hot reload**: Update when repo changes

## Integration Patterns

### 1. CI/CD Validation

```yaml
# .github/workflows/validate-pr.yml
name: Validate PR
on: pull_request

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check PR follows guidelines
        run: |
          mcp-client query governance://workflows/pr-review-guidelines
          # Validate PR description, labels, etc.
```

### 2. Pre-commit Hooks

```bash
#!/bin/sh
# .git/hooks/commit-msg

# Query commit message format from governance
mcp-client query governance://standards/conventional-commits

# Validate commit message against standard
commitlint --edit "$1"
```

### 3. Agent Context Injection

```python
# AI agent context provider
def get_coding_standards():
    standards = mcp_client.query("governance://standards/*")
    return f"Follow these standards: {standards}"

# Agent uses this context when generating code
agent.set_context(get_coding_standards())
```

### 4. Compliance Dashboard

```javascript
// Dashboard that shows repo compliance
const branchRules = await mcp.query(
  "governance://github-settings/branch-protection"
);
const actualSettings = await github.repos.getBranchProtection();
const compliance = compare(branchRules, actualSettings);
// Display drift and non-compliance
```

## Deployment

### Local Development

```bash
# Clone governance repo
git clone <org-governance-repo>

# Start MCP server
cd mcp-server
npm install
npm start

# Server listens on localhost:3000
# Resources available at governance:// URIs
```

### Production Deployment

1. **Self-hosted**

   - Deploy MCP server to internal infrastructure
   - Point to cloned governance repo
   - Agents connect via internal network

2. **Serverless**

   - Deploy as Lambda/Cloud Function
   - Trigger on governance repo updates
   - Cache in Redis/DynamoDB

3. **GitHub Integration**
   - Run as GitHub App
   - Webhook on repo changes
   - Provide API for agents

## Security Considerations

- **Authentication**: MCP server requires API key/token
- **Authorization**: Different access levels for different agents
- **Rate limiting**: Prevent abuse
- **Audit logging**: Track who queries what
- **Encryption**: TLS for transport, encrypt sensitive docs

## Future Enhancements

### Phase 1: Foundation (Weeks 1-2)

- Basic Python MCP Server
- File system reader (Markdown/YAML)
- Simple query interface
- GitHub Actions integration

### Phase 2: Intelligence & Search (Weeks 3-5)

- Semantic search implementation (Embeddings)
- Vector store integration
- Natural language query processing ("How do I...?")

### Phase 3: Advanced Capabilities (Weeks 6-8)

- Compliance validation logic
- Proactive recommendations
- Automated report generation
- Full "Intelligence Layer" maturity

## Metrics and Monitoring

Track:

- Query volume and patterns
- Most accessed documents
- Query latency
- Cache hit rates
- Error rates
- Agents using the system

## Getting Started

### For Agent Developers

1. **Setup Environment**:

   ```bash
   cd mcp-server
   ./setup.sh
   source .venv/bin/activate
   ```

2. **Run Server**:

   ```bash
   python src/server.py
   ```

3. **Connect Client**:
   ```python
   from mcp import Client
   # ...
   ```

```python
from mcp import Client

client = Client("http://mcp-server:3000")
branching_rules = client.query("governance://workflows/git-branching-strategy")
# Use rules to validate agent's work
```

### For Automation Scripts

```bash
# Query via CLI
mcp-query governance://standards/conventional-commits > /tmp/commit-standard.md

# Validate commit message
commitlint --config /tmp/commit-standard.md
```

---

**Status**: Planning / Implementation Pending  
**Version**: 1.0.0  
**Last Updated**: 2025-11-23
