import type { ManipulationTactic, DetectedClaim } from '../types';

interface ManipulationProps {
  tactics: ManipulationTactic[];
}

const TACTIC_CONFIG: Record<ManipulationTactic, { label: string; color: string; bg: string; border: string }> = {
  AUTHORITY: { label: 'Authority', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
  URGENCY:   { label: 'Urgency', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  FEAR:      { label: 'Fear', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
  PRESSURE:  { label: 'Pressure', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  ISOLATION: { label: 'Isolation', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', border: 'rgba(236,72,153,0.3)' },
  REWARD:    { label: 'Reward Bait', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  EMOTIONAL: { label: 'Emotional', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
  IMPERSONATION: { label: 'Impersonation', color: '#fb7185', bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.3)' },
  TRUST:     { label: 'Trust Exploit', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
};

export function ManipulationTactics({ tactics }: ManipulationProps) {
  if (tactics.length === 0) {
    return (
      <div className="glass-card p-6">
        <p className="section-title">Manipulation Tactics</p>
        <p className="text-emerald-400 text-sm">✓ No manipulation tactics detected</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <p className="section-title">Manipulation Tactics</p>
      <p className="text-gray-500 text-xs mb-4">Psychological manipulation techniques detected in conversation</p>
      <div className="flex flex-wrap gap-2">
        {tactics.map(t => {
          const cfg = TACTIC_CONFIG[t];
          return (
            <div
              key={t}
              className="px-3 py-2 rounded-lg border text-sm font-semibold"
              style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
            >
              {cfg.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ClaimsProps {
  claims: DetectedClaim[];
}

const CLAIM_STATUS = {
  UNVERIFIED: { label: 'UNVERIFIED', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  FALSE:      { label: 'FALSE', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  VERIFIED:   { label: 'VERIFIED', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
  SUSPICIOUS: { label: 'SUSPICIOUS', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)' },
};

export function DetectedClaims({ claims }: ClaimsProps) {
  return (
    <div className="glass-card p-6">
      <p className="section-title">Detected Claims</p>
      <p className="text-gray-500 text-xs mb-4">Statements made by caller and their verification status</p>
      <div className="space-y-3">
        {claims.map((c, i) => {
          const cfg = CLAIM_STATUS[c.status];
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/5">
              <div
                className="px-2 py-1 rounded text-xs font-bold flex-shrink-0 border"
                style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
              >
                {cfg.label}
              </div>
              <p className="text-gray-300 text-sm">{c.claim}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
