import { Zap, TrendingUp } from 'lucide-react';

interface Props {
  nextAction: string;
  confidence: number;
}

export default function NextAction({ nextAction, confidence }: Props) {
  const pct   = Math.round(confidence * 100);
  const color = confidence >= 0.85 ? '#ef4444' : confidence >= 0.65 ? '#f59e0b' : '#10b981';
  const glow  = confidence >= 0.85 ? 'rgba(239,68,68,0.4)' : confidence >= 0.65 ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.35)';
  const label = confidence >= 0.85 ? 'HIGH CONFIDENCE' : confidence >= 0.65 ? 'MODERATE' : 'LOW';

  if (!nextAction || nextAction === 'None detected') {
    return (
      <div className="glass-card p-6">
        <p className="section-title">Next Likely Action</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <span className="text-emerald-400 text-lg">✓</span>
          </div>
          <div>
            <p className="text-emerald-400 font-semibold">No harmful action predicted</p>
            <p className="text-gray-500 text-xs">Call appears non-threatening</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card p-6 relative overflow-hidden"
      style={{
        border: confidence >= 0.8 ? `1px solid ${color}30` : undefined,
        background: confidence >= 0.8 ? `${color}05` : undefined,
      }}
    >
      <p className="section-title">Next Likely Action</p>
      <p className="text-gray-500 text-xs mb-4">Attacker's predicted next move</p>

      {/* Action */}
      <div className="flex items-start gap-3 mb-5">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}40`, boxShadow: `0 0 16px ${glow}` }}
        >
          <Zap className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p
            className="text-white font-bold text-lg leading-snug"
            style={{ textShadow: confidence >= 0.85 ? `0 0 12px ${glow}` : 'none' }}
          >
            {nextAction}
          </p>
          <div
            className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border"
            style={{ color, borderColor: `${color}40`, background: `${color}12` }}
          >
            <TrendingUp className="w-3 h-3" />
            {label}
          </div>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Prediction Confidence</span>
          <span
            className="text-sm font-black font-mono"
            style={{ color, textShadow: `0 0 8px ${glow}` }}
          >
            {pct}%
          </span>
        </div>

        {/* Track */}
        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden relative">
          {/* Striped background for danger */}
          {confidence >= 0.85 && (
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                backgroundImage: 'repeating-linear-gradient(60deg, transparent, transparent 6px, rgba(255,255,255,0.15) 6px, rgba(255,255,255,0.15) 8px)',
              }}
            />
          )}
          <div
            className="h-full rounded-full relative"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}80, ${color})`,
              boxShadow: `0 0 10px ${glow}`,
              transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
            }}
          />
        </div>

        <p className="text-gray-700 text-xs italic mt-2">Demo confidence · Prototype estimate</p>
      </div>
    </div>
  );
}
