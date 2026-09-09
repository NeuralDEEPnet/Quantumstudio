import React, { useState } from 'react';
import { Download, Film, CheckCircle2, Play, Sparkles, X, RefreshCw, Eye } from 'lucide-react';
import { Shot, AspectRatio, MLStyleFilter, MovieExportProgress } from '../types';
import { MovieRendererService } from '../services/movieRendererService';

interface MovieExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  shots: Shot[];
  projectTitle: string;
  aspectRatio: AspectRatio;
  activeFilter: MLStyleFilter;
  grainIntensity: number;
  anamorphicFlare: number;
}

export const MovieExporterModal: React.FC<MovieExporterModalProps> = ({
  isOpen,
  onClose,
  shots,
  projectTitle,
  aspectRatio,
  activeFilter,
  grainIntensity,
  anamorphicFlare
}) => {
  const [progress, setProgress] = useState<MovieExportProgress>({
    isRendering: false,
    currentFrame: 0,
    totalFrames: 0,
    fps: 24,
    percentage: 0,
    stageMessage: 'Ready to render 24 FPS Master Movie.'
  });
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartRender = async () => {
    try {
      const renderer = MovieRendererService.getInstance();
      const url = await renderer.render24FpsMovie(
        shots,
        aspectRatio,
        activeFilter,
        grainIntensity,
        anamorphicFlare,
        (p) => setProgress(p)
      );
      setExportedUrl(url);
    } catch (e: any) {
      alert(`Render failed: ${e.message}`);
    }
  };

  const handleDownloadFile = () => {
    if (!exportedUrl) return;
    const a = document.createElement('a');
    a.href = exportedUrl;
    a.download = `${projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_24fps_master.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">24 FPS Cinema Movie Exporter</h3>
              <p className="text-xs text-slate-400">
                Lockstep 24.000 FPS rasterization • WebM/MP4 • Shaders & Audio Muxed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500">Frame Rate</span>
            <p className="text-cyan-400 font-bold text-sm mt-0.5">24.000 FPS</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500">Aspect Ratio</span>
            <p className="text-white font-bold text-sm mt-0.5">{aspectRatio}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500">ML Grade</span>
            <p className="text-purple-300 font-bold text-sm mt-0.5 capitalize">{activeFilter.replace('-', ' ')}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-500">Sequence</span>
            <p className="text-emerald-400 font-bold text-sm mt-0.5">{shots.length} Shots</p>
          </div>
        </div>

        {/* Live Video Preview if finished */}
        {exportedUrl ? (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-black border border-cyan-800/60 aspect-video shadow-2xl">
              <video
                src={exportedUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/50">
              <span className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" /> 24 FPS Master Movie file encoded successfully!
              </span>
              <span>{((progress.fileSizeBytes || 0) / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          </div>
        ) : (
          /* Progress status */
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800/90 text-center space-y-4">
            {progress.isRendering ? (
              <>
                <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-700/50 animate-pulse">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-mono">
                    Frame {progress.currentFrame} / {progress.totalFrames} ({progress.percentage}%)
                  </div>
                  <p className="text-xs text-cyan-300 mt-1 font-mono">{progress.stageMessage}</p>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-150"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <div className="space-y-2 py-4">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
                <h4 className="text-sm font-semibold text-white">Generate Full 24 FPS Cinematic Video</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click the button below to rasterize all shots, apply IBM Quantum camera motions, WebGL transitions, and export an actual playable movie file.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>

          {!exportedUrl ? (
            <button
              disabled={progress.isRendering}
              onClick={handleStartRender}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              {progress.isRendering ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  Rendering 24 FPS Movie...
                </>
              ) : (
                <>
                  <Film className="w-4 h-4 text-black" />
                  Render 24 FPS Master Movie
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
            >
              <Download className="w-4 h-4" />
              Download 24 FPS Video File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
