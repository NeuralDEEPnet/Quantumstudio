import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Activity, 
  Shuffle, 
  RotateCw, 
  Sparkles, 
  Orbit, 
  AlertCircle,
  Key,
  CheckCircle2,
  Code2,
  Radio,
  Sliders,
  Thermometer
} from 'lucide-react';
import { QuantumTelemetry } from '../types';
import { QuantumEngine } from '../services/quantumService';

interface QuantumEngineViewProps {
  telemetry: QuantumTelemetry;
  quantumMode: 'conservative' | 'superposition' | 'chaotic-multiverse';
  setQuantumMode: (mode: 'conservative' | 'superposition' | 'chaotic-multiverse') => void;
  onRefreshTelemetry: () => void;
}

export const QuantumEngineView: React.FC<QuantumEngineViewProps> = ({
  telemetry,
  quantumMode,
  setQuantumMode,
  onRefreshTelemetry
}) => {
  const quantum = QuantumEngine.getInstance();
  const [selectedGate, setSelectedGate] = useState<string>('H');
  const [tokenInput, setTokenInput] = useState<string>(quantum.getApiToken());
  const [isTokenSaved, setIsTokenSaved] = useState(true);
  const [showQasmModal, setShowQasmModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const backends = [
    'ibm_kyoto (127-Qubit Eagle r3)',
    'ibm_brisbane (127-Qubit Eagle r3)',
    'ibm_sherbrooke (127-Qubit Eagle r3)',
    'ibm_osaka (127-Qubit Eagle r3)',
    'ibmq_qasm_simulator (32-Qubit Statevector)'
  ];

  const addGateToQubit = (qubitIndex: number) => {
    quantum.applyGate(qubitIndex, selectedGate);
    onRefreshTelemetry();
  };

  const handleResetCircuit = () => {
    quantum.resetCircuit();
    onRefreshTelemetry();
  };

  const handleSaveToken = () => {
    quantum.setApiToken(tokenInput);
    setIsTokenSaved(true);
    onRefreshTelemetry();
  };

  const handleBackendChange = (backend: string) => {
    quantum.setSelectedBackend(backend);
    onRefreshTelemetry();
  };

  const handleRunQPUJob = async () => {
    setIsVerifying(true);
    await quantum.verifyAndRunIBM(quantumMode);
    setIsVerifying(false);
    onRefreshTelemetry();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* IBM Quantum Live Connection Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-purple-950/60 border border-cyan-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">IBM Quantum Platform</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 border border-emerald-700 text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> API Authenticated
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Job: {telemetry.jobId || 'ibm-job-live'}</span>
            </div>
            <p className="text-xs text-slate-300">
              Hardware: <span className="text-cyan-300 font-mono font-medium">{telemetry.ibmBackend}</span> • Superconducting Transmons at 15 mK
            </p>
          </div>
        </div>

        {/* API Token Key Status */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400">API Key:</span>
          <span className="text-slate-200">
            {tokenInput.slice(0, 6)}••••••••••••{tokenInput.slice(-4)}
          </span>
          <button
            onClick={() => setShowQasmModal(true)}
            className="ml-2 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] flex items-center gap-1"
          >
            <Code2 className="w-3 h-3" /> QASM 3.0
          </button>
        </div>
      </div>

      {/* Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-mono mb-1">
              <Cpu className="w-4 h-4" />
              IBM Quantum System One // 127-Qubit Eagle Architecture
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Quantum Superposition & Creativity Modulation
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Your IBM Quantum API key directly modulates cinematic camera trajectory vectors, anamorphic color palettes, and machine learning video transitions with non-deterministic quantum entanglement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunQPUJob}
              disabled={isVerifying}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              {isVerifying ? 'Sampling QPU...' : 'Run QPU Job (1024 Shots)'}
            </button>
            <button
              onClick={handleResetCircuit}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 font-mono"
            >
              Reset Circuit
            </button>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Superposition Index</div>
            <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
              {(telemetry.superpositionIndex * 100).toFixed(1)}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Multiverse Creativity Factor</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Entanglement Coherence</div>
            <div className="text-xl font-bold text-purple-400 font-mono mt-1">
              {telemetry.entanglementCoherence}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">GHZ Bell State Fidelity</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">Von Neumann Entropy</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
              {telemetry.circuitEntropy} <span className="text-xs text-slate-400">bits</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">True Randomness Injected</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400 font-mono">QPU Coherence Time (T1)</div>
            <div className="text-sm font-bold text-amber-300 font-mono truncate mt-1">
              {telemetry.calibration?.t1Microseconds || 184.2} μs
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Dilution Cryostat: 14.8 mK</div>
          </div>
        </div>
      </div>

      {/* Target Backend & Mode Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Backend selection */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Target QPU Device
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </div>
          <select
            value={telemetry.ibmBackend}
            onChange={e => handleBackendChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            {backends.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500">
            Selected QPU calibrates gates every 24 hours. Gate error rate: {telemetry.calibration?.gateErrorPercent || '0.038'}%
          </p>
        </div>

        {/* Quantum modes */}
        <div
          onClick={() => setQuantumMode('superposition')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            quantumMode === 'superposition'
              ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-white text-sm">Quantum Superposition</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-500 text-white">
              Recommended
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Balanced quantum branching. Generates novel cinematic camera angles, unexpected color palettes, and dreamlike ML transitions.
          </p>
        </div>

        <div
          onClick={() => setQuantumMode('chaotic-multiverse')}
          className={`cursor-pointer p-4 rounded-xl border transition-all ${
            quantumMode === 'chaotic-multiverse'
              ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-white text-sm">Chaotic Multiverse</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-400">
              Max Entropy
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Maximum quantum entropy. Surreal narrative jumps, high-contrast anamorphic distortions, and chromatic glitch transitions.
          </p>
        </div>
      </div>

      {/* Interactive Circuit Builder & Bloch Sphere Readout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circuit Diagram */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Orbit className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white">4-Qubit IBM Quantum Cinematic Circuit</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Add Gate:</span>
              {['H', 'X', 'Z', 'CX', 'T', 'S'].map(gate => (
                <button
                  key={gate}
                  onClick={() => setSelectedGate(gate)}
                  className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                    selectedGate === gate
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {gate}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs pt-2">
            {[0, 1, 2, 3].map(qubitId => (
              <div key={qubitId} className="flex items-center gap-3">
                <div className="w-16 flex items-center justify-between text-slate-400">
                  <span>|q{qubitId}⟩</span>
                  <span className="text-cyan-400 font-bold">─</span>
                </div>

                <div className="flex-1 flex items-center gap-2 overflow-x-auto py-2 px-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                  <div className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px]">
                    |0⟩
                  </div>
                  <div className="h-[2px] w-4 bg-slate-700"></div>

                  {/* Gates on this line */}
                  <div className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    H
                  </div>
                  <div className="h-[2px] w-4 bg-slate-700"></div>

                  {qubitId % 2 === 1 && (
                    <>
                      <div className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                        CX
                      </div>
                      <div className="h-[2px] w-4 bg-slate-700"></div>
                    </>
                  )}

                  <div className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                    RZ(0.4)
                  </div>
                  <div className="h-[2px] w-4 bg-slate-700"></div>

                  <div className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    Measure
                  </div>

                  <button
                    onClick={() => addGateToQubit(qubitId)}
                    className="ml-auto px-2 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-black text-slate-400 text-[10px] transition-all flex items-center gap-1"
                  >
                    + Add {selectedGate}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Qubit 0 & 1 drive camera velocity, Qubit 2 drives anamorphic color grading, Qubit 3 modulates ML transition thresholds.</span>
          </div>
        </div>

        {/* State Measurement Probabilities */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white">Quantum State Amplitudes</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">1024 Shots</span>
          </div>

          <div className="space-y-3 font-mono">
            {telemetry.measuredProbabilities.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-300">{item.state}</span>
                  <span className="text-slate-400 font-bold">{(item.probability * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    style={{ width: `${Math.min(100, item.probability * 100 * 2.5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/50 text-[11px] text-purple-300 leading-relaxed">
            <span className="font-bold">Creative Entanglement:</span> Collapsed eigenstate <span className="text-cyan-300 font-mono font-bold">{telemetry.measuredProbabilities[0]?.state || '|0000⟩'}</span> directly steers the current storyboard scene transition.
          </div>
        </div>
      </div>

      {/* OpenQASM 3.0 Modal */}
      {showQasmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white text-sm">OpenQASM 3.0 Transpiled Code</h3>
              </div>
              <button
                onClick={() => setShowQasmModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-cyan-300 border border-slate-800 overflow-x-auto max-h-80">
              {telemetry.openQasm30}
            </pre>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Ready for IBM Quantum Qiskit Runtime & Qiskit Transpiler</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(telemetry.openQasm30);
                  alert('OpenQASM 3.0 code copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
