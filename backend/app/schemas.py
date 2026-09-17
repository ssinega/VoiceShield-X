from pydantic import BaseModel, Field
from typing import List

class Indicator(BaseModel):
    label: str
    evidence: str
    severity: str
    points: int

class AnalysisResponse(BaseModel):
    filename: str
    transcript: str
    risk_score: int = Field(ge=0, le=100)
    risk_level: str
    category: str
    indicators: List[Indicator]
    recommendations: List[str]
    disclaimer: str
