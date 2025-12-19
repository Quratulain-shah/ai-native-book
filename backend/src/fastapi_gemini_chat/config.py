import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API Configuration
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    api_debug: bool = os.getenv("API_DEBUG", "false").lower() == "true"

    # Groq Configuration
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")  # Free tier model
    groq_base_url: str = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")

    # Application Configuration
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "*")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Validate required settings (only in production/non-debug mode)
        # Skip validation if in debug mode to allow testing without API key
        import os
        api_debug = os.getenv("API_DEBUG", "false").lower() == "true"
        if not api_debug:
            if not self.groq_api_key:
                raise ValueError("GROQ_API_KEY environment variable is required")

    class Config:
        env_file = ".env"
        extra = "ignore"  # Allow extra environment variables


# Global settings instance
settings = Settings()