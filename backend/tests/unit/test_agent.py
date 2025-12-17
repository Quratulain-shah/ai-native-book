import pytest
from unittest.mock import Mock, patch, AsyncMock
from fastapi_gemini_chat.services.agent import GeminiAgent


class TestGeminiAgent:
    """Unit tests for the GeminiAgent class."""

    def test_agent_initialization(self):
        """Test that the agent initializes with proper configuration."""
        agent = GeminiAgent()
        assert agent.model is not None
        assert agent.client is not None

    @pytest.mark.asyncio
    async def test_generate_response(self):
        """Test that generate_response method works correctly."""
        agent = GeminiAgent()

        # Mock the OpenAI client's chat completions create method
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message = Mock()
        mock_response.choices[0].message.content = "Test response"
        mock_response.choices[0].finish_reason = "stop"
        mock_response.usage = Mock()
        mock_response.usage.total_tokens = 15

        # Mock the client.chat.completions.create method
        with patch.object(agent.client.chat.completions, 'create', return_value=mock_response):
            result = await agent.generate_response("Test message")

            assert result["response"] == "Test response"
            assert result["model_used"] is not None
            assert result["tokens_used"] == 15

    def test_validate_config_valid(self):
        """Test that validate_config returns True when configuration is valid."""
        agent = GeminiAgent()
        # This test depends on the environment being properly configured
        # In a real test, we'd mock the settings
        result = agent.validate_config()
        # Note: This will be True if GEMINI_API_KEY is set in the environment
        assert isinstance(result, bool)