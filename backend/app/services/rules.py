import re

RULES = [
    ("Urgency / pressure", [r"act now", r"immediately", r"within \d+ minutes", r"urgent", r"last chance"], 18),
    ("Credential request", [r"password", r"otp", r"one[- ]time password", r"verification code", r"pin"], 25),
    ("Payment request", [r"send money", r"transfer", r"gift card", r"crypto", r"pay a fee", r"processing fee"], 22),
    ("Impersonation", [r"bank", r"police", r"income tax", r"government", r"support team", r"customer care"], 15),
    ("Threat / consequence", [r"account will be blocked", r"arrest", r"legal action", r"fine", r"penalty"], 15),
    ("Remote-access request", [r"anydesk", r"teamviewer", r"remote access", r"screen share", r"install this app"], 25),
]

def detect_indicators(text: str):
    normalized = text.lower()
    found = []
    for label, patterns, points in RULES:
        matches = []
        for pattern in patterns:
            if re.search(pattern, normalized):
                matches.append(pattern.replace(r"\d+", "number"))
        if matches:
            found.append({
                "label": label,
                "evidence": ", ".join(matches[:3]),
                "severity": "high" if points >= 22 else "medium",
                "points": points,
            })
    return found
