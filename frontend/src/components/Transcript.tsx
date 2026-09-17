import type { TranscriptSegment } from '../types';
import { MessageSquare } from 'lucide-react';

interface Props {
  segments: TranscriptSegment[];
  animate?: boolean;
}

const TAG_STYLES: Record<string, string> = {
  IDENTITY: 'tag-identity',
  THREAT: 'tag-threat',
  URGENCY: 'tag-urgency',
  OTP: 'tag-otp',
  PAYMENT: 'tag-payment',
  SAFE: 'tag-safe',
  ISOLATION: 'px-2 py-0.5 rounded text-xs font-bold bg-pink-900/40 text-pink-300 border border-pink-700/40',
  FEAR: 'px-2 py-0.5 rounded text-xs font-bold bg-orange-900/40 text-orange-300 border border-orange-700/40',
  LINK: 'px-2 py-0.5 rounded text-xs font-bold bg-red-900/40 text-red-300 border border-red-700/40',
};

function HighlightedText({ text, phrases }: { text: string; phrases: { text: string; tag: string }[] }) {
  if (phrases.length === 0) return <span>{text}</span>;

  const parts: Array<{ text: string; tag?: string }> = [];


  // Simple approach: split text by highlighted phrases
  let remaining = text;
  const sortedPhrases = [...phrases].sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text));

  for (const phrase of sortedPhrases) {
    const idx = remaining.indexOf(phrase.text);
    if (idx === -1) continue;
    if (idx > 0) parts.push({ text: remaining.slice(0, idx) });
    parts.push({ text: phrase.text, tag: phrase.tag });
    remaining = remaining.slice(idx + phrase.text.length);
  }
  if (remaining) parts.push({ text: remaining });

  return (
    <span>
      {parts.map((p, i) =>
        p.tag ? (
          <span key={i} className={TAG_STYLES[p.tag] || 'tag-safe'}>
            [{p.text.toUpperCase()}]
          </span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </span>
  );
}

export default function Transcript({ segments, animate }: Props) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-cyan-400" />
        <p className="section-title mb-0">Conversation Transcript</p>
      </div>
      <p className="text-gray-500 text-xs mb-4">Highlighted phrases indicate detected threat signals</p>

      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-1">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fade-in-up ${seg.speaker === 'VICTIM' ? 'flex-row-reverse' : ''}`}
            style={{ animationDelay: animate ? `${i * 200}ms` : '0ms', opacity: animate ? 0 : 1, animationFillMode: 'forwards' }}
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                seg.speaker === 'CALLER'
                  ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                  : seg.speaker === 'VICTIM'
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                  : 'bg-gray-500/20 border border-gray-500/40 text-gray-400'
              }`}>
                {seg.speaker === 'CALLER' ? 'C' : seg.speaker === 'VICTIM' ? 'V' : 'S'}
              </div>
            </div>

            {/* Bubble */}
            <div className={`flex-1 max-w-[80%] ${seg.speaker === 'VICTIM' ? 'text-right' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-semibold ${
                  seg.speaker === 'CALLER' ? 'text-red-400' : seg.speaker === 'VICTIM' ? 'text-cyan-400' : 'text-gray-400'
                }`}>
                  {seg.speaker === 'CALLER' ? '🔴 Caller' : seg.speaker === 'VICTIM' ? '🔵 You' : 'System'}
                </span>
                <span className="text-gray-700 text-xs font-mono">{seg.timestamp}</span>
              </div>

              <div className={`rounded-lg px-3 py-2.5 text-sm leading-relaxed ${
                seg.speaker === 'CALLER'
                  ? 'bg-red-950/30 border border-red-900/30 text-gray-200'
                  : seg.speaker === 'VICTIM'
                  ? 'bg-cyan-950/30 border border-cyan-900/30 text-gray-200'
                  : 'bg-gray-900/30 border border-gray-700/30 text-gray-400'
              }`}>
                <HighlightedText text={seg.text} phrases={seg.highlighted_phrases} />
              </div>

              {/* Tags */}
              {seg.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {seg.tags.map(tag => (
                    <span key={tag} className={TAG_STYLES[tag] || 'tag-safe'}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
