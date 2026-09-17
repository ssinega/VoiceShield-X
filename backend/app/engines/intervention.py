"""
VoiceShield X — Intervention Engine

Generates intervention recommendations based on risk level and attack stage.
"""
from __future__ import annotations
from typing import List


INTERVENTIONS: dict[str, dict] = {
    "CRITICAL": {
        "actions": [
            "Do NOT share your OTP, PIN, or password with anyone",
            "Do NOT authorize any payment or UPI transaction",
            "End the call immediately — hang up now",
            "Verify independently via your bank's official helpline number",
            "Report this number to your bank's fraud department",
        ],
        "reasons_template": "Critical threat detected — multiple attack patterns confirmed"
    },
    "HIGH": {
        "actions": [
            "Do NOT provide banking credentials or click any links",
            "Verify the caller's identity through the official channel",
            "Contact your bank or service provider directly using a number from their official website",
            "Do not take any financial action during this call",
        ],
        "reasons_template": "High risk patterns detected — proceed with extreme caution"
    },
    "MEDIUM": {
        "actions": [
            "Be cautious — some suspicious patterns detected",
            "Do not share sensitive information during this call",
            "Verify the caller independently before proceeding",
            "You can always call back through an official number",
        ],
        "reasons_template": "Moderate risk signals detected"
    },
    "LOW": {
        "actions": [
            "Call appears legitimate — no dangerous requests detected",
            "If unsure, verify case details on the official website",
            "No immediate action required",
        ],
        "reasons_template": "No significant threat patterns detected"
    },
    "SAFE": {
        "actions": [
            "No threat detected — call appears safe",
            "Continue normally",
        ],
        "reasons_template": "No threat patterns detected"
    },
}


def get_intervention(risk_level: str, stage: str, dna: list[str], reasons: List[str]) -> dict:
    """
    Get intervention recommendation for the given risk level.
    Returns dict with actions and reasons.
    """
    cfg = INTERVENTIONS.get(risk_level, INTERVENTIONS["LOW"])

    # Add stage-specific actions
    actions = list(cfg["actions"])
    if stage == "PAYMENT_REQUEST" and "End the call immediately — hang up now" not in actions:
        actions.insert(0, "Do NOT make any payment — end the call now")
    if "MALICIOUS_LINK" in dna and "Do NOT click any links" not in str(actions):
        actions.insert(1, "Do NOT click any links received during this call")

    return {
        "actions": actions,
        "reasons": reasons or [cfg["reasons_template"]],
    }
