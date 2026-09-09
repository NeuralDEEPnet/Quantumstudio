import React, { useState } from 'react';
import { FilmProject, AspectRatio, QuantumTelemetry, Shot, MLStyleFilter } from './types';
import { QuantumEngine } from './services/quantumService';
import { Header } from './components/Header';
import { AgentStudio } from './components/AgentStudio';
import { TimelineEditor } from './components/TimelineEditor';
import { QuantumEngineView } from './components/QuantumEngineView';
import { VideoCanvasPlayer } from './components/VideoCanvasPlayer';
import { MovieExporterModal } from './components/MovieExporterModal';
import { Download, Sparkles, Film, ArrowRight, Clapperboard } from 'lucide-react';

const initialShots: Shot[] = [
  {
    id: 'shot-init-1',
    shotNumber: 1,
    title: 'Singularity Horizon',
    durationSec: 4,
    narrativeAction: 'The quantum exploration vessel glides past a shimmering photon sphere.',
    visualPrompt: 'Cinematic deep space vessel orbiting a golden black hole accretion disk, anamorphic lens, Unreal Engine 5 render',
    cameraMovement: 'Slow rotational arc shot',
    lightingStyle: 'Golden chromatic glow with volumetric shadows',
    soundCue: 'Sub-bass drone with harmonic cello shimmer',
    transitionToNext: 'quantum-tunnel',
    quantumModulation: {
      entropySeed: 4821,
      colorShift: '#06b6d4',
      motionIntensity: 1.1,
      eigenstate: '|0011⟩'
    }
  },
  {
    id: 'shot-init-2',
    shotNumber: 2,
    title: 'Superposition Chamber',
    durationSec: 5,
    narrativeAction: 'Inside the cockpit, holographic quantum qubits collapse into crystalline coordinates.',
    visualPrompt: 'Futuristic cockpit pilot looking at floating cyan holographic quantum circuits, reflections on helmet visor',
    cameraMovement: 'Slow push-in macro rack focus',
    lightingStyle: 'Bioluminescent cyan and purple interior glow',
    soundCue: 'High-frequency crystal chimes and mechanical servos',
    transitionToNext: 'superposition-dissolve',
    quantumModulation: {
      entropySeed: 9124,
      colorShift: '#a855f7',
      motionIntensity: 1.3,
      eigenstate: '|0101⟩'
    }
  },
  {
    id: 'shot-init-3',
    shotNumber: 3,
    title: 'Event Horizon Breach',
    durationSec: 4,
    narrativeAction: 'The hull experiences relativistic time dilation as light bends into kaleidoscopic waves.',
    visualPrompt: 'Ship entering a tunnel of warping spacetime, iridescent prism refractions, hyper-detailed cosmic dust',
    cameraMovement: 'Fast vertigo dolly zoom',
    lightingStyle: 'Hyperspeed ultraviolet streaks',
    soundCue: 'Rising Shepard tone acoustic illusion',
    transitionToNext: 'chromatic-glitch',
    quantumModulation: {
      entropySeed: 7721,
      colorShift: '#06b6d4',
      motionIntensity: 1.5,
      eigenstate: '|1100⟩'
    }
  }
];

export default function App() {
  const quantum = QuantumEngine.getInstance();
  const [activeTab, setActiveTab] = useState<'director' | 'timeline' | 'quantum-lab' | 'player'>('director');
  const [quantumMode, setQuantumMode] = useState<'conservative' | 'superposition' | 'chaotic-multiverse'>('superposition');
  const [quantumTelemetry, setQuantumTelemetry] = useState<QuantumTelemetry>(() => quantum.simulateRun('superposition'));

  const [activeFilter, setActiveFilter] = useState<MLStyleFilter>('cyber-anamorphic');
  const [grainIntensity, setGrainIntensity] = useState<number>(35);
  const [anamorphicFlare, setAnamorphicFlare] = useState<number>(55);
  const [isMovieExporterOpen, setIsMovieExporterOpen] = useState<boolean>(false);

  const [project, setProject] = useState<FilmProject>({
    id: 'proj-1',
    title: 'Quantum Singularity: Odyssey',
    genre: 'Cosmic Cyberpunk / Hard Sci-Fi',
    synopsis: 'A human consciousness archive salvaged from the edge of a rotating Kerr black hole.',
    aspectRatio: '16:9',
    quantumMode: 'superposition',
    activeMlFilter: 'cyber-anamorphic',
    grainIntensity: 35,
    anamorphicFlare: 55,
    opticalFlowSpeed: 1.0,
    shots: initialShots,
    createdAt: Date.now()
  });

  const [playerTime, setPlayerTime] = useState(0);
  const [isPlayingMaster, setIsPlayingMaster] = useState(false);

  const handleRefreshQuantum = () => {
    const updated = quantum.simulateRun(quantumMode);
    setQuantumTelemetry(updated);
  };

  const handleSetQuantumMode = (mode: 'conservative' | 'superposition' | 'chaotic-multiverse') => {
    setQuantumMode(mode);
    const updated = quantum.simulateRun(mode);
    setQuantumTelemetry(updated);
  };

  const totalDuration = project.shots.reduce((acc, s) => acc + s.durationSec, 0) || 12;

  // Master playback ticker
  React.useEffect(() => {
    let timer: any;
    if (isPlayingMaster) {
      timer = setInterval(() => {
        setPlayerTime(prev => {
          if (prev >= totalDuration) {
            setIsPlayingMaster(false);
            return 0;
          }
          return prev + 0.05;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [isPlayingMaster, totalDuration]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        aspectRatio={project.aspectRatio}
        setAspectRatio={(ar: AspectRatio) => setProject(p => ({ ...p, aspectRatio: ar }))}
        quantumTelemetry={quantumTelemetry}
        isAgentRunning={false}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeTab === 'director' && (
          <AgentStudio
            project={project}
            setProject={setProject}
            quantumTelemetry={quantumTelemetry}
            onJumpToTimeline={() => setActiveTab('timeline')}
            onRefreshQuantum={handleRefreshQuantum}
            onOpenMovieExporter={() => setIsMovieExporterOpen(true)}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineEditor
            shots={project.shots}
            setShots={(newShotsOrFn) => {
              if (typeof newShotsOrFn === 'function') {
                setProject(p => ({ ...p, shots: newShotsOrFn(p.shots) }));
              } else {
                setProject(p => ({ ...p, shots: newShotsOrFn }));
              }
            }}
            aspectRatio={project.aspectRatio}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            grainIntensity={grainIntensity}
            setGrainIntensity={setGrainIntensity}
            anamorphicFlare={anamorphicFlare}
            setAnamorphicFlare={setAnamorphicFlare}
            onOpenMovieExporter={() => setIsMovieExporterOpen(true)}
          />
        )}

        {activeTab === 'quantum-lab' && (
          <QuantumEngineView
            telemetry={quantumTelemetry}
            quantumMode={quantumMode}
            setQuantumMode={handleSetQuantumMode}
            onRefreshTelemetry={handleRefreshQuantum}
          />
        )}

        {activeTab === 'player' && (
          <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400">FINAL COMPOSITE CUT</span>
                <h2 className="text-2xl font-bold text-white">{project.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMovieExporterOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Clapperboard className="w-3.5 h-3.5" />
                  Render 24 FPS Movie
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Back to Timeline
                </button>
              </div>
            </div>

            <VideoCanvasPlayer
              shots={project.shots}
              aspectRatio={project.aspectRatio}
              currentTime={playerTime}
              totalDuration={totalDuration}
              isPlaying={isPlayingMaster}
              onTimeUpdate={setPlayerTime}
              onTogglePlay={() => setIsPlayingMaster(!isPlayingMaster)}
              onReset={() => {
                setIsPlayingMaster(false);
                setPlayerTime(0);
              }}
              activeFilter={activeFilter}
              grainIntensity={grainIntensity}
              anamorphicFlare={anamorphicFlare}
            />

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-semibold text-white text-sm">Quantum Production Manifest</h4>
                <p className="text-xs text-slate-400 font-mono">
                  IBM Quantum QPU: {quantumTelemetry.ibmBackend} • 24 FPS Lockstep Muxer • Latency: {quantumTelemetry.calibration.lastPingMs}ms
                </p>
              </div>

              <button
                onClick={() => setIsMovieExporterOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all"
              >
                <Clapperboard className="w-4 h-4" />
                Export 24 FPS Movie Master
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 24 FPS Cinema Movie Exporter Modal */}
      <MovieExporterModal
        isOpen={isMovieExporterOpen}
        onClose={() => setIsMovieExporterOpen(false)}
        shots={project.shots}
        projectTitle={project.title}
        aspectRatio={project.aspectRatio}
        activeFilter={activeFilter}
        grainIntensity={grainIntensity}
        anamorphicFlare={anamorphicFlare}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        Quantum Cinema AI Studio • Powered by Google Gemini 2.5 Flash, Nano Banana, Veo 2.0 & IBM Quantum Eagle QPU (xxYP...CKHU)
      </footer>
    </div>
  );
}
