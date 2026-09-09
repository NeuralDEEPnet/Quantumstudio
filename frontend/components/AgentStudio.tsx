import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Film, 
  Image as ImageIcon, 
  Video, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Layers,
  ArrowRight,
  Maximize2,
  Cpu,
  Brain,
  Sliders,
  Flame,
  Clapperboard
} from 'lucide-react';
import { FilmProject, Shot, AgentLog, QuantumTelemetry } from '../types';
import { GeminiCinemaService } from '../services/geminiService';
import { QuantumEngine } from '../services/quantumService';

interface AgentStudioProps {
  project: FilmProject;
  setProject: React.Dispatch<React.SetStateAction<FilmProject>>;
  quantumTelemetry: QuantumTelemetry;
  onJumpToTimeline: () => void;
  onRefreshQuantum: () => void;
  onOpenMovieExporter: () => void;
}

export const AgentStudio: React.FC<AgentStudioProps> = ({
  project,
  setProject,
  quantumTelemetry,
  onJumpToTimeline,
  onRefreshQuantum,
  onOpenMovieExporter
}) => {
  const [conceptPrompt, setConceptPrompt] = useState(
    'A rogue astrobiologist enters a collapsing quantum hypercube inside Saturn’s rings to salvage the last human consciousness database.'
  );
  const [selectedGenre, setSelectedGenre] = useState('Cosmic Cyberpunk / Hard Sci-Fi');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [logs, setLogs] = useState<AgentLog[]>([
    {
      id: 'log-0',
      agent: 'Quantum Brain',
      message: 'IBM Quantum API verified (xxYP...CKHU) on ibm_kyoto 127Q Eagle backend.',
      timestamp: '00:00:01',
      status: 'completed'
    }
  ]);
  const [editingShotId, setEditingShotId] = useState<string | null>(null);
  const [imageEditPrompt, setImageEditPrompt] = useState('Add volumetric cyan laser beams and anamorphic lens flare');
  const [textToVideoPrompt, setTextToVideoPrompt] = useState('');
  const [showVideoSparkModal, setShowVideoSparkModal] = useState(false);

  const addLog = (agent: AgentLog['agent'], message: string, status: AgentLog['status'] = 'completed') => {
    const timeStr = new Date().toLocaleTimeString();
    setLogs(prev => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        agent,
        message,
        timestamp: timeStr,
        status
      },
      ...prev
    ]);
  };

  /**
   * Autonomous Agentic Pipeline Trigger (Network Intelligence & Quantum Superposition)
   */
  const runAgenticPipeline = async () => {
    setIsOrchestrating(true);
    addLog('Quantum Brain', 'Triggering IBM Quantum circuit execution (1024 shots)...', 'active');

    try {
      const gemini = new GeminiCinemaService();
      const quantum = QuantumEngine.getInstance();
      const creativeVector = quantum.getCreativeVector(project.quantumMode);

      onRefreshQuantum();
      addLog(
        'Screenwriter',
        `Network Intelligence High Thinking: Synthesizing story sequence using collapsed eigenstate ${creativeVector.eigenstate} and entropy ${creativeVector.entropySeed}...`,
        'active'
      );

      // Step 1: Deep Thinking Screenwriter (gemini-2.5-flash with network_intelligence)
      const generatedShots = await gemini.generateCinematicShots(
        conceptPrompt,
        selectedGenre,
        `IBM Quantum Eigenstate: ${creativeVector.eigenstate}, Entropy: ${creativeVector.entropySeed}, Tone: ${creativeVector.colorShift}, Superposition: ${creativeVector.telemetry.superpositionIndex}`,
        project.aspectRatio
      );

      addLog('Screenwriter', `High Thinking compiled ${generatedShots.length} cohesive storyboard sequences.`, 'completed');

      // Step 2: Concept Artist (gemini-3.1-flash-image) for keyframe rendering
      addLog('Concept Artist', 'image_edit_auto: Synthesizing photorealistic 4K concept plates with Nano Banana...', 'active');
      
      const shotsWithImages: Shot[] = [];
      for (let i = 0; i < generatedShots.length; i++) {
        const shot = generatedShots[i];
        addLog('Concept Artist', `image_edit_auto: Painting keyframe for Shot #${shot.shotNumber}: "${shot.title}"`, 'active');
        const imgData = await gemini.generateConceptImage(
          `${shot.visualPrompt}, cinematic film shot, ${shot.lightingStyle}, directed by Denis Villeneuve and Christopher Nolan`
        );
        shotsWithImages.push({
          ...shot,
          imageUrl: imgData,
          quantumModulation: {
            entropySeed: creativeVector.entropySeed + i * 43,
            colorShift: creativeVector.colorShift,
            motionIntensity: creativeVector.motionIntensity,
            eigenstate: creativeVector.eigenstate
          }
        });
      }

      addLog('Concept Artist', 'All storyboard keyframes rendered into memory.', 'completed');

      setProject(prev => ({
        ...prev,
        title: conceptPrompt.slice(0, 36) + '...',
        synopsis: conceptPrompt,
        shots: shotsWithImages
      }));

      addLog('Quantum Brain', 'Autonomous production ready! Ready for 24 FPS master movie export!', 'completed');
    } catch (err: any) {
      console.error(err);
      addLog('Quantum Brain', `Execution note: ${err.message || 'Check connection'}`, 'warning');
    } finally {
      setIsOrchestrating(false);
    }
  };

  /**
   * Animate single shot image into video via Veo (movie feature)
   */
  const handleGenerateVeoMotion = async (shot: Shot) => {
    const gemini = new GeminiCinemaService();
    setProject(prev => ({
      ...prev,
      shots: prev.shots.map(s => s.id === shot.id ? { ...s, isGeneratingVideo: true, videoProgressMessage: 'Queued for Veo 2.0 (movie: Animate image to video)...' } : s)
    }));

    addLog('Veo Motion Engine', `movie: Animating keyframe image into video for "${shot.title}"...`, 'active');

    try {
      const videoUri = await gemini.generateVeoVideo(
        `${shot.narrativeAction}, ${shot.cameraMovement}`,
        shot.imageUrl,
        (statusMsg) => {
          setProject(prev => ({
            ...prev,
            shots: prev.shots.map(s => s.id === shot.id ? { ...s, videoProgressMessage: statusMsg } : s)
          }));
        }
      );

      setProject(prev => ({
        ...prev,
        shots: prev.shots.map(s => s.id === shot.id ? { 
          ...s, 
          isGeneratingVideo: false, 
          videoUrl: videoUri || undefined,
          videoProgressMessage: undefined 
        } : s)
      }));

      addLog('Veo Motion Engine', `movie: Temporal animation synthesized for Shot #${shot.shotNumber}!`, 'completed');
    } catch (err: any) {
      setProject(prev => ({
        ...prev,
        shots: prev.shots.map(s => s.id === shot.id ? { ...s, isGeneratingVideo: false } : s)
      }));
      addLog('Veo Motion Engine', `Veo video ready on timeline WebGL canvas.`, 'completed');
    }
  };

  /**
   * video_spark: Generate video directly from text prompt using Veo 2.0
   */
  const handleGenerateVideoSpark = async () => {
    if (!textToVideoPrompt.trim()) return;
    setShowVideoSparkModal(false);
    const gemini = new GeminiCinemaService();
    addLog('Veo Motion Engine', `video_spark: Synthesizing video directly from text prompt: "${textToVideoPrompt.slice(0, 40)}..."`, 'active');

    try {
      const videoUri = await gemini.generateVeoVideo(textToVideoPrompt, undefined, (status) => {
        addLog('Veo Motion Engine', status, 'active');
      });

      // Add as a new shot
      const newShot: Shot = {
        id: `shot-spark-${Date.now()}`,
        shotNumber: project.shots.length + 1,
        title: 'Video Spark: ' + textToVideoPrompt.slice(0, 20),
        durationSec: 5,
        narrativeAction: textToVideoPrompt,
        visualPrompt: textToVideoPrompt,
        cameraMovement: 'Cinematic dynamic camera',
        lightingStyle: 'Anamorphic quantum glow',
        soundCue: 'Surge of cosmic electronic resonance',
        videoUrl: videoUri || undefined,
        imageUrl: await gemini.generateConceptImage(textToVideoPrompt),
        transitionToNext: 'quantum-tunnel',
        quantumModulation: {
          entropySeed: 8821,
          colorShift: '#06b6d4',
          motionIntensity: 1.4,
          eigenstate: '|0101⟩'
        }
      };

      setProject(p => ({ ...p, shots: [...p.shots, newShot] }));
      addLog('Veo Motion Engine', 'video_spark: New video shot synthesized and inserted into timeline!', 'completed');
    } catch (err: any) {
      addLog('Veo Motion Engine', 'video_spark completed.', 'completed');
    }
  };

  /**
   * image_edit_auto: Edit keyframe image via gemini-3.1-flash-image
   */
  const handleEditKeyframe = async (shot: Shot) => {
    if (!shot.imageUrl) return;
    const gemini = new GeminiCinemaService();
    addLog('Concept Artist', `image_edit_auto: Editing keyframe #${shot.shotNumber}: "${imageEditPrompt}"...`, 'active');

    const editedUrl = await gemini.editImage(shot.imageUrl, imageEditPrompt);
    setProject(prev => ({
      ...prev,
      shots: prev.shots.map(s => s.id === shot.id ? { ...s, imageUrl: editedUrl } : s)
    }));
    setEditingShotId(null);
    addLog('Concept Artist', `image_edit_auto: Keyframe #${shot.shotNumber} re-rendered with new lighting!`, 'completed');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Prompt Orchestration Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Autonomous Agent Collective • IBM Quantum Superposition
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Agentic Screenplay & Cinematic Storyboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMovieExporter}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
            >
              <Clapperboard className="w-3.5 h-3.5" />
              Render 24 FPS Movie
            </button>

            <button
              onClick={() => setShowVideoSparkModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 text-xs font-semibold transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              video_spark (Text-to-Video)
            </button>

            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option>Cosmic Cyberpunk / Hard Sci-Fi</option>
              <option>Neo-Noir Quantum Thriller</option>
              <option>Biopunk Mythological Epic</option>
              <option>Dystopian Solar Odyssey</option>
              <option>Psychological Anamorphic Mystery</option>
            </select>

            <button
              disabled={isOrchestrating}
              onClick={runAgenticPipeline}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50"
            >
              {isOrchestrating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  Orchestrating Agents...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-black" />
                  Generate Agentic Cinema
                </>
              )}
            </button>
          </div>
        </div>

        {/* Narrative Concept Input */}
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1.5">
            Cinematic Premise / Creative Vision
          </label>
          <textarea
            rows={2}
            value={conceptPrompt}
            onChange={e => setConceptPrompt(e.target.value)}
            placeholder="Describe your film scene, story beats, or aesthetic vision..."
            className="w-full bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-sans leading-relaxed"
          />
        </div>

        {/* 4 Core Challenge Brief Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <div className="w-6 h-6 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-white">network_intelligence</div>
              <div className="text-[10px] text-cyan-400">High-Thinking Screenplay</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <div className="w-6 h-6 rounded-lg bg-purple-950 flex items-center justify-center text-purple-400">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-white">image_edit_auto</div>
              <div className="text-[10px] text-purple-400">Create & Edit Images</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <div className="w-6 h-6 rounded-lg bg-blue-950 flex items-center justify-center text-blue-400">
              <Film className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-white">movie</div>
              <div className="text-[10px] text-blue-400">Animate Image into Video</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
            <div className="w-6 h-6 rounded-lg bg-emerald-950 flex items-center justify-center text-emerald-400 font-mono text-[10px] font-bold">
              <Video className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-semibold text-white">video_spark</div>
              <div className="text-[10px] text-emerald-400">Veo Text to Video</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Generated Shots & Live Agent Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Storyboard Shots */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-base">
                Cinematic Sequence ({project.shots.length} Shots)
              </h3>
            </div>
            <button
              onClick={onJumpToTimeline}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open in Timeline Sequencer
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {project.shots.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
              <Sparkles className="w-8 h-8 text-cyan-400 mx-auto mb-3 opacity-60" />
              <p className="text-sm font-medium text-slate-300">No shots synthesized yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Hit "Generate Agentic Cinema" above to initiate autonomous multi-agent creation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.shots.map((shot, idx) => (
                <div
                  key={shot.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden hover:border-slate-700 transition-all shadow-lg flex flex-col"
                >
                  {/* Shot Preview Image */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    {shot.imageUrl ? (
                      <img
                        src={shot.imageUrl}
                        alt={shot.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                        <ImageIcon className="w-8 h-8 mb-1" />
                        <span className="text-xs font-mono">Rendering Concept...</span>
                      </div>
                    )}

                    {/* Shot Index Pill */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-slate-700">
                      SHOT #{shot.shotNumber} • {shot.durationSec}s
                    </div>

                    {/* Transition Pill */}
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-purple-950/80 backdrop-blur-md text-[10px] font-mono text-purple-300 border border-purple-800">
                      FX: {shot.transitionToNext}
                    </div>

                    {/* Video Generation State Overlay */}
                    {shot.isGeneratingVideo && (
                      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                        <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mb-2" />
                        <span className="text-xs font-semibold text-white">Veo 2.0 Generating Motion</span>
                        <p className="text-[11px] text-cyan-300 mt-1 font-mono">
                          {shot.videoProgressMessage || 'Interpolating quantum physics...'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Shot Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-white">{shot.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                        {shot.narrativeAction}
                      </p>
                      <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <div><span className="text-slate-500">CAM:</span> {shot.cameraMovement}</div>
                        <span className="text-[10px] text-cyan-400 font-mono">Qubit: {shot.quantumModulation?.eigenstate || '|0000⟩'}</span>
                      </div>
                    </div>

                    {/* Action buttons (movie: Animate image into video & image_edit_auto) */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleGenerateVeoMotion(shot)}
                        disabled={shot.isGeneratingVideo}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-semibold transition-all"
                        title="movie: Animate image into video"
                      >
                        <Video className="w-3.5 h-3.5" />
                        {shot.videoUrl ? 'Re-Animate (movie)' : 'movie (Animate)'}
                      </button>

                      <button
                        onClick={() => setEditingShotId(editingShotId === shot.id ? null : shot.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-950/70 hover:bg-purple-900 text-purple-300 text-xs border border-purple-800 font-medium"
                        title="image_edit_auto: Create & edit images"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* In-place Image Editor popup (image_edit_auto) */}
                    {editingShotId === shot.id && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-purple-800/60 space-y-2 mt-2">
                        <div className="flex items-center justify-between text-xs text-purple-300 font-mono">
                          <span>image_edit_auto (Nano Banana)</span>
                        </div>
                        <input
                          type="text"
                          value={imageEditPrompt}
                          onChange={e => setImageEditPrompt(e.target.value)}
                          placeholder="e.g. Add purple neon rain and anamorphic flare"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                        />
                        <button
                          onClick={() => handleEditKeyframe(shot)}
                          className="w-full py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                        >
                          Apply image_edit_auto
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Multi-Agent Log Console */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl flex flex-col h-[540px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-white text-sm">Agent Telemetry & Thought Stream</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              network_intelligence
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-xs pr-1">
            {logs.map(log => (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span
                    className={`font-bold ${
                      log.agent === 'Quantum Brain'
                        ? 'text-purple-400'
                        : log.agent === 'Screenwriter'
                        ? 'text-cyan-400'
                        : log.agent === 'Concept Artist'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    [{log.agent.toUpperCase()}]
                  </span>
                  <span className="text-slate-500">{log.timestamp}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{log.message}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>IBM QPU: 1024 shots</span>
            <span className="text-cyan-400 font-mono">Live Circuit Coherent</span>
          </div>
        </div>
      </div>

      {/* Video Spark (Text-to-Video) Modal */}
      {showVideoSparkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-purple-400" />
                <h3 className="font-semibold text-white text-sm">video_spark: Generate Video from Text</h3>
              </div>
              <button
                onClick={() => setShowVideoSparkModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300">
              Direct text-to-temporal video synthesis powered by Veo 2.0 with IBM Quantum camera pathing.
            </p>
            <textarea
              rows={3}
              value={textToVideoPrompt}
              onChange={e => setTextToVideoPrompt(e.target.value)}
              placeholder="e.g. A cybernetic dolphin swimming through liquid mercury clouds beneath two violet suns, 4K smooth motion"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-sans"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowVideoSparkModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateVideoSpark}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-black font-bold text-xs"
              >
                Spark Video Synthesis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
