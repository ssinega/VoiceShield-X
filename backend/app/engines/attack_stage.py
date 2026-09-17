"""
VoiceShield X — Attack Stage Engine

Deterministic state machine mapping Scam DNA → Attack Stage.
Future: Replace transition logic with sequence model (LSTM / Transformer).
"""
from __future__ import annotations
from typing import List


STAGE_PRIORITY = {
    "SAFE": 0,
    "IDENTITY_CLAIM": 1,
    "TRUST_BUILDING": 2,
    "URGENCY": 3,
    "THREAT": 4,
    "SENSITIVE_INFO_REQUEST": 5,
    "CREDENTIAL_REQUEST": 6,
    "PAYMENT_REQUEST": 7,
    "IMMINENT_HARM": 8,
    "INTERVENTION": 9,
}

# DNA node → attack stage mapping
DNA_TO_STAGE = {
    "BANK_IMPERSONATION": "IDENTITY_CLAIM",
    "GOVT_IMPERSONATION": "IDENTITY_CLAIM",
    "FAMILY_IMPERSONATION": "IDENTITY_CLAIM",
    "TECH_SUPPORT_IMPERSONATION": "IDENTITY_CLAIM",
    "KYC_FRAUD": "IDENTITY_CLAIM",
    "IDENTITY_CLAIM": "IDENTITY_CLAIM",
    "AUTHORITY": "TRUST_BUILDING",
    "TRUST_BUILDING": "TRUST_BUILDING",
    "REWARD": "TRUST_BUILDING",
    "URGENCY": "URGENCY",
    "FEAR": "URGENCY",
    "THREAT": "THREAT",
    "ISOLATION": "THREAT",
    "OTP_REQUEST": "CREDENTIAL_REQUEST",
    "CREDENTIAL_REQUEST": "CREDENTIAL_REQUEST",
    "MALICIOUS_LINK": "CREDENTIAL_REQUEST",
    "REMOTE_ACCESS_REQUEST": "SENSITIVE_INFO_REQUEST",
    "PAYMENT_REQUEST": "PAYMENT_REQUEST",
    "UPI_REQUEST": "PAYMENT_REQUEST",
    "BANKING_REQUEST": "PAYMENT_REQUEST",
    "EMOTIONAL_MANIPULATION": "URGENCY",
    "FINANCIAL_HARM": "IMMINENT_HARM",
}


def detect_attack_stage(dna: List[str]) -> str:
    """
    Determine the highest (most advanced) attack stage from the Scam DNA.
    Returns the stage name string.
    """
    if not dna:
        return "SAFE"

    stages_detected = set()
    for node in dna:
        stage = DNA_TO_STAGE.get(node)
        if stage:
            stages_detected.add(stage)

    if not stages_detected:
        return "SAFE"

    # Return the most advanced stage
    return max(stages_detected, key=lambda s: STAGE_PRIORITY.get(s, 0))
