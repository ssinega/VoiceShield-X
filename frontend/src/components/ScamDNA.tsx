import type { ScamDNANode } from '../types';
import { ShieldCheck } from 'lucide-react';

interface Props {
  nodes: ScamDNANode[];
  animate?: boolean;
}

const NODE_CFG: Record<string, { label: string; color: string; border: string; bg: string; category: string }> = {
  BANK_IMPERSONATION:          { label: 'Bank Impersonation',     color: '#a78bfa', border: 'rgba(167,139,250,0.45)', bg: 'rgba(167,139,250,0.10)', category: 'IDENTITY' },
  GOVT_IMPERSONATION:          { label: 'Govt Impersonation',     color: '#a78bfa', border: 'rgba(167,139,250,0.45)', bg: 'rgba(167,139,250,0.10)', category: 'IDENTITY' },
  FAMILY_IMPERSONATION:        { label: 'Family Impersonation',   color: '#a78bfa', border: 'rgba(167,139,250,0.45)', bg: 'rgba(167,139,250,0.10)', category: 'IDENTITY' },
  TECH_SUPPORT_IMPERSONATION:  { label: 'Tech Support Scam',      color: '#a78bfa', border: 'rgba(167,139,250,0.45)', bg: 'rgba(167,139,250,0.10)', category: 'IDENTITY' },
  IDENTITY_CLAIM:              { label: 'Identity Claim',         color: '#a78bfa', border: 'rgba(167,139,250,0.45)', bg: 'rgba(167,139,250,0.10)', category: 'IDENTITY' },
  AUTHORITY:                   { label: 'Authority',              color: '#60a5fa', border: 'rgba(96,165,250,0.45)',  bg: 'rgba(96,165,250,0.10)',  category: 'PRESSURE' },
  TRUST_BUILDING:              { label: 'Trust Building',         color: '#34d399', border: 'rgba(52,211,153,0.45)', bg: 'rgba(52,211,153,0.10)', category: 'PRESSURE' },
  URGENCY:                     { label: 'Urgency',                color: '#f59e0b', border: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.10)', category: 'PRESSURE' },
  FEAR:                        { label: 'Fear',                   color: '#f97316', border: 'rgba(249,115,22,0.45)', bg: 'rgba(249,115,22,0.10)', category: 'PRESSURE' },
  THREAT:                      { label: 'Threat',                 color: '#ef4444', border: 'rgba(239,68,68,0.45)',  bg: 'rgba(239,68,68,0.10)',  category: 'PRESSURE' },
  ISOLATION:                   { label: 'Isolation',              color: '#ec4899', border: 'rgba(236,72,153,0.45)', bg: 'rgba(236,72,153,0.10)', category: 'PRESSURE' },
  EMOTIONAL_MANIPULATION:      { label: 'Emotional',              color: '#ec4899', border: 'rgba(236,72,153,0.45)', bg: 'rgba(236,72,153,0.10)', category: 'PRESSURE' },
  OTP_REQUEST:                 { label: 'OTP Request',            color: '#f43f5e', border: 'rgba(244,63,94,0.50)',  bg: 'rgba(244,63,94,0.12)',  category: 'EXTRACT' },
  CREDENTIAL_REQUEST:          { label: 'Credentials',            color: '#f43f5e', border: 'rgba(244,63,94,0.50)',  bg: 'rgba(244,63,94,0.12)',  category: 'EXTRACT' },
  PAYMENT_REQUEST:             { label: 'Payment',                color: '#dc2626', border: 'rgba(220,38,38,0.55)',  bg: 'rgba(220,38,38,0.12)',  category: 'EXTRACT' },
  UPI_REQUEST:                 { label: 'UPI Transfer',           color: '#dc2626', border: 'rgba(220,38,38,0.55)',  bg: 'rgba(220,38,38,0.12)',  category: 'EXTRACT' },
  BANKING_REQUEST:             { label: 'Banking Data',           color: '#dc2626', border: 'rgba(220,38,38,0.55)',  bg: 'rgba(220,38,38,0.12)',  category: 'EXTRACT' },
  MALICIOUS_LINK:              { label: 'Malicious Link',         color: '#dc2626', border: 'rgba(220,38,38,0.55)',  bg: 'rgba(220,38,38,0.12)',  category: 'EXTRACT' },
  REMOTE_ACCESS_REQUEST:       { label: 'Remote Access',          color: '#dc2626', border: 'rgba(220,38,38,0.55)',  bg: 'rgba(220,38,38,0.12)',  category: 'EXTRACT' },
  KYC_FRAUD:                   { label: 'KYC Fraud',              color: '#f59e0b', border: 'rgba(245,158,11,0.45)', bg: 'rgba(245,158,11,0.10)', category: 'IDENTITY' },
  REWARD:                      { label: 'Reward Bait',            color: '#10b981', border: 'rgba(16,185,129,0.45)', bg: 'rgba(16,185,129,0.10)', category: 'PRESSURE' },
  FINANCIAL_HARM:              { label: '⚠ Financial Harm',       color: '#ef4444', border: 'rgba(239,68,68,0.70)',  bg: 'rgba(239,68,68,0.18)',  category: 'HARM' },
};

const CAT_LABEL: Record<string, string> = {
  IDENTITY: 'Identity',
  PRESSURE: 'Manipulation',
  EXTRACT:  'Extraction',
  HARM:     'Outcome',
};

export default function ScamDNA({ nodes, animate }: Props) {
  if (nodes.length === 0) {
    return (
      <div className="glass-card p-6 flex flex-col">
        <p className="section-title">Scam DNA</p>
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-emerald-400">
          <ShieldCheck className="w-10 h-10 mb-3 text-emerald-400/60" />
          <p className="font-semibold">No Scam DNA Detected</p>
          <p className="text-gray-500 text-sm mt-1">No malicious behavioral pattern identified</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 flex flex-col">
      <p className="section-title">Scam DNA</p>
      <p className="text-gray-500 text-xs mb-4">
        Behavioral attack pattern chain · <span className="text-cyan-400/70">{nodes.length} nodes detected</span>
      </p>

      <div className="flex-1 overflow-y-auto scrollbar-thin pr-1" style={{ maxHeight: 380 }}>
        {nodes.map((node, i) => {
          const cfg = NODE_CFG[node] || { label: node, color: '#9ca3af', border: 'rgba(156,163,175,0.4)', bg: 'rgba(156,163,175,0.08)', category: 'OTHER' };
          const isLast = i === nodes.length - 1;
          const isHarm = node === 'FINANCIAL_HARM';
          const nextCfg = !isLast ? (NODE_CFG[nodes[i + 1]] || { color: '#9ca3af' }) : null;

          return (
            <div
              key={`${node}-${i}`}
              className="flex flex-col items-start animate-fade-in-up"
              style={{
                animationDelay: animate ? `${i * 90}ms` : '0ms',
                opacity: animate ? 0 : 1,
                animationFillMode: 'forwards',
              }}
            >
              {/* Category micro-label */}
              {(i === 0 || NODE_CFG[nodes[i]]?.category !== NODE_CFG[nodes[i - 1]]?.category) && (
                <span className="text-gray-700 text-xs font-mono mb-1 ml-1">
                  ── {CAT_LABEL[cfg.category] || cfg.category}
                </span>
              )}

              {/* Node pill */}
              <div
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg border font-mono text-xs font-bold tracking-wide transition-all duration-200 hover:scale-[1.02] cursor-default w-full"
                style={{
                  color:       cfg.color,
                  borderColor: cfg.border,
                  background:  cfg.bg,
                  boxShadow:   isHarm ? `0 0 18px ${cfg.border}, 0 0 6px ${cfg.border}` : 'none',
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${isHarm ? 'animate-pulse' : ''}`}
                  style={{ backgroundColor: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }}
                />
                <span className="flex-1">{cfg.label}</span>
                <span className="text-gray-700 text-xs font-normal ml-auto">{String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex items-center ml-3 my-0.5 gap-1">
                  <div
                    className="w-0.5 h-5 rounded-full"
                    style={{
                      background: `linear-gradient(to bottom, ${cfg.color}70, ${nextCfg?.color ?? '#9ca3af'}50)`,
                    }}
                  />
                  <span className="text-gray-700 text-xs leading-none">↓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-gray-700 text-xs italic mt-4 pt-3 border-t border-white/5">
        DNA = behavioral structure, not keyword match
      </p>
    </div>
  );
}
