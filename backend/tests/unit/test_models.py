import pytest
from pydantic import ValidationError
from fastapi_gemini_chat.models.request import MessageRequest
from fastapi_gemini_chat.models.response import MessageResponse, ErrorResponse


class TestMessageRequest:
    """Unit tests for MessageRequest model."""

    def test_valid_message_request(self):
        """Test that a valid message request is accepted."""
        request = MessageRequest(message="Hello, world!")
        assert request.message == "Hello, world!"
        assert request.conversation_id is None

    def test_message_request_with_all_fields(self):
        """Test that a message request with all fields is accepted."""
        request = MessageRequest(
            message="Hello, world!",
            conversation_id="conv_123",
            user_id="user_456",
            metadata={"source": "test"}
        )
        assert request.message == "Hello, world!"
        assert request.conversation_id == "conv_123"
        assert request.user_id == "user_456"
        assert request.metadata == {"source": "test"}

    def test_empty_message_validation(self):
        """Test that empty messages are rejected."""
        with pytest.raises(ValidationError):
            MessageRequest(message="")

    def test_message_too_long_validation(self):
        """Test that messages that are too long are rejected."""
        long_message = "x" * 10001  # Exceeds max length of 10000
        with pytest.raises(ValidationError):
            MessageRequest(message=long_message)

    def test_minimal_message_request(self):
        """Test that a minimal message request is accepted."""
        request = MessageRequest(message="Hi")
        assert request.message == "Hi"


class TestMessageResponse:
    """Unit tests for MessageResponse model."""

    def test_valid_message_response(self):
        """Test that a valid message response is accepted."""
        response = MessageResponse(
            response="Test response",
            conversation_id="conv_123",
            model_used="gemini-2.5-flash"
        )
        assert response.response == "Test response"
        assert response.conversation_id == "conv_123"
        assert response.model_used == "gemini-2.5-flash"
        assert response.timestamp is not None

    def test_message_response_with_optional_fields(self):
        """Test that a message response with optional fields is accepted."""
        response = MessageResponse(
            response="Test response",
            conversation_id="conv_123",
            model_used="gemini-2.5-flash",
            tokens_used=25
        )
        assert response.tokens_used == 25


class TestErrorResponse:
    """Unit tests for ErrorResponse model."""

    def test_valid_error_response(self):
        """Test that a valid error response is accepted."""
        error_response = ErrorResponse(
            error="Test error message",
            error_code="TEST_ERROR"
        )
        assert error_response.error == "Test error message"
        assert error_response.error_code == "TEST_ERROR"
        assert error_response.timestamp is not None