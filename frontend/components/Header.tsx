import React from 'react';
import { Film, Cpu, Sparkles, Wand2, Layers, PlayCircle, Atom, CheckCircle2 } from 'lucide-react';
import { AspectRatio, QuantumTelemetry } from '../types';

interface HeaderProps {
  activeTab: 'director' | 'timeline' | 'quantum-lab' | 'player';
  setActiveTab: (tab: 'director' | 'timeline' | 'quantum-lab' | 'player') => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ar: AspectRatio) => void;
  quantumTelemetry: QuantumTelemetry;
  isAgentRunning: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  aspectRatio,
  setAspectRatio,
  quantumTelemetry,
  isAgentRunning
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Atom className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '14s' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold tracking-tight text-lg text-white">
                AGENTIC<span className="text-cyan-400">CINEMA</span>
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                IBM QUANTUM + GEMINI 2.5
              </span>
            </div>
            <p className="text-xs text-slate-400">Superposition Video Maker & Autonomous Director</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('director')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'director'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Agentic Studio
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Timeline & ML FX
          </button>

          <button
            onClick={() => setActiveTab('quantum-lab')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'quantum-lab'
                ? 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            IBM Quantum QPU
          </button>

          <button
            onClick={() => setActiveTab('player')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'player'
                ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Master Cinema
          </button>
        </nav>

        {/* Status & Aspect Ratio Controls */}
        <div className="flex items-center gap-3">
          {/* Aspect Ratio picker */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['16:9', '9:16', '2.39:1'] as AspectRatio[]).map(ratio => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-2 py-0.5 rounded font-mono ${
                  aspectRatio === ratio
                    ? 'bg-slate-700 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          {/* IBM Quantum Live Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-800 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-blue-300">IBM QPU:</span>
            <span className="text-cyan-300 font-bold">{quantumTelemetry.entanglementCoherence}%</span>
          </div>

          {isAgentRunning && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-700 text-purple-300 text-xs animate-pulse">
              <Wand2 className="w-3.5 h-3.5 animate-spin" />
              <span>Agents Active</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
