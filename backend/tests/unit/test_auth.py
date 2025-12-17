import pytest
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient

from fastapi_gemini_chat.api.middleware.auth import verify_api_key
from fastapi_gemini_chat.main import app


class TestAuthMiddleware:
    """Unit tests for the authentication middleware."""

    @pytest.mark.asyncio
    async def test_verify_api_key_with_valid_header(self):
        """Test that a valid API key in header is accepted."""
        # Create a mock request with API key in header
        mock_request = Mock()
        mock_request.query_params = Mock()
        mock_request.query_params.get.return_value = None  # No query param API key

        # Create valid credentials
        mock_credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="test_key_for_testing")

        # Mock the settings object from the config module
        with patch("fastapi_gemini_chat.config.settings") as mock_settings:
            mock_settings.gemini_api_key = "test_key_for_testing"

            # This should not raise an exception
            result = await verify_api_key(mock_request, mock_credentials)
            assert result == "test_key_for_testing"

    @pytest.mark.asyncio
    async def test_verify_api_key_with_invalid_header(self):
        """Test that an invalid API key in header is rejected."""
        # Create a mock request with API key in header
        mock_request = Mock()
        mock_request.query_params = Mock()
        mock_request.query_params.get.return_value = None  # No query param API key

        # Create invalid credentials
        mock_credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials="invalid_key")

        # Mock the settings object from the config module
        with patch("fastapi_gemini_chat.config.settings") as mock_settings:
            mock_settings.gemini_api_key = "valid_key"

            # This should raise an HTTPException
            with pytest.raises(HTTPException) as exc_info:
                await verify_api_key(mock_request, mock_credentials)
            assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_verify_api_key_with_valid_query_param(self):
        """Test that a valid API key in query parameter is accepted."""
        # Create a mock request with API key in query params
        mock_request = Mock()
        mock_request.query_params = Mock()
        mock_request.query_params.get.return_value = "test_key_for_testing"

        # No credentials in header
        mock_credentials = None

        # Mock the settings object from the config module
        with patch("fastapi_gemini_chat.config.settings") as mock_settings:
            mock_settings.gemini_api_key = "test_key_for_testing"

            # This should not raise an exception
            result = await verify_api_key(mock_request, mock_credentials)
            assert result == "test_key_for_testing"

    @pytest.mark.asyncio
    async def test_verify_api_key_with_invalid_query_param(self):
        """Test that an invalid API key in query parameter is rejected."""
        # Create a mock request with API key in query params
        mock_request = Mock()
        mock_request.query_params = Mock()
        mock_request.query_params.get.return_value = "invalid_key"

        # No credentials in header
        mock_credentials = None

        # Mock the settings object from the config module
        with patch("fastapi_gemini_chat.config.settings") as mock_settings:
            mock_settings.gemini_api_key = "valid_key"

            # This should raise an HTTPException
            with pytest.raises(HTTPException) as exc_info:
                await verify_api_key(mock_request, mock_credentials)
            assert exc_info.value.status_code == 401

    @pytest.mark.asyncio
    async def test_verify_api_key_missing(self):
        """Test that missing API key is rejected."""
        # Create a mock request with no API key
        mock_request = Mock()
        mock_request.query_params = Mock()
        mock_request.query_params.get.return_value = None

        # No credentials in header
        mock_credentials = None

        # Mock the settings object from the config module
        with patch("fastapi_gemini_chat.config.settings") as mock_settings:
            mock_settings.gemini_api_key = "valid_key"

            # This should raise an HTTPException
            with pytest.raises(HTTPException) as exc_info:
                await verify_api_key(mock_request, mock_credentials)
            assert exc_info.value.status_code == 401