"""
VoiceShield X — Pydantic Models / Schemas
"""
from __future__ import annotations
from typing import Optional, List, Literal
from pydantic import BaseModel


RiskLevel = Literal["CRITICAL", "HIGH", "MEDIUM", "LOW", "SAFE"]
AttackStage = Literal[
    "SAFE", "IDENTITY_CLAIM", "TRUST_BUILDING", "URGENCY", "THREAT",
    "SENSITIVE_INFO_REQUEST", "CREDENTIAL_REQUEST", "PAYMENT_REQUEST",
    "IMMINENT_HARM", "INTERVENTION"
]
VoiceStatus = Literal["CLEAN", "SUSPICIOUS", "HIGH_RISK", "UNKNOWN"]
ClaimStatus = Literal["UNVERIFIED", "FALSE", "VERIFIED", "SUSPICIOUS"]
Severity = Literal["info", "warning", "danger", "critical", "safe"]
Speaker = Literal["CALLER", "VICTIM", "SYSTEM"]


class HighlightedPhrase(BaseModel):
    text: str
    tag: str


class TranscriptSegment(BaseModel):
    speaker: Speaker
    text: str
    timestamp: str
    tags: List[str]
    highlighted_phrases: List[HighlightedPhrase]


class TimelineEvent(BaseModel):
    timestamp: str
    seconds: int
    event: str
    severity: Severity


class DetectedClaim(BaseModel):
    claim: str
    status: ClaimStatus


class VoiceSignal(BaseModel):
    status: VoiceStatus
    prototype_score: float
    label: str = "Prototype signal"


class AnalysisResult(BaseModel):
    scenario_id: str
    scenario_name: str
    risk_score: int
    risk_level: RiskLevel
    current_stage: AttackStage
    scam_type: str
    scam_dna: List[str]
    time_to_harm_seconds: Optional[int]
    next_action: str
    next_action_confidence: float
    manipulation_tactics: List[str]
    detected_claims: List[DetectedClaim]
    voice_signal: VoiceSignal
    reasons: List[str]
    recommended_action: List[str]
    transcript: List[TranscriptSegment]
    timeline: List[TimelineEvent]


class DemoScenario(BaseModel):
    id: str
    name: str
    description: str
    risk_level: RiskLevel
    scam_type: str
    sample_text: str


class AnalyzeRequest(BaseModel):
    text: str
    scenario_id: Optional[str] = None


class InterventionRequest(BaseModel):
    risk_level: RiskLevel
    stage: Optional[str] = None
