"""
VoiceShield X — Demo Scenario Fixtures

Deterministic, pre-computed analysis results for the 4 built-in demo scenarios.
These work without any API key, ML model, or internet connection.
"""
from __future__ import annotations

DEMO_SCENARIOS = [
    {
        "id": "bank-otp",
        "name": "Bank OTP Scam",
        "description": "Caller impersonates bank security, threatens account block, requests OTP",
        "risk_level": "CRITICAL",
        "scam_type": "BANK_IMPERSONATION",
        "sample_text": "I am calling from your bank security department. We detected suspicious activity on your account.",
    },
    {
        "id": "family-emergency",
        "name": "Family Emergency Scam",
        "description": "Caller impersonates family member, claims emergency, requests immediate money transfer",
        "risk_level": "CRITICAL",
        "scam_type": "FAMILY_IMPERSONATION",
        "sample_text": "Mom, it's me. My phone is broken. I'm in an emergency and need ₹25,000 immediately.",
    },
    {
        "id": "kyc-block",
        "name": "KYC / Account Block Scam",
        "description": "Caller threatens KYC expiry, demands immediate verification via suspicious link",
        "risk_level": "HIGH",
        "scam_type": "KYC_FRAUD",
        "sample_text": "Your KYC has expired. If you do not verify your details immediately, your account will be suspended.",
    },
    {
        "id": "investment-scam",
        "name": "Investment / Stock Tip Scam",
        "description": "Caller offers guaranteed high returns on a fake investment scheme, requests immediate UPI transfer",
        "risk_level": "HIGH",
        "scam_type": "INVESTMENT_FRAUD",
        "sample_text": "Sir, this is a limited-time investment opportunity. Guaranteed 40% returns in 30 days. Just send ₹50,000 via UPI now to secure your slot.",
    },
    {
        "id": "remote-support",
        "name": "Remote Support Scam",
        "description": "Caller impersonates tech support, claims device is hacked, requests remote access software installation",
        "risk_level": "CRITICAL",
        "scam_type": "TECH_SUPPORT_SCAM",
        "sample_text": "This is Microsoft tech support. Your computer has been hacked. Please install AnyDesk immediately so we can fix it.",
    },
    {
        "id": "legitimate-call",
        "name": "Safe / Legitimate Call",
        "description": "Normal customer service call with no suspicious requests or threats",
        "risk_level": "LOW",
        "scam_type": "NONE",
        "sample_text": "Hello, this is customer support. We are calling regarding your service request. No OTP or payment required.",
    },
]


SCENARIO_ANALYSIS = {
    "bank-otp": {
        "scenario_id": "bank-otp",
        "scenario_name": "Bank OTP Scam",
        "risk_score": 92,
        "risk_level": "CRITICAL",
        "current_stage": "CREDENTIAL_REQUEST",
        "scam_type": "BANK_IMPERSONATION",
        "scam_dna": ["BANK_IMPERSONATION", "AUTHORITY", "FEAR", "URGENCY", "THREAT", "OTP_REQUEST", "PAYMENT_REQUEST", "FINANCIAL_HARM"],
        "time_to_harm_seconds": 47,
        "next_action": "UPI / Payment authorization request",
        "next_action_confidence": 0.87,
        "manipulation_tactics": ["AUTHORITY", "FEAR", "URGENCY", "PRESSURE"],
        "detected_claims": [
            {"claim": "Caller claims to be bank security employee", "status": "UNVERIFIED"},
            {"claim": "Suspicious activity detected on account", "status": "UNVERIFIED"},
            {"claim": "Account will be blocked today", "status": "SUSPICIOUS"},
        ],
        "voice_signal": {"status": "SUSPICIOUS", "prototype_score": 0.71, "label": "Prototype signal · Not a real deepfake detector"},
        "reasons": [
            "Bank security department impersonation detected",
            "Account blocking threat issued",
            "Urgency pressure applied to victim",
            "OTP disclosure explicitly requested",
            "High probability of immediate financial harm",
        ],
        "recommended_action": [
            "Do NOT share your OTP, PIN, or password with anyone",
            "Do NOT authorize any payment or UPI transaction",
            "End the call immediately — hang up now",
            "Verify independently via your bank's official helpline number",
            "Report this number to your bank's fraud department",
        ],
        "transcript": [
            {
                "speaker": "CALLER",
                "text": "Hello, I am calling from your Bank Security Department. My name is Officer Sharma.",
                "timestamp": "00:00",
                "tags": ["IDENTITY"],
                "highlighted_phrases": [{"text": "Bank Security Department", "tag": "IDENTITY"}]
            },
            {
                "speaker": "CALLER",
                "text": "We have detected suspicious activity on your account. Your account will be blocked today unless you complete verification immediately.",
                "timestamp": "00:10",
                "tags": ["THREAT", "URGENCY", "FEAR"],
                "highlighted_phrases": [
                    {"text": "suspicious activity on your account", "tag": "FEAR"},
                    {"text": "account will be blocked today", "tag": "THREAT"},
                    {"text": "immediately", "tag": "URGENCY"}
                ]
            },
            {
                "speaker": "VICTIM",
                "text": "Oh no, what happened? How do I verify?",
                "timestamp": "00:18",
                "tags": [],
                "highlighted_phrases": []
            },
            {
                "speaker": "CALLER",
                "text": "To secure your account, please tell me the OTP you just received on your registered mobile number. This is required for verification only.",
                "timestamp": "00:24",
                "tags": ["OTP"],
                "highlighted_phrases": [{"text": "OTP you just received", "tag": "OTP"}]
            },
            {
                "speaker": "CALLER",
                "text": "After this, you will need to authorize a small security transaction of ₹1 to confirm your identity. Your full balance is safe.",
                "timestamp": "00:38",
                "tags": ["PAYMENT"],
                "highlighted_phrases": [{"text": "authorize a small security transaction", "tag": "PAYMENT"}]
            }
        ],
        "timeline": [
            {"timestamp": "00:00", "seconds": 0, "event": "Call started", "severity": "info"},
            {"timestamp": "00:05", "seconds": 5, "event": "Bank identity claimed", "severity": "warning"},
            {"timestamp": "00:10", "seconds": 10, "event": "Suspicious activity mentioned", "severity": "warning"},
            {"timestamp": "00:15", "seconds": 15, "event": "Account blocking threat detected", "severity": "danger"},
            {"timestamp": "00:24", "seconds": 24, "event": "OTP request detected", "severity": "critical"},
            {"timestamp": "00:38", "seconds": 38, "event": "Payment authorization demanded", "severity": "critical"},
            {"timestamp": "00:47", "seconds": 47, "event": "⚠ INTERVENTION TRIGGERED", "severity": "critical"},
        ]
    },

    "family-emergency": {
        "scenario_id": "family-emergency",
        "scenario_name": "Family Emergency Scam",
        "risk_score": 88,
        "risk_level": "CRITICAL",
        "current_stage": "PAYMENT_REQUEST",
        "scam_type": "FAMILY_IMPERSONATION",
        "scam_dna": ["FAMILY_IMPERSONATION", "EMOTIONAL_MANIPULATION", "FEAR", "URGENCY", "ISOLATION", "PAYMENT_REQUEST", "FINANCIAL_HARM"],
        "time_to_harm_seconds": 90,
        "next_action": "Immediate money transfer via UPI/bank",
        "next_action_confidence": 0.91,
        "manipulation_tactics": ["FEAR", "URGENCY", "ISOLATION", "EMOTIONAL"],
        "detected_claims": [
            {"claim": "Caller claims to be family member", "status": "UNVERIFIED"},
            {"claim": "Caller claims phone is broken", "status": "SUSPICIOUS"},
            {"claim": "Emergency requiring ₹25,000", "status": "UNVERIFIED"},
        ],
        "voice_signal": {"status": "HIGH_RISK", "prototype_score": 0.84, "label": "Prototype signal · Not a real deepfake detector"},
        "reasons": [
            "Family member impersonation detected",
            "Emotional manipulation using distress signals",
            "Isolation tactic: 'do not call anyone'",
            "Immediate large payment requested (₹25,000)",
            "Broken phone excuse prevents identity verification",
        ],
        "recommended_action": [
            "Do NOT transfer money before verifying identity",
            "Call the family member on their known number immediately",
            "Contact another trusted family member to verify",
            "End this call and verify through independent means",
            "Never send money based on an unexpected call alone",
        ],
        "transcript": [
            {
                "speaker": "CALLER",
                "text": "Mom, it's me. I'm in serious trouble right now.",
                "timestamp": "00:00",
                "tags": ["IDENTITY"],
                "highlighted_phrases": [{"text": "it's me", "tag": "IDENTITY"}]
            },
            {
                "speaker": "CALLER",
                "text": "My phone got broken and this is my friend's number. I am in an emergency and I need ₹25,000 immediately.",
                "timestamp": "00:08",
                "tags": ["URGENCY", "PAYMENT"],
                "highlighted_phrases": [
                    {"text": "phone got broken", "tag": "FEAR"},
                    {"text": "emergency", "tag": "URGENCY"},
                    {"text": "₹25,000 immediately", "tag": "PAYMENT"}
                ]
            },
            {
                "speaker": "CALLER",
                "text": "Please don't call anyone. Just transfer it to this number right now. I will explain everything later.",
                "timestamp": "00:22",
                "tags": ["ISOLATION", "URGENCY"],
                "highlighted_phrases": [
                    {"text": "don't call anyone", "tag": "ISOLATION"},
                    {"text": "right now", "tag": "URGENCY"}
                ]
            },
            {
                "speaker": "VICTIM",
                "text": "Are you okay? What happened?",
                "timestamp": "00:30",
                "tags": [],
                "highlighted_phrases": []
            },
            {
                "speaker": "CALLER",
                "text": "Mom please just send the money, I will call you back from a proper phone. Trust me, it is urgent.",
                "timestamp": "00:35",
                "tags": ["URGENCY", "PAYMENT"],
                "highlighted_phrases": [
                    {"text": "send the money", "tag": "PAYMENT"},
                    {"text": "urgent", "tag": "URGENCY"}
                ]
            }
        ],
        "timeline": [
            {"timestamp": "00:00", "seconds": 0, "event": "Call started", "severity": "info"},
            {"timestamp": "00:03", "seconds": 3, "event": "Family identity claimed (unverified)", "severity": "warning"},
            {"timestamp": "00:08", "seconds": 8, "event": "Emergency distress signal used", "severity": "warning"},
            {"timestamp": "00:15", "seconds": 15, "event": "Large payment demand (₹25,000)", "severity": "critical"},
            {"timestamp": "00:22", "seconds": 22, "event": "Isolation tactic detected", "severity": "critical"},
            {"timestamp": "00:35", "seconds": 35, "event": "Repeat payment pressure applied", "severity": "critical"},
            {"timestamp": "00:45", "seconds": 45, "event": "⚠ INTERVENTION TRIGGERED", "severity": "critical"},
        ]
    },

    "kyc-block": {
        "scenario_id": "kyc-block",
        "scenario_name": "KYC / Account Block Scam",
        "risk_score": 76,
        "risk_level": "HIGH",
        "current_stage": "CREDENTIAL_REQUEST",
        "scam_type": "KYC_FRAUD",
        "scam_dna": ["AUTHORITY", "URGENCY", "THREAT", "KYC_FRAUD", "MALICIOUS_LINK", "CREDENTIAL_REQUEST", "BANKING_REQUEST"],
        "time_to_harm_seconds": 120,
        "next_action": "Credential harvesting via phishing link",
        "next_action_confidence": 0.82,
        "manipulation_tactics": ["AUTHORITY", "URGENCY", "FEAR", "PRESSURE"],
        "detected_claims": [
            {"claim": "KYC has expired and must be renewed immediately", "status": "SUSPICIOUS"},
            {"claim": "Account suspension in 24 hours", "status": "UNVERIFIED"},
            {"claim": "Verification link is official bank link", "status": "FALSE"},
        ],
        "voice_signal": {"status": "SUSPICIOUS", "prototype_score": 0.55, "label": "Prototype signal · Not a real deepfake detector"},
        "reasons": [
            "KYC fraud pattern detected",
            "Account suspension threat issued",
            "Urgency pressure to click link immediately",
            "Suspicious link for credential collection",
            "Banking details explicitly requested",
        ],
        "recommended_action": [
            "Do NOT click any link sent during the call",
            "Do NOT provide banking credentials or account details",
            "Visit your bank's official website directly (type URL manually)",
            "Contact your bank through the number on the back of your card",
            "Report the suspicious call to your bank immediately",
        ],
        "transcript": [
            {
                "speaker": "CALLER",
                "text": "This is an automated message from your bank's KYC Compliance Department.",
                "timestamp": "00:00",
                "tags": ["IDENTITY"],
                "highlighted_phrases": [{"text": "KYC Compliance Department", "tag": "IDENTITY"}]
            },
            {
                "speaker": "CALLER",
                "text": "Your KYC verification has expired. If you do not verify your details immediately, your account will be suspended within 24 hours.",
                "timestamp": "00:07",
                "tags": ["THREAT", "URGENCY"],
                "highlighted_phrases": [
                    {"text": "KYC verification has expired", "tag": "FEAR"},
                    {"text": "account will be suspended", "tag": "THREAT"},
                    {"text": "within 24 hours", "tag": "URGENCY"}
                ]
            },
            {
                "speaker": "CALLER",
                "text": "Please open this secure link and provide your account number, registered mobile number, and net banking credentials to complete verification.",
                "timestamp": "00:20",
                "tags": ["LINK", "OTP"],
                "highlighted_phrases": [
                    {"text": "open this secure link", "tag": "LINK"},
                    {"text": "net banking credentials", "tag": "OTP"}
                ]
            },
            {
                "speaker": "CALLER",
                "text": "The link is: secure-bank-kyc-verify.net — please do this now to avoid suspension.",
                "timestamp": "00:35",
                "tags": ["LINK", "URGENCY"],
                "highlighted_phrases": [
                    {"text": "secure-bank-kyc-verify.net", "tag": "LINK"},
                    {"text": "do this now", "tag": "URGENCY"}
                ]
            }
        ],
        "timeline": [
            {"timestamp": "00:00", "seconds": 0, "event": "Call started", "severity": "info"},
            {"timestamp": "00:05", "seconds": 5, "event": "KYC authority claim made", "severity": "warning"},
            {"timestamp": "00:07", "seconds": 7, "event": "Account suspension threat issued", "severity": "danger"},
            {"timestamp": "00:20", "seconds": 20, "event": "Credential harvesting link sent", "severity": "critical"},
            {"timestamp": "00:35", "seconds": 35, "event": "Phishing domain detected", "severity": "critical"},
            {"timestamp": "00:40", "seconds": 40, "event": "⚠ INTERVENTION TRIGGERED", "severity": "critical"},
        ]
    },

    "legitimate-call": {
        "scenario_id": "legitimate-call",
        "scenario_name": "Safe / Legitimate Call",
        "risk_score": 8,
        "risk_level": "LOW",
        "current_stage": "SAFE",
        "scam_type": "NONE",
        "scam_dna": [],
        "time_to_harm_seconds": None,
        "next_action": "None detected",
        "next_action_confidence": 0.05,
        "manipulation_tactics": [],
        "detected_claims": [
            {"claim": "Customer support call regarding service request", "status": "VERIFIED"},
            {"claim": "No OTP or payment required", "status": "VERIFIED"},
        ],
        "voice_signal": {"status": "CLEAN", "prototype_score": 0.12, "label": "Prototype signal · Not a real deepfake detector"},
        "reasons": [
            "No impersonation patterns detected",
            "No urgency or threat language detected",
            "No sensitive information requested",
            "Caller explicitly stated no OTP/payment needed",
            "Caller provided verifiable case number",
        ],
        "recommended_action": [
            "Call appears legitimate — continue normally",
            "If unsure, verify case number on official website",
            "No immediate action required",
        ],
        "transcript": [
            {
                "speaker": "CALLER",
                "text": "Hello, this is the customer support team calling regarding your service request number SR-2024-8821.",
                "timestamp": "00:00",
                "tags": [],
                "highlighted_phrases": []
            },
            {
                "speaker": "CALLER",
                "text": "We are following up on your internet connectivity issue. No OTP, password, PIN, or payment is required from your end.",
                "timestamp": "00:10",
                "tags": ["SAFE"],
                "highlighted_phrases": [{"text": "No OTP, password, PIN, or payment is required", "tag": "SAFE"}]
            },
            {
                "speaker": "VICTIM",
                "text": "Yes, I did report that. Can I verify this call?",
                "timestamp": "00:22",
                "tags": [],
                "highlighted_phrases": []
            },
            {
                "speaker": "CALLER",
                "text": "Absolutely. You can verify this case number on our official website or call our helpline at the number printed on your bill.",
                "timestamp": "00:28",
                "tags": ["SAFE"],
                "highlighted_phrases": [{"text": "verify this case number on our official website", "tag": "SAFE"}]
            }
        ],
        "timeline": [
            {"timestamp": "00:00", "seconds": 0, "event": "Call started", "severity": "info"},
            {"timestamp": "00:05", "seconds": 5, "event": "Service request referenced", "severity": "safe"},
            {"timestamp": "00:10", "seconds": 10, "event": "No sensitive data requested (safe signal)", "severity": "safe"},
            {"timestamp": "00:22", "seconds": 22, "event": "Victim requests verification", "severity": "info"},
            {"timestamp": "00:28", "seconds": 28, "event": "Caller provides official verification path", "severity": "safe"},
            {"timestamp": "00:35", "seconds": 35, "event": "Call concluded — no threats detected", "severity": "safe"},
        ]
    },

    "investment-scam": {
        "scenario_id": "investment-scam",
        "scenario_name": "Investment / Stock Tip Scam",
        "risk_score": 74,
        "risk_level": "HIGH",
        "current_stage": "PAYMENT_REQUEST",
        "scam_type": "INVESTMENT_FRAUD",
        "scam_dna": ["AUTHORITY", "REWARD", "TRUST_BUILDING", "URGENCY", "PAYMENT_REQUEST", "UPI_REQUEST", "FINANCIAL_HARM"],
        "time_to_harm_seconds": 150,
        "next_action": "Immediate UPI payment transfer",
        "next_action_confidence": 0.84,
        "manipulation_tactics": ["AUTHORITY", "URGENCY", "REWARD", "PRESSURE"],
        "detected_claims": [
            {"claim": "Caller claims guaranteed 40% returns in 30 days", "status": "FALSE"},
            {"claim": "Limited-time exclusive investment slot", "status": "SUSPICIOUS"},
            {"claim": "Caller claims to be SEBI-registered advisor", "status": "UNVERIFIED"},
        ],
        "voice_signal": {"status": "SUSPICIOUS", "prototype_score": 0.58, "label": "Prototype signal · Not a real deepfake detector"},
        "reasons": [
            "Investment fraud pattern detected",
            "Guaranteed returns claim is a classic scam signal",
            "Urgency pressure to transfer immediately",
            "UPI payment requested within first contact",
            "Caller identity as SEBI advisor is unverified",
        ],
        "recommended_action": [
            "Do NOT transfer money based on a phone call alone",
            "Verify SEBI registration at sebi.gov.in",
            "No legitimate investment requires immediate UPI payment",
            "Consult a verified financial advisor independently",
            "Report this number to the cybercrime portal (cybercrime.gov.in)",
        ],
        "transcript": [
            {
                "speaker": "CALLER",
                "text": "Good morning! This is Rahul from Alpha Wealth Advisors, a SEBI-registered advisory firm.",
                "timestamp": "00:00",
                "tags": ["IDENTITY"],
                "highlighted_phrases": [{"text": "SEBI-registered advisory firm", "tag": "IDENTITY"}],
            },
            {
                "speaker": "CALLER",
                "text": "We have an exclusive stock portfolio that has given 40% returns in the last 30 days. This is a limited offer — only 5 slots left.",
                "timestamp": "00:08",
                "tags": ["URGENCY"],
                "highlighted_phrases": [
                    {"text": "40% returns in the last 30 days", "tag": "FEAR"},
                    {"text": "limited offer — only 5 slots left", "tag": "URGENCY"},
                ],
            },
            {
                "speaker": "VICTIM",
                "text": "That sounds interesting. Can you send me details in writing?",
                "timestamp": "00:22",
                "tags": [],
                "highlighted_phrases": [],
            },
            {
                "speaker": "CALLER",
                "text": "Sir, there is no time. The market closes in 2 hours and I need to place the order now. Please transfer ₹50,000 via UPI to secure your position.",
                "timestamp": "00:28",
                "tags": ["URGENCY", "PAYMENT"],
                "highlighted_phrases": [
                    {"text": "no time", "tag": "URGENCY"},
                    {"text": "transfer ₹50,000 via UPI", "tag": "PAYMENT"},
                ],
            },
            {
                "speaker": "CALLER",
                "text": "Our UPI ID is alphawealthfund@ybl. Transfer now and I will send you the portfolio confirmation immediately.",
                "timestamp": "00:42",
                "tags": ["PAYMENT"],
                "highlighted_phrases": [{"text": "alphawealthfund@ybl", "tag": "PAYMENT"}],
            },
        ],
        "timeline": [
            {"timestamp": "00:00", "seconds": 0, "event": "Call started", "severity": "info"},
            {"timestamp": "00:05", "seconds": 5, "event": "Authority claim (SEBI advisor)", "severity": "warning"},
            {"timestamp": "00:08", "seconds": 8, "event": "Guaranteed returns bait presented", "severity": "warning"},
            {"timestamp": "00:15", "seconds": 15, "event": "Artificial scarcity created (5 slots)", "severity": "danger"},
            {"timestamp": "00:28", "seconds": 28, "event": "Urgency + UPI payment demand", "severity": "critical"},
            {"timestamp": "00:42", "seconds": 42, "event": "Fake UPI ID shared", "severity": "critical"},
            {"timestamp": "00:50", "seconds": 50, "event": "⚠ INTERVENTION TRIGGERED", "severity": "critical"},
        ],
    },

    "remote-support": {
        "scenario_id": "remote-support",
        "scenario_name": "Remote Support Scam",
        "risk_score": 89,
        "risk_level": "CRITICAL",
        "current_stage": "SENSITIVE_INFO_REQUEST",
        "scam_type": "TECH_SUPPORT_SCAM",
        "scam_dna": ["TECH_SUPPORT_IMPERSONATION", "FEAR", "URGENCY", "THREAT", "REMOTE_ACCESS_REQUEST", "CREDENTIAL_REQUEST", "FINANCIAL_HARM"],
        "time_to_harm_seconds": 60,
        "next_action": "Remote device access + credential harvesting",
        "next_action_confidence": 0.80,
        "manipulation_tactics": ["FEAR", "URGENCY", "AUTHORITY", "IMPERSONATION"],
        "detected_claims": [
            {"claim": "Caller claims to be Microsoft tech support", "status": "UNVERIFIED"},
            {"claim": "Device is hacked and data is at risk", "status": "UNVERIFIED"},
            {"claim": "AnyDesk installation is required for official fix", "status": "FALSE"},
        ],
        "voice_signal": {"status": "HIGH_RISK", "prototype_score": 0.76, "label": "Prototype signal · Not a real deepfake detector"},
        "reasons": [
            "Tech support impersonation detected (Microsoft)",
            "Fear tactic: device hacked claim",
            "Remote access software installation requested",
            "Credential request expected after remote access",
            "Microsoft never calls users proactively for support",
        ],
        "recommended_action": [
            "Do NOT install AnyDesk, TeamViewer, or any remote access app",
            "Hang up immediately — Microsoft does not make unsolicited calls",
            "Do not share your screen or any passwords",
            "Run an antivirus scan independently after the call",
            "Report to cybercrime.gov.in",
        ],
        "transcript": [
            {
                "speaker": "CALLER",
                "text": "Hello, this is Alex from Microsoft Technical Support. We have detected a serious security breach on your Windows computer.",
                "timestamp": "00:00",
                "tags": ["IDENTITY"],
                "highlighted_phrases": [{"text": "Microsoft Technical Support", "tag": "IDENTITY"}],
            },
            {
                "speaker": "CALLER",
                "text": "Our systems show your IP address has been compromised and hackers are accessing your banking data right now.",
                "timestamp": "00:09",
                "tags": ["THREAT", "FEAR"],
                "highlighted_phrases": [
                    {"text": "compromised", "tag": "FEAR"},
                    {"text": "accessing your banking data right now", "tag": "THREAT"},
                ],
            },
            {
                "speaker": "VICTIM",
                "text": "Oh no! What should I do?",
                "timestamp": "00:18",
                "tags": [],
                "highlighted_phrases": [],
            },
            {
                "speaker": "CALLER",
                "text": "You need to act immediately. Please download AnyDesk from the link I will send you. This will allow our security team to remove the virus.",
                "timestamp": "00:22",
                "tags": ["URGENCY"],
                "highlighted_phrases": [
                    {"text": "act immediately", "tag": "URGENCY"},
                    {"text": "download AnyDesk", "tag": "LINK"},
                ],
            },
            {
                "speaker": "CALLER",
                "text": "Once connected, please do not close any windows. I will need to see your bank account to verify it has not been tampered with.",
                "timestamp": "00:38",
                "tags": ["OTP"],
                "highlighted_phrases": [{"text": "see your bank account", "tag": "OTP"}],
            },
        ],
        "timeline": [
            {"timestamp": "00:00", "seconds": 0, "event": "Call started", "severity": "info"},
            {"timestamp": "00:05", "seconds": 5, "event": "Microsoft identity claimed (unverified)", "severity": "warning"},
            {"timestamp": "00:09", "seconds": 9, "event": "Hacking / breach fear tactic deployed", "severity": "danger"},
            {"timestamp": "00:22", "seconds": 22, "event": "Remote access software requested", "severity": "critical"},
            {"timestamp": "00:38", "seconds": 38, "event": "Banking credential access demanded", "severity": "critical"},
            {"timestamp": "00:45", "seconds": 45, "event": "⚠ INTERVENTION TRIGGERED", "severity": "critical"},
        ],
    },
}

