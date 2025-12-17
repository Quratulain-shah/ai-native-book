import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API Configuration
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    api_debug: bool = os.getenv("API_DEBUG", "false").lower() == "true"

    # Gemini Configuration
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    gemini_base_url: str = os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/")

    # Application Configuration
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "*")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Validate required settings
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

    class Config:
        env_file = ".env"


# Global settings instance
settings = Settings()