export type AspectRatio = '16:9' | '9:16' | '2.39:1' | '1:1';

export type TransitionType = 
  | 'quantum-tunnel' 
  | 'superposition-dissolve' 
  | 'chromatic-glitch' 
  | 'entanglement-blur' 
  | 'neural-warp' 
  | 'cut';

export type MLStyleFilter = 
  | 'none'
  | 'quantum-chroma'
  | 'cyber-anamorphic'
  | 'kodak-vision3'
  | 'monochrome-qubit'
  | 'infrared-singularity';

export interface QuantumQubit {
  id: number;
  theta: number; // Bloch sphere polar angle [0, pi]
  phi: number;   // Bloch sphere azimuth angle [0, 2pi]
  gates: string[];
}

export interface IBMQPUCalibration {
  t1Microseconds: number;
  t2Microseconds: number;
  readoutErrorPercent: number;
  qubitCount: number;
  gateErrorPercent: number;
  temperatureMilliKelvin: number;
  status: 'online' | 'calibrating' | 'queued';
  lastPingMs: number;
}

export interface QuantumTelemetry {
  superpositionIndex: number; // 0 to 1
  entanglementCoherence: number; // %
  qubitStates: number[];
  circuitEntropy: number;
  ibmBackend: string;
  measuredProbabilities: { state: string; probability: number }[];
  openQasm30: string;
  isLiveHardware: boolean;
  jobId?: string;
  calibration: IBMQPUCalibration;
  connectionState: 'connected' | 'calibrating' | 'fallback_statevector';
}

export interface Shot {
  id: string;
  shotNumber: number;
  title: string;
  durationSec: number;
  narrativeAction: string;
  visualPrompt: string;
  cameraMovement: string;
  lightingStyle: string;
  soundCue: string;
  imageUrl?: string;
  videoUrl?: string;
  isGeneratingVideo?: boolean;
  videoProgressMessage?: string;
  transitionToNext: TransitionType;
  mlStyleFilter?: MLStyleFilter;
  quantumModulation: {
    entropySeed: number;
    colorShift: string;
    motionIntensity: number;
    eigenstate: string;
  };
}

export interface MovieExportProgress {
  isRendering: boolean;
  currentFrame: number;
  totalFrames: number;
  fps: number;
  percentage: number;
  stageMessage: string;
  downloadUrl?: string;
  fileSizeBytes?: number;
}

export interface AgentLog {
  id: string;
  agent: 'Quantum Brain' | 'Screenwriter' | 'Concept Artist' | 'Veo Motion Engine' | 'Transition ML';
  message: string;
  timestamp: string;
  status: 'pending' | 'active' | 'completed' | 'warning';
  dataPayload?: string;
}

export interface FilmProject {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
  aspectRatio: AspectRatio;
  quantumMode: 'conservative' | 'superposition' | 'chaotic-multiverse';
  activeMlFilter: MLStyleFilter;
  grainIntensity: number; // 0 to 100
  anamorphicFlare: number; // 0 to 100
  opticalFlowSpeed: number; // 0.5 to 2.0
  shots: Shot[];
  createdAt: number;
}
