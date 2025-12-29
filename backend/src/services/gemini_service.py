"""
Service for generating embeddings using Google's Gemini models via google-generativeai.
"""
import os
from typing import List, Optional
import google.generativeai as genai


class GeminiService:
    """Service class for generating embeddings using Google's Gemini models."""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize Gemini service for embeddings.

        Args:
            api_key: API key for Google Gemini. If not provided, will use GEMINI_API_KEY env var.
        """
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is required for embeddings")

        # Configure the Gemini client
        genai.configure(api_key=self.api_key)

        # Gemini text-embedding-004 produces 768-dimensional vectors
        self.embedding_dimension = 768
        print("Gemini embedding service initialized successfully.")

    def get_embedding(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for the given text using Gemini text-embedding-004.

        Args:
            text: Text to generate embedding for

        Returns:
            List of floats representing the embedding, or None if failed
        """
        try:
            # Truncate text if too long (model has max token limit)
            max_chars = 20000  # Gemini text-embedding-004 has larger context
            if len(text) > max_chars:
                text = text[:max_chars]

            # Use the embeddings.generate_embeddings method
            result = genai.embed_content(
                model="text-embedding-004",
                content=text,
                task_type="retrieval_query"
            )

            if result and "embedding" in result:
                return result["embedding"]
            return None
        except Exception as e:
            print(f"Error generating embedding with Gemini: {e}")
            return None

    def get_embeddings(self, texts: List[str]) -> Optional[List[List[float]]]:
        """
        Generate embeddings for multiple texts using Gemini.

        Args:
            texts: List of texts to generate embeddings for

        Returns:
            List of embeddings, or None if failed
        """
        try:
            result = genai.embed_content(
                model="text-embedding-004",
                content=texts,
                task_type="retrieval_query"
            )

            if result and "embedding" in result:
                return result["embedding"]
            return None
        except Exception as e:
            print(f"Error generating embeddings with Gemini: {e}")
            return None
