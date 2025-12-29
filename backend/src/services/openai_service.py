"""
Service for text completions using GROQ (Grok models).
Embeddings are handled by GeminiService.
"""
import os
from typing import Optional
from openai import OpenAI


class GroqService:
    """Service class for interacting with GROQ for text generation."""

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize GROQ client for text generation.

        Args:
            api_key: API key for GROQ. If not provided, will use GROQ_API_KEY env var.
        """
        self.groq_api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY is required for text generation")

        self.groq_client = OpenAI(
            api_key=self.groq_api_key,
            base_url="https://api.groq.com/openai/v1"
        )
        self.chat_model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
        print("GROQ text generation service initialized successfully.")

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
