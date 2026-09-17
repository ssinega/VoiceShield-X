"""
VoiceShield X — Time-to-Harm Engine

Deterministic rule-based estimate of time before irreversible harm.
NOT a scientifically validated prediction. Prototype estimate only.
"""
from __future__ import annotations
from typing import Optional


STAGE_TIME_MAP: dict[str, Optional[int]] = {
    "SAFE": None,
    "IDENTITY_CLAIM": 360,   # > 5 minutes
    "TRUST_BUILDING": 300,   # ~5 minutes
    "URGENCY": 180,          # ~3 minutes
    "THREAT": 120,           # ~2 minutes
    "SENSITIVE_INFO_REQUEST": 90,  # ~90 seconds
    "CREDENTIAL_REQUEST": 47,      # ~47 seconds
    "PAYMENT_REQUEST": 30,         # ~30 seconds
    "IMMINENT_HARM": 10,           # ~10 seconds
    "INTERVENTION": 5,
}


def estimate_time_to_harm(stage: str, dna: list[str]) -> Optional[int]:
    """
    Estimate seconds until irreversible harm from the current attack stage.
    
    Returns None if no threat detected (SAFE stage).
    
    Future: Replace with regression model trained on real fraud call durations.
    """
    base = STAGE_TIME_MAP.get(stage)
    if base is None:
        return None

    # Adjust for presence of both payment AND OTP in DNA (more imminent)
    has_otp = "OTP_REQUEST" in dna
    has_payment = "PAYMENT_REQUEST" in dna or "UPI_REQUEST" in dna
    if has_otp and has_payment and base > 30:
        base = max(int(base * 0.6), 20)

    # Urgency DNA node further reduces estimate
    if "URGENCY" in dna and base > 60:
        base = max(int(base * 0.8), 30)

    return base
