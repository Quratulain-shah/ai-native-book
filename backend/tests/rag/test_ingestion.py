"""Integration tests for ingestion workflow."""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from backend.src.fastapi_gemini_chat.main import create_app
from backend.src.fastapi_gemini_chat.rag.api import IngestRequest


def test_ingest_endpoint_basic():
    """Test the basic ingestion endpoint functionality."""
    app = create_app()
    client = TestClient(app)

    # Test data
    test_content = "This is a test textbook content for ingestion."

    with patch("backend.src.fastapi_gemini_chat.rag.api.VectorDB") as mock_vector_db, \
         patch("backend.src.fastapi_gemini_chat.rag.api.EmbeddingGenerator") as mock_embedding_gen:

        # Setup mocks
        mock_db_instance = AsyncMock()
        mock_vector_db.return_value = mock_db_instance
        mock_vector_db.return_value.return_value.initialize = AsyncMock()
        mock_vector_db.return_value.return_value.close = AsyncMock()
        mock_vector_db.return_value.return_value.upsert_text_chunks_with_embeddings = AsyncMock(return_value=["id1", "id2"])

        mock_embedding_instance = AsyncMock()
        mock_embedding_gen.return_value = mock_embedding_instance
        mock_embedding_gen.return_value.return_value.generate_embeddings_batch = AsyncMock(return_value=[[0.1, 0.2, 0.3, 0.4]])

        # Make the request
        response = client.post(
            "/rag/ingest",
            json={
                "content": test_content,
                "source": "test_source",
                "max_chunk_size": 500
            }
        )

        # Assertions
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "chunks_processed" in data
        assert data["chunks_processed"] >= 0


def test_ingest_endpoint_empty_content():
    """Test ingestion endpoint with empty content."""
    app = create_app()
    client = TestClient(app)

    # Make the request with empty content
    response = client.post(
        "/rag/ingest",
        json={
            "content": "",
            "source": "test_source"
        }
    )

    # Should return 400 for empty content
    assert response.status_code == 422  # Validation error


def test_ingest_endpoint_validation():
    """Test ingestion endpoint request validation."""
    app = create_app()
    client = TestClient(app)

    # Make the request with invalid data
    response = client.post(
        "/rag/ingest",
        json={
            "invalid_field": "test"
        }
    )

    # Should return 422 for validation error
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_ingest_workflow_integration():
    """Test the complete ingestion workflow with mocked dependencies."""
    from backend.src.fastapi_gemini_chat.rag.api import IngestRequest, ingest_content

    # Create a valid request
    request = IngestRequest(
        content="This is test content for the ingestion workflow.",
        source="test_source",
        max_chunk_size=500
    )

    with patch("backend.src.fastapi_gemini_chat.rag.api.VectorDB") as mock_vector_db, \
         patch("backend.src.fastapi_gemini_chat.rag.api.EmbeddingGenerator") as mock_embedding_gen:

        # Setup mocks
        mock_db_instance = AsyncMock()
        mock_vector_db.return_value = mock_db_instance
        mock_vector_db.return_value.initialize = AsyncMock()
        mock_vector_db.return_value.close = AsyncMock()
        mock_vector_db.return_value.upsert_text_chunks_with_embeddings = AsyncMock(return_value=["id1", "id2"])

        mock_embedding_instance = AsyncMock()
        mock_embedding_gen.return_value = mock_embedding_instance
        mock_embedding_gen.return_value.generate_embeddings_batch = AsyncMock(return_value=[[0.1, 0.2, 0.3, 0.4], [0.5, 0.6, 0.7, 0.8]])

        # Call the function
        result = await ingest_content(request)

        # Assertions
        assert result.success is True
        assert result.chunks_processed >= 0
        assert "chunks_processed" in result.dict()


if __name__ == "__main__":
    pytest.main([__file__])