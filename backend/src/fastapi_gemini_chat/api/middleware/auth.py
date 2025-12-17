from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import logging


logger = logging.getLogger(__name__)
security = HTTPBearer(auto_error=False)


async def verify_api_key(request: Request, credentials: Optional[HTTPAuthorizationCredentials] = None):
    """
    Verify API key from either header or query parameter.

    Args:
        request: The incoming request
        credentials: HTTP authorization credentials (from header)

    Raises:
        HTTPException: If API key is invalid or missing
    """
    from ...config import settings

    # Get API key from header (Authorization: Bearer <key>) or query parameter
    api_key = None

    # Check header first
    if credentials:
        api_key = credentials.credentials
    else:
        # Check query parameter as fallback
        api_key = request.query_params.get("api_key")

    # Validate the API key
    if not api_key or api_key != settings.gemini_api_key:
        logger.warning("Invalid or missing API key")
        raise HTTPException(status_code=401, detail="Invalid or missing API key")

    logger.debug("API key verified successfully")
    return api_key