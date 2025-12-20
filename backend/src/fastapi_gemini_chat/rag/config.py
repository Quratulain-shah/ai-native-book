"""Configuration for RAG (Retrieval-Augmented Generation) components."""
from pydantic_settings import BaseSettings
from typing import Optional


class RagSettings(BaseSettings):
    """Settings for RAG components."""

    qdrant_url: Optional[str] = None
    qdrant_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None  # Use existing GEMINI_API_KEY if available
    collection_name: str = "book"
    embedding_size: int = 768  # Default size for Gemini embeddings (text-embedding-004)

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra environment variables that don't match fields


# Global instance
rag_settings = RagSettings()