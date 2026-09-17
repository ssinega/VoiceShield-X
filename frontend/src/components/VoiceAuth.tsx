import { Radio } from 'lucide-react';
import type { VoiceSignal } from '../types';

interface Props {
  signal: VoiceSignal;
}

const STATUS_CONFIG = {
  CLEAN:     { color: '#10b981', label: 'Clean', bar: 3 },
  SUSPICIOUS:{ color: '#f59e0b', label: 'Suspicious', bar: 6 },
  HIGH_RISK: { color: '#ef4444', label: 'High Risk', bar: 9 },
  UNKNOWN:   { color: '#6b7280', label: 'Unknown', bar: 0 },
};

export default function VoiceAuth({ signal }: Props) {
  const cfg = STATUS_CONFIG[signal.status];
  const pct = Math.round(signal.prototype_score * 100);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4 text-cyan-400" />
        <p className="section-title mb-0">Voice Authenticity</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="px-3 py-1.5 rounded-lg border text-sm font-bold"
          style={{ color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}10` }}
        >
          {cfg.label}
        </div>
        <div>
          <p className="text-gray-400 text-sm">Synthetic voice likelihood</p>
          <p className="font-bold font-mono" style={{ color: cfg.color }}>{pct}%</p>
        </div>
      </div>

      {/* Signal bars */}
      <div className="flex items-end gap-1 mb-3 h-10">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-300"
            style={{
              height: `${20 + (i % 4) * 15 + Math.sin(i) * 10}%`,
              minHeight: '15%',
              background: i < cfg.bar
                ? `${cfg.color}`
                : i < 9
                ? `${cfg.color}30`
                : 'rgba(255,255,255,0.05)',
              opacity: i < cfg.bar ? 0.9 : 0.3
            }}
          />
        ))}
      </div>

      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: `linear-gradient(to right, ${cfg.color}80, ${cfg.color})` }}
        />
      </div>

      <div className="mt-3 p-3 rounded-lg bg-white/3 border border-white/5">
        <p className="text-gray-500 text-xs leading-relaxed">
          <span className="text-amber-400 font-semibold">⚠ Prototype signal</span> — 
          Voice authenticity module uses simulated values for demonstration. 
          A future version will integrate ASVspoof / Wav2Vec anti-spoofing models.
        </p>
      </div>
    </div>
  );
}
