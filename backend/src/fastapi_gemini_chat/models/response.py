from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MessageResponse(BaseModel):
    """
    Response model for chat messages.

    Attributes:
        response: The AI-generated response text
        conversation_id: ID of the conversation (new or existing)
        timestamp: When the response was generated
        model_used: Which model was used to generate the response
        tokens_used: Number of tokens consumed (optional)
    """
    response: str = Field(
        ...,
        description="The AI-generated response text"
    )
    conversation_id: str = Field(
        ...,
        description="ID of the conversation (new or existing)"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="When the response was generated"
    )
    model_used: str = Field(
        ...,
        description="Which model was used to generate the response"
    )
    tokens_used: Optional[int] = Field(
        None,
        description="Number of tokens consumed (optional)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "response": "Hello! I'm doing well, thank you for asking.",
                "conversation_id": "conv_123",
                "timestamp": "2025-12-17T15:30:00.000Z",
                "model_used": "gemini-2.5-flash",
                "tokens_used": 15
            }
        }


class ErrorResponse(BaseModel):
    """
    Error response model.

    Attributes:
        error: Error message
        error_code: Error code
        timestamp: When the error occurred
    """
    error: str
    error_code: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "error": "Invalid input: message field is required",
                "error_code": "VALIDATION_ERROR",
                "timestamp": "2025-12-17T15:30:00.000Z"
            }
        }