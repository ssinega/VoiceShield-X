import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  Shield, ArrowLeft, Play, Zap, Loader2,
  Upload, ChevronDown, BarChart3, AlertTriangle, CheckCircle,
} from 'lucide-react';

import RiskScore from '../components/RiskScore';
import ScamDNA from '../components/ScamDNA';
import AttackStageComponent from '../components/AttackStage';
import TimeToHarm from '../components/TimeToHarm';
import NextAction from '../components/NextAction';
import Intervention from '../components/Intervention';
import Transcript from '../components/Transcript';
import Timeline from '../components/Timeline';
import VoiceAuth from '../components/VoiceAuth';
import { ManipulationTactics, DetectedClaims } from '../components/ManipulationTactics';

import { getScenario, analyzeText, FALLBACK_SCENARIOS } from '../services/api';
import type { AnalysisResult } from '../types';

// ─── Demo animation steps ─────────────────────────────────────────────────

const DEMO_STEPS = [
  { label: 'Initialising audio analysis engine…', ms: 700 },
  { label: 'Processing conversation transcript…', ms: 900 },
  { label: 'Extracting Scam DNA patterns…', ms: 1100 },
  { label: 'Running attack stage state machine…', ms: 800 },
  { label: 'Calculating Time-to-Harm estimate…', ms: 600 },
  { label: 'Predicting next attacker action…', ms: 700 },
  { label: 'Generating intervention recommendation…', ms: 500 },
  { label: 'Compiling security dashboard…', ms: 400 },
];

const FAST_STEPS = [
  { label: 'Analysing conversation…', ms: 250 },
  { label: 'Extracting Scam DNA…', ms: 350 },
  { label: 'Building dashboard…', ms: 300 },
];

type Status = 'idle' | 'loading' | 'done';

// ─── Component ────────────────────────────────────────────────────────────

export default function Analysis() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { scenarioId } = useParams<{ scenarioId: string }>();

  const [status, setStatus] = useState<Status>('idle');
  const [stepIdx, setStepIdx] = useState(0);
  const [steps, setSteps] = useState(DEMO_STEPS);
  const [stepLabel, setStepLabel] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedId, setSelectedId] = useState('bank-otp');
  const [showUpload, setShowUpload] = useState(searchParams.get('mode') === 'upload');
  const [customText, setCustomText] = useState('');
  const [dropdown, setDropdown] = useState(false);

  // Generation counter — incremented on every new runDemo call so stale
  // async completions from a previous run cannot overwrite the current result.
  const runGenRef = useRef(0);

  const demoId = searchParams.get('demo');
  const isFast = searchParams.get('fast') === 'true';

  // Auto-start from URL param
  useEffect(() => {
    const id = demoId || scenarioId;
    if (id) {
      setSelectedId(id);
      runDemo(id, isFast);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runDemo = useCallback(async (id: string, fast = false) => {
    // Increment generation — any older in-flight call will see a mismatch and bail out.
    const gen = ++runGenRef.current;
    const activeSteps = fast ? FAST_STEPS : DEMO_STEPS;
    setSteps(activeSteps);
    setStatus('loading');
    setStepIdx(0);
    setResult(null);

    for (let i = 0; i < activeSteps.length; i++) {
      if (runGenRef.current !== gen) return; // aborted by a newer call
      setStepIdx(i);
      setStepLabel(activeSteps[i].label);
      await new Promise<void>(r => setTimeout(r, activeSteps[i].ms));
    }

    if (runGenRef.current !== gen) return; // aborted by a newer call
    setResult(getScenario(id));
    setStatus('done');
  }, []);

  const runCustomAnalysis = useCallback(async () => {
    if (!customText.trim()) return;
    const gen = ++runGenRef.current;
    const activeSteps = DEMO_STEPS;
    setSteps(activeSteps);
    setStatus('loading');
    setStepIdx(0);
    setResult(null);

    for (let i = 0; i < activeSteps.length; i++) {
      if (runGenRef.current !== gen) return;
      setStepIdx(i);
      setStepLabel(activeSteps[i].label);
      await new Promise<void>(r => setTimeout(r, activeSteps[i].ms / 2));
    }

    if (runGenRef.current !== gen) return;
    setResult(analyzeText(customText));
    setStatus('done');
  }, [customText]);

  const reset = () => { setStatus('idle'); setResult(null); };

  const r = result;

  return (
    <div className="min-h-screen bg-grid" style={{ backgroundColor: '#0a0f1e' }}>

      {/* ── Nav ── */}
      <nav className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-50"
        style={{ backgroundColor: 'rgba(10,15,30,0.96)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">

          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Shield className="w-6 h-6 text-cyan-400" />
            <span className="text-white font-bold">VoiceShield <span className="text-cyan-400">X</span></span>
            {r && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                r.risk_level === 'CRITICAL' ? 'risk-badge-critical' :
                r.risk_level === 'HIGH'     ? 'risk-badge-high' :
                r.risk_level === 'MEDIUM'   ? 'risk-badge-medium' : 'risk-badge-low'
              }`}>{r.risk_level}</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Scenario dropdown */}
            <div className="relative">
              <button onClick={() => setDropdown(d => !d)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-gray-300 text-sm hover:border-white/20 transition-colors">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Scenarios</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {dropdown && (
                <div className="absolute right-0 top-full mt-1 w-60 glass-card z-50 overflow-hidden shadow-xl">
                  {FALLBACK_SCENARIOS.map(s => (
                    <button key={s.id}
                      onClick={() => { setDropdown(false); setSelectedId(s.id); runDemo(s.id); }}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">{s.name}</span>
                        <span className={`text-xs font-bold ${
                          s.risk_level === 'CRITICAL' ? 'text-red-400' :
                          s.risk_level === 'HIGH'     ? 'text-amber-400' : 'text-emerald-400'
                        }`}>{s.risk_level}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setShowUpload(v => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-gray-300 text-sm hover:border-white/20 transition-colors">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Paste Transcript</span>
            </button>

            {status === 'done' && (
              <button onClick={reset}
                className="px-3 py-2 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-white/20 transition-colors">
                Reset
              </button>
            )}

            {status !== 'loading' && (
              <button onClick={() => runDemo(selectedId)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#0099bb)', color: '#0a0f1e' }}>
                <Play className="w-4 h-4" />
                Run Demo
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ── Paste-transcript panel ── */}
        {showUpload && (
          <div className="glass-card p-5 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-cyan-400" /> Analyse Custom Transcript
              </h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-600 hover:text-white text-sm">✕</button>
            </div>
            <textarea value={customText} onChange={e => setCustomText(e.target.value)}
              placeholder="Paste suspicious conversation text here…&#10;&#10;Example: 'I am calling from your bank. Your account will be blocked — share the OTP now.'"
              className="w-full h-28 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-cyan-500/50 scrollbar-thin" />
            <div className="flex gap-2 mt-2 flex-wrap">
              {FALLBACK_SCENARIOS.slice(0,3).map(s => (
                <button key={s.id} onClick={() => setCustomText(s.sample_text)}
                  className="px-2 py-1 text-xs rounded border border-white/10 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors">
                  Use "{s.name}" sample
                </button>
              ))}
            </div>
            <button onClick={runCustomAnalysis} disabled={!customText.trim() || status === 'loading'}
              className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg,#00d4ff,#0099bb)', color: '#0a0f1e' }}>
              <Zap className="w-4 h-4" /> Analyse Transcript
            </button>
          </div>
        )}

        {/* ── Loading ── */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-cyan-500/20 flex items-center justify-center">
                <Shield className="w-10 h-10 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-500 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-cyan-400 font-semibold text-lg mb-1">Analysing Conversation</p>
              <p className="text-gray-500 text-sm animate-pulse">{stepLabel}</p>
            </div>
            <div className="w-full max-w-sm glass-card p-4">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Analysis Progress</span>
                <span>{Math.round((stepIdx / steps.length) * 100)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(stepIdx / steps.length) * 100}%` }} />
              </div>
              <div className="space-y-1">
                {steps.map((s, i) => (
                  <div key={i} className={`flex items-center gap-2 text-xs transition-colors ${
                    i < stepIdx ? 'text-emerald-400' : i === stepIdx ? 'text-cyan-400' : 'text-gray-700'
                  }`}>
                    {i < stepIdx
                      ? <CheckCircle className="w-3 h-3 flex-shrink-0" />
                      : i === stepIdx
                      ? <Loader2 className="w-3 h-3 flex-shrink-0 animate-spin" />
                      : <div className="w-3 h-3 rounded-full border border-gray-700 flex-shrink-0" />}
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Idle ── */}
        {status === 'idle' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <Shield className="w-16 h-16 text-cyan-400/40" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">VoiceShield X Intelligence Platform</h2>
              <p className="text-gray-500 max-w-md">Select a scenario below or paste a transcript to run full fraud intelligence analysis.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { setSelectedId('bank-otp'); runDemo('bank-otp'); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                style={{ background: 'linear-gradient(135deg,#00d4ff,#0099bb)', color: '#0a0f1e', boxShadow: '0 0 24px rgba(0,212,255,0.35)' }}>
                <Play className="w-5 h-5" /> Run Live Scam Simulation
              </button>
              <button onClick={() => runDemo(selectedId, true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                <Zap className="w-5 h-5" /> Fast Demo (3 s)
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl mt-2">
              {FALLBACK_SCENARIOS.map(s => (
                <button key={s.id} onClick={() => { setSelectedId(s.id); runDemo(s.id); }}
                  className="glass-card p-3 text-left hover:border-white/20 transition-all group">
                  <div className={`text-xs font-bold mb-1 ${
                    s.risk_level === 'CRITICAL' ? 'text-red-400' :
                    s.risk_level === 'HIGH'     ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{s.risk_level}</div>
                  <div className="text-white text-xs font-medium group-hover:text-cyan-400 transition-colors">{s.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Dashboard ── */}
        {status === 'done' && r && (
          <div className="animate-fade-in">

            {/* Header */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">{r.scenario_name}</h2>
                <p className="text-gray-500 text-sm">Scam type: <span className="font-mono text-xs text-gray-300">{r.scam_type}</span></p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => runDemo(selectedId)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-500/10 transition-colors">
                  <Play className="w-3.5 h-3.5" /> Re-run
                </button>
                <button onClick={() => runDemo(selectedId, true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-400 text-sm hover:border-white/20 transition-colors">
                  <Zap className="w-3.5 h-3.5" /> Fast
                </button>
              </div>
            </div>

            {/* INTERVENTION — top for critical/high */}
            {(r.risk_level === 'CRITICAL' || r.risk_level === 'HIGH') && (
              <div className="mb-5 animate-fade-in-up">
                <Intervention level={r.risk_level} actions={r.recommended_action} reasons={r.reasons} />
              </div>
            )}

            {/* Row 1: Risk + Time-to-Harm + Next Action */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <RiskScore score={r.risk_score} level={r.risk_level} animate reasons={r.reasons} />
              <TimeToHarm seconds={r.time_to_harm_seconds} level={r.risk_level} animate />
              <NextAction nextAction={r.next_action} confidence={r.next_action_confidence} />
            </div>

            {/* Row 2: Scam DNA + Attack Stage + Voice / Tactics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <ScamDNA nodes={r.scam_dna} animate />
              <AttackStageComponent currentStage={r.current_stage} animate />
              <div className="flex flex-col gap-4">
                <VoiceAuth signal={r.voice_signal} />
                <ManipulationTactics tactics={r.manipulation_tactics} />
              </div>
            </div>

            {/* Row 3: Transcript + Timeline + Claims */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <Transcript segments={r.transcript} animate />
              <div className="flex flex-col gap-4">
                <Timeline events={r.timeline} animate />
                <DetectedClaims claims={r.detected_claims} />
              </div>
            </div>

            {/* LOW/SAFE intervention at bottom */}
            {r.risk_level !== 'CRITICAL' && r.risk_level !== 'HIGH' && (
              <div className="mb-4">
                <Intervention level={r.risk_level} actions={r.recommended_action} reasons={r.reasons} />
              </div>
            )}

            {/* Scenario switcher */}
            <div className="glass-card p-4 mb-4">
              <p className="section-title mb-3">Try Another Scenario</p>
              <div className="flex gap-2 flex-wrap">
                {FALLBACK_SCENARIOS.map(s => (
                  <button key={s.id}
                    onClick={() => { setSelectedId(s.id); runDemo(s.id); }}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${
                      s.id === selectedId
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400'
                        : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                    }`}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-white/2 border border-white/5">
              <AlertTriangle className="w-4 h-4 text-amber-500/50 flex-shrink-0 mt-0.5" />
              <p className="text-gray-600 text-xs leading-relaxed">
                <strong className="text-gray-500">Hackathon Prototype:</strong> All scores, Time-to-Harm estimates, and confidence values are
                illustrative and have not been measured on real-world datasets. Not for production or financial/legal use.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
