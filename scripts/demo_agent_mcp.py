import asyncio
import sys
import os

# Ensure mcp is installed or run with the mcp-server venv
try:
    from mcp.client.stdio import stdio_client, StdioServerParameters
    from mcp.client.session import ClientSession
except ImportError:
    print("Error: 'mcp' package not found. Please run this script using the mcp-server virtual environment:")
    print("source mcp-server/.venv/bin/activate && python scripts/demo_agent_mcp.py")
    sys.exit(1)

async def run_agent_demo():
    print("🤖 Agent: Connecting to Governance MCP Server (Stdio)...")
    
    # Define server parameters
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    server_script = os.path.join(repo_root, "mcp-server/src/server.py")
    python_exe = sys.executable # Use current python (assuming running in venv)
    
    server_params = StdioServerParameters(
        command=python_exe,
        args=[server_script],
        env=os.environ.copy()
    )
    
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                
                print("✅ Agent: Connected!")
                
                # List tools
                print("\n1️⃣  Discovering Capabilities...")
                tools = await session.list_tools()
                tool_names = [t.name for t in tools.tools]
                print(f"   Found {len(tool_names)} tools: {', '.join(tool_names)}")
                
                # Scenario: Agent needs to check branch protection rules
                query = "branch protection requirements"
                print(f"\n2️⃣  Agent Task: Search for '{query}'...")
                
                try:
                    # Call search tool
                    result = await session.call_tool("search_governance", arguments={"query": query})
                    
                    print("\n   📄 Search Results Received:")
                    # Handle potential text or list content
                    content = result.content[0].text if result.content else "No content"
                    print(f"   > {content[:300].replace(chr(10), chr(10) + '   > ')}...")
                except Exception as e:
                    print(f"   ⚠️  Search failed (likely due to missing API key): {e}")

                # Scenario: Agent reads a specific policy
                print("\n3️⃣  Agent Task: Read 'ai-agent-approval-policy'...")
                try:
                    doc = await session.call_tool("read_governance_doc", arguments={"category": "policies", "document": "ai-agent-approval-policy"})
                    content = doc.content[0].text if doc.content else "No content"
                    print(f"\n   📖 Content Preview:\n   > {content[:200].replace(chr(10), chr(10) + '   > ')}...")
                except Exception as e:
                     print(f"   ⚠️  Read failed: {e}")

    except Exception as e:
        print(f"\n❌ Connection Error: {e}")
        print("Ensure the MCP server is running: 'cd mcp-server && source .venv/bin/activate && python src/server.py'")

if __name__ == "__main__":
    asyncio.run(run_agent_demo())
