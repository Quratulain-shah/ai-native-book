"""Embedding generation using multiple providers with fallbacks."""
import asyncio
import time
import google.generativeai as genai
from typing import List
from pydantic import BaseModel
from .config import rag_settings
import logging
from openai import OpenAI
import os


class EmbeddingResponse(BaseModel):
    """Response model for embedding generation."""
    embedding: List[float]
    text: str


class EmbeddingGenerator:
    """Embedding generator with multiple provider support and fallbacks."""

    def __init__(self):
        # Initialize logging
        self.logger = logging.getLogger(__name__)

        # Configure Google Gemini if available
        self.gemini_client = None
        self.gemini_api_key = rag_settings.gemini_api_key
        if not self.gemini_api_key:
            self.gemini_api_key = os.getenv("GEMINI_API_KEY")

        if self.gemini_api_key:
            genai.configure(api_key=self.gemini_api_key)
            self.gemini_client = genai
        else:
            self.logger.warning("GEMINI_API_KEY not found in environment")

        # Configure OpenAI if available
        self.openai_client = None
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if self.openai_api_key:
            self.openai_client = OpenAI(api_key=self.openai_api_key)
        else:
            self.logger.info("OPENAI_API_KEY not found in environment, OpenAI embeddings will be disabled")

        # Use the embedding model
        self.gemini_model_name = "text-embedding-004"  # Updated Gemini embedding model (768 dimensions)
        self.openai_model_name = "text-embedding-ada-002"  # Default OpenAI embedding model (1536 dimensions)
        self.max_retries = 3
        self.retry_delay = 1  # seconds
        # Default to Gemini size, will be updated when actual provider is used
        self.current_embedding_size = 768

    async def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text with multiple provider fallbacks."""
        last_exception = None

        # First try Gemini (Google)
        if self.gemini_client:
            self.logger.info("Attempting to generate embedding using Google Gemini...")
            for attempt in range(self.max_retries):
                try:
                    loop = asyncio.get_event_loop()
                    response = await loop.run_in_executor(
                        None,
                        lambda: self.gemini_client.embed_content(
                            model=self.gemini_model_name,
                            content=text,
                            task_type="retrieval_document"
                        )
                    )
                    embedding = response['embedding']
                    self.current_embedding_size = len(embedding)  # Update to actual size
                    self.logger.info(f"Successfully generated embedding using Google Gemini (size: {len(embedding)})")
                    return embedding
                except Exception as e:
                    last_exception = e
                    error_msg = str(e).lower()
                    # Check if it's a quota/rate limit error
                    if "quota" in error_msg or "rate" in error_msg or "429" in error_msg:
                        self.logger.warning(f"Gemini quota/rate limit exceeded: {str(e)}")
                        # Don't retry on quota errors, move to fallback immediately
                        break
                    if attempt < self.max_retries - 1:  # Don't sleep on the last attempt
                        await asyncio.sleep(self.retry_delay * (2 ** attempt))  # Exponential backoff
                    continue

        # If Gemini fails or isn't available, try OpenAI as fallback
        if self.openai_client:
            self.logger.info("Attempting to generate embedding using OpenAI...")
            for attempt in range(self.max_retries):
                try:
                    response = await asyncio.get_event_loop().run_in_executor(
                        None,
                        lambda: self.openai_client.embeddings.create(
                            input=text,
                            model=self.openai_model_name
                        )
                    )
                    embedding = response.data[0].embedding
                    self.current_embedding_size = len(embedding)  # Update to actual size
                    self.logger.info(f"Successfully generated embedding using OpenAI (size: {len(embedding)})")
                    return embedding
                except Exception as e:
                    last_exception = e
                    if attempt < self.max_retries - 1:  # Don't sleep on the last attempt
                        await asyncio.sleep(self.retry_delay * (2 ** attempt))  # Exponential backoff
                    continue

        # If both providers fail, raise an error
        raise RuntimeError(f"Error generating embedding after trying all providers: {str(last_exception)}")

    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts using batch processing."""
        # Process embeddings one by one to handle quota errors properly
        embeddings = []
        for i, text in enumerate(texts):
            try:
                embedding = await self.generate_embedding(text)
                embeddings.append(embedding)
            except Exception as e:
                self.logger.error(f"Error generating embedding for text {i}: {str(e)}")
                raise RuntimeError(f"Error generating embedding for text {i}: {str(e)}")

        return embeddings

    def get_embedding_size(self) -> int:
        """Get the current embedding size based on the provider used."""
        return self.current_embedding_size