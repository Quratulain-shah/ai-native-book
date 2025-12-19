"""Unit tests for search functionality."""
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from backend.src.fastapi_gemini_chat.rag.search import search_textbook


@pytest.mark.asyncio
async def test_search_textbook():
    """Test the search_textbook function."""
    # Mock the VectorDB and EmbeddingGenerator classes
    with patch("backend.src.fastapi_gemini_chat.rag.search.VectorDB") as mock_vector_db, \
         patch("backend.src.fastapi_gemini_chat.rag.search.EmbeddingGenerator") as mock_embedding_gen:

        # Setup mock VectorDB
        mock_db_instance = AsyncMock()
        mock_vector_db.return_value = mock_db_instance
        mock_vector_db.return_value.initialize = AsyncMock()
        mock_vector_db.return_value.close = AsyncMock()

        # Setup mock search results
        mock_scored_point = MagicMock()
        mock_scored_point.payload = {"content": "Test content", "source": "test_source"}
        mock_scored_point.score = 0.95
        mock_vector_db.return_value.search = AsyncMock(return_value=[mock_scored_point])

        # Setup mock EmbeddingGenerator
        mock_embedding_instance = AsyncMock()
        mock_embedding_gen.return_value = mock_embedding_instance
        mock_embedding_instance.generate_embedding = AsyncMock(return_value=[0.1, 0.2, 0.3])
        mock_embedding_gen.return_value.return_value.generate_embedding = AsyncMock(return_value=[0.1, 0.2, 0.3])

        # Call the function
        result = await search_textbook("test query")

        # Assertions
        assert "Test content" in result
        assert "0.95" in result  # Relevance score should be in the result
        mock_vector_db.return_value.initialize.assert_called_once()
        mock_vector_db.return_value.close.assert_called_once()
        mock_embedding_instance.generate_embedding.assert_called_once_with("test query")


@pytest.mark.asyncio
async def test_search_textbook_no_results():
    """Test search_textbook when no results are found."""
    with patch("backend.src.fastapi_gemini_chat.rag.search.VectorDB") as mock_vector_db, \
         patch("backend.src.fastapi_gemini_chat.rag.search.EmbeddingGenerator") as mock_embedding_gen:

        # Setup mock VectorDB
        mock_db_instance = AsyncMock()
        mock_vector_db.return_value = mock_db_instance
        mock_vector_db.return_value.initialize = AsyncMock()
        mock_vector_db.return_value.close = AsyncMock()
        mock_vector_db.return_value.search = AsyncMock(return_value=[])

        # Setup mock EmbeddingGenerator
        mock_embedding_instance = AsyncMock()
        mock_embedding_gen.return_value = mock_embedding_instance
        mock_embedding_instance.generate_embedding = AsyncMock(return_value=[0.1, 0.2, 0.3])

        # Call the function
        result = await search_textbook("test query")

        # Assertions
        assert "No relevant content found" in result


@pytest.mark.asyncio
async def test_search_textbook_error_handling():
    """Test search_textbook error handling."""
    with patch("backend.src.fastapi_gemini_chat.rag.search.VectorDB") as mock_vector_db, \
         patch("backend.src.fastapi_gemini_chat.rag.search.EmbeddingGenerator") as mock_embedding_gen:

        # Setup mock VectorDB to raise an exception
        mock_db_instance = AsyncMock()
        mock_vector_db.return_value = mock_db_instance
        mock_vector_db.return_value.initialize = AsyncMock()
        mock_vector_db.return_value.search.side_effect = Exception("Test error")

        # Setup mock EmbeddingGenerator
        mock_embedding_instance = AsyncMock()
        mock_embedding_gen.return_value = mock_embedding_instance
        mock_embedding_instance.generate_embedding = AsyncMock(return_value=[0.1, 0.2, 0.3])

        # Call the function
        result = await search_textbook("test query")

        # Assertions
        assert "An error occurred during search" in result


if __name__ == "__main__":
    pytest.main([__file__])