import { useEffect, useState } from 'react';
import type { RiskLevel } from '../types';

interface Props {
  score: number;
  level: RiskLevel;
  animate?: boolean;
  reasons?: string[];
}

const LEVEL_CFG: Record<RiskLevel, { color: string; glow: string; trackGlow: string; bg: string; label: string }> = {
  CRITICAL: { color: '#ef4444', glow: 'rgba(239,68,68,0.7)',  trackGlow: 'rgba(239,68,68,0.15)', bg: 'rgba(239,68,68,0.10)', label: 'CRITICAL THREAT' },
  HIGH:     { color: '#f59e0b', glow: 'rgba(245,158,11,0.7)', trackGlow: 'rgba(245,158,11,0.12)', bg: 'rgba(245,158,11,0.10)', label: 'HIGH RISK' },
  MEDIUM:   { color: '#eab308', glow: 'rgba(234,179,8,0.6)',  trackGlow: 'rgba(234,179,8,0.08)',  bg: 'rgba(234,179,8,0.08)',  label: 'MEDIUM RISK' },
  LOW:      { color: '#10b981', glow: 'rgba(16,185,129,0.6)', trackGlow: 'rgba(16,185,129,0.08)', bg: 'rgba(16,185,129,0.08)', label: 'LOW RISK' },
  SAFE:     { color: '#10b981', glow: 'rgba(16,185,129,0.6)', trackGlow: 'rgba(16,185,129,0.08)', bg: 'rgba(16,185,129,0.08)', label: 'SAFE' },
};

export default function RiskScore({ score, level, animate, reasons }: Props) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const [scanDone, setScanDone] = useState(false);
  const cfg = LEVEL_CFG[level];

  useEffect(() => {
    setScanDone(false);
    if (!animate) { setDisplayScore(score); setScanDone(true); return; }
    let current = 0;
    const step = score / 50;
    const timer = setInterval(() => {
      current = Math.min(current + step, score);
      setDisplayScore(Math.round(current));
      if (current >= score) { clearInterval(timer); setScanDone(true); }
    }, 25);
    return () => clearInterval(timer);
  }, [score, animate]);

  const R = 88;
  const circ = 2 * Math.PI * R;
  const offset = circ - (displayScore / 100) * circ;
  const isCrit = level === 'CRITICAL';

  return (
    <div
      className={`glass-card p-6 flex flex-col items-center relative overflow-hidden ${isCrit ? 'animate-critical-ring' : ''}`}
      style={isCrit ? { background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.3)' } : {}}
    >
      {/* Scanline sweep when animation completes */}
      {scanDone && animate && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-[14px]"
          style={{ zIndex: 1 }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-60"
            style={{
              background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
              animation: 'sweepH 0.8s ease-out forwards',
            }}
          />
        </div>
      )}

      <p className="section-title w-full text-center">Overall Risk Score</p>

      {/* SVG Gauge */}
      <div className="relative" style={{ width: 210, height: 210 }}>
        <svg width="210" height="210" viewBox="0 0 210 210">
          {/* Outer subtle ring */}
          <circle cx="105" cy="105" r="100" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          {/* Track */}
          <circle cx="105" cy="105" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
          {/* Progress arc */}
          <circle
            cx="105" cy="105" r={R}
            fill="none"
            stroke={cfg.color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 105 105)"
            style={{
              transition: 'stroke-dashoffset 0.25s ease',
              filter: `drop-shadow(0 0 10px ${cfg.glow})`,
            }}
          />
          {/* Tick marks */}
          {Array.from({ length: 24 }, (_, i) => {
            const angle = (i / 24) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % 6 === 0;
            const inner = isMajor ? 70 : 74, outer = isMajor ? 78 : 77;
            return (
              <line key={i}
                x1={105 + inner * Math.cos(rad)} y1={105 + inner * Math.sin(rad)}
                x2={105 + outer * Math.cos(rad)} y2={105 + outer * Math.sin(rad)}
                stroke={isMajor ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}
                strokeWidth={isMajor ? 1.5 : 1}
              />
            );
          })}
        </svg>

        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono font-black leading-none"
            style={{ fontSize: '3.8rem', color: cfg.color, textShadow: `0 0 30px ${cfg.glow}` }}
          >
            {displayScore}
          </span>
          <span className="text-gray-600 text-xs font-mono mt-1">/ 100</span>
        </div>
      </div>

      {/* Level badge */}
      <div
        className="mt-3 px-6 py-2 rounded-full border font-bold text-sm tracking-widest font-mono"
        style={{
          color: cfg.color,
          borderColor: `${cfg.color}55`,
          background: cfg.bg,
          boxShadow: isCrit ? `0 0 24px ${cfg.trackGlow}` : 'none',
        }}
      >
        {cfg.label}
      </div>

      {/* Explainability — Pillar 6 */}
      {reasons && reasons.length > 0 && (
        <div className="mt-4 w-full border-t border-white/5 pt-3 space-y-1.5">
          <p className="section-title mb-2">Detection Signals</p>
          {reasons.slice(0, 4).map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span style={{ color: cfg.color }} className="flex-shrink-0 font-bold">›</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
