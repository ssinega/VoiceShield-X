import type { TimelineEvent } from '../types';

interface Props {
  events: TimelineEvent[];
  animate?: boolean;
}

const SEVERITY_CONFIG = {
  info:     { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', dot: '#60a5fa' },
  warning:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', dot: '#f59e0b' },
  danger:   { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', dot: '#f97316' },
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.4)', dot: '#ef4444' },
  safe:     { color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', dot: '#10b981' },
};

export default function Timeline({ events, animate }: Props) {
  return (
    <div className="glass-card p-6">
      <p className="section-title">Conversation Timeline</p>
      <p className="text-gray-500 text-xs mb-4">Chronological sequence of detected events</p>

      <div className="relative pl-4">
        {/* Vertical line */}
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/5 rounded" />

        <div className="space-y-0">
          {events.map((ev, i) => {
            const cfg = SEVERITY_CONFIG[ev.severity];
            return (
              <div
                key={i}
                className="relative flex items-start gap-3 pb-3 animate-fade-in-up"
                style={{ animationDelay: animate ? `${i * 150}ms` : '0ms', opacity: animate ? 0 : 1, animationFillMode: 'forwards' }}
              >
                {/* Dot on line */}
                <div
                  className="absolute -left-[17px] w-4 h-4 rounded-full border-2 flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: cfg.bg,
                    borderColor: cfg.dot,
                    boxShadow: ev.severity === 'critical' ? `0 0 8px ${cfg.dot}` : 'none'
                  }}
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex-1 ml-3 px-3 py-2 rounded-lg border"
                  style={{ background: cfg.bg, borderColor: cfg.border }}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs" style={{ color: cfg.color }}>
                      {ev.timestamp}
                    </span>
                    <span className="text-sm font-medium" style={{ color: ev.severity === 'critical' ? cfg.color : '#d1d5db' }}>
                      {ev.event}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
