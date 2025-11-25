from mcp.server.fastmcp import FastMCP
from fastapi import FastAPI
import uvicorn
import os

# Initialize MCP Server
mcp = FastMCP("governance-mcp")

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

# Initialize Semantic Search
try:
    from search import SemanticSearch
except ImportError:
    from .search import SemanticSearch
search_engine = SemanticSearch(persistence_directory=os.path.join(os.path.dirname(__file__), "../chroma_db"))

@mcp.tool()
async def search_governance(query: str) -> str:
    """
    Perform a semantic search across all governance documentation.
    Returns relevant snippets with source links.
    """
    results = search_engine.search(query)
    
    if not results:
        return "No matching documents found."
    
    if "error" in results[0]:
        return results[0]["error"]

    response = f"### Search Results for '{query}'\n\n"
    for item in results:
        source = item['source'].split('/')[-1] # Simple filename
        response += f"**Source**: {source} (Score: {item['score']:.2f})\n"
        response += f"> {item['content']}...\n\n"
        
    return response

@mcp.tool()
async def reindex_governance() -> str:
    """
    Trigger a re-indexing of all governance documents.
    Call this after adding or modifying documentation.
    """
    base_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    try:
        search_engine.index_documents(base_path)
        return "Successfully re-indexed governance documents."
    except Exception as e:
        return f"Failed to re-index: {str(e)}"

# Initialize Reporting
try:
    from reporting import ComplianceReporter, get_mock_compliance_data
except ImportError:
    from .reporting import ComplianceReporter, get_mock_compliance_data
reporter = ComplianceReporter()

@mcp.tool()
async def generate_compliance_report() -> str:
    """
    Generate a comprehensive compliance report for the organization.
    Currently uses mock data for demonstration.
    """
    data = get_mock_compliance_data()
    return reporter.generate_report(data)

# Initialize Recommendations
try:
    from recommendations import PolicyRecommender
except ImportError:
    from .recommendations import PolicyRecommender
recommender = PolicyRecommender()

@mcp.tool()
async def suggest_policy_updates(category: str, document: str) -> str:
    """
    Suggest updates for a specific policy document using AI.
    Reads the document and generates recommendations.
    """
    # Reuse read_governance_doc logic
    try:
        content = await read_governance_doc(category, document)
        if content.startswith("Document not found"):
            return content
            
        return await recommender.suggest_updates(content, context=f"Reviewing {document}")
    except Exception as e:
        return f"Error: {e}"

@mcp.tool()
async def analyze_violation_trends(violations: list[str]) -> str:
    """
    Analyze a list of violations to suggest systemic policy changes.
    """
    return await recommender.analyze_violations(violations)

if __name__ == "__main__":
    mcp.run()
