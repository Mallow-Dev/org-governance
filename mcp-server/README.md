# Governance MCP Server

A Model Context Protocol (MCP) server for the Organizational Governance repository. This server provides tools to access governance documentation, search standards, and manage compliance workflows.

## Features

- **Read Documentation**: Access any governance document via `governance://` URI.
- **List Documents**: Discover available workflows, standards, and policies.
- **Semantic Search**: Query the governance knowledge base using natural language.
- **Compliance Tools**: (Coming Soon) Automated checks and reporting.

## Setup

1. **Prerequisites**:

   - Python 3.10+
   - OpenAI API Key (for semantic search)

2. **Installation**:

   ```bash
   ./setup.sh
   ```

3. **Environment Variables**:
   Create a `.env` file or export:
   ```bash
   export OPENAI_API_KEY="sk-..."
   ```

## Usage

### Running the Server

```bash
source .venv/bin/activate
python src/server.py
```

The server will start on `http://0.0.0.0:8000`.

### Indexing Documents

Before using semantic search, you must index the documentation:

```bash
source .venv/bin/activate
python index_docs.py
```

This creates a local vector database in `chroma_db/`.

## Tools

- `read_governance_doc(category, document)`: Read a specific file.
- `list_governance_docs()`: List all available files.
- `search_governance(query)`: Semantic search across all docs.
- `reindex_governance()`: Trigger a re-index of the docs.

## Development

- **Source**: `src/`
- **Tests**: (Coming Soon)
