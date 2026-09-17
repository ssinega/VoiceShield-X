"""
VoiceShield X — FastAPI Main Application
"""
from __future__ import annotations
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models.schemas import AnalyzeRequest, InterventionRequest
from app.data.scenarios import DEMO_SCENARIOS, SCENARIO_ANALYSIS
from app.services.analyzer import analyze_text
from app.engines.intervention import get_intervention

app = FastAPI(
    title="VoiceShield X API",
    description="AI-powered conversational fraud defense — hackathon prototype",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "VoiceShield X", "version": "1.0.0"}


@app.get("/api/demo-scenarios")
def get_demo_scenarios():
    """Return list of all available demo scenarios."""
    return DEMO_SCENARIOS


@app.get("/api/scenario/{scenario_id}")
def get_scenario(scenario_id: str):
    """Return full pre-computed analysis for a demo scenario."""
    if scenario_id not in SCENARIO_ANALYSIS:
        raise HTTPException(
            status_code=404,
            detail=f"Scenario '{scenario_id}' not found. Available: {list(SCENARIO_ANALYSIS.keys())}"
        )
    return SCENARIO_ANALYSIS[scenario_id]


@app.post("/api/analyze")
def analyze(request: AnalyzeRequest):
    """
    Analyze a conversation transcript text.
    Returns structured fraud intelligence JSON.
    
    Note: For demo scenarios, use /api/scenario/{id} for richer results.
    """
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Text is required")

    # Check if text matches a demo scenario sample
    if request.scenario_id and request.scenario_id in SCENARIO_ANALYSIS:
        return SCENARIO_ANALYSIS[request.scenario_id]

    return analyze_text(request.text, request.scenario_id or "custom")


@app.post("/api/analyze-transcript")
def analyze_transcript(request: AnalyzeRequest):
    """Alias for /api/analyze."""
    return analyze(request)


@app.post("/api/intervention")
def get_intervention_rec(request: InterventionRequest):
    """Get intervention recommendations for a given risk level."""
    result = get_intervention(request.risk_level, request.stage or "SAFE", [], [])
    return {
        "risk_level": request.risk_level,
        "actions": result["actions"],
        "reasons": result["reasons"],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
