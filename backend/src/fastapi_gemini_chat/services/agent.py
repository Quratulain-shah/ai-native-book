import asyncio
import logging
from typing import Optional, Dict, Any
from openai import OpenAI
from pydantic import BaseModel
import httpx
from ..config import settings


logger = logging.getLogger(__name__)


class GroqAgent:
    """
    Agent that uses OpenAI SDK to connect to Groq's API.

    This class configures the OpenAI client to work with Groq's API
    using the OpenAI-compatible endpoint.
    """

    def __init__(self):
        """Initialize the Groq agent with proper configuration."""
        self.model = settings.groq_model
        self.client = OpenAI(
            base_url=settings.groq_base_url,
            api_key=settings.groq_api_key,
            # Configure HTTP client with reasonable timeouts
            http_client=httpx.Client(
                timeout=httpx.Timeout(30.0, connect=5.0),
                follow_redirects=True,
            )
        )

    async def generate_response(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        user_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Generate a response from the Gemini model.

        Args:
            message: The user's input message
            conversation_id: Optional conversation identifier for context
            user_id: Optional user identifier
            metadata: Optional additional data

        Returns:
            Dictionary containing the response and metadata
        """
        try:
            # Prepare the messages array for the chat completion
            messages = [{"role": "user", "content": message}]

            # Add system message if needed for context
            if metadata and metadata.get("system_prompt"):
                messages.insert(0, {"role": "system", "content": metadata["system_prompt"]})

            # Make the API call asynchronously
            response = await asyncio.get_event_loop().run_in_executor(
                None,
                lambda: self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=1000,
                    top_p=0.9
                )
            )

            # Extract the response content
            ai_response = response.choices[0].message.content
            tokens_used = response.usage.total_tokens if response.usage else None

            return {
                "response": ai_response,
                "conversation_id": conversation_id or f"conv_{hash(message) % 10000}",
                "model_used": self.model,
                "tokens_used": tokens_used,
                "finish_reason": response.choices[0].finish_reason
            }

        except Exception as e:
            logger.error(f"Groq API error: {str(e)}", exc_info=True)
            raise RuntimeError(f"Failed to get response from Groq: {str(e)}")

    def validate_config(self) -> bool:
        """
        Validate that the agent is properly configured.

        Returns:
            True if configuration is valid, False otherwise
        """
        try:
            if not settings.groq_api_key:
                logger.error("GROQ_API_KEY is not configured")
                return False

            if not self.model:
                logger.error("GROQ_MODEL is not configured")
                return False

            return True
        except Exception as e:
            logger.error(f"Configuration validation failed: {str(e)}")
            return False


# Singleton instance
groq_agent = GroqAgent()