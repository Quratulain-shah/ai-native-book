import logging
import os
import google.generativeai as genai

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is required")
        genai.configure(api_key=self.api_key)
        self.model_name = "models/embedding-001"
        logger.info("GeminiService initialized for embeddings")

    def get_embedding(self, text: str) -> list:
        try:
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="retrieval_query",
            )
            return result["embedding"]
        except Exception as e:
            logger.error(f"Gemini embedding failed: {e}")
            return None
