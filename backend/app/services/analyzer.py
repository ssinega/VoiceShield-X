<<<<<<< HEAD
"""
VoiceShield X — Analysis Orchestrator

Coordinates all intelligence engines to produce a complete analysis result.
"""
from __future__ import annotations
from typing import Optional

from app.engines.scam_dna import extract_scam_dna
from app.engines.attack_stage import detect_attack_stage
from app.engines.time_to_harm import estimate_time_to_harm
from app.engines.next_action import predict_next_action
from app.engines.intervention import get_intervention
from app.engines.voice_signal import analyze_voice_signal


RISK_SCORE_MAP = {
    "IMMINENT_HARM": (90, 99),
    "CREDENTIAL_REQUEST": (80, 92),
    "PAYMENT_REQUEST": (75, 90),
    "THREAT": (60, 79),
    "SENSITIVE_INFO_REQUEST": (55, 75),
    "URGENCY": (40, 60),
    "TRUST_BUILDING": (20, 39),
    "IDENTITY_CLAIM": (15, 30),
    "SAFE": (1, 12),
}

STAGE_TO_RISK = {
    "IMMINENT_HARM": "CRITICAL",
    "CREDENTIAL_REQUEST": "CRITICAL",
    "PAYMENT_REQUEST": "CRITICAL",
    "THREAT": "HIGH",
    "SENSITIVE_INFO_REQUEST": "HIGH",
    "URGENCY": "MEDIUM",
    "TRUST_BUILDING": "LOW",
    "IDENTITY_CLAIM": "MEDIUM",
    "SAFE": "SAFE",
    "INTERVENTION": "CRITICAL",
}

MANIPULATION_TACTICS_MAP = {
    "AUTHORITY": "AUTHORITY",
    "URGENCY": "URGENCY",
    "FEAR": "FEAR",
    "THREAT": "PRESSURE",
    "ISOLATION": "ISOLATION",
    "EMOTIONAL_MANIPULATION": "EMOTIONAL",
    "REWARD": "REWARD",
    "BANK_IMPERSONATION": "IMPERSONATION",
    "FAMILY_IMPERSONATION": "IMPERSONATION",
    "GOVT_IMPERSONATION": "IMPERSONATION",
    "TECH_SUPPORT_IMPERSONATION": "IMPERSONATION",
    "TRUST_BUILDING": "TRUST",
}

DNA_TO_SCAM_TYPE = {
    "BANK_IMPERSONATION": "BANK_IMPERSONATION",
    "GOVT_IMPERSONATION": "GOVT_IMPERSONATION",
    "FAMILY_IMPERSONATION": "FAMILY_IMPERSONATION",
    "TECH_SUPPORT_IMPERSONATION": "TECH_SUPPORT_SCAM",
    "KYC_FRAUD": "KYC_FRAUD",
    "REMOTE_ACCESS_REQUEST": "TECH_SUPPORT_SCAM",
    "MALICIOUS_LINK": "PHISHING",
    "REWARD": "INVESTMENT_FRAUD",
}


def analyze_text(text: str, scenario_id: str = "custom") -> dict:
    """
    Full analysis pipeline for a conversation transcript.
    
    Steps:
    1. Scam DNA extraction
    2. Attack stage detection
    3. Time-to-Harm estimation
    4. Next-action prediction
    5. Risk scoring
    6. Manipulation tactic extraction
    7. Voice signal (simulated)
    8. Intervention generation
    """
    # 1. Scam DNA
    dna = extract_scam_dna(text)

    # 2. Attack stage
    stage = detect_attack_stage(dna)

    # 3. Time-to-Harm
    tth = estimate_time_to_harm(stage, dna)

    # 4. Next action
    next_action, confidence = predict_next_action(stage, dna)

    # 5. Risk level and score
    risk_level = STAGE_TO_RISK.get(stage, "LOW")
    score_range = RISK_SCORE_MAP.get(stage, (5, 20))
    # Normalize score within range based on DNA node count
    dna_weight = min(len(dna) / 8, 1.0)
    risk_score = int(score_range[0] + (score_range[1] - score_range[0]) * dna_weight)

    # 6. Manipulation tactics
    seen_tactics = set()
    tactics = []
    for node in dna:
        t = MANIPULATION_TACTICS_MAP.get(node)
        if t and t not in seen_tactics:
            tactics.append(t)
            seen_tactics.add(t)

    # 7. Scam type
    scam_type = "NONE"
    for node in dna:
        if node in DNA_TO_SCAM_TYPE:
            scam_type = DNA_TO_SCAM_TYPE[node]
            break

    # 8. Detected claims (basic extraction)
    claims = []
    text_lower = text.lower()
    if any(w in text_lower for w in ["bank", "security department", "fraud department"]):
        claims.append({"claim": "Caller claims to be bank/security employee", "status": "UNVERIFIED"})
    if any(w in text_lower for w in ["blocked", "suspended", "frozen"]):
        claims.append({"claim": "Account blocking or suspension threat made", "status": "SUSPICIOUS"})
    if any(w in text_lower for w in ["kyc", "kyc expired"]):
        claims.append({"claim": "KYC expiry claimed", "status": "SUSPICIOUS"})
    if not claims:
        claims = [{"claim": "No suspicious claims detected", "status": "VERIFIED"}]

    # 9. Reasons
    reasons = []
    for node in dna:
        label_map = {
            "BANK_IMPERSONATION": "Bank impersonation detected",
            "FAMILY_IMPERSONATION": "Family member impersonation detected",
            "GOVT_IMPERSONATION": "Government authority impersonation detected",
            "OTP_REQUEST": "OTP disclosure request detected",
            "PAYMENT_REQUEST": "Payment/transfer request detected",
            "THREAT": "Account threat detected",
            "URGENCY": "Urgency pressure detected",
            "ISOLATION": "Isolation tactic detected",
            "MALICIOUS_LINK": "Suspicious link detected",
            "FINANCIAL_HARM": "High probability of financial harm",
            "KYC_FRAUD": "KYC fraud pattern detected",
        }
        reason = label_map.get(node)
        if reason:
            reasons.append(reason)

    if not reasons:
        reasons = ["No significant threat patterns detected"]

    # 10. Voice signal
    voice = analyze_voice_signal(risk_level)

    # 11. Intervention
    intervention = get_intervention(risk_level, stage, dna, reasons)

    return {
        "scenario_id": scenario_id,
        "scenario_name": "Custom Analysis",
        "risk_score": risk_score,
        "risk_level": risk_level,
        "current_stage": stage,
        "scam_type": scam_type,
        "scam_dna": dna,
        "time_to_harm_seconds": tth,
        "next_action": next_action,
        "next_action_confidence": confidence,
        "manipulation_tactics": tactics,
        "detected_claims": claims,
        "voice_signal": voice,
        "reasons": reasons,
        "recommended_action": intervention["actions"],
        "transcript": [],  # Custom text analysis doesn't generate transcript
        "timeline": [],
    }
=======
from .rules import detect_indicators

def analyze_transcript(transcript: str):
    indicators = detect_indicators(transcript)
    score = min(100, sum(item["points"] for item in indicators))

    if score >= 70:
        level = "Critical"
    elif score >= 45:
        level = "High"
    elif score >= 20:
        level = "Medium"
    else:
        level = "Low"

    labels = [i["label"] for i in indicators]
    if "Payment request" in labels and "Credential request" in labels:
        category = "Financial / Account Takeover Scam"
    elif "Remote-access request" in labels:
        category = "Remote Access Scam"
    elif "Impersonation" in labels:
        category = "Impersonation Scam"
    else:
        category = "Potentially Suspicious Call" if score >= 20 else "No Strong Scam Signal"

    recommendations = [
        "Do not share OTPs, PINs, passwords, or verification codes.",
        "Do not transfer money because of pressure from an unexpected caller.",
        "End the call and contact the organization using an independently verified number.",
    ] if score >= 20 else [
        "No strong scam pattern was detected by the current rules.",
        "Continue to verify unexpected requests independently.",
    ]

    return score, level, category, indicators, recommendations
>>>>>>> e823d31a797f4ffc5ecac7769dc7769fb09179f9
