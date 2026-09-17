import { ShieldAlert, AlertTriangle, Shield } from 'lucide-react';
import type { RiskLevel } from '../types';

interface Props {
  level: RiskLevel;
  actions: string[];
  reasons: string[];
}

const LEVEL_CFG: Record<RiskLevel, {
  Icon: typeof Shield;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  border: string;
  pulseClass: string;
}> = {
  CRITICAL: {
    Icon: ShieldAlert,
    title: '🚨 CRITICAL THREAT — STOP NOW',
    subtitle: 'Scam detected. Do not share any information.',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.07)',
    border: 'rgba(239,68,68,0.5)',
    pulseClass: 'animate-intervention',
  },
  HIGH: {
    Icon: AlertTriangle,
    title: '⚠ HIGH RISK — Immediate Caution Required',
    subtitle: 'Suspicious patterns detected. Verify independently.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.4)',
    pulseClass: 'animate-amber-pulse',
  },
  MEDIUM: {
    Icon: AlertTriangle,
    title: '⚠ MEDIUM RISK — Proceed with Caution',
    subtitle: 'Some suspicious signals. Stay alert.',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.06)',
    border: 'rgba(234,179,8,0.3)',
    pulseClass: '',
  },
  LOW: {
    Icon: Shield,
    title: '✓ LOW RISK — Call Appears Legitimate',
    subtitle: 'No dangerous patterns detected.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.3)',
    pulseClass: '',
  },
  SAFE: {
    Icon: Shield,
    title: '✓ SAFE — No Threat Detected',
    subtitle: 'No scam indicators found.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.3)',
    pulseClass: '',
  },
};

export default function Intervention({ level, actions, reasons }: Props) {
  const cfg = LEVEL_CFG[level];
  const isCritical = level === 'CRITICAL';

  return (
    <div
      className={`rounded-2xl border p-6 ${cfg.pulseClass}`}
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      {/* Header row */}
      <div className="flex items-start gap-4 mb-5">
        {/* Icon block */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${cfg.color}15`,
            border: `1px solid ${cfg.color}40`,
            boxShadow: isCritical ? `0 0 20px ${cfg.color}40` : 'none',
          }}
        >
          <cfg.Icon
            className={`w-6 h-6 ${isCritical ? 'animate-pulse' : ''}`}
            style={{ color: cfg.color }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="font-black text-lg leading-tight"
            style={{ color: cfg.color, textShadow: isCritical ? `0 0 12px ${cfg.color}60` : 'none' }}
          >
            {cfg.title}
          </h3>
          <p className="text-gray-400 text-sm mt-0.5">{cfg.subtitle}</p>
        </div>
      </div>

      {/* Two-column layout for actions + reasons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Actions */}
        <div>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: `${cfg.color}90` }}
          >
            Recommended Actions
          </p>
          <div className="space-y-2">
            {actions.map((action, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black"
                  style={{
                    background: `${cfg.color}20`,
                    color: cfg.color,
                    border: `1px solid ${cfg.color}40`,
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-white text-sm leading-snug">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detection reasons */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-gray-500">
            Detection Reasons
          </p>
          <div className="space-y-2">
            {reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2">
                <span style={{ color: cfg.color }} className="flex-shrink-0 font-bold text-sm">✓</span>
                <p className="text-gray-300 text-sm leading-snug">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separator + disclaimer */}
      <div className="mt-5 pt-4 border-t" style={{ borderColor: `${cfg.color}18` }}>
        <p className="text-xs text-gray-600">
          VoiceShield X Intervention Engine ·{' '}
          <span className="text-gray-700">Hackathon prototype — not a substitute for professional advice</span>
        </p>
      </div>
    </div>
  );
}
