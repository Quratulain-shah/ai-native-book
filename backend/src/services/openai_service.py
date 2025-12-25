"""
OpenAI Service for generating embeddings and text completions.
"""
import os
from typing import List, Optional
from openai import OpenAI


class OpenAIservice:
    """Service class for interacting with OpenAI API."""
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize OpenAI service.
        
        Args:
            api_key: OpenAI API key. If not provided, will use OPENAI_API_KEY env var.
        """
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key is required")
        
        self.client = OpenAI(api_key=self.api_key)
        self.embedding_model = "text-embedding-3-small"
        self.chat_model = "gpt-4o-mini"
    
    def get_embedding(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for the given text.
        
        Args:
            text: Text to generate embedding for
            
        Returns:
            List of floats representing the embedding, or None if failed
        """
        try:
            response = self.client.embeddings.create(
                model=self.embedding_model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return None
    
    def generate_text(self, prompt: str, max_tokens: int = 500) -> str:
        """
        Generate text completion using OpenAI API.
        
        Args:
            prompt: The prompt to generate text from
            max_tokens: Maximum tokens in the response
            
        Returns:
            Generated text response
        """
        try:
            response = self.client.chat.completions.create(
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
            print(f"Error generating text: {e}")
            return f"I apologize, but I encountered an error: {str(e)}"
