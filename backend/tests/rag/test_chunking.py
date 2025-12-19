"""Unit tests for chunking functionality."""
import pytest
from backend.src.fastapi_gemini_chat.rag.chunking import (
    chunk_text_by_paragraphs,
    chunk_text_by_length,
    chunk_text_adaptive,
    validate_chunk_content,
    TextChunk
)


def test_validate_chunk_content():
    """Test chunk content validation."""
    # Valid content should return True
    assert validate_chunk_content("This is valid content") is True
    assert validate_chunk_content("A") is True  # More than min_size characters

    # Invalid content should return False
    assert validate_chunk_content("") is False
    assert validate_chunk_content("   ") is False
    assert validate_chunk_content("A") is False  # Less than min_size (default 10) characters
    assert validate_chunk_content("123456789") is False  # Exactly 9 chars, less than default min of 10


def test_chunk_text_by_paragraphs():
    """Test chunking by paragraphs."""
    text = "First paragraph.\n\nSecond paragraph.\n\nThird paragraph."

    chunks = chunk_text_by_paragraphs(text)

    assert len(chunks) == 3
    assert "First paragraph." in chunks[0]
    assert "Second paragraph." in chunks[1]
    assert "Third paragraph." in chunks[2]


def test_chunk_text_by_length():
    """Test chunking by fixed length."""
    text = "This is a test string that will be split into smaller chunks."

    chunks = chunk_text_by_length(text, max_chunk_size=20)

    assert len(chunks) > 1  # Should be split into multiple chunks
    for chunk in chunks:
        assert len(chunk) <= 20  # Each chunk should respect the size limit


def test_chunk_text_adaptive():
    """Test adaptive chunking."""
    text = "First paragraph with some content.\n\nSecond paragraph with more content."

    chunks = chunk_text_adaptive(text, max_chunk_size=50)

    assert len(chunks) >= 1
    for chunk in chunks:
        assert len(chunk.content) <= 50
        assert validate_chunk_content(chunk.content)


def test_empty_text_chunking():
    """Test chunking with empty text."""
    assert chunk_text_by_paragraphs("") == []
    assert chunk_text_by_length("") == [""]
    assert chunk_text_adaptive("") == []


if __name__ == "__main__":
    pytest.main([__file__])