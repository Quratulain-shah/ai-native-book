import logging
import os
from openai import OpenAI

logger = logging.getLogger(__name__)


class GroqService:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is required")
        self.base_url = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
        self.model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)
        logger.info(f"GroqService initialized with model: {self.model}")

    def generate_text(self, prompt: str) -> str:
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1024,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq text generation failed: {e}")
            raise
