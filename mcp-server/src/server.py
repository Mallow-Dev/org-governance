from mcp.server.fastapi import FcpServer
from fastapi import FastAPI
import uvicorn
import os

# Initialize FastAPI app
app = FastAPI(title="Governance MCP Server")

# Initialize MCP Server
mcp = FcpServer(name="governance-mcp")

@mcp.resource("governance://{category}/{document}")
async def read_governance_doc(category: str, document: str) -> str:
    """Read a governance document by category and name."""
    # Security check: prevent directory traversal
    if ".." in category or ".." in document:
        raise ValueError("Invalid path")
    
    # Construct path (assuming running from repo root or mcp-server)
    # Adjust path logic as needed based on deployment
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    file_path = os.path.join(base_path, category, f"{document}.md")
    
    if not os.path.exists(file_path):
        return f"Document not found: {category}/{document}"
        
    with open(file_path, "r") as f:
        return f.read()

@mcp.tool()
async def list_governance_docs() -> list[str]:
    """List all available governance documents."""
    docs = []
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    
    for category in ["workflows", "standards", "policies", "templates"]:
        cat_path = os.path.join(base_path, category)
        if os.path.exists(cat_path):
            for file in os.listdir(cat_path):
                if file.endswith(".md"):
                    docs.append(f"governance://{category}/{file.replace('.md', '')}")
    return docs

# Mount MCP to FastAPI
app.include_router(mcp.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
