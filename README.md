# VoiceShield X

> **Predict the Scam. Stop the Harm.**

AI-powered conversational fraud defense platform for real-time voice call analysis.

[![Hackathon Prototype](https://img.shields.io/badge/status-hackathon%20prototype-orange)](.)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688)](.)
[![React](https://img.shields.io/badge/frontend-React%20+%20Vite-61dafb)](.)

---

## Problem Statement

Voice fraud (vishing) causes billions in annual losses. Victims are manipulated through:
- **Authority impersonation** (bank, police, government)
- **Urgency and fear tactics** (account blocking, legal threats)
- **OTP and credential theft**
- **Emergency money transfer scams**

Existing solutions only answer: *"Is this a scam?"*

**VoiceShield X answers 7 deeper questions in real time.**

---

## Core Innovation

| Question | VoiceShield X Answer |
|----------|---------------------|
| What scam pattern is occurring? | **Scam DNA extraction** |
| What stage of the attack are we in? | **Attack Stage state machine** |
| What manipulation techniques are used? | **Tactic analysis** |
| What action is the attacker triggering? | **Sensitive action detection** |
| How close is the victim to harm? | **Time-to-Harm estimation** |
| What will the attacker request next? | **Next-Action Prediction** |
| What intervention is recommended? | **Intervention Engine** |

---

## Architecture

```
frontend/ (React + Vite + TypeScript + Tailwind)
    └── src/
        ├── components/     # Dashboard UI components
        ├── pages/          # Landing + Analysis pages
        ├── services/api.ts # Backend calls + fallback data
        └── types/          # TypeScript interfaces

backend/ (Python + FastAPI)
    └── app/
        ├── main.py         # FastAPI routes
        ├── engines/
        │   ├── scam_dna.py        # Behavioral pattern extraction
        │   ├── attack_stage.py    # State machine
        │   ├── time_to_harm.py    # Harm estimation
        │   ├── next_action.py     # Action prediction
        │   ├── intervention.py    # Intervention generator
        │   └── voice_signal.py    # Voice authenticity (prototype)
        ├── services/analyzer.py   # Pipeline orchestrator
        └── data/scenarios.py      # 4 deterministic demo fixtures
```

**Pipeline:**
```
Call Audio / Transcript
        ↓
Scam DNA Extraction
        ↓
Attack Stage Detection
        ↓
Time-to-Harm Estimation
        ↓
Next-Action Prediction
        ↓
Intervention Engine
        ↓
Explainable Security Dashboard
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Python, FastAPI, Pydantic |
| Storage | In-memory fixtures (JSON-compatible) |
| ML | Deterministic rule engine (prototype) |

---

## Setup Instructions

### Prerequisites
- Node.js 18+  (no Python, no backend required)

### Run (2 commands)

```powershell
# Open PowerShell as Administrator in the frontend folder
cd "c:\Users\Admin\Downloads\technova\frontend"
npm install
npm run dev
```

Then open **http://localhost:5173**

> ✅ No backend needed. No API keys. No internet. Everything runs locally in the browser.

### Access
- **App:** http://localhost:5173
- Backend is optional — the app works 100% without it

---

## Demo Instructions

### Recommended Demo Flow (30 seconds)

1. Open **http://localhost:5173**
2. Click **"Run Live Scam Simulation"**
3. Watch the analysis animation (8 steps, ~20 seconds)
4. Review the dashboard:
   - Risk Score: 92/100 CRITICAL
   - Scam DNA chain
   - Time-to-Harm: 00:47
   - Next Action: UPI payment authorization
   - Intervention card
   - Transcript with highlighted threat phrases
   - Timeline of events

### Fast Demo Mode (5 seconds)
Click **"Fast Demo (5s)"** for quick judge demonstrations.

### Try All 4 Scenarios
Use the **Scenarios** dropdown to switch between:
- Bank OTP Scam (CRITICAL)
- Family Emergency Scam (CRITICAL)
- KYC / Account Block Scam (HIGH)
- Safe / Legitimate Call (LOW)

---

## API Documentation

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/demo-scenarios` | List all 4 demo scenarios |
| GET | `/api/scenario/{id}` | Full analysis for a scenario |
| POST | `/api/analyze` | Analyze free-form transcript text |
| POST | `/api/analyze-transcript` | Alias for analyze |
| POST | `/api/intervention` | Get intervention for risk level |

### Example Request
```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "I am calling from bank security. Share your OTP immediately or account will be blocked."}'
```

### Example Response
```json
{
  "risk_score": 88,
  "risk_level": "CRITICAL",
  "current_stage": "CREDENTIAL_REQUEST",
  "scam_type": "BANK_IMPERSONATION",
  "scam_dna": ["BANK_IMPERSONATION", "AUTHORITY", "URGENCY", "THREAT", "OTP_REQUEST"],
  "time_to_harm_seconds": 47,
  "next_action": "UPI / Payment authorization request",
  "next_action_confidence": 0.87,
  "manipulation_tactics": ["AUTHORITY", "URGENCY", "PRESSURE"],
  "voice_signal": {"status": "SUSPICIOUS", "prototype_score": 0.71, "label": "Prototype signal"},
  "reasons": ["Bank impersonation detected", "OTP request detected", "Urgency pressure detected"],
  "recommended_action": ["Do NOT share OTP", "End the call", "Verify via official channel"]
}
```

---

## Scam DNA Explanation

**Scam DNA** represents the behavioral structure of a scam — not keyword matching.

It captures the *sequence of manipulation techniques* an attacker uses:

```
BANK_IMPERSONATION
        ↓
AUTHORITY
        ↓
FEAR
        ↓
URGENCY
        ↓
THREAT
        ↓
OTP_REQUEST
        ↓
PAYMENT_REQUEST
        ↓
⚠ FINANCIAL HARM
```

Each node represents a behavioral element. The combination and sequence of nodes 
uniquely identifies the scam type — like a DNA fingerprint.

**DNA Nodes:**
- Impersonation: `BANK_IMPERSONATION`, `FAMILY_IMPERSONATION`, `GOVT_IMPERSONATION`
- Pressure: `AUTHORITY`, `URGENCY`, `FEAR`, `THREAT`, `ISOLATION`
- Actions: `OTP_REQUEST`, `PAYMENT_REQUEST`, `UPI_REQUEST`, `CREDENTIAL_REQUEST`
- Delivery: `MALICIOUS_LINK`, `REMOTE_ACCESS_REQUEST`

---

## Time-to-Harm Explanation

**Time-to-Harm** estimates seconds until an irreversible or high-impact financial action occurs.

> ⚠️ This is a **prototype estimate** based on deterministic rules. It is NOT a scientifically validated prediction and has not been measured on real call datasets.

**Stage-based estimates:**

| Stage | Estimated Time |
|-------|---------------|
| SAFE | N/A |
| Identity Claim | > 5 minutes |
| Trust Building | ~5 minutes |
| Urgency | ~3 minutes |
| Threat | ~2 minutes |
| Credential Request | ~47 seconds |
| Payment Request | ~30 seconds |
| Imminent Harm | ~10 seconds |

---

## Next-Action Prediction Explanation

**Next-Action Prediction** infers the most likely next harmful step the attacker will take.

> ⚠️ This is a **demo confidence** based on rule matching. Not a measured accuracy metric.

Based on the current attack stage and Scam DNA, the engine predicts:
- Bank impersonation + OTP request → UPI payment authorization
- Family emergency + payment request → Immediate money transfer  
- KYC fraud + malicious link → Credential harvesting

---

## Intervention Engine

Risk-based intervention recommendations:

| Level | Response |
|-------|----------|
| **CRITICAL** | 🚨 STOP — hang up, do not share OTP/payment, verify via official channel |
| **HIGH** | ⚠ Do not provide credentials, verify caller independently |
| **MEDIUM** | Be cautious, verify before proceeding |
| **LOW** | Continue normally, no dangerous request detected |

---

## Prototype Limitations

This is a **hackathon prototype** with the following limitations:

1. **No real audio processing** — works on transcripts only
2. **Rule-based DNA extraction** — not an NLP model (future: transformer-based intent classifier)
3. **Simulated voice authenticity** — no real deepfake detection (future: ASVspoof/Wav2Vec2)
4. **No training dataset** — all scores are illustrative estimates
5. **English-only** — no multilingual support (future roadmap)
6. **No real-time telephony** — no actual call interception
7. **No persistent storage** — analysis is stateless

---

## Future Integrations

### Real Deepfake Detection
- **ASVspoof** anti-spoofing models
- **Wav2Vec2** for speaker verification
- **RawNet2** for synthetic voice detection

### Multilingual Support
- **Whisper** for multilingual transcription
- **Indic language models** for Hindi, Tamil, Bengali, etc.

### Production Features
- Real-time call monitoring via telephony APIs
- Banking system integration (with proper authorization)
- Longitudinal scam pattern database
- Cross-call attacker fingerprinting

---

## Honesty / Research Safety

> All risk scores, Time-to-Harm estimates, and confidence values in this prototype are **illustrative and have not been measured on real-world datasets**.

Labels used:
- "Prototype signal" — voice authenticity
- "Demo confidence" — prediction confidence  
- "Illustrative risk score" — risk score
- "Estimated Time-to-Harm" — time estimates

This system is a hackathon proof of concept. It is **not for production, medical, legal, or financial use**.

---

*Built for hackathon demonstration · VoiceShield X v1.0*
