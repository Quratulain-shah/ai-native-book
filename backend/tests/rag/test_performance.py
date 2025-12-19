"""Performance tests for RAG system."""
import pytest
import asyncio
import time
from unittest.mock import patch, AsyncMock
from backend.src.fastapi_gemini_chat.rag.embeddings import EmbeddingGenerator
from backend.src.fastapi_gemini_chat.rag.vector_db import VectorDB
from backend.src.fastapi_gemini_chat.rag.chunking import chunk_text_adaptive


@pytest.mark.asyncio
async def test_batch_embedding_performance():
    """Test performance of batch embedding generation."""
    # Mock the embedding generator to avoid actual API calls
    with patch("backend.src.fastapi_gemini_chat.rag.embeddings.genai") as mock_genai:
        import os
        original_key = os.environ.get("GEMINI_API_KEY")
        os.environ["GEMINI_API_KEY"] = "test-key"

        # Mock to return consistent embeddings
        mock_genai.embed_content.return_value = {"embedding": [0.1, 0.2, 0.3, 0.4, 0.5] * 153}  # 765-dim vector

        generator = EmbeddingGenerator()

        # Create test data - multiple text samples
        test_texts = [f"This is test text sample {i} for performance testing." for i in range(10)]

        start_time = time.time()
        embeddings = await generator.generate_embeddings_batch(test_texts)
        end_time = time.time()

        duration = end_time - start_time

        # Assertions
        assert len(embeddings) == len(test_texts)
        assert duration < 5.0  # Should complete in under 5 seconds for 10 samples (mocked)

        # Restore environment
        if original_key is not None:
            os.environ["GEMINI_API_KEY"] = original_key
        else:
            del os.environ["GEMINI_API_KEY"]


@pytest.mark.asyncio
async def test_chunking_performance():
    """Test performance of text chunking."""
    # Create a large text sample
    large_text = "This is a test paragraph. " * 1000  # 1000 paragraphs

    start_time = time.time()
    chunks = chunk_text_adaptive(large_text, max_chunk_size=500)
    end_time = time.time()

    duration = end_time - start_time

    # Assertions
    assert len(chunks) > 0
    assert duration < 2.0  # Should chunk large text quickly


@pytest.mark.asyncio
async def test_concurrent_requests_performance():
    """Test handling of concurrent requests."""
    # Mock dependencies
    with patch("backend.src.fastapi_gemini_chat.rag.embeddings.genai") as mock_genai, \
         patch("backend.src.fastapi_gemini_chat.rag.vector_db.rag_settings") as mock_settings:

        import os
        original_key = os.environ.get("GEMINI_API_KEY")
        os.environ["GEMINI_API_KEY"] = "test-key"

        mock_genai.embed_content.return_value = {"embedding": [0.1, 0.2, 0.3, 0.4, 0.5] * 153}  # 765-dim vector
        mock_settings.qdrant_url = None
        mock_settings.qdrant_api_key = None
        mock_settings.collection_name = "test_collection"
        mock_settings.embedding_size = 765

        # Create multiple embedding generator instances
        generators = [EmbeddingGenerator() for _ in range(5)]

        # Create tasks for concurrent embedding generation
        test_texts = [f"Test text {i}" for i in range(5)]
        tasks = [gen.generate_embedding(text) for gen, text in zip(generators, test_texts)]

        start_time = time.time()
        results = await asyncio.gather(*tasks)
        end_time = time.time()

        duration = end_time - start_time

        # Assertions
        assert len(results) == 5
        assert all(len(embedding) == 765 for embedding in results)  # Each embedding has correct size
        assert duration < 5.0  # Should handle concurrent requests efficiently

        # Restore environment
        if original_key is not None:
            os.environ["GEMINI_API_KEY"] = original_key
        else:
            del os.environ["GEMINI_API_KEY"]


def test_api_response_time():
    """Test API response time under mocked conditions."""
    from fastapi.testclient import TestClient
    from backend.src.fastapi_gemini_chat.main import create_app

    app = create_app()
    client = TestClient(app)

    # Test health endpoint response time
    start_time = time.time()
    response = client.get("/health")
    end_time = time.time()

    duration = end_time - start_time

    # Assertions
    assert response.status_code == 200
    assert duration < 1.0  # Health check should be very fast


if __name__ == "__main__":
    pytest.main([__file__])