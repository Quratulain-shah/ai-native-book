#!/usr/bin/env python3
"""Script to ingest textbook content from markdown files into Qdrant vector database."""
import asyncio
import os
import sys
from pathlib import Path
import logging

# Add the backend/src directory to the Python path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi_gemini_chat.rag.vector_db import VectorDB
from fastapi_gemini_chat.rag.embeddings import EmbeddingGenerator
from fastapi_gemini_chat.rag.chunking import chunk_text_adaptive
from fastapi_gemini_chat.rag.config import rag_settings


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def load_and_ingest_markdown_files():
    """Load all markdown files from frontend/docs and ingest them into Qdrant."""
    # Define the path to the markdown files
    # When running from backend directory: python -m src.fastapi_gemini_chat.rag.ingest_content
    # The docs are at ../frontend/docs relative to backend directory
    docs_path = Path("../frontend/docs")

    if not docs_path.exists():
        logger.error(f"Documentation directory not found at {docs_path.absolute()}")
        return False

    logger.info(f"Loading markdown files from {docs_path.absolute()}")

    # Find all markdown files
    markdown_files = list(docs_path.rglob("*.md"))
    logger.info(f"Found {len(markdown_files)} markdown files to process")

    if not markdown_files:
        logger.warning("No markdown files found to ingest")
        return True

    # Initialize embedding generator
    embedding_gen = EmbeddingGenerator()

    # Initialize vector database - first try to get existing collection to determine embedding size
    vector_db = VectorDB()
    # Initialize without specifying size first, it will determine size from existing collection or use default
    await vector_db.initialize()
    logger.info(f"Connected to Qdrant collection: {rag_settings.collection_name} with embedding size: {vector_db.embedding_size}")

    total_chunks = 0

    try:
        for file_path in markdown_files:
            logger.info(f"Processing file: {file_path}")

            try:
                # Read the content of the markdown file
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                if not content.strip():
                    logger.warning(f"Skipping empty file: {file_path}")
                    continue

                # Chunk the content
                chunks = chunk_text_adaptive(content, max_chunk_size=1000)

                if not chunks:
                    logger.warning(f"No valid chunks created from file: {file_path}")
                    continue

                # Prepare chunk dictionaries
                chunk_dicts = []
                for chunk in chunks:
                    chunk_dicts.append({
                        "content": chunk.content,
                        "source": str(file_path.relative_to(docs_path)),
                        "index": chunk.index,
                        "metadata": {
                            "file_path": str(file_path),
                            "relative_path": str(file_path.relative_to(docs_path)),
                            "filename": file_path.name
                        }
                    })

                # Generate embeddings for the chunks
                logger.info(f"Generating embeddings for {len(chunk_dicts)} chunks from {file_path}")
                embeddings = await embedding_gen.generate_embeddings_batch([chunk["content"] for chunk in chunk_dicts])

                # Upsert to vector database
                chunk_ids = await vector_db.upsert_text_chunks_with_embeddings(
                    chunk_dicts,
                    embeddings
                )

                total_chunks += len(chunk_dicts)
                logger.info(f"Successfully ingested {len(chunk_dicts)} chunks from {file_path}")

            except Exception as e:
                logger.error(f"Error processing file {file_path}: {str(e)}")
                continue

        logger.info(f"Successfully ingested {total_chunks} total chunks from {len(markdown_files)} files")
        return True

    except Exception as e:
        logger.error(f"Error during ingestion process: {str(e)}")
        return False
    finally:
        await vector_db.close()


async def validate_ingestion():
    """Validate that content has been properly ingested by performing a test search."""
    logger.info("Validating ingestion by performing a test search...")

    embedding_gen = EmbeddingGenerator()

    # Generate a test embedding to determine the embedding size
    try:
        test_embedding = await embedding_gen.generate_embedding("test")
        embedding_size = len(test_embedding)
    except Exception as e:
        logger.error(f"Error generating test embedding: {str(e)}")
        return False

    vector_db = VectorDB()
    await vector_db.initialize(embedding_size)

    try:
        # Test search with a common term
        test_query = "robotics"
        query_embedding = await embedding_gen.generate_embedding(test_query)
        search_results = await vector_db.search(query_embedding, limit=3)

        if search_results:
            logger.info(f"✓ Test search successful - found {len(search_results)} results for query '{test_query}'")
            for i, result in enumerate(search_results):
                content_preview = result.payload.get('content', '')[:100] + "..." if len(result.payload.get('content', '')) > 100 else result.payload.get('content', '')
                logger.info(f"  Result {i+1}: {content_preview}")
            return True
        else:
            logger.warning("⚠ No results found for test search - content may not be properly ingested")
            return False

    except Exception as e:
        logger.error(f"Error during validation: {str(e)}")
        return False
    finally:
        await vector_db.close()


async def main():
    """Main function to run the ingestion process."""
    logger.info("Starting content ingestion process...")

    success = await load_and_ingest_markdown_files()
    if success:
        validation_success = await validate_ingestion()
        if validation_success:
            logger.info("Content ingestion and validation completed successfully!")
        else:
            logger.warning("Content ingestion completed but validation failed.")
    else:
        logger.error("Content ingestion failed.")
        return 1

    return 0


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)