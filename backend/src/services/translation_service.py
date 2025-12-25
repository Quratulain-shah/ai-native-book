from deep_translator import GoogleTranslator
from typing import Optional
from fastapi import HTTPException

async def translate_text(text: str, dest_language: str = "ur") -> Optional[str]:
    """
    Translates the given text to the destination language using deep-translator.
    """
    try:
        translated = GoogleTranslator(source='auto', target=dest_language).translate(text)
        return translated
    except Exception as e:
        # Log the exception for debugging
        print(f"Translation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Translation service error: {e}")
