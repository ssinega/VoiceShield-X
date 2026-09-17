"""
VoiceShield X — Next-Action Prediction Engine

Predicts the most likely next harmful action the attacker will request.
Deterministic rule-based prototype. Future: sequence prediction model.
"""
from __future__ import annotations
from typing import Tuple


STAGE_NEXT_ACTION: dict[str, Tuple[str, float]] = {
    "SAFE": ("No action predicted", 0.05),
    "IDENTITY_CLAIM": ("Trust establishment / account mention", 0.60),
    "TRUST_BUILDING": ("Urgency creation / threat introduction", 0.65),
    "URGENCY": ("Threat escalation / account block warning", 0.72),
    "THREAT": ("Sensitive information or OTP request", 0.78),
    "SENSITIVE_INFO_REQUEST": ("OTP or credential disclosure request", 0.82),
    "CREDENTIAL_REQUEST": ("UPI / Payment authorization request", 0.87),
    "PAYMENT_REQUEST": ("Immediate money transfer / UPI transaction", 0.92),
    "IMMINENT_HARM": ("Irreversible financial transaction", 0.97),
    "INTERVENTION": ("Irreversible financial transaction", 0.97),
}

# Override next action based on DNA pattern
DNA_NEXT_ACTION: list[Tuple[list[str], str, float]] = [
    (["OTP_REQUEST", "BANK_IMPERSONATION"], "UPI / Payment authorization request", 0.87),
    (["OTP_REQUEST", "PAYMENT_REQUEST"], "Immediate money transfer", 0.92),
    (["FAMILY_IMPERSONATION", "PAYMENT_REQUEST"], "Immediate money transfer via UPI/bank", 0.91),
    (["KYC_FRAUD", "MALICIOUS_LINK"], "Credential harvesting via phishing link", 0.82),
    (["REMOTE_ACCESS_REQUEST"], "Remote device access / screen control installation", 0.80),
    (["CREDENTIAL_REQUEST", "MALICIOUS_LINK"], "Credential submission on phishing site", 0.85),
]


def predict_next_action(stage: str, dna: list[str]) -> Tuple[str, float]:
    """
    Predict the attacker's next likely action.
    
    Returns (action_description, confidence).
    Confidence is a prototype estimate, not a measured accuracy.
    """
    # Check DNA-specific overrides first
    for dna_pattern, action, confidence in DNA_NEXT_ACTION:
        if all(node in dna for node in dna_pattern):
            return action, confidence

    # Fall back to stage-based prediction
    return STAGE_NEXT_ACTION.get(stage, ("Unknown", 0.5))
