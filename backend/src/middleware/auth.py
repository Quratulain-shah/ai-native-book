from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime
import logging
from ..database import get_db
from ..models import AuthSession, AuthUser
from .. import schemas

logger = logging.getLogger(__name__)

# We use optional oauth2_scheme to get token from header if present
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/sign-in", auto_error=False)

async def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> schemas.AuthUser:
    
    # 1. Try to get token from Authorization header (Bearer)
    if token:
        # Bearer token is usually pure, but just in case
        pass

    # 2. If not in header, try cookie
    if not token:
        token = request.cookies.get("better-auth.session_token")
        
    if not token:
        logger.error("No token provided in Header or Cookie")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated (No token)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Decode URL encoded characters if any (though requests usually handles this)
    import urllib.parse
    token = urllib.parse.unquote(token)

    # 3. Query DB
    # Handle signed cookies (token.signature) - try exact match first, then split
    session_record = db.query(AuthSession).filter(AuthSession.token == token).first()
    
    if not session_record and "." in token:
        # Try extracting the token part (before the signature)
        # This format depends on how Better Auth sets the cookie. 
        # Sometimes it's `token.signature` or similar.
        potential_token = token.split(".")[0]
        logger.info(f"Exact match failed. Trying truncated token: {potential_token}")
        session_record = db.query(AuthSession).filter(AuthSession.token == potential_token).first()

    if not session_record:
        logger.error(f"Session record not found in DB for token: {token}")
        # Debug: List count
        count = db.query(AuthSession).count()
        logger.info(f"Total sessions in DB: {count}")
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # 4. Check Expiry
    if session_record.expiresAt < datetime.utcnow():
        logger.error("Session expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # 5. Get User
    user = db.query(AuthUser).filter(AuthUser.id == session_record.userId).first()
    if not user:
        logger.error(f"User {session_record.userId} not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user