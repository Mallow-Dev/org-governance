import os
from typing import List, Dict, Any
from langchain_community.document_loaders import DirectoryLoader, TextLoader
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

class SemanticSearch:
    def __init__(self, persistence_directory: str = "./chroma_db"):
        self.persistence_directory = persistence_directory
        try:
            self.embeddings = OpenAIEmbeddings()
        except Exception as e:
            print(f"Warning: Could not initialize OpenAI Embeddings: {e}")
            self.embeddings = None
            
        self.vector_store = None
        if self.embeddings:
            self._load_vector_store()

    def _load_vector_store(self):
        """Load the vector store from disk if it exists."""
        if os.path.exists(self.persistence_directory):
            self.vector_store = Chroma(
                persist_directory=self.persistence_directory,
                embedding_function=self.embeddings
            )
        else:
            # Initialize empty if not found, will be created on index
            pass

    def index_documents(self, root_dir: str):
        """Index all markdown files in the governance repo."""
        print(f"Indexing documents from {root_dir}...")
        
        # Load Markdown files
        loader = DirectoryLoader(
            root_dir,
            glob="**/*.md",
            loader_cls=TextLoader,
            show_progress=True,
            use_multithreading=True
        )
        documents = loader.load()
        
        print(f"Loaded {len(documents)} documents.")

        # Split documents
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            add_start_index=True,
        )
        chunks = text_splitter.split_documents(documents)
        
        print(f"Split into {len(chunks)} chunks.")

        # Create/Update Vector Store
        if self.vector_store:
            self.vector_store.add_documents(chunks)
        else:
            self.vector_store = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.persistence_directory
            )
        
        print("Indexing complete.")

    def search(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Perform semantic search."""
        if not self.vector_store:
            return [{"error": "Index not found. Please run indexing first."}]

        results = self.vector_store.similarity_search_with_score(query, k=limit)
        
        formatted_results = []
        for doc, score in results:
            formatted_results.append({
                "content": doc.page_content,
                "source": doc.metadata.get("source", "unknown"),
                "score": score
            })
            
        return formatted_results
