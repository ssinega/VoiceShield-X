// =============================================
// VoiceShield AI — TypeScript Type Definitions
// =============================================

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';

export type AttackStage =
  | 'SAFE'
  | 'IDENTITY_CLAIM'
  | 'TRUST_BUILDING'
  | 'URGENCY'
  | 'THREAT'
  | 'SENSITIVE_INFO_REQUEST'
  | 'CREDENTIAL_REQUEST'
  | 'PAYMENT_REQUEST'
  | 'IMMINENT_HARM'
  | 'INTERVENTION';

export type ScamDNANode =
  | 'BANK_IMPERSONATION'
  | 'GOVT_IMPERSONATION'
  | 'FAMILY_IMPERSONATION'
  | 'TECH_SUPPORT_IMPERSONATION'
  | 'AUTHORITY'
  | 'TRUST_BUILDING'
  | 'URGENCY'
  | 'FEAR'
  | 'THREAT'
  | 'ISOLATION'
  | 'REWARD'
  | 'EMOTIONAL_MANIPULATION'
  | 'CREDENTIAL_REQUEST'
  | 'OTP_REQUEST'
  | 'PAYMENT_REQUEST'
  | 'UPI_REQUEST'
  | 'BANKING_REQUEST'
  | 'MALICIOUS_LINK'
  | 'REMOTE_ACCESS_REQUEST'
  | 'FINANCIAL_HARM'
  | 'KYC_FRAUD'
  | 'IDENTITY_CLAIM';

export type ManipulationTactic =
  | 'AUTHORITY'
  | 'URGENCY'
  | 'FEAR'
  | 'PRESSURE'
  | 'ISOLATION'
  | 'REWARD'
  | 'EMOTIONAL'
  | 'IMPERSONATION'
  | 'TRUST';

export interface VoiceSignal {
  status: 'CLEAN' | 'SUSPICIOUS' | 'HIGH_RISK' | 'UNKNOWN';
  prototype_score: number;
  label: string;
}

export interface TranscriptSegment {
  speaker: 'CALLER' | 'VICTIM' | 'SYSTEM';
  text: string;
  timestamp: string;
  tags: string[];
  highlighted_phrases: HighlightedPhrase[];
}

export interface HighlightedPhrase {
  text: string;
  tag: 'IDENTITY' | 'THREAT' | 'URGENCY' | 'OTP' | 'PAYMENT' | 'SAFE' | 'ISOLATION' | 'FEAR' | 'LINK';
}

export interface TimelineEvent {
  timestamp: string;
  seconds: number;
  event: string;
  severity: 'info' | 'warning' | 'danger' | 'critical' | 'safe';
}

export interface DetectedClaim {
  claim: string;
  status: 'UNVERIFIED' | 'FALSE' | 'VERIFIED' | 'SUSPICIOUS';
}

export interface AnalysisResult {
  scenario_id: string;
  scenario_name: string;
  risk_score: number;
  risk_level: RiskLevel;
  current_stage: AttackStage;
  scam_type: string;
  scam_dna: ScamDNANode[];
  time_to_harm_seconds: number | null;
  next_action: string;
  next_action_confidence: number;
  manipulation_tactics: ManipulationTactic[];
  detected_claims: DetectedClaim[];
  voice_signal: VoiceSignal;
  reasons: string[];
  recommended_action: string[];
  transcript: TranscriptSegment[];
  timeline: TimelineEvent[];
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  risk_level: RiskLevel;
  scam_type: string;
  sample_text: string;
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'animating' | 'complete' | 'error';
  currentStep: number;
  totalSteps: number;
  stepLabel: string;
  result: AnalysisResult | null;
  error: string | null;
}
