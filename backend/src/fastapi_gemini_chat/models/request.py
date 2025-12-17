from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class MessageRequest(BaseModel):
    """
    Request model for chat messages.

    Attributes:
        message: The user's input message text
        conversation_id: Optional ID to maintain conversation context
        user_id: Optional ID to identify the user
        metadata: Optional additional data for the request
    """
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="The user's input message text"
    )
    conversation_id: Optional[str] = Field(
        None,
        description="Optional ID to maintain conversation context"
    )
    user_id: Optional[str] = Field(
        None,
        description="Optional ID to identify the user"
    )
    metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional additional data for the request"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Hello, how are you?",
                "conversation_id": "conv_123",
                "user_id": "user_456",
                "metadata": {"source": "web_app"}
            }
        }