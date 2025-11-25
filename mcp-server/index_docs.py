#!/usr/bin/env python3
import os
import sys

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from search import SemanticSearch

def main():
    # Root of the repo is one level up from mcp-server
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
    
    print(f"Initializing Semantic Search for repo: {repo_root}")
    
    # Initialize search engine (will create/load DB in mcp-server/chroma_db)
    db_path = os.path.join(os.path.dirname(__file__), "chroma_db")
    search_engine = SemanticSearch(persistence_directory=db_path)
    
    # Index documents
    search_engine.index_documents(repo_root)

if __name__ == "__main__":
    main()
