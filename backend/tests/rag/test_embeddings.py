"""Unit tests for embeddings functionality."""
import pytest
import asyncio
from unittest.mock import patch, AsyncMock
from backend.src.fastapi_gemini_chat.rag.embeddings import EmbeddingGenerator


@pytest.fixture
def mock_embedding_generator():
    """Create a mock embedding generator for testing."""
    with patch("backend.src.fastapi_gemini_chat.rag.embeddings.genai") as mock_genai:
        # Mock the embed_content function
        mock_genai.embed_content.return_value = {"embedding": [0.1, 0.2, 0.3]}

        # Temporarily set the API key in environment
        import os
        original_key = os.environ.get("GEMINI_API_KEY")
        os.environ["GEMINI_API_KEY"] = "test-key"

        generator = EmbeddingGenerator()

        # Restore original environment
        if original_key is not None:
            os.environ["GEMINI_API_KEY"] = original_key
        else:
            del os.environ["GEMINI_API_KEY"]

        yield generator, mock_genai


@pytest.mark.asyncio
async def test_generate_embedding(mock_embedding_generator):
    """Test generating a single embedding."""
    generator, mock_genai = mock_embedding_generator

    result = await generator.generate_embedding("test text")

    assert result == [0.1, 0.2, 0.3]
    mock_genai.embed_content.assert_called_once()


@pytest.mark.asyncio
async def test_generate_embeddings_batch(mock_embedding_generator):
    """Test generating embeddings for multiple texts."""
    generator, mock_genai = mock_embedding_generator

    # Mock the embed_content function to return different embeddings for different calls
    mock_genai.embed_content.side_effect = [
        {"embedding": [0.1, 0.2, 0.3]},
        {"embedding": [0.4, 0.5, 0.6]}
    ]

    result = await generator.generate_embeddings_batch(["text1", "text2"])

    assert len(result) == 2
    assert result[0] == [0.1, 0.2, 0.3]
    assert result[1] == [0.4, 0.5, 0.6]
    assert mock_genai.embed_content.call_count == 2


@pytest.mark.asyncio
async def test_generate_embedding_retry_logic():
    """Test that retry logic works when API fails."""
    with patch("backend.src.fastapi_gemini_chat.rag.embeddings.genai") as mock_genai:
        import os
        original_key = os.environ.get("GEMINI_API_KEY")
        os.environ["GEMINI_API_KEY"] = "test-key"

        # Make the first two calls fail and the third succeed
        mock_genai.embed_content.side_effect = [
            Exception("API Error"),
            Exception("API Error"),
            {"embedding": [0.7, 0.8, 0.9]}
        ]

        generator = EmbeddingGenerator()
        result = await generator.generate_embedding("test text")

        assert result == [0.7, 0.8, 0.9]
        assert mock_genai.embed_content.call_count == 3

        # Restore environment
        if original_key is not None:
            os.environ["GEMINI_API_KEY"] = original_key
        else:
            del os.environ["GEMINI_API_KEY"]


if __name__ == "__main__":
    pytest.main([__file__])