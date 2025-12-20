"""Text chunking utilities for RAG system."""
import re
from typing import List
from pydantic import BaseModel


class TextChunk(BaseModel):
    """Represents a chunk of text with metadata."""
    content: str
    index: int
    source: str = ""


def chunk_text_by_paragraphs(text: str, max_chunk_size: int = 1000) -> List[TextChunk]:
    """
    Split text by paragraphs while respecting max chunk size.

    Args:
        text: Input text to chunk
        max_chunk_size: Maximum size of each chunk in characters

    Returns:
        List of TextChunk objects
    """
    if not text.strip():
        return []

    # Split by paragraphs (double newlines or more)
    paragraphs = re.split(r'\n\s*\n', text)

    chunks = []
    current_chunk = ""
    current_index = 0

    for para in paragraphs:
        # If adding this paragraph would exceed the limit, save current chunk
        if len(current_chunk) + len(para) > max_chunk_size and current_chunk:
            chunks.append(TextChunk(content=current_chunk.strip(), index=current_index))
            current_chunk = para
            current_index += 1
        # If paragraph is larger than max size, split it
        elif len(para) > max_chunk_size:
            # Split large paragraph into smaller chunks
            para_chunks = chunk_text_by_length(para, max_chunk_size)
            for chunk_content in para_chunks:
                chunks.append(TextChunk(content=chunk_content, index=current_index))
                current_index += 1
        else:
            # Add paragraph to current chunk
            if current_chunk:
                current_chunk += "\n\n" + para
            else:
                current_chunk = para

    # Add the last chunk if it exists
    if current_chunk.strip():
        chunks.append(TextChunk(content=current_chunk.strip(), index=current_index))

    return chunks


def chunk_text_by_length(text: str, max_chunk_size: int = 1000) -> List[str]:
    """
    Split text into chunks of approximately max_chunk_size characters.

    Args:
        text: Input text to chunk
        max_chunk_size: Maximum size of each chunk in characters

    Returns:
        List of text chunks
    """
    if not text.strip():
        return [""]

    chunks = []
    start = 0

    while start < len(text):
        end = start + max_chunk_size

        # If we're not at the end and we're in the middle of a word, try to find a word boundary
        if end < len(text):
            # Look for a space or punctuation to break at
            while end > start and text[end] not in [' ', '\n', '\t', '.', '!', '?', ';', ',']:
                end -= 1

            # If we couldn't find a good break point, just break at max_chunk_size
            if end == start:
                end = start + max_chunk_size

        chunk = text[start:end].strip()
        if chunk:  # Only add non-empty chunks
            chunks.append(chunk)

        start = end

        # If we couldn't find a good break point, advance by max_chunk_size anyway
        if start == end and end < len(text):
            start = start + max_chunk_size

    return chunks


def validate_chunk_content(chunk: str, min_size: int = 10) -> bool:
    """
    Validate that a chunk has sufficient content.

    Args:
        chunk: Text chunk to validate
        min_size: Minimum number of characters for valid content

    Returns:
        True if chunk is valid, False otherwise
    """
    if not chunk or not chunk.strip():
        return False

    # Check if chunk has at least min_size non-whitespace characters
    clean_content = ''.join(chunk.split())
    return len(clean_content) >= min_size


def chunk_text_adaptive(text: str, max_chunk_size: int = 1000, min_chunk_size: int = 200) -> List[TextChunk]:
    """
    Adaptive chunking that tries to respect semantic boundaries while keeping chunks within size limits.

    Args:
        text: Input text to chunk
        max_chunk_size: Maximum size of each chunk in characters
        min_chunk_size: Minimum size threshold before forcing a split

    Returns:
        List of TextChunk objects
    """
    if not text or not text.strip():
        return []

    # First try paragraph-based chunking
    paragraph_chunks = chunk_text_by_paragraphs(text, max_chunk_size)

    # For any chunks that are still too large, further split them
    final_chunks = []
    chunk_index = 0

    for para_chunk in paragraph_chunks:
        # Validate chunk content before processing
        if not validate_chunk_content(para_chunk.content):
            continue

        if len(para_chunk.content) <= max_chunk_size:
            final_chunks.append(TextChunk(
                content=para_chunk.content,
                index=chunk_index,
                source=para_chunk.source
            ))
            chunk_index += 1
        else:
            # Split large paragraph into smaller pieces
            sub_chunks = chunk_text_by_length(para_chunk.content, max_chunk_size)
            for sub_chunk in sub_chunks:
                if validate_chunk_content(sub_chunk):
                    final_chunks.append(TextChunk(
                        content=sub_chunk,
                        index=chunk_index,
                        source=para_chunk.source
                    ))
                    chunk_index += 1

    return final_chunks