import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch


class TestChatAPI:
    """Integration tests for the chat API endpoints."""

    def test_health_endpoint(self, client):
        """Test the health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert data["status"] == "healthy"

    def test_chat_endpoint_success(self, client, mock_gemini_agent):
        """Test successful chat message processing."""
        # Mock the agent response
        mock_gemini_agent.generate_response.return_value = {
            "response": "This is a test response.",
            "conversation_id": "test_conv_123",
            "model_used": "gemini-2.5-flash",
            "tokens_used": 15
        }

        # Send a valid request with API key in headers
        payload = {
            "message": "Hello, how are you?",
            "conversation_id": "conv_123",
            "user_id": "user_456"
        }

        response = client.post("/api/v1/chat", json=payload, headers={"Authorization": "Bearer test_key_for_testing"})

        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "conversation_id" in data
        assert data["response"] == "This is a test response."

    def test_chat_endpoint_missing_message(self, client):
        """Test that requests with missing messages are rejected."""
        payload = {
            "conversation_id": "conv_123"
            # Missing required 'message' field
        }

        response = client.post("/api/v1/chat", json=payload, headers={"Authorization": "Bearer test_key_for_testing"})

        # Should get validation error (422) because 'message' is required
        assert response.status_code == 422

    def test_chat_endpoint_empty_message(self, client):
        """Test that requests with empty messages are rejected."""
        payload = {
            "message": "",
            "conversation_id": "conv_123"
        }

        response = client.post("/api/v1/chat", json=payload, headers={"Authorization": "Bearer test_key_for_testing"})

        # Should get validation error (422) for empty message at Pydantic level
        assert response.status_code == 422

    def test_chat_endpoint_long_message(self, client):
        """Test that requests with very long messages are rejected."""
        payload = {
            "message": "x" * 10001,  # Exceeds max length
            "conversation_id": "conv_123"
        }

        response = client.post("/api/v1/chat", json=payload, headers={"Authorization": "Bearer test_key_for_testing"})

        # Should get validation error (422) for long message at Pydantic level
        assert response.status_code == 422

    def test_chat_health_endpoint(self, client):
        """Test the chat health check endpoint."""
        response = client.get("/api/v1/chat/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "chat service healthy" in data["status"]

    def test_unauthorized_access(self, client):
        """Test that unauthorized requests are rejected."""
        payload = {
            "message": "Hello, how are you?"
        }

        # Test without API key (should fail)
        response = client.post("/api/v1/chat", json=payload)

        # The response could be 401 or 422 depending on how validation runs first
        # We expect either an auth error or a validation error due to missing API key
        assert response.status_code in [401, 422]