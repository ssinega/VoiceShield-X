"""
VoiceShield X — Audio Transcription & Signal Analysis Service
Uses faster-whisper (CTranslate2 + PyAV) for fast, local, universal audio decoding & speech-to-text.
Supports: MP3, WAV, M4A, OGG, WEBM, FLAC, AAC.
"""
from __future__ import annotations
import os
import tempfile
import math
from typing import List, Dict, Any, Optional
import numpy as np

# Global model cache
_WHISPER_MODEL = None


def get_whisper_model():
    """Lazy load Whisper model on CPU with int8 quantization."""
    global _WHISPER_MODEL
    if _WHISPER_MODEL is None:
        from faster_whisper import WhisperModel
        # 'tiny.en' is fast (~75MB) and accurate for English conversational audio
        _WHISPER_MODEL = WhisperModel("tiny.en", device="cpu", compute_type="int8")
    return _WHISPER_MODEL


def format_seconds(seconds: float) -> str:
    """Format seconds into MM:SS string."""
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02d}:{s:02d}"


def extract_audio_features(audio_path: str) -> Dict[str, Any]:
    """
    Extract acoustic features from audio file using PyAV for voice authenticity signal.
    Calculates zero-crossing rate, RMS energy variability, and spectral distribution.
    """
    try:
        import av
        container = av.open(audio_path)
        stream = next((s for s in container.streams if s.type == "audio"), None)
        if not stream:
            return {"status": "CLEAN", "score": 0.12, "notes": "No audio stream found"}

        samples_list = []
        sample_rate = stream.rate or 16000
        for frame in container.decode(stream):
            # Convert frame to mono float32 array
            arr = frame.to_ndarray()
            if arr.ndim > 1:
                arr = arr.mean(axis=0)
            samples_list.append(arr.astype(np.float32))

        if not samples_list:
            return {"status": "CLEAN", "score": 0.15, "notes": "Empty audio"}

        audio = np.concatenate(samples_list)
        if len(audio) == 0:
            return {"status": "CLEAN", "score": 0.15, "notes": "Empty audio array"}

        # Normalize
        max_val = np.max(np.abs(audio)) + 1e-9
        norm_audio = audio / max_val

        # 1. Zero crossing rate (ZCR)
        zcr = np.mean(np.abs(np.diff(np.sign(norm_audio)))) / 2.0

        # 2. Frame-based RMS energy variability
        frame_len = int(sample_rate * 0.03)  # 30ms frames
        if len(norm_audio) >= frame_len:
            n_frames = len(norm_audio) // frame_len
            frames = norm_audio[:n_frames * frame_len].reshape(n_frames, frame_len)
            rms = np.sqrt(np.mean(frames ** 2, axis=1) + 1e-9)
            energy_variance = float(np.std(rms))
        else:
            energy_variance = 0.05

        # Synthetic/TTS voices often exhibit unnaturally uniform energy or robotic cadence
        # Lower energy variance + very high ZCR is indicative of synthetic/robotic artifacts
        synthetic_indicator = 0.0
        if energy_variance < 0.025:
            synthetic_indicator += 0.35
        if zcr > 0.18:
            synthetic_indicator += 0.25

        base_score = min(max(synthetic_indicator + 0.10, 0.05), 0.92)
        score = round(base_score, 2)

        if score >= 0.65:
            status = "HIGH_RISK"
        elif score >= 0.40:
            status = "SUSPICIOUS"
        else:
            status = "CLEAN"

        return {
            "status": status,
            "prototype_score": score,
            "duration_seconds": round(len(norm_audio) / sample_rate, 2),
            "label": f"Acoustic analysis (ZCR: {zcr:.2f}, Variance: {energy_variance:.3f})"
        }
    except Exception as e:
        return {
            "status": "SUSPICIOUS",
            "prototype_score": 0.50,
            "label": f"Acoustic analysis fallback: {str(e)}"
        }


def transcribe_audio_file(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Transcribe audio bytes (MP3, WAV, M4A, OGG, WEBM, FLAC, etc.) into structured segments.
    Returns:
    {
        "full_text": str,
        "segments": list of {start, end, timestamp, text},
        "voice_signal": dict,
        "filename": str
    }
    """
    ext = os.path.splitext(filename)[1].lower() if filename else ".wav"
    if not ext:
        ext = ".wav"

    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        # 1. Acoustic Signal Analysis
        voice_signal = extract_audio_features(tmp_path)

        # 2. Faster-Whisper Speech Recognition
        model = get_whisper_model()
        segments_gen, info = model.transcribe(
            tmp_path,
            beam_size=2,
            vad_filter=True,
            vad_parameters=dict(min_silence_duration_ms=400),
        )

        segments = []
        text_parts = []
        for s in segments_gen:
            clean_text = s.text.strip()
            if clean_text:
                segments.append({
                    "start": round(s.start, 2),
                    "end": round(s.end, 2),
                    "timestamp": format_seconds(s.start),
                    "text": clean_text
                })
                text_parts.append(clean_text)

        full_text = " ".join(text_parts).strip()

        # If transcription was empty (e.g. silent audio or unrecognized speech)
        if not full_text and segments:
            full_text = " ".join(s["text"] for s in segments)

        return {
            "full_text": full_text,
            "segments": segments,
            "voice_signal": voice_signal,
            "language": info.language if hasattr(info, "language") else "en",
            "duration": round(info.duration, 2) if hasattr(info, "duration") else 0.0,
            "filename": filename
        }
    finally:
        if os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass
