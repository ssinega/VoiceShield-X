import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Zap, Brain, Clock, AlertTriangle, ChevronRight,
  Activity, Eye, Target, Upload, Play, BarChart3, Radio, Lock
} from 'lucide-react';
import { FALLBACK_SCENARIOS } from '../services/api';
import type { DemoScenario } from '../types';

const FEATURES = [
  { icon: Brain, label: 'Scam DNA', desc: 'Behavioral attack pattern extraction', color: 'cyan' },
  { icon: Clock, label: 'Time-to-Harm', desc: 'Estimated seconds to irreversible action', color: 'amber' },
  { icon: Target, label: 'Next-Action Prediction', desc: 'Predict the attacker\'s next move', color: 'red' },
  { icon: Shield, label: 'Intervention Engine', desc: 'Actionable real-time guidance', color: 'green' },
  { icon: Activity, label: 'Attack Stage', desc: 'Live attack state machine tracking', color: 'purple' },
  { icon: Eye, label: 'Voice Authenticity', desc: 'Prototype synthetic voice signal', color: 'blue' },
];

const PIPELINE = [
  'CALL AUDIO',
  'SPEECH / TRANSCRIPT',
  'CONVERSATION INTELLIGENCE',
  'SCAM DNA EXTRACTION',
  'ATTACK STAGE DETECTION',
  'TIME-TO-HARM ESTIMATION',
  'NEXT-ACTION PREDICTION',
  'INTERVENTION ENGINE',
  'SECURITY DASHBOARD',
];

export default function Landing() {
  const navigate = useNavigate();
  const [scenarios] = useState<DemoScenario[]>(FALLBACK_SCENARIOS);
  const [pipelineStep, setPipelineStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineStep(s => (s + 1) % PIPELINE.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'HIGH': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'LOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-grid overflow-x-hidden" style={{ backgroundColor: '#0a0f1e' }}>
      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-50" style={{ backgroundColor: 'rgba(10,15,30,0.95)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">VoiceShield</span>
              <span className="text-cyan-400 font-bold text-lg"> X</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <span className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors">Features</span>
            <span className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors">Architecture</span>
            <span className="text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors">Demo Scenarios</span>
            <button
              onClick={() => navigate('/analyze?demo=bank-otp&fast=true')}
              className="px-4 py-2 bg-cyan-500 text-navy-950 rounded-lg font-semibold text-sm hover:bg-cyan-400 transition-all"
              style={{ color: '#0a0f1e' }}
            >
              Live Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-8">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 text-sm font-medium">Hackathon Prototype · Real-time Fraud Defense</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Voice<span className="text-cyan-400 text-glow-cyan">Shield</span>{' '}
            <span className="text-white">X</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-medium">
            Predict the Scam.{' '}
            <span className="text-red-400 font-bold">Stop the Harm.</span>
          </p>

          <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
            AI-powered conversational fraud defense platform. Analyzes suspicious voice conversations 
            to extract Scam DNA, detect attack stages, and predict harm before it happens.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={() => navigate('/analyze?demo=bank-otp')}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
                color: '#0a0f1e',
                boxShadow: '0 0 30px rgba(0,212,255,0.4)'
              }}
            >
              <Play className="w-5 h-5" />
              Run Live Scam Simulation
            </button>
            <button
              onClick={() => navigate('/analyze?mode=upload')}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg border border-white/20 text-white hover:border-cyan-500/50 hover:bg-white/5 transition-all duration-300"
            >
              <Upload className="w-5 h-5" />
              Upload Audio / Transcript
            </button>
            <button
              onClick={() => navigate('/analyze')}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg border border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            >
              <BarChart3 className="w-5 h-5" />
              View Scam Intelligence
            </button>
          </div>

          <p className="text-gray-600 text-sm">
            ⚡ No API key required · Works offline · Deterministic demo mode
          </p>
        </div>

        {/* Live pipeline animation */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-gray-500 text-xs ml-2 font-mono">analysis_pipeline.py</span>
            </div>
            <div className="space-y-2">
              {PIPELINE.map((step, i) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-500 ${
                    i === pipelineStep
                      ? 'bg-cyan-500/15 border border-cyan-500/30'
                      : i < pipelineStep
                      ? 'opacity-40'
                      : 'opacity-20'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i === pipelineStep ? 'bg-cyan-500' : i < pipelineStep ? 'bg-emerald-500/50' : 'bg-white/10'
                  }`}>
                    {i < pipelineStep ? (
                      <span className="text-xs text-white">✓</span>
                    ) : i === pipelineStep ? (
                      <span className="text-xs text-navy-950 font-bold">▶</span>
                    ) : (
                      <span className="text-xs text-gray-600">{i + 1}</span>
                    )}
                  </div>
                  <span className={`font-mono text-sm ${i === pipelineStep ? 'text-cyan-400 font-semibold' : 'text-gray-500'}`}>
                    {step}
                  </span>
                  {i === pipelineStep && (
                    <div className="ml-auto flex gap-1">
                      {[0,1,2].map(d => (
                        <div key={d} className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-500/70 mb-3">Core Innovation</p>
          <h2 className="text-3xl font-bold text-white">Fraud Intelligence Stack</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const colorMap: Record<string, string> = {
              cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
              amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
              red: 'text-red-400 bg-red-500/10 border-red-500/20',
              green: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
              blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            };
            return (
              <div key={f.label}
                className="glass-card p-6 hover:border-white/20 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className={`inline-flex p-3 rounded-xl border mb-4 ${colorMap[f.color]}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold mb-1">{f.label}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Demo Scenarios */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-500/70 mb-3">Built-in Demos</p>
          <h2 className="text-3xl font-bold text-white">Scam Scenario Library</h2>
          <p className="text-gray-500 mt-2">Click any scenario to run the full fraud intelligence analysis</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => navigate(`/analyze?demo=${s.id}`)}
              className="glass-card p-6 text-left hover:border-white/20 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${getRiskColor(s.risk_level)} mb-2`}>
                    {s.risk_level}
                  </span>
                  <h3 className="text-white font-bold text-lg">{s.name}</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all mt-1" />
              </div>
              <p className="text-gray-500 text-sm mb-3">{s.description}</p>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-xs font-mono text-gray-600">{s.scam_type}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="glass-card p-8 md:p-12">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-cyan-500/70 mb-3">The Core Question</p>
            <h2 className="text-3xl font-bold text-white mb-4">Beyond "Is this a scam?"</h2>
            <p className="text-gray-500">VoiceShield X answers 7 critical questions in real time</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { n: '01', q: 'What scam pattern is occurring?', icon: Brain },
              { n: '02', q: 'What stage of the attack are we in?', icon: Activity },
              { n: '03', q: 'What manipulation techniques are being used?', icon: Eye },
              { n: '04', q: 'What action is the attacker triggering?', icon: Target },
              { n: '05', q: 'How close is the victim to irreversible harm?', icon: Clock },
              { n: '06', q: 'What will the attacker request next?', icon: Zap },
              { n: '07', q: 'What intervention should be recommended?', icon: Shield },
            ].map(item => (
              <div key={item.n} className="flex items-start gap-4 p-4 rounded-lg bg-white/3 hover:bg-white/5 transition-colors">
                <span className="text-3xl font-black text-white/10 font-mono leading-none">{item.n}</span>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.q}</p>
                </div>
                <item.icon className="w-5 h-5 text-cyan-400/50 flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="glass-card-cyan p-10 rounded-2xl">
          <Lock className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Ready to see it in action?</h2>
          <p className="text-gray-400 mb-6">Run the Bank OTP simulation — see Scam DNA, Time-to-Harm, and Intervention in 30 seconds.</p>
          <button
            onClick={() => navigate('/analyze?demo=bank-otp')}
            className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #0099bb)',
              color: '#0a0f1e',
              boxShadow: '0 0 30px rgba(0,212,255,0.4)'
            }}
          >
            <Play className="w-5 h-5 inline mr-2" />
            Start Live Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-bold">VoiceShield X</span>
          </div>
          <p className="text-gray-600 text-sm">Hackathon Prototype · All signals are illustrative estimates · Not for production use</p>
        </div>
      </footer>
    </div>
  );
}
