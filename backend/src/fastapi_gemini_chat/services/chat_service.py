import logging
from typing import Optional, Dict, Any
from datetime import datetime

from ..models.request import MessageRequest
from ..models.response import MessageResponse
from .agent import gemini_agent


logger = logging.getLogger(__name__)


class ChatService:
    """Service layer to orchestrate chat operations."""

    def __init__(self):
        """Initialize the chat service."""
        self.agent = gemini_agent

    async def process_message(self, request: MessageRequest) -> MessageResponse:
        """
        Process a chat message request and return a response.

        Args:
            request: The message request containing user input

        Returns:
            MessageResponse with AI-generated content
        """
        try:
            logger.info(f"Processing message for user: {request.user_id or 'anonymous'}")

            # Generate response using the Gemini agent
            agent_response = await self.agent.generate_response(
                message=request.message,
                conversation_id=request.conversation_id,
                user_id=request.user_id,
                metadata=request.metadata
            )

            # Create and return the response model
            response = MessageResponse(
                response=agent_response["response"],
                conversation_id=agent_response["conversation_id"],
                model_used=agent_response["model_used"],
                tokens_used=agent_response.get("tokens_used"),
            )

            logger.info(f"Successfully processed message for conversation: {response.conversation_id}")
            return response

        except Exception as e:
            logger.error(f"Error processing message: {str(e)}", exc_info=True)
            raise

    async def validate_request(self, request: MessageRequest) -> bool:
        """
        Validate the incoming request.

        Args:
            request: The message request to validate

        Returns:
            True if request is valid, raises exception if not
        """
        if not request.message or len(request.message.strip()) == 0:
            raise ValueError("Message cannot be empty")

        if len(request.message) > 10000:  # Max length from Pydantic model
            raise ValueError("Message is too long")

        # Additional validations can be added here
        return True


# Singleton instance
chat_service = ChatService()