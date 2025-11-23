# System Context

## Architecture

```mermaid
flowchart TD
    Repo[Governance Repo] -->|Reads| MCP[MCP Server]
    MCP -->|Exposes| Agent[AI Agents]
    Repo -->|Syncs| GitHub[GitHub Settings]
    GitHub -->|Provides Data| Dash[Compliance Dashboard]

    subgraph "Governance Repo"
        Docs[Markdown Docs]
        Settings[YAML Configs]
        Scripts[Automation Scripts]
    end

    subgraph "MCP Server (Python)"
        FastAPI[FastAPI Server]
        LangChain[LangChain Logic]
        Vector[Vector Store]
    end

    subgraph "Dashboard (Next.js)"
        UI[Glassmorphism UI]
        Viz[Drift Visualization]
    end
```

## Tech Stack

- **Repository**: Git, Markdown, YAML.
- **MCP Server**: Python 3.10+, FastAPI, LangChain, ChromaDB.
- **Dashboard**: Next.js 14, Tailwind CSS, Framer Motion.
- **Automation**: TypeScript (Octokit), GitHub Actions.

## Key Workflows

1. **Policy Update**: Dev submits PR -> 3-way Vote -> Merge -> MCP Server updates index.
2. **Agent Query**: Agent asks "How do I commit?" -> MCP searches docs -> Returns `conventional-commits` rule.
3. **Drift Detection**: Scheduled Action checks GitHub settings vs YAML -> Updates Dashboard -> Alerts Tech Lead.
