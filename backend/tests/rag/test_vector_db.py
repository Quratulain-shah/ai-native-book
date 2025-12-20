"""Integration tests for vector database functionality."""
import pytest
import asyncio
from unittest.mock import patch
from qdrant_client.http import models
from backend.src.fastapi_gemini_chat.rag.vector_db import VectorDB


@pytest.mark.asyncio
async def test_vector_db_initialization():
    """Test vector database initialization."""
    # Test with mock configuration
    with patch("backend.src.fastapi_gemini_chat.rag.vector_db.rag_settings") as mock_settings:
        mock_settings.qdrant_url = None
        mock_settings.qdrant_api_key = None
        mock_settings.collection_name = "test_collection"
        mock_settings.embedding_size = 768

        db = VectorDB()
        await db.initialize()

        # Verify the client was created
        assert db.client is not None

        # Test connection validation
        is_valid = await db.validate_connection()
        assert is_valid  # Should be valid with in-memory client

        await db.close()


@pytest.mark.asyncio
async def test_upsert_and_search():
    """Test upsert and search functionality."""
    with patch("backend.src.fastapi_gemini_chat.rag.vector_db.rag_settings") as mock_settings:
        mock_settings.qdrant_url = None
        mock_settings.qdrant_api_key = None
        mock_settings.collection_name = "test_collection"
        mock_settings.embedding_size = 4  # Using smaller size for test

        db = VectorDB()
        await db.initialize()

        # Create test points
        test_points = [
            models.PointStruct(
                id="test1",
                vector=[0.1, 0.2, 0.3, 0.4],
                payload={"content": "Test content 1", "source": "test_source"}
            ),
            models.PointStruct(
                id="test2",
                vector=[0.5, 0.6, 0.7, 0.8],
                payload={"content": "Test content 2", "source": "test_source"}
            )
        ]

        # Upsert points
        await db.upsert_points(test_points)

        # Search for similar vectors
        results = await db.search([0.1, 0.2, 0.3, 0.4], limit=2)

        # Verify we got results
        assert len(results) > 0

        await db.close()


@pytest.mark.asyncio
async def test_upsert_text_chunks_with_embeddings():
    """Test the full upsert functionality with text chunks."""
    with patch("backend.src.fastapi_gemini_chat.rag.vector_db.rag_settings") as mock_settings:
        mock_settings.qdrant_url = None
        mock_settings.qdrant_api_key = None
        mock_settings.collection_name = "test_collection"
        mock_settings.embedding_size = 4  # Using smaller size for test

        db = VectorDB()
        await db.initialize()

        # Test data
        chunks = [
            {
                "content": "Test chunk 1 content",
                "source": "test_source",
                "index": 0,
                "metadata": {"page": 1}
            },
            {
                "content": "Test chunk 2 content",
                "source": "test_source",
                "index": 1,
                "metadata": {"page": 2}
            }
        ]
        embeddings = [
            [0.1, 0.2, 0.3, 0.4],
            [0.5, 0.6, 0.7, 0.8]
        ]

        # Upsert the chunks with embeddings
        ids = await db.upsert_text_chunks_with_embeddings(chunks, embeddings)

        # Verify we got IDs back
        assert len(ids) == 2

        # Verify the chunks were stored by searching
        results = await db.search([0.1, 0.2, 0.3, 0.4], limit=2)
        assert len(results) > 0

        await db.close()


if __name__ == "__main__":
    pytest.main([__file__])