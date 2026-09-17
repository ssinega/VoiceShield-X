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
