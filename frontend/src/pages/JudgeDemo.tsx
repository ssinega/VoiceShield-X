import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, ArrowLeft, Play, Zap, RotateCcw,
  AlertTriangle, CheckCircle, Loader2, PhoneCall,
  User, Siren, Clock, CreditCard, KeyRound,
  TrendingUp, ShieldOff, ChevronRight,
} from 'lucide-react';

// ─── Simulation stages ────────────────────────────────────────────────────

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  border: string;
  bg: string;
  delay: number;
  fastDelay: number;
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Call Started',
    subtitle: 'Incoming call detected — monitoring active',
    icon: PhoneCall,
    color: '#60a5fa',
    glow: 'rgba(96,165,250,0.35)',
    border: 'rgba(96,165,250,0.40)',
    bg: 'rgba(96,165,250,0.07)',
    delay: 0,
    fastDelay: 0,
  },
  {
    id: 2,
    title: 'Caller Identity Claim Detected',
    subtitle: '"I am from your Bank Security Department" — UNVERIFIED',
    icon: User,
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.35)',
    border: 'rgba(167,139,250,0.40)',
    bg: 'rgba(167,139,250,0.07)',
    delay: 2200,
    fastDelay: 600,
  },
  {
    id: 3,
    title: 'Authority Detected',
    subtitle: 'Caller asserts official institutional authority — pressure tactic',
    icon: Shield,
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.35)',
    border: 'rgba(56,189,248,0.40)',
    bg: 'rgba(56,189,248,0.07)',
    delay: 4000,
    fastDelay: 1000,
  },
  {
    id: 4,
    title: 'Urgency Detected',
    subtitle: '"Your account will be blocked TODAY" — urgency escalation',
    icon: Clock,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.35)',
    border: 'rgba(245,158,11,0.40)',
    bg: 'rgba(245,158,11,0.07)',
    delay: 6000,
    fastDelay: 1600,
  },
  {
    id: 5,
    title: 'Account Threat Detected',
    subtitle: '"We detected suspicious activity" — fear induction confirmed',
    icon: AlertTriangle,
    color: '#f97316',
    glow: 'rgba(249,115,22,0.40)',
    border: 'rgba(249,115,22,0.45)',
    bg: 'rgba(249,115,22,0.08)',
    delay: 8200,
    fastDelay: 2200,
  },
  {
    id: 6,
    title: 'OTP Request Detected',
    subtitle: '"Please share the OTP on your registered mobile number"',
    icon: KeyRound,
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.45)',
    border: 'rgba(244,63,94,0.50)',
    bg: 'rgba(244,63,94,0.09)',
    delay: 10500,
    fastDelay: 2800,
  },
  {
    id: 7,
    title: 'Next Action Predicted',
    subtitle: 'UPI / Payment Authorization',
    icon: CreditCard,
    color: '#dc2626',
    glow: 'rgba(220,38,38,0.45)',
    border: 'rgba(220,38,38,0.55)',
    bg: 'rgba(220,38,38,0.10)',
    delay: 12800,
    fastDelay: 3400,
  },
  {
    id: 8,
    title: 'Time-to-Harm',
    subtitle: '00:47',
    icon: TrendingUp,
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.50)',
    border: 'rgba(239,68,68,0.60)',
    bg: 'rgba(239,68,68,0.12)',
    delay: 14800,
    fastDelay: 3900,
  },
  {
    id: 9,
    title: 'Risk Escalates To',
    subtitle: 'CRITICAL',
    icon: ShieldOff,
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.65)',
    border: 'rgba(239,68,68,0.75)',
    bg: 'rgba(239,68,68,0.15)',
    delay: 16500,
    fastDelay: 4300,
  },
  {
    id: 10,
    title: 'INTERVENTION TRIGGERED',
    subtitle: '',
    icon: Siren,
    color: '#ff3d3d',
    glow: 'rgba(255,61,61,0.75)',
    border: 'rgba(255,61,61,0.90)',
    bg: 'rgba(255,61,61,0.18)',
    delay: 18500,
    fastDelay: 4700,
  },
];

const SCAM_DNA = [
  { label: 'BANK IMPERSONATION', color: '#a78bfa' },
  { label: 'AUTHORITY',          color: '#60a5fa' },
  { label: 'URGENCY',            color: '#f59e0b' },
  { label: 'THREAT',             color: '#f97316' },
  { label: 'OTP',                color: '#f43f5e' },
  { label: 'PAYMENT',            color: '#dc2626' },
];

const DNA_FINAL_DELAY_NORMAL = 20500;
const DNA_FINAL_DELAY_FAST   = 5000;

// ─── Component ────────────────────────────────────────────────────────────

type SimState = 'idle' | 'running' | 'done';

export default function JudgeDemo() {
  const navigate = useNavigate();

  const [simState, setSimState]       = useState<SimState>('idle');
  const [fastMode, setFastMode]       = useState(false);
  const [visibleStages, setVisible]   = useState<number[]>([]);
  const [showDNA, setShowDNA]         = useState(false);
  const [dnaNodes, setDnaNodes]       = useState<number[]>([]);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const fastRef   = useRef(fastMode);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => { fastRef.current = fastMode; }, [fastMode]);

  const clearAllTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const reset = useCallback(() => {
    clearAllTimers();
    setSimState('idle');
    setVisible([]);
    setShowDNA(false);
    setDnaNodes([]);
    setActiveStage(null);
  }, []);

  const runSim = useCallback((fast: boolean) => {
    clearAllTimers();
    setSimState('running');
    setVisible([]);
    setShowDNA(false);
    setDnaNodes([]);
    setActiveStage(null);

    STAGES.forEach((s) => {
      const delay = fast ? s.fastDelay : s.delay;
      const t = setTimeout(() => {
        setVisible(prev => [...prev, s.id]);
        setActiveStage(s.id);
      }, delay);
      timersRef.current.push(t);
    });

    const dnaDelay = fast ? DNA_FINAL_DELAY_FAST : DNA_FINAL_DELAY_NORMAL;
    const tDone = setTimeout(() => {
      setSimState('done');
      setActiveStage(null);
      setShowDNA(true);
      SCAM_DNA.forEach((_, i) => {
        const nodeTimer = setTimeout(() => {
          setDnaNodes(prev => [...prev, i]);
        }, i * (fast ? 100 : 200));
        timersRef.current.push(nodeTimer);
      });
    }, dnaDelay);
    timersRef.current.push(tDone);
  }, []);

  const handleRun = (fast: boolean) => {
    setFastMode(fast);
    runSim(fast);
  };

  const isRunning = simState === 'running';
  const isDone    = simState === 'done';
  const isIdle    = simState === 'idle';

  return (
    <div className="min-h-screen bg-grid" style={{ backgroundColor: '#060b17' }}>

      {/* ── Nav ── */}
      <nav
        className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-50"
        style={{ backgroundColor: 'rgba(6,11,23,0.97)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-bold text-sm">
              VoiceShield <span className="text-cyan-400">X</span>
            </span>
            <span
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold"
              style={{
                background: 'rgba(239,68,68,0.12)',
                borderColor: 'rgba(239,68,68,0.45)',
                color: '#f87171',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
              JUDGE DEMO MODE
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Fast toggle */}
            <button
              onClick={() => setFastMode(v => !v)}
              disabled={isRunning}
              id="fast-demo-toggle"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all disabled:opacity-40 ${
                fastMode
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                  : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Fast Demo
            </button>

            {(isRunning || isDone) && (
              <button
                onClick={reset}
                id="judge-demo-reset"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 text-xs hover:border-white/20 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}

            {!isRunning && (
              <button
                id="run-live-scam-simulation"
                onClick={() => handleRun(fastMode)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm tracking-wide transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
                  color: '#fff',
                  boxShadow: '0 0 24px rgba(239,68,68,0.50)',
                  letterSpacing: '0.04em',
                }}
              >
                <Play className="w-4 h-4" />
                RUN LIVE SCAM SIMULATION
              </button>
            )}

            {isRunning && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm" style={{ color: '#f87171' }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                Simulating…
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* IDLE hero */}
        {isIdle && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 text-center animate-fade-in">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-6"
                style={{
                  background: 'rgba(239,68,68,0.10)',
                  borderColor: 'rgba(239,68,68,0.40)',
                  color: '#f87171',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
                JUDGE DEMO MODE — VOICESHIELD X
              </div>

              <h1
                className="text-4xl sm:text-5xl font-black mb-4 tracking-tight"
                style={{ color: '#f1f5f9' }}
              >
                Bank OTP Scam
                <br />
                <span style={{
                  background: 'linear-gradient(135deg,#ef4444,#f97316)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Live Simulation
                </span>
              </h1>
              <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
                Watch VoiceShield X detect each stage of a real-world bank impersonation scam
                in real time — from first call to full intervention.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                id="run-live-scam-simulation-hero"
                onClick={() => handleRun(false)}
                className="flex items-center gap-3 px-8 py-4 rounded-xl font-black text-base transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
                  color: '#fff',
                  boxShadow: '0 0 40px rgba(239,68,68,0.55)',
                  letterSpacing: '0.08em',
                }}
              >
                <Play className="w-5 h-5" />
                RUN LIVE SCAM SIMULATION
              </button>

              <button
                id="run-fast-demo"
                onClick={() => handleRun(true)}
                className="flex items-center gap-2 px-6 py-4 rounded-xl font-bold text-sm border transition-all hover:scale-105 active:scale-95"
                style={{
                  borderColor: 'rgba(245,158,11,0.45)',
                  color: '#fbbf24',
                  background: 'rgba(245,158,11,0.07)',
                }}
              >
                <Zap className="w-4 h-4" />
                Fast Demo (5s)
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-600 mt-2">
              <span>&#x23F1; Normal: ~20 seconds</span>
              <span>&#x26A1; Fast: ~5 seconds</span>
              <span>&#x1F512; No external APIs — fully deterministic</span>
              <span>&#x267B; Repeatable — same result every run</span>
            </div>
          </div>
        )}

        {/* Running / Done */}
        {(isRunning || isDone) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: stage feed */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <PhoneCall className="w-5 h-5 text-cyan-400" />
                  Scam Detection Feed
                </h2>
                {isRunning && (
                  <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                    LIVE
                  </span>
                )}
                {isDone && (
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full border"
                    style={{
                      color: '#4ade80',
                      background: 'rgba(74,222,128,0.10)',
                      borderColor: 'rgba(74,222,128,0.35)',
                    }}
                  >
                    SIMULATION COMPLETE
                  </span>
                )}
              </div>

              {STAGES.map((stage, idx) => {
                const visible = visibleStages.includes(stage.id);
                const isActive = activeStage === stage.id;
                const Icon = stage.icon;
                const isIntervention = stage.id === 10;

                return (
                  <div
                    key={stage.id}
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(16px)',
                      transition: 'opacity 0.4s ease, transform 0.4s ease',
                    }}
                  >
                    <div
                      className={`relative rounded-xl border p-4 flex items-start gap-4 ${
                        isIntervention && isDone ? 'animate-intervention' : ''
                      }`}
                      style={{
                        background: stage.bg,
                        borderColor: stage.border,
                        boxShadow: isActive
                          ? `0 0 28px ${stage.glow}`
                          : isIntervention && isDone
                          ? `0 0 40px ${stage.glow}`
                          : 'none',
                        transition: 'box-shadow 0.4s ease',
                      }}
                    >
                      {/* Stage number badge */}
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black font-mono"
                        style={{
                          background: `${stage.color}22`,
                          border: `1px solid ${stage.border}`,
                          color: stage.color,
                        }}
                      >
                        {String(stage.id).padStart(2, '0')}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Icon className="w-4 h-4 flex-shrink-0" style={{ color: stage.color }} />
                          <span
                            className={`font-bold text-sm ${
                              isIntervention ? 'text-base tracking-widest uppercase' : ''
                            }`}
                            style={{ color: stage.color }}
                          >
                            {stage.title}
                          </span>
                          {isActive && isRunning && (
                            <Loader2
                              className="w-3.5 h-3.5 animate-spin ml-auto flex-shrink-0"
                              style={{ color: stage.color }}
                            />
                          )}
                          {!isActive && visible && (
                            <CheckCircle
                              className="w-3.5 h-3.5 ml-auto flex-shrink-0"
                              style={{ color: `${stage.color}aa` }}
                            />
                          )}
                        </div>

                        {stage.subtitle && (
                          <p
                            className="text-xs mt-1 leading-relaxed"
                            style={
                              stage.id === 8
                                ? { color: stage.color, fontFamily: 'JetBrains Mono, monospace', fontSize: '1.5rem', fontWeight: 900, textShadow: `0 0 16px ${stage.glow}` }
                                : stage.id === 9
                                ? { color: stage.color, fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.15em', textShadow: `0 0 16px ${stage.glow}` }
                                : { color: '#9ca3af' }
                            }
                          >
                            {stage.subtitle}
                          </p>
                        )}

                        {/* Intervention final STOP message */}
                        {isIntervention && isDone && (
                          <div
                            className="mt-3 p-3 rounded-lg border"
                            style={{
                              background: 'rgba(239,68,68,0.12)',
                              borderColor: 'rgba(239,68,68,0.55)',
                            }}
                          >
                            <p className="text-white font-black text-sm tracking-wide leading-relaxed">
                              &#x26D4; STOP — DO NOT SHARE OTP OR AUTHORIZE PAYMENT.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Connector */}
                    {idx < STAGES.length - 1 && visible && (
                      <div className="flex items-center gap-2 ml-6 my-0.5">
                        <div
                          className="w-0.5 h-4 rounded-full"
                          style={{
                            background: `linear-gradient(to bottom, ${stage.color}60, ${
                              STAGES[idx + 1]?.color ?? '#9ca3af'
                            }40)`,
                          }}
                        />
                        <ChevronRight
                          className="w-3 h-3 -ml-1"
                          style={{
                            color: `${stage.color}50`,
                            transform: 'rotate(90deg)',
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {isRunning && visibleStages.length < STAGES.length && (
                <div className="flex items-center gap-2 text-gray-700 text-xs animate-pulse py-2 pl-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Monitoring call…
                </div>
              )}
            </div>

            {/* Right: progress + DNA */}
            <div className="flex flex-col gap-4">

              {/* Progress tracker */}
              <div
                className="rounded-xl border p-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
              >
                <p className="section-title mb-3">Detection Progress</p>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(visibleStages.length / STAGES.length) * 100}%`,
                      background: 'linear-gradient(90deg,#ef4444,#b91c1c)',
                      boxShadow: '0 0 8px rgba(239,68,68,0.6)',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 mb-3">
                  <span>{visibleStages.length} / {STAGES.length} stages</span>
                  <span>{Math.round((visibleStages.length / STAGES.length) * 100)}%</span>
                </div>

                <div className="space-y-1.5">
                  {STAGES.map(s => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 text-xs transition-colors duration-300"
                      style={{
                        color: visibleStages.includes(s.id)
                          ? s.color
                          : 'rgba(75,85,99,0.6)',
                      }}
                    >
                      {visibleStages.includes(s.id) ? (
                        <CheckCircle className="w-3 h-3 flex-shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-gray-700 flex-shrink-0" />
                      )}
                      <span className="truncate font-mono">S{s.id}: {s.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scam DNA */}
              {showDNA && (
                <div
                  className="rounded-xl border p-5 animate-fade-in-up"
                  style={{
                    background: 'rgba(239,68,68,0.06)',
                    borderColor: 'rgba(239,68,68,0.35)',
                    boxShadow: '0 0 32px rgba(239,68,68,0.15)',
                  }}
                >
                  <p className="section-title mb-4" style={{ color: 'rgba(239,68,68,0.75)' }}>
                    Scam DNA — Attack Chain
                  </p>

                  <div className="flex flex-col gap-1.5">
                    {SCAM_DNA.map((node, i) => (
                      <div key={node.label}>
                        <div
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg border font-mono text-xs font-bold tracking-wide"
                          style={{
                            color: node.color,
                            borderColor: `${node.color}50`,
                            background: `${node.color}11`,
                            opacity: dnaNodes.includes(i) ? 1 : 0,
                            transform: dnaNodes.includes(i) ? 'translateX(0)' : 'translateX(-16px)',
                            transition: 'opacity 0.3s ease, transform 0.3s ease',
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor: node.color,
                              boxShadow: `0 0 6px ${node.color}`,
                            }}
                          />
                          {node.label}
                        </div>
                        {i < SCAM_DNA.length - 1 && dnaNodes.includes(i) && (
                          <div className="flex items-center ml-3 my-0.5 gap-1">
                            <div
                              className="w-0.5 h-4 rounded-full"
                              style={{
                                background: `linear-gradient(to bottom, ${node.color}60, ${
                                  SCAM_DNA[i + 1]?.color ?? '#9ca3af'
                                }40)`,
                              }}
                            />
                            <span className="text-gray-700 text-xs">&#x2192;</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {dnaNodes.length === SCAM_DNA.length && (
                    <p className="text-gray-600 text-xs italic mt-4 pt-3 border-t border-white/5">
                      Pattern match: BANK OTP SCAM &middot; Confidence 97%
                    </p>
                  )}
                </div>
              )}

              {/* Re-run controls */}
              {isDone && (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <button
                    id="judge-rerun-normal"
                    onClick={() => handleRun(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
                      color: '#fff',
                      boxShadow: '0 0 18px rgba(239,68,68,0.40)',
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Re-run (~20s)
                  </button>
                  <button
                    id="judge-rerun-fast"
                    onClick={() => handleRun(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm transition-all hover:scale-105"
                    style={{
                      borderColor: 'rgba(245,158,11,0.40)',
                      color: '#fbbf24',
                      background: 'rgba(245,158,11,0.07)',
                    }}
                  >
                    <Zap className="w-4 h-4" />
                    Re-run Fast (5s)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
