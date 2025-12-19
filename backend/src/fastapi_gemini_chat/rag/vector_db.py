"""Vector database operations using Qdrant."""
import asyncio
import uuid
from typing import List, Optional
from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams
from .config import rag_settings


class VectorDB:
    """Async Qdrant client wrapper for vector database operations."""

    def __init__(self):
        self.client = None
        self.collection_name = rag_settings.collection_name
        self.embedding_size = rag_settings.embedding_size  # This will be dynamically adjusted based on provider

    async def initialize(self, embedding_size: int = None):
        """Initialize the Qdrant client and create collection if it doesn't exist."""
        if rag_settings.qdrant_url and rag_settings.qdrant_api_key:
            self.client = AsyncQdrantClient(
                url=rag_settings.qdrant_url,
                api_key=rag_settings.qdrant_api_key,
                timeout=30
            )
        else:
            # For local development
            self.client = AsyncQdrantClient(":memory:")

        # Use provided embedding size if given, otherwise use the default
        if embedding_size is not None:
            self.embedding_size = embedding_size

        # Try to get existing collection to determine its vector size
        try:
            collection_info = await self.client.get_collection(self.collection_name)
            # Update the embedding size based on the existing collection
            self.embedding_size = collection_info.config.params.vectors.size
        except Exception:
            # Collection doesn't exist, create it with the determined size
            await self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=self.embedding_size,
                    distance=Distance.COSINE
                )
            )

    async def close(self):
        """Close the Qdrant client connection."""
        if self.client:
            await self.client.close()

    async def upsert_points(self, points: List[models.PointStruct]):
        """Upsert multiple points to the collection."""
        if not self.client:
            raise RuntimeError("VectorDB not initialized")

        await self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

    async def search(self, vector: List[float], limit: int = 3) -> List[models.ScoredPoint]:
        """Search for similar vectors in the collection."""
        if not self.client:
            raise RuntimeError("VectorDB not initialized")

        # Use the query_points method with the correct parameters
        results = await self.client.query_points(
            collection_name=self.collection_name,
            query=vector,
            limit=limit
        )
        return results.points

    async def validate_connection(self) -> bool:
        """Validate connection to Qdrant."""
        try:
            if self.client:
                await self.client.get_collection(self.collection_name)
                return True
            return False
        except Exception:
            return False

    async def upsert_text_chunks_with_embeddings(self, chunks: List[dict], embeddings: List[List[float]],
                                               progress_callback=None):
        """
        Upsert text chunks with their embeddings to Qdrant.

        Args:
            chunks: List of dictionaries containing 'content' and optional metadata
            embeddings: List of embedding vectors corresponding to the chunks
            progress_callback: Optional callback function to report progress (called with current/total)

        Returns:
            List of IDs of the upserted points
        """
        if not self.client:
            raise RuntimeError("VectorDB not initialized")

        if len(chunks) != len(embeddings):
            raise ValueError(f"Number of chunks ({len(chunks)}) must match number of embeddings ({len(embeddings)})")

        total_chunks = len(chunks)
        points = []
        ids = []

        try:
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                # Check embedding dimension
                if len(embedding) != self.embedding_size:
                    raise ValueError(f"Embedding dimension mismatch for chunk {i}: expected {self.embedding_size}, got {len(embedding)}")

                # Generate a unique ID for each point
                point_id = str(uuid.uuid4())
                ids.append(point_id)

                # Create payload with the text content and any metadata
                payload = {
                    "content": chunk.get('content', ''),
                    "source": chunk.get('source', ''),
                    "index": chunk.get('index', i),
                    "metadata": chunk.get('metadata', {})
                }

                # Create the point structure
                point = models.PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload=payload
                )

                points.append(point)

                # Report progress if callback is provided
                if progress_callback:
                    await progress_callback(i + 1, total_chunks)

            # Upsert all points at once
            await self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )

            return ids
        except Exception as e:
            # Log the error for debugging
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error during upsert operation: {str(e)}")
            raise