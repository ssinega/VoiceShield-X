import type { AttackStage } from '../types';

interface Props {
  currentStage: AttackStage;
  animate?: boolean;
}

const STAGES: { key: AttackStage; label: string; desc: string; color: string; icon: string }[] = [
  { key: 'SAFE',                   label: 'Safe',              desc: 'No threat detected',              color: '#10b981', icon: '✓' },
  { key: 'IDENTITY_CLAIM',         label: 'Identity Claim',    desc: 'Establishes fake identity',       color: '#a78bfa', icon: '①' },
  { key: 'TRUST_BUILDING',         label: 'Trust Building',    desc: 'Builds credibility',              color: '#60a5fa', icon: '②' },
  { key: 'URGENCY',                label: 'Urgency',           desc: 'Creates time pressure',           color: '#f59e0b', icon: '③' },
  { key: 'THREAT',                 label: 'Threat',            desc: 'Issues consequences / threats',   color: '#f97316', icon: '④' },
  { key: 'SENSITIVE_INFO_REQUEST', label: 'Info Request',      desc: 'Requests personal details',       color: '#ef4444', icon: '⑤' },
  { key: 'CREDENTIAL_REQUEST',     label: 'Credential Request',desc: 'Demands OTP / PIN / password',   color: '#dc2626', icon: '⑥' },
  { key: 'PAYMENT_REQUEST',        label: 'Payment Request',   desc: 'Requests money transfer',         color: '#dc2626', icon: '⑦' },
  { key: 'IMMINENT_HARM',          label: '⚠ Imminent Harm',  desc: 'Financial loss imminent',         color: '#ef4444', icon: '⑧' },
  { key: 'INTERVENTION',           label: '🛑 Intervention',   desc: 'VoiceShield AI block triggered', color: '#ef4444', icon: '🛑' },
];

export default function AttackStageComponent({ currentStage, animate }: Props) {
  const currentIdx = STAGES.findIndex(s => s.key === currentStage);
  const safeIdx    = STAGES.findIndex(s => s.key === 'SAFE');
  const totalDanger = STAGES.length - 1; // everything except SAFE
  const progressPct = currentIdx <= 0 ? 0 : Math.round((currentIdx / totalDanger) * 100);

  return (
    <div className="glass-card p-6 flex flex-col">
      <p className="section-title">Attack Stage</p>
      <p className="text-gray-500 text-xs mb-3">Current position in attack state machine</p>

      {/* Danger progress bar */}
      {currentIdx > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Attack Progression</span>
            <span className="font-mono font-bold" style={{ color: STAGES[currentIdx].color }}>{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPct}%`,
                background: `linear-gradient(90deg, #a78bfa, #f97316, ${STAGES[currentIdx].color})`,
                boxShadow: `0 0 8px ${STAGES[currentIdx].color}60`,
                transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ maxHeight: 320 }}>
        {STAGES.map((stage, i) => {
          const isCurrent = i === currentIdx;
          const isPast    = i > 0 && i < currentIdx && currentIdx > safeIdx;
          const isFuture  = i > currentIdx;

          return (
            <div
              key={stage.key}
              className="flex items-start gap-3 mb-1 animate-fade-in-up"
              style={{
                animationDelay: animate ? `${i * 60}ms` : '0ms',
                opacity: animate ? 0 : 1,
                animationFillMode: 'forwards',
              }}
            >
              {/* Dot + connector */}
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 28 }}>
                <div
                  className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500 flex-shrink-0"
                  style={{
                    borderColor: isCurrent ? stage.color : isPast ? `${stage.color}50` : 'rgba(255,255,255,0.08)',
                    background:  isCurrent ? `${stage.color}20` : isPast ? `${stage.color}08` : 'transparent',
                    boxShadow:   isCurrent ? `0 0 14px ${stage.color}70, 0 0 4px ${stage.color}` : 'none',
                    color: isCurrent ? stage.color : isPast ? `${stage.color}80` : '#374151',
                  }}
                >
                  {isPast ? '✓' : <span style={{ fontSize: '0.6rem' }}>{i + 1}</span>}
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    className="mt-0.5"
                    style={{
                      width: 2,
                      height: 16,
                      background: isPast
                        ? `linear-gradient(to bottom, ${stage.color}50, ${STAGES[i+1].color}30)`
                        : 'rgba(255,255,255,0.05)',
                      borderRadius: 1,
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <div className={`pb-1 flex-1 min-w-0 ${isCurrent ? 'pt-0.5' : ''}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-semibold text-sm truncate"
                    style={{
                      color: isCurrent ? stage.color : isPast ? `${stage.color}75` : '#374151',
                      fontWeight: isCurrent ? 700 : 500,
                    }}
                  >
                    {stage.label}
                  </span>
                  {isCurrent && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold border animate-pulse flex-shrink-0"
                      style={{ color: stage.color, borderColor: `${stage.color}50`, background: `${stage.color}12` }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-gray-500 text-xs mt-0.5">{stage.desc}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
