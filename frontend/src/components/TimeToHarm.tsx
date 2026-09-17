import { useEffect, useState } from 'react';
import { Clock, AlertTriangle, ShieldAlert } from 'lucide-react';
import type { RiskLevel } from '../types';

interface Props {
  seconds: number | null;
  level: RiskLevel;
  animate?: boolean;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export default function TimeToHarm({ seconds, level, animate }: Props) {
  const [display, setDisplay] = useState(seconds);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    setDisplay(seconds);
    setCounting(animate === true && seconds !== null && seconds > 0);
  }, [seconds, animate]);

  useEffect(() => {
    if (!counting) return;
    if (display === null || display <= 0) { setCounting(false); return; }
    const t = setTimeout(() => setDisplay(d => (d !== null && d > 0 ? d - 1 : d)), 1000);
    return () => clearTimeout(t);
  }, [counting, display]);

  const isCrit  = level === 'CRITICAL';
  const isHigh  = level === 'HIGH';
  const isUrgent = display !== null && display <= 30 && display > 0;

  const color  = isCrit ? '#ef4444' : isHigh ? '#f59e0b' : '#00d4ff';
  const glow   = isCrit ? 'rgba(239,68,68,0.5)' : isHigh ? 'rgba(245,158,11,0.4)' : 'rgba(0,212,255,0.4)';

  if (seconds === null) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
        <p className="section-title w-full text-center">Time-to-Harm</p>
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
          <ShieldAlert className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="text-3xl font-black text-emerald-400 font-mono">N / A</div>
        <p className="text-emerald-400/70 text-sm font-semibold mt-2">No immediate threat</p>
        <p className="text-gray-600 text-xs mt-2">Prototype estimate</p>
      </div>
    );
  }

  /* Urgency ring radius animation */
  const ringPct = display !== null ? Math.max(0, Math.min(100, (display / seconds) * 100)) : 100;
  const R = 70, ringCirc = 2 * Math.PI * R;
  const ringOffset = ringCirc - (ringPct / 100) * ringCirc;

  return (
    <div
      className={`glass-card p-6 flex flex-col items-center justify-center text-center min-h-[200px] relative overflow-hidden ${isCrit ? 'animate-critical-ring' : ''}`}
      style={isCrit ? { background: 'rgba(239,68,68,0.05)', border: `1px solid ${color}40` } : {}}
    >
      {isCrit && (
        <div className="absolute top-3 right-3">
          <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
        </div>
      )}

      <p className="section-title w-full text-center">Time-to-Harm</p>

      {/* Urgency ring */}
      <div className="relative mb-3" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <circle
            cx="80" cy="80" r={R}
            fill="none" stroke={color} strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={ringCirc}
            strokeDashoffset={ringOffset}
            transform="rotate(-90 80 80)"
            style={{
              transition: 'stroke-dashoffset 1s linear',
              filter: `drop-shadow(0 0 6px ${glow})`,
            }}
          />
        </svg>
        {/* Countdown display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Clock className="w-4 h-4 mb-1" style={{ color }} />
          <span
            className={`font-mono font-black ${isUrgent ? 'animate-countdown-blink' : ''}`}
            style={{ fontSize: '2.6rem', color, textShadow: `0 0 20px ${glow}`, letterSpacing: '0.04em' }}
          >
            {display !== null ? formatTime(display) : '--:--'}
          </span>
          {isUrgent && (
            <span className="text-xs font-bold text-red-400 animate-pulse mt-0.5">URGENT</span>
          )}
        </div>
      </div>

      <div
        className="px-4 py-1.5 rounded-full text-xs font-bold border font-mono tracking-wider"
        style={{ color, borderColor: `${color}40`, background: `${color}10` }}
      >
        {level}
      </div>
      <p className="text-gray-700 text-xs italic mt-3">Prototype estimate · Not validated</p>
    </div>
  );
}
