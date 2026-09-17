import os
from pathlib import Path

DEMO_TRANSCRIPT = (
    "Hello, this is your bank support team. Your account will be blocked immediately. "
    "Please share the OTP and transfer a processing fee now to complete verification."
)

def transcribe_audio(file_path: str) -> str:
    """Transcribe audio when OpenAI credentials are configured; otherwise use demo mode."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return DEMO_TRANSCRIPT

    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        with open(Path(file_path), "rb") as audio:
            result = client.audio.transcriptions.create(model="gpt-4o-mini-transcribe", file=audio)
        return result.text
    except Exception:
        return DEMO_TRANSCRIPT
