import logging
from deep_translator import GoogleTranslator

logger = logging.getLogger(__name__)


async def translate_text(text: str, dest_language: str = "ur") -> str:
    try:
        # deep-translator has a character limit per request, so chunk large texts
        max_chunk = 4500
        if len(text) <= max_chunk:
            translated = GoogleTranslator(source="auto", target=dest_language).translate(text)
            return translated

        # Split into chunks for large texts
        chunks = [text[i:i + max_chunk] for i in range(0, len(text), max_chunk)]
        translated_chunks = []
        for chunk in chunks:
            translated_chunk = GoogleTranslator(source="auto", target=dest_language).translate(chunk)
            translated_chunks.append(translated_chunk)

        return "".join(translated_chunks)
    except Exception as e:
        logger.error(f"Translation failed: {e}")
        return None
