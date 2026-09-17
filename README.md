# VoiceShield-X

AI-powered voice scam detection and risk analysis prototype.

## Features

- Voice upload and browser microphone recording
- Audio preprocessing and speech transcription
- Suspicious phrase detection
- Risk scoring with explainable signals
- Scam category classification
- Results dashboard with transcript, score, indicators and recommendations
- REST API using FastAPI
- React + Vite frontend

## Project structure

```text
VoiceShield-X/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   ├── services/
│   │   │   ├── analyzer.py
│   │   │   ├── rules.py
│   │   │   └── transcriber.py
│   │   └── __init__.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Run backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Optional transcription

The prototype works without external AI credentials by using a deterministic demo transcription fallback. To use OpenAI transcription, set `OPENAI_API_KEY` in `backend/.env` and install the OpenAI package listed in requirements.

## Important

VoiceShield-X is a decision-support prototype. It should not be treated as proof that a call is fraudulent. Always verify important claims independently.