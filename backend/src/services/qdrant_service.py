import logging
from qdrant_client import QdrantClient, models

logger = logging.getLogger(__name__)


class QdrantService:
    def __init__(self, host: str, port: int, api_key: str = None, collection_name: str = "book_content_chunks"):
        self.collection_name = collection_name
        # If host is a full URL (starts with http), use url parameter
        if host and host.startswith("http"):
            self.client = QdrantClient(url=host, api_key=api_key)
        else:
            self.client = QdrantClient(host=host, port=port, api_key=api_key)
        logger.info(f"QdrantService connected to {host}:{port}")

    def search(self, query_vector: list, limit: int = 3):
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=limit,
            )
            return models.ScoredPoint.model_validate({"hits": results}) if hasattr(models, 'ScoredPoint') else type('SearchResult', (), {'hits': results})()
        except Exception as e:
            logger.error(f"Qdrant search failed: {e}")
            return type('SearchResult', (), {'hits': []})()

    def upsert(self, points: list):
        try:
            self.client.upsert(
                collection_name=self.collection_name,
                wait=True,
                points=points,
            )
        except Exception as e:
            logger.error(f"Qdrant upsert failed: {e}")
            raise
