"""Search functionality for RAG system."""
import logging
from typing import List, Optional
from qdrant_client.http.models import ScoredPoint
from .vector_db import VectorDB
from .embeddings import EmbeddingGenerator
from .config import rag_settings


# Set up logging
logger = logging.getLogger(__name__)


def function_tool(func):
    """Decorator to mark a function as a tool for the AI agent."""
    func.is_tool = True
    return func


@function_tool
async def search_textbook(query: str) -> str:
    """
    Search textbook content using semantic search.

    Args:
        query: The search query string

    Returns:
        Formatted string with top 3 relevant text chunks
    """
    vector_db = None
    try:
        # Validate input
        if not query or not query.strip():
            return "Please provide a valid search query."

        # Initialize components
        embedding_gen = EmbeddingGenerator()

        # Generate embedding for the query first to determine the embedding size
        query_embedding = await embedding_gen.generate_embedding(query)

        # Initialize the vector database with the correct embedding size
        vector_db = VectorDB()
        await vector_db.initialize(embedding_gen.get_embedding_size())

        # Validate connection
        if not await vector_db.validate_connection():
            return "Unable to connect to the textbook database. Please try again later."

        # Perform semantic search in Qdrant
        search_results = await vector_db.search(query_embedding, limit=3)

        # Format and return the results
        if not search_results:
            return "No relevant content found in the textbook for the given query. The AI will try to answer based on its general knowledge."

        formatted_results = []
        for i, result in enumerate(search_results, 1):
            content = result.payload.get('content', '') if result.payload else ''
            score = result.score if result.score else 0
            source = result.payload.get('source', '') if result.payload else ''

            # Format the result more concisely for agent consumption
            result_text = f"Relevant information (relevance: {score:.2f}): {content}"
            if source:
                result_text += f" [Source: {source}]"

            formatted_results.append(result_text)

        # Join results with clear separation
        return "\n\n".join(formatted_results)

    except Exception as e:
        logger.error(f"Error in search_textbook: {str(e)}")
        return f"An error occurred during search. The AI will try to answer based on its general knowledge: {str(e)}"
    finally:
        # Ensure cleanup happens even if there's an exception
        if vector_db:
            try:
                await vector_db.close()
            except Exception as e:
                logger.error(f"Error closing vector database connection: {str(e)}")


async def search_textbook_raw(query: str) -> List[ScoredPoint]:
    """
    Search textbook content and return raw results.

    Args:
        query: The search query string

    Returns:
        List of ScoredPoint objects with the search results
    """
    try:
        # Initialize components
        embedding_gen = EmbeddingGenerator()

        # Generate embedding for the query first to determine the embedding size
        query_embedding = await embedding_gen.generate_embedding(query)

        # Initialize the vector database with the correct embedding size
        vector_db = VectorDB()
        await vector_db.initialize(embedding_gen.get_embedding_size())

        # Perform semantic search in Qdrant
        search_results = await vector_db.search(query_embedding, limit=3)

        await vector_db.close()

        return search_results

    except Exception as e:
        logger.error(f"Error in search_textbook_raw: {str(e)}")
        return []


# Define the schema for agent consumption
search_textbook_schema = {
    "name": "search_textbook",
    "description": "Search through textbook content to find relevant information for answering questions",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search query to find relevant textbook content"
            }
        },
        "required": ["query"]
    }
}