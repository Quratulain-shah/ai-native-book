import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from fastapi_gemini_chat.main import create_app
from fastapi_gemini_chat.config import Settings


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    # Import the app creation inside the fixture to ensure patches are applied first
    with patch('fastapi_gemini_chat.config.settings') as mock_settings:
        # Configure the mock settings
        mock_settings.gemini_api_key = "test_key_for_testing"
        mock_settings.gemini_model = "gemini-2.5-flash"
        mock_settings.gemini_base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
        mock_settings.api_host = "0.0.0.0"
        mock_settings.api_port = 8000
        mock_settings.api_debug = False
        mock_settings.allowed_origins = "*"
        mock_settings.validate_config = MagicMock(return_value=True)

        # Create app with mocked settings
        test_app = create_app()

        with TestClient(test_app) as test_client:
            yield test_client


@pytest.fixture
def mock_gemini_agent():
    """Mock the Gemini agent to avoid actual API calls during testing."""
    with patch('fastapi_gemini_chat.services.agent.gemini_agent') as mock_agent:
        mock_agent.generate_response.return_value = {
            "response": "This is a test response from the mock agent.",
            "conversation_id": "test_conv_123",
            "model_used": "gemini-2.5-flash",
            "tokens_used": 10
        }
        yield mock_agent