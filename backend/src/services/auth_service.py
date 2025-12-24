from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas
import httpx
import os
import datetime
import urllib.parse

# Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
BETTER_AUTH_API_KEY = os.getenv("BETTER_AUTH_API_KEY") # Keep for backward compatibility if needed

async def google_login_initiate(callback_url: str):
    """
    Initiates the Google social login process.
    Prioritizes direct Google OAuth if credentials are present.
    """
    if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:
        # Direct Google OAuth Flow
        params = {
            "client_id": GOOGLE_CLIENT_ID,
            "redirect_uri": callback_url,
            "response_type": "code",
            "scope": "openid email profile",
            "access_type": "offline",
            "prompt": "consent"
        }
        auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urllib.parse.urlencode(params)}"
        return {"url": auth_url}
    
    elif BETTER_AUTH_API_KEY:
        # Fallback to Better Auth (original implementation)
        BETTER_AUTH_API_URL = "https://dev.api.fdsfi.com/v1/auth"
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BETTER_AUTH_API_URL}/sign-in/social",
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {BETTER_AUTH_API_KEY}"},
                json={
                    "provider": "google",
                    "callbackURL": callback_url,
                    "disableRedirect": False,
                    "scopes": ["profile", "email"]
                }
            )
            response.raise_for_status()
            return response.json()
    else:
        raise HTTPException(status_code=500, detail="Authentication not configured (Missing Google Credentials or Better Auth Key)")

async def google_login_callback(db: Session, auth_code: str):
    """
    Handles the Google OAuth callback.
    """
    if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET:
        # Direct Google OAuth Flow
        token_url = "https://oauth2.googleapis.com/token"
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
        # Ensure this matches exactly what was sent in initiate
        # Note: The callback_url passed to initiate was constructed in main.py as f"{frontend_url}/auth/google/callback"
        # We need to reconstruct it here or pass it in. Ideally it should be passed in, but for now we reconstruct.
        redirect_uri = f"{frontend_url}/auth/google/callback" 

        async with httpx.AsyncClient() as client:
            # Exchange code for token
            token_data = {
                "code": auth_code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code"
            }
            token_response = await client.post(token_url, data=token_data)
            if token_response.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to retrieve token from Google: {token_response.text}")
            
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            id_token = tokens.get("id_token") # JWT containing user info

            # Get User Info
            user_info_response = await client.get(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            if user_info_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to retrieve user info from Google")
            
            user_info = user_info_response.json()
            
            # Create or update user in our database
            user = db.query(models.User).filter(
                models.User.provider == "google",
                models.User.provider_id == user_info["id"]
            ).first()

            if user:
                user.email = user_info.get("email", user.email)
                user.name = user_info.get("name", user.name)
                user.updated_at = datetime.datetime.utcnow()
            else:
                user = models.User(
                    email=user_info["email"],
                    name=user_info.get("name"),
                    provider="google",
                    provider_id=user_info["id"]
                )
                db.add(user)
            
            db.commit()
            db.refresh(user)

            # Return the tokens (you might want to issue your own JWT here instead)
            return {
                "access_token": access_token, 
                "id_token": id_token, 
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "name": user.name
                }
            }

    elif BETTER_AUTH_API_KEY:
        # Fallback to Better Auth
        BETTER_AUTH_API_URL = "https://dev.api.fdsfi.com/v1/auth"
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BETTER_AUTH_API_URL}/sign-in/social/callback",
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {BETTER_AUTH_API_KEY}"},
                json={"code": auth_code, "provider": "google"}
            )
            response.raise_for_status()
            auth_data = response.json()
            
            user_info = auth_data.get("user")
            if not user_info:
                raise HTTPException(status_code=500, detail="Failed to get user info from Better Auth")

            # Create or update user in our database
            user = db.query(models.User).filter(
                models.User.provider == "google",
                models.User.provider_id == user_info["id"]
            ).first()

            if user:
                user.email = user_info.get("email", user.email)
                user.name = user_info.get("name", user.name)
                user.updated_at = datetime.datetime.utcnow()
            else:
                user = models.User(
                    email=user_info["email"],
                    name=user_info.get("name"),
                    provider="google",
                    provider_id=user_info["id"]
                )
                db.add(user)
            
            db.commit()
            db.refresh(user)

            return {"token": auth_data.get("token")}
    else:
        raise HTTPException(status_code=500, detail="Authentication not configured")


# --- RAG Chatbot Compatibility ---
def get_rag_chatbot_auth_context(current_user_id: int):
    """
    Placeholder function to provide authentication context for the RAG Chatbot.
    """
    return {"user_id": current_user_id, "roles": ["authenticated_user"], "permissions": ["read_all_books"]}