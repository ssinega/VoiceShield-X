"""
VoiceShield X — Scam DNA Engine

Extracts behavioral scam pattern nodes from conversation text.
This uses keyword/pattern matching as a deterministic baseline.
The interface is designed to be replaced by an NLP/LLM model.
"""
from __future__ import annotations
from typing import List

# Pattern → DNA node mapping
# Each entry: (keywords/phrases, dna_node)
PATTERN_MAP: list[tuple[list[str], str]] = [
    # Impersonation patterns
    (["bank", "hdfc", "sbi", "icici", "kotak", "axis bank", "security department", "fraud department"], "BANK_IMPERSONATION"),
    (["police", "cbi", "eid", "government", "income tax", "customs", "narcotics", "enforcement"], "GOVT_IMPERSONATION"),
    (["mom", "mum", "papa", "dad", "bhaiya", "didi", "friend", "it's me", "this is me"], "FAMILY_IMPERSONATION"),
    (["microsoft", "apple", "google", "tech support", "technical support", "virus", "hacked"], "TECH_SUPPORT_IMPERSONATION"),

    # Authority and trust
    (["officer", "department", "official", "security team", "helpline", "verified"], "AUTHORITY"),
    (["trust me", "we are here to help", "for your safety", "protecting your account"], "TRUST_BUILDING"),

    # Urgency
    (["immediately", "right now", "urgent", "today", "within", "minutes", "seconds", "hours", "quick", "hurry", "fast", "asap"], "URGENCY"),

    # Fear
    (["suspicious activity", "fraud detected", "unauthorized", "at risk", "compromised", "suspicious transaction", "illegal"], "FEAR"),

    # Threat
    (["blocked", "suspended", "frozen", "arrested", "legal action", "case filed", "complaint", "terminate", "penalty", "fine"], "THREAT"),

    # Isolation
    (["don't tell anyone", "don't call", "don't inform", "keep this confidential", "secret", "between us", "don't contact"], "ISOLATION"),

    # Emotional manipulation
    (["emergency", "accident", "hospital", "hurt", "help me", "please", "crying", "trouble", "problem", "desperate"], "EMOTIONAL_MANIPULATION"),

    # Credential / OTP requests
    (["otp", "one time password", "verification code", "pin", "password", "passcode"], "OTP_REQUEST"),
    (["account number", "cvv", "card number", "net banking", "username", "login", "credentials", "details"], "CREDENTIAL_REQUEST"),

    # Payment requests
    (["transfer", "send money", "pay", "payment", "₹", "rs.", "rupees", "amount", "deposit"], "PAYMENT_REQUEST"),
    (["upi", "gpay", "phonepe", "paytm", "bhim", "upi id", "vpa"], "UPI_REQUEST"),
    (["account", "ifsc", "neft", "rtgs", "imps", "bank transfer"], "BANKING_REQUEST"),

    # Malicious link
    (["click", "link", "url", "http", "www.", ".net", ".xyz", "website", "portal", "form"], "MALICIOUS_LINK"),

    # Remote access
    (["anydesk", "teamviewer", "download", "install", "remote", "screen share", "app"], "REMOTE_ACCESS_REQUEST"),

    # KYC fraud
    (["kyc", "know your customer", "kyc expired", "kyc update", "kyc verification", "aadhaar", "pan card"], "KYC_FRAUD"),
]


def extract_scam_dna(text: str) -> List[str]:
    """
    Extract Scam DNA nodes from conversation text.
    Returns ordered list of detected behavioral nodes.
    
    Future: Replace with transformer-based intent classifier.
    """
    text_lower = text.lower()
    detected: list[str] = []
    seen: set[str] = set()

    for keywords, node in PATTERN_MAP:
        if node in seen:
            continue
        for kw in keywords:
            if kw in text_lower:
                detected.append(node)
                seen.add(node)
                break

    # Add FINANCIAL_HARM if payment + impersonation both present
    has_impersonation = any(n in seen for n in ["BANK_IMPERSONATION", "FAMILY_IMPERSONATION", "GOVT_IMPERSONATION", "TECH_SUPPORT_IMPERSONATION", "KYC_FRAUD"])
    has_payment = any(n in seen for n in ["OTP_REQUEST", "PAYMENT_REQUEST", "UPI_REQUEST", "CREDENTIAL_REQUEST"])
    if has_impersonation and has_payment and "FINANCIAL_HARM" not in seen:
        detected.append("FINANCIAL_HARM")

    return detected
