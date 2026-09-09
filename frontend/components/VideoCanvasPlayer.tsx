import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Sparkles, Layers, Sliders, Eye } from 'lucide-react';
import { Shot, AspectRatio, TransitionType, MLStyleFilter } from '../types';

interface VideoCanvasPlayerProps {
  shots: Shot[];
  aspectRatio: AspectRatio;
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onTogglePlay: () => void;
  onReset: () => void;
  activeFilter?: MLStyleFilter;
  grainIntensity?: number;
  anamorphicFlare?: number;
}

export const VideoCanvasPlayer: React.FC<VideoCanvasPlayerProps> = ({
  shots,
  aspectRatio,
  currentTime,
  totalDuration,
  isPlaying,
  onTimeUpdate,
  onTogglePlay,
  onReset,
  activeFilter = 'cyber-anamorphic',
  grainIntensity = 30,
  anamorphicFlare = 50
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imageElements, setImageElements] = useState<Map<string, HTMLImageElement>>(new Map());
  const [activeTransition, setActiveTransition] = useState<string>('Normal');
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Preload shot images for zero-latency frame interpolation
  useEffect(() => {
    const map = new Map<string, HTMLImageElement>();
    shots.forEach(shot => {
      if (shot.imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = shot.imageUrl;
        map.set(shot.id, img);
      }
    });
    setImageElements(map);
  }, [shots]);

  // Audio synthesizer tone for immersive playback
  const playQuantumTone = (freq: number) => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      // Audio autoplay policy
    }
  };

  // Render loop with Machine Learning Stylistic Optimizations and Real-Time Video Transitions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Find current shot
    let accumulatedTime = 0;
    let currentShotIndex = 0;
    let shotStartTime = 0;

    for (let i = 0; i < shots.length; i++) {
      const dur = shots[i].durationSec;
      if (currentTime >= accumulatedTime && currentTime <= accumulatedTime + dur) {
        currentShotIndex = i;
        shotStartTime = accumulatedTime;
        break;
      }
      accumulatedTime += dur;
    }

    const currentShot = shots[currentShotIndex] || shots[0];
    const nextShot = shots[currentShotIndex + 1];
    const shotElapsed = currentShot ? currentTime - shotStartTime : 0;
    const shotDuration = currentShot ? currentShot.durationSec : 4;
    const progressInShot = shotDuration > 0 ? shotElapsed / shotDuration : 0;

    // Transition window (last 0.8 seconds of the shot)
    const transitionWindow = 0.85;
    const isInTransition = nextShot && (shotDuration - shotElapsed) <= transitionWindow;
    const transitionProgress = isInTransition 
      ? 1 - (shotDuration - shotElapsed) / transitionWindow 
      : 0;

    const currentImg = currentShot ? imageElements.get(currentShot.id) : undefined;
    const nextImg = nextShot ? imageElements.get(nextShot.id) : undefined;

    // Clear frame
    ctx.fillStyle = '#050a18';
    ctx.fillRect(0, 0, width, height);

    if (currentImg && currentImg.complete) {
      // Smooth dynamic camera motion
      const scale = 1.0 + progressInShot * 0.09;
      const dx = (width - width * scale) / 2;
      const dy = (height - height * scale) / 2;

      ctx.save();
      ctx.drawImage(currentImg, dx, dy, width * scale, height * scale);

      // Real-time Machine Learning Video Transitions
      if (isInTransition && nextImg && nextImg.complete) {
        const transType = currentShot.transitionToNext || 'superposition-dissolve';
        setActiveTransition(transType);

        if (transType === 'quantum-tunnel') {
          // Quantum Tunneling Dissolve: Circular expanding vortex with chromatic split
          ctx.save();
          ctx.globalAlpha = transitionProgress;
          ctx.drawImage(nextImg, 0, 0, width, height);
          ctx.restore();

          // Tunnel rings
          const radius = (1 - transitionProgress) * (width * 0.6);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.9 * (1 - transitionProgress)})`;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, Math.max(10, radius), 0, Math.PI * 2);
          ctx.stroke();

          ctx.strokeStyle = `rgba(168, 85, 247, ${0.7 * (1 - transitionProgress)})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(width / 2, height / 2, Math.max(5, radius * 0.7), 0, Math.PI * 2);
          ctx.stroke();
        } else if (transType === 'chromatic-glitch') {
          // Chromatic Aberration Glitch: Split color planes
          const offset = (Math.random() - 0.5) * 24 * transitionProgress;
          ctx.save();
          ctx.globalAlpha = 1 - transitionProgress;
          ctx.drawImage(currentImg, offset, 0, width, height);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = transitionProgress;
          ctx.drawImage(nextImg, -offset, 0, width, height);
          ctx.restore();

          // Horizontal glitch lines
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.fillRect(0, Math.random() * height, width, 4);
        } else if (transType === 'entanglement-blur') {
          // Quantum Entanglement Blur: Radial bloom crossfade
          ctx.save();
          ctx.filter = `blur(${transitionProgress * 12}px)`;
          ctx.drawImage(currentImg, 0, 0, width, height);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = transitionProgress;
          ctx.drawImage(nextImg, 0, 0, width, height);
          ctx.restore();
        } else if (transType === 'neural-warp') {
          // Neural Latent Space Warp: Zoom push with alpha fade
          const warpScale = 1.0 + transitionProgress * 0.25;
          const wDx = (width - width * warpScale) / 2;
          const wDy = (height - height * warpScale) / 2;

          ctx.save();
          ctx.globalAlpha = 1 - transitionProgress;
          ctx.drawImage(currentImg, wDx, wDy, width * warpScale, height * warpScale);
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = transitionProgress;
          ctx.drawImage(nextImg, 0, 0, width, height);
          ctx.restore();
        } else {
          // Superposition Dissolve (Cross-fade)
          ctx.save();
          ctx.globalAlpha = transitionProgress;
          ctx.drawImage(nextImg, 0, 0, width, height);
          ctx.restore();
        }
      } else {
        setActiveTransition('Normal');
      }

      ctx.restore();
    } else {
      // Placeholder aesthetic animation if image loading
      ctx.fillStyle = '#0b132b';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(currentShot ? `[${currentShot.title.toUpperCase()}]` : 'QUANTUM CINEMA ENGINE', width / 2, height / 2);
    }

    // Machine Learning Stylistic Filters
    if (activeFilter === 'cyber-anamorphic') {
      ctx.save();
      // Cyan-Orange Anamorphic split
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else if (activeFilter === 'quantum-chroma') {
      ctx.save();
      ctx.fillStyle = 'rgba(168, 85, 247, 0.09)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else if (activeFilter === 'kodak-vision3') {
      ctx.save();
      ctx.fillStyle = 'rgba(234, 179, 8, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else if (activeFilter === 'infrared-singularity') {
      ctx.save();
      ctx.fillStyle = 'rgba(244, 63, 94, 0.1)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    // Anamorphic Lens Flare Line
    if (anamorphicFlare > 0) {
      ctx.save();
      const flareAlpha = (anamorphicFlare / 100) * 0.45;
      ctx.strokeStyle = `rgba(6, 182, 212, ${flareAlpha})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.52);
      ctx.lineTo(width, height * 0.52);
      ctx.stroke();
      ctx.restore();
    }

    // 35mm Film Grain Simulation
    if (grainIntensity > 0) {
      ctx.save();
      const grainCount = Math.floor((grainIntensity / 100) * 450);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let i = 0; i < grainCount; i++) {
        const gx = Math.random() * width;
        const gy = Math.random() * height;
        ctx.fillRect(gx, gy, 1.5, 1.5);
      }
      ctx.restore();
    }

  }, [currentTime, shots, imageElements, activeFilter, grainIntensity, anamorphicFlare]);

  // Aspect ratio styling helpers
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[580px] mx-auto';
      case '2.39:1':
        return 'aspect-[2.39/1] w-full';
      case '1:1':
        return 'aspect-square max-h-[520px] mx-auto';
      default:
        return 'aspect-video w-full';
    }
  };

  return (
    <div className="space-y-4">
      {/* Player Frame */}
      <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl flex items-center justify-center">
        <div className={`relative ${getAspectClass()}`}>
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-cover"
          />

          {/* Film HUD Overlay */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-400 border border-cyan-800/60">
              REC ● 24 FPS
            </span>
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-800">
              {aspectRatio} ANAMORPHIC
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-950/80 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-purple-800 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              FX: {activeTransition}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-slate-800">
              LUT: {activeFilter}
            </span>
          </div>
        </div>
      </div>

      {/* Playback Controls Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onTogglePlay();
              playQuantumTone(220);
            }}
            className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onReset}
            className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
            title="Rewind to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>

        {/* Timecode */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="text-cyan-400 font-bold">
            00:0{Math.floor(currentTime)}:{(currentTime % 1).toFixed(2).slice(2)}
          </span>
          <span className="text-slate-600">/</span>
          <span>00:0{Math.floor(totalDuration)}:00</span>
        </div>
      </div>
    </div>
  );
};
