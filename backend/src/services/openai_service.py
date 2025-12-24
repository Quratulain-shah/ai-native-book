"""
Service for generating embeddings using Gemini and text completions using GROQ.
"""
import os
from typing import List, Optional
from openai import OpenAI
import google.generativeai as genai


class OpenAIservice:
    """Service class for interacting with GROQ for text generation and Gemini for embeddings."""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize services for GROQ (text generation) and Gemini (embeddings).

        Args:
            api_key: API key. If not provided, will use GROQ_API_KEY or GEMINI_API_KEY env vars.
        """
        # Initialize GROQ client for text generation (Grok-like models)
        self.groq_api_key = os.getenv("GROQ_API_KEY") or os.getenv("GROK_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ or GROK API key is required for text generation")

        self.groq_base_url = os.getenv("GROQ_BASE_URL", os.getenv("GROK_BASE_URL", "https://api.groq.com/openai/v1"))
        self.groq_client = OpenAI(api_key=self.groq_api_key, base_url=self.groq_base_url)
        self.chat_model = os.getenv("GROQ_MODEL", os.getenv("CHAT_MODEL", "llama-3.1-8b-instant"))

        # Initialize Gemini client for embeddings
        self.gemini_api_key = os.getenv("GEMINI_API_KEY") or api_key
        if not self.gemini_api_key:
            raise ValueError("GEMINI API key is required for embeddings")

        genai.configure(api_key=self.gemini_api_key)
        self.embedding_model_name = "embedding-001"

        print("GROQ and Gemini services initialized successfully.")
    
    def get_embedding(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for the given text using Gemini.

        Args:
            text: Text to generate embedding for

        Returns:
            List of floats representing the embedding, or None if failed
        """
        try:
            result = genai.embed_content(
                model=self.embedding_model_name,
                content=text,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error generating embedding with Gemini: {e}")
            return None
    
    def generate_text(self, prompt: str, max_tokens: int = 500) -> str:
        """
        Generate text completion using GROQ API (Grok-like models).

        Args:
            prompt: The prompt to generate text from
            max_tokens: Maximum tokens in the response

        Returns:
            Generated text response
        """
        try:
            response = self.groq_client.chat.completions.create(
                model=self.chat_model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that answers questions about Physical AI and Humanoid Robotics."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating text with GROQ: {e}")
            return f"I apologize, but I encountered an error: {str(e)}"
