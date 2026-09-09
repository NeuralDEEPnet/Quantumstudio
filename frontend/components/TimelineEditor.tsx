import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Scissors, 
  Volume2, 
  Clock, 
  Film, 
  ChevronRight, 
  Wand2, 
  Eye, 
  Plus, 
  Trash2,
  MoveHorizontal,
  Sliders,
  Palette,
  Clapperboard
} from 'lucide-react';
import { Shot, TransitionType, AspectRatio, MLStyleFilter } from '../types';
import { VideoCanvasPlayer } from './VideoCanvasPlayer';

interface TimelineEditorProps {
  shots: Shot[];
  setShots: React.Dispatch<React.SetStateAction<Shot[]>>;
  aspectRatio: AspectRatio;
  activeFilter: MLStyleFilter;
  setActiveFilter: (f: MLStyleFilter) => void;
  grainIntensity: number;
  setGrainIntensity: (val: number) => void;
  anamorphicFlare: number;
  setAnamorphicFlare: (val: number) => void;
  onOpenMovieExporter: () => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  shots,
  setShots,
  aspectRatio,
  activeFilter,
  setActiveFilter,
  grainIntensity,
  setGrainIntensity,
  anamorphicFlare,
  setAnamorphicFlare,
  onOpenMovieExporter
}) => {
  const totalDuration = shots.reduce((acc, s) => acc + s.durationSec, 0) || 16;
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedShotId, setSelectedShotId] = useState<string>(shots[0]?.id || '');

  // Playback timer ticker
  React.useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.05;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  const handleUpdateTransition = (shotId: string, trans: TransitionType) => {
    setShots(prev => prev.map(s => s.id === shotId ? { ...s, transitionToNext: trans } : s));
  };

  const handleUpdateDuration = (shotId: string, delta: number) => {
    setShots(prev => prev.map(s => {
      if (s.id === shotId) {
        const nextDur = Math.max(2, Math.min(12, s.durationSec + delta));
        return { ...s, durationSec: nextDur };
      }
      return s;
    }));
  };

  const selectedShot = shots.find(s => s.id === selectedShotId) || shots[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Split: Real-Time Preview & Shot Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time WebGL/Canvas Video Player */}
        <div className="lg:col-span-2">
          <VideoCanvasPlayer
            shots={shots}
            aspectRatio={aspectRatio}
            currentTime={currentTime}
            totalDuration={totalDuration}
            isPlaying={isPlaying}
            onTimeUpdate={setCurrentTime}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onReset={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
            activeFilter={activeFilter}
            grainIntensity={grainIntensity}
            anamorphicFlare={anamorphicFlare}
          />
        </div>

        {/* Selected Shot Inspector & ML Style Controls */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white text-sm">Shot & ML Style Inspector</h3>
              </div>
              <button
                onClick={onOpenMovieExporter}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[11px] flex items-center gap-1 shadow-md shadow-cyan-500/20"
              >
                <Clapperboard className="w-3.5 h-3.5" />
                Render 24 FPS
              </button>
            </div>

            {selectedShot ? (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="text-slate-400 font-mono text-[11px]">Title</label>
                  <p className="font-semibold text-white text-sm mt-0.5">{selectedShot.title}</p>
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px]">Duration Control</label>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      onClick={() => handleUpdateDuration(selectedShot.id, -1)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono"
                    >
                      -1s
                    </button>
                    <span className="font-mono text-sm text-cyan-400 font-bold">
                      {selectedShot.durationSec} seconds
                    </span>
                    <button
                      onClick={() => handleUpdateDuration(selectedShot.id, 1)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-mono"
                    >
                      +1s
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-mono text-[11px]">Real-Time ML Video Transition</label>
                  <select
                    value={selectedShot.transitionToNext}
                    onChange={e => handleUpdateTransition(selectedShot.id, e.target.value as TransitionType)}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="quantum-tunnel">Quantum Tunneling Dissolve</option>
                    <option value="superposition-dissolve">Superposition Cross-Fade</option>
                    <option value="chromatic-glitch">Chromatic Aberration Glitch</option>
                    <option value="entanglement-blur">Quantum Entanglement Blur</option>
                    <option value="neural-warp">Neural Latent Space Warp</option>
                    <option value="cut">Direct Hard Cut</option>
                  </select>
                </div>

                {/* ML Stylistic Optimizations */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Palette className="w-3 h-3" /> ML Style LUT Filter
                    </span>
                  </div>
                  <select
                    value={activeFilter}
                    onChange={e => setActiveFilter(e.target.value as MLStyleFilter)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="cyber-anamorphic">Cyber Anamorphic (Teal & Orange)</option>
                    <option value="quantum-chroma">Quantum Chroma (Violet Entangled)</option>
                    <option value="kodak-vision3">Kodak 5219 Film Stock</option>
                    <option value="infrared-singularity">Cosmic Infrared Radiance</option>
                    <option value="none">Neutral Cinema RAW</option>
                  </select>
                </div>

                {/* 35mm Film Grain Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>35mm Film Grain</span>
                    <span className="text-cyan-300">{grainIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={grainIntensity}
                    onChange={e => setGrainIntensity(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 mt-1 bg-slate-800 rounded-lg"
                  />
                </div>

                {/* Anamorphic Flare Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Anamorphic Streak Flare</span>
                    <span className="text-cyan-300">{anamorphicFlare}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={anamorphicFlare}
                    onChange={e => setAnamorphicFlare(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 mt-1 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select a shot block from the timeline below.</p>
            )}
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/50 text-[11px] text-cyan-300 leading-relaxed font-mono">
            ★ Real-time WebGL transitions recalculate pixel vectors on every audio beat.
          </div>
        </div>
      </div>

      {/* Multi-Track Timeline Sequencer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Multi-Track Cinematic Timeline</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Click any track block to seek</span>
          </div>
        </div>

        {/* Scrubbable Time Ruler */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newRatio = clickX / rect.width;
            setCurrentTime(newRatio * totalDuration);
          }}
          className="relative h-6 bg-slate-900 rounded-lg cursor-pointer border border-slate-800 select-none overflow-hidden"
        >
          {/* Second marks */}
          <div className="w-full h-full flex justify-between px-2 items-center text-[10px] font-mono text-slate-500">
            {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
              <span key={i}>0{i}s</span>
            ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#06b6d4] z-20 pointer-events-none transition-all duration-75"
            style={{ left: `${(currentTime / totalDuration) * 100}%` }}
          >
            <div className="w-3 h-3 -ml-1 bg-cyan-400 rotate-45 transform -translate-y-1"></div>
          </div>
        </div>

        {/* Track 1: Video & Keyframe Track */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <Film className="w-3 h-3 text-cyan-400" />
            VIDEO TRACK 1 (4K Visual Frames)
          </div>

          <div className="flex gap-2 h-24 bg-slate-900/60 rounded-xl p-2 border border-slate-800/80 overflow-x-auto">
            {shots.map((shot) => {
              const widthPercent = (shot.durationSec / totalDuration) * 100;
              const isSelected = selectedShotId === shot.id;

              return (
                <div
                  key={shot.id}
                  onClick={() => setSelectedShotId(shot.id)}
                  style={{ minWidth: `${Math.max(120, widthPercent * 7)}px`, width: `${widthPercent}%` }}
                  className={`relative rounded-lg overflow-hidden border cursor-pointer transition-all flex flex-col justify-between p-2 select-none ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  {/* Thumbnail background */}
                  {shot.imageUrl && (
                    <img
                      src={shot.imageUrl}
                      alt={shot.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white">
                    <span className="font-bold truncate">#{shot.shotNumber} {shot.title}</span>
                    <span className="text-cyan-300 text-[10px] bg-black/60 px-1 rounded">{shot.durationSec}s</span>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-300">
                    <span className="truncate max-w-[100px]">{shot.cameraMovement}</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[9px] border border-purple-800">
                      {shot.transitionToNext}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track 2: Audio & Atmospheric Synth Track */}
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-purple-400 flex items-center gap-1.5">
            <Volume2 className="w-3 h-3" />
            AUDIO & QUANTUM ATMOSPHERE TRACK
          </div>

          <div className="flex gap-2 h-12 bg-slate-900/60 rounded-xl p-1.5 border border-slate-800/80">
            {shots.map((shot) => {
              const widthPercent = (shot.durationSec / totalDuration) * 100;
              return (
                <div
                  key={shot.id}
                  style={{ width: `${widthPercent}%` }}
                  className="rounded-lg bg-purple-950/40 border border-purple-900/50 p-1 flex items-center justify-between overflow-hidden"
                >
                  <span className="text-[10px] font-mono text-purple-300 truncate px-1">
                    ♪ {shot.soundCue}
                  </span>
                  {/* Fake Audio Waveform */}
                  <div className="flex items-center gap-0.5 h-4 opacity-60">
                    {[3, 8, 14, 6, 12, 16, 7, 4, 11].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-purple-400 rounded-full"
                        style={{ height: `${h}px` }}
                      ></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
