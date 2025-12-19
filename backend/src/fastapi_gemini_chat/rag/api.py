"""API endpoints for RAG ingestion functionality."""
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .vector_db import VectorDB
from .embeddings import EmbeddingGenerator
from .chunking import chunk_text_adaptive, TextChunk


router = APIRouter()


class IngestRequest(BaseModel):
    """Request model for ingestion endpoint."""
    content: str
    source: str = ""
    max_chunk_size: int = 1000
    max_content_length: int = 1000000  # 1MB limit
    metadata: Dict[str, Any] = {}


class IngestResponse(BaseModel):
    """Response model for ingestion endpoint."""
    success: bool
    message: str
    chunks_processed: int
    tokens_used: int = 0
    details: Dict[str, Any] = {}


@router.post("/ingest", response_model=IngestResponse)
async def ingest_content(request: IngestRequest) -> IngestResponse:
    """
    Ingest textbook content into the vector database.

    This endpoint accepts text content, chunks it, generates embeddings,
    and stores the chunks in the Qdrant vector database.
    """
    try:
        # Validate incoming content
        if not request.content or not request.content.strip():
            raise HTTPException(status_code=400, detail="Content cannot be empty")

        # Check for extremely long text inputs
        if len(request.content) > request.max_content_length:
            raise HTTPException(
                status_code=413,
                detail=f"Content too large: {len(request.content)} characters. Maximum allowed: {request.max_content_length} characters."
            )

        # Chunk the text
        text_chunks: List[TextChunk] = chunk_text_adaptive(
            request.content,
            max_chunk_size=request.max_chunk_size
        )

        if not text_chunks:
            raise HTTPException(status_code=400, detail="No valid content chunks were created from the input text")

        # Limit the number of chunks to prevent excessive processing
        max_chunks = 1000  # Prevent too many chunks from being processed at once
        if len(text_chunks) > max_chunks:
            raise HTTPException(
                status_code=413,
                detail=f"Too many chunks generated: {len(text_chunks)}. Maximum allowed: {max_chunks}. Please reduce content size or increase chunk size."
            )

        # Prepare chunks for processing
        chunk_dicts = []
        for chunk in text_chunks:
            chunk_dicts.append({
                "content": chunk.content,
                "source": request.source,
                "index": chunk.index,
                "metadata": request.metadata
            })

        # Generate embeddings
        embedding_gen = EmbeddingGenerator()
        embeddings = await embedding_gen.generate_embeddings_batch([chunk["content"] for chunk in chunk_dicts])

        # Store in vector database
        vector_db = VectorDB()
        await vector_db.initialize()

        # Progress tracking callback
        async def progress_callback(current: int, total: int):
            # For now, just log progress - in a real implementation you might want to
            # send progress updates through WebSocket or store in a job queue
            print(f"Ingestion progress: {current}/{total}")

        chunk_ids = await vector_db.upsert_text_chunks_with_embeddings(
            chunk_dicts,
            embeddings,
            progress_callback=progress_callback
        )

        await vector_db.close()

        return IngestResponse(
            success=True,
            message=f"Successfully ingested {len(chunk_dicts)} text chunks",
            chunks_processed=len(chunk_dicts),
            details={
                "chunk_ids": chunk_ids[:5],  # Return first 5 IDs as sample
                "total_chunks": len(chunk_dicts)
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during ingestion: {str(e)}"
        )


# Include the RAG API routes in the main application
def include_rag_router(app):
    """Helper function to include the RAG router in the main application."""
    app.include_router(router, prefix="/rag", tags=["rag"])