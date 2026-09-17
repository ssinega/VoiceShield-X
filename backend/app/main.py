import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .services.transcriber import transcribe_audio
from .services.analyzer import analyze_transcript
from .schemas import AnalysisResponse

load_dotenv()
app = FastAPI(title="VoiceShield-X API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_TYPES = {"audio/mpeg", "audio/wav", "audio/x-wav", "audio/webm", "audio/ogg", "audio/mp4", "audio/x-m4a"}

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "VoiceShield-X"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Unsupported audio format. Use WAV, MP3, WEBM, OGG or M4A.")

    data = await file.read()
    if len(data) > 25 * 1024 * 1024:
        raise HTTPException(413, "Audio file is too large. Maximum size is 25 MB.")

    suffix = os.path.splitext(file.filename or "audio.webm")[1] or ".webm"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(data)
        temp_path = temp.name

    try:
        transcript = transcribe_audio(temp_path)
        score, level, category, indicators, recommendations = analyze_transcript(transcript)
        return {
            "filename": file.filename or "recording",
            "transcript": transcript,
            "risk_score": score,
            "risk_level": level,
            "category": category,
            "indicators": indicators,
            "recommendations": recommendations,
            "disclaimer": "VoiceShield-X provides automated risk signals, not a definitive fraud determination.",
        }
    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass
