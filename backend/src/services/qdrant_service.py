"""
Qdrant Service for vector database operations.
"""
from typing import List, Optional, Any
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, SearchRequest


class SearchResult:
    """Simple search result wrapper."""
    def __init__(self, hits: List[Any]):
        self.hits = hits


class QdrantService:
    """Service class for interacting with Qdrant vector database."""
    
    def __init__(self, host: str = "localhost", port: int = 6333, 
                 api_key: Optional[str] = None, collection_name: str = "book_content_chunks"):
        """
        Initialize Qdrant service.
        
        Args:
            host: Qdrant host (can be cloud URL)
            port: Qdrant port
            api_key: Qdrant API key (required for cloud)
            collection_name: Name of the collection to use
        """
        self.host = host
        self.port = port
        self.api_key = api_key
        self.collection_name = collection_name
        
        # Initialize client - use cloud URL if API key is provided
        if api_key and not host.startswith("localhost"):
            if host.startswith("https://") or host.startswith("http://"):
                self.client = QdrantClient(url=host, api_key=api_key)
            else:
                self.client = QdrantClient(url=f"https://{host}", api_key=api_key)
        else:
            self.client = QdrantClient(host=host, port=port)
        
        # Ensure collection exists
        self._ensure_collection()
    
    def _ensure_collection(self):
        """Create collection if it doesn't exist."""
        try:
            collections = self.client.get_collections()
            collection_names = [col.name for col in collections.collections]
            
            if self.collection_name not in collection_names:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=1536, distance=Distance.COSINE)
                )
                print(f"Created collection: {self.collection_name}")
        except Exception as e:
            print(f"Error ensuring collection exists: {e}")
    
    def search(self, query_vector: List[float], limit: int = 5) -> SearchResult:
        """
        Search for similar vectors in the collection.
        
        Args:
            query_vector: The query vector to search for
            limit: Maximum number of results to return
            
        Returns:
            SearchResult object with hits
        """
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit
            )
            return SearchResult(hits=results)
        except Exception as e:
            print(f"Error searching Qdrant: {e}")
            return SearchResult(hits=[])
    
    def upsert(self, points: List[PointStruct]):
        """
        Insert or update points in the collection.
        
        Args:
            points: List of PointStruct objects to upsert
        """
        try:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
        except Exception as e:
            print(f"Error upserting to Qdrant: {e}")
