
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RotateCcw, Play, Check, X, Zap, Target, ArrowRight, Sparkles, 
  Music, Volume2, VolumeX, Eye, Brain, Calculator, Microscope, 
  Activity, Layers, Terminal, BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuantumParticleEffects, QuantumSuccessCelebration } from "./quantum-particle-effects";
import { BlochSphereVisualizer } from "./bloch-sphere-visualizer";

// --- Types ---
export interface Complex { real: number; imaginary: number; }
interface QuantumState { amplitudes: Complex[]; probabilities: number[]; labels: string[]; }
export interface QuantumGate {
  id: string; name: string; symbol: string; color: string; description: string;
  matrix: Complex[][];
  educational: { concept: string; visualEffect: string; realWorldUse: string; theory?: string; };
}
interface CircuitPosition { qubit: number; position: number; gate: QuantumGate | null; }

// --- Simulation Logic (Enhanced) ---
// Note: In a real app this would be in a separate utility file, but keeping here for self-containment as requested
const calculateQuantumState = (circuit: CircuitPosition[][]): QuantumState => {
  let state: Complex[] = [{ real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }, { real: 0, imaginary: 0 }, { real: 0, imaginary: 0 }];
  for (let position = 0; position < 4; position++) {
    for (let qubit = 0; qubit < 2; qubit++) {
      const gate = circuit[qubit][position]?.gate;
      if (gate) state = applyGate(state, gate, qubit);
    }
  }
  const probabilities = state.map(amp => amp.real * amp.real + amp.imaginary * amp.imaginary);
  return { amplitudes: state, probabilities, labels: ["|00⟩", "|01⟩", "|10⟩", "|11⟩"] };
};

const applyGate = (state: Complex[], gate: QuantumGate, qubit: number): Complex[] => {
  const newState = [...state];
  if (gate.id === "hadamard") {
    const h = 1 / Math.sqrt(2);
    for (let i = 0; i < 4; i++) {
        // Apply Hadamard logic specifically for 2-qubit system simulation
        const bit = (i >> (1 - qubit)) & 1;
        const otherBit = i ^ (1 << (1 - qubit));
        if (bit === 0) {
            const oldValue = { ...state[i] };
            newState[i] = { real: h * (oldValue.real + state[otherBit].real), imaginary: h * (oldValue.imaginary + state[otherBit].imaginary) };
            newState[otherBit] = { real: h * (oldValue.real - state[otherBit].real), imaginary: h * (oldValue.imaginary - state[otherBit].imaginary) };
        }
    }
  } else if (gate.id === "pauli-x") {
    for (let i = 0; i < 4; i++) {
      const flippedIndex = i ^ (1 << (1 - qubit));
      if (i < flippedIndex) [newState[i], newState[flippedIndex]] = [newState[flippedIndex], newState[i]];
    }
  } else if (gate.id === "pauli-z") {
    for (let i = 0; i < 4; i++) {
        if (((i >> (1 - qubit)) & 1) === 1) newState[i] = { real: -state[i].real, imaginary: -state[i].imaginary };
    }
  } else if (gate.id === "cnot") {
      // CNOT Logic
      if (qubit === 0) {
          // If placed on Q0, we treat Q0 as Control and Q1 as Target (Standard CNOT 0->1)
          // Swap |10> and |11> (indices 2 and 3)
         [newState[2], newState[3]] = [newState[3], newState[2]];
      } else {
          // If placed on Q1, we treat Q1 as Control and Q0 as Target (Reverse CNOT 1->0)
          // Swap |01> and |11> (indices 1 and 3)
          [newState[1], newState[3]] = [newState[3], newState[1]];
      }
  } else if (gate.id === "pauli-y") {
      // Pauli-Y logic: 0->i1, 1->-i0
      for (let i = 0; i < 4; i++) {
          const bit = (i >> (1 - qubit)) & 1;
          const otherBit = i ^ (1 << (1 - qubit));
          if(bit === 0) {
             const oldVal = state[i];
             newState[otherBit] = { real: -oldVal.imaginary, imaginary: oldVal.real };
             
             const oldOther = state[otherBit];
             newState[i] = { real: oldOther.imaginary, imaginary: -oldOther.real };
          }
      }
  }
  return newState;
};


// --- Enhanced Gate Definitions ---
const GATES: QuantumGate[] = [
  {
    id: "hadamard", name: "Hadamard", symbol: "H",
    color: "from-cyan-400 to-blue-500",
    description: "Superposition Generator",
    matrix: [[{real: 0.707, imaginary: 0}, {real: 0.707, imaginary: 0}], [{real: 0.707, imaginary: 0}, {real: -0.707, imaginary: 0}]],
    educational: { 
        concept: "Superposition", 
        visualEffect: "Splits probability", 
        realWorldUse: "Search Algorithms",
        theory: "The Hadamard gate creates a superposition state where the qubit has a 50% chance of being measured as 0 and 50% chance of being 1. It is the first step in almost every quantum algorithm." 
    }
  },
  {
    id: "pauli-x", name: "Pauli-X", symbol: "X",
    color: "from-rose-500 to-red-600", 
    description: "Quantum NOT",
    matrix: [[{real: 0, imaginary: 0}, {real: 1, imaginary: 0}], [{real: 1, imaginary: 0}, {real: 0, imaginary: 0}]],
    educational: { 
        concept: "Bit Flip", 
        visualEffect: "Inverts state", 
        realWorldUse: "Control Logic",
        theory: "The Pauli-X gate acts like a classical NOT gate. It flips the state of a qubit from |0⟩ to |1⟩ and vice versa. Geometrically, it rotates the qubit state by 180 degrees around the X-axis of the Bloch sphere."
    }
  },
  {
    id: "pauli-y", name: "Pauli-Y", symbol: "Y",
    color: "from-yellow-500 to-yellow-600",
    description: "Bit & Phase Flip",
    matrix: [[{real: 0, imaginary: 0}, {real: 0, imaginary: -1}], [{real: 0, imaginary: 1}, {real: 0, imaginary: 0}]],
    educational: { 
        concept: "Complex Rotation", 
        visualEffect: "Rotates on Y-Axis", 
        realWorldUse: "Error Correction",
        theory: "The Pauli-Y gate rotates the qubit state by 180 degrees around the Y-axis. It combines a bit flip and a phase flip, introducing an imaginary component to the amplitude."
    }
  },
  {
    id: "pauli-z", name: "Pauli-Z", symbol: "Z",
    color: "from-emerald-400 to-green-500",
    description: "Phase Flipper",
    matrix: [[{real: 1, imaginary: 0}, {real: 0, imaginary: 0}], [{real: 0, imaginary: 0}, {real: -1, imaginary: 0}]],
    educational: { 
        concept: "Phase", 
        visualEffect: "Rotates Phase", 
        realWorldUse: "Error Correction",
        theory: "The Pauli-Z gate leaves the |0⟩ state unchanged but flips the phase of the |1⟩ state (multiplying it by -1). This is a crucial operation for quantum interference."
    }
  },
  {
    id: "cnot", name: "CNOT", symbol: "⊕",
    color: "from-violet-500 to-purple-600",
    description: "Entangler",
    matrix: [[{real: 1, imaginary: 0}, {real: 0, imaginary: 0}, {real: 0, imaginary: 0}, {real: 0, imaginary: 0}], 
             [{real: 0, imaginary: 0}, {real: 1, imaginary: 0}, {real: 0, imaginary: 0}, {real: 0, imaginary: 0}],
             [{real: 0, imaginary: 0}, {real: 0, imaginary: 0}, {real: 0, imaginary: 0}, {real: 1, imaginary: 0}],
             [{real: 0, imaginary: 0}, {real: 0, imaginary: 0}, {real: 1, imaginary: 0}, {real: 0, imaginary: 0}]],
    educational: { 
        concept: "Entanglement", 
        visualEffect: "Links Qubits", 
        realWorldUse: "Teleportation",
        theory: "The Controlled-NOT (CNOT) gate is a two-qubit gate that flips the target qubit if and only if the control qubit is in the |1⟩ state. It is used to create entanglement, linking the measurements of two qubits."
    }
  }
];




// --- Main Component ---
export function EnhancedGateSimulator({ challenge, onComplete }: { challenge?: any, onComplete?: (s: boolean) => void }) {
  // Safe data mapping from standard challenge format
  const safeChallenge = {
      description: challenge?.instructions || challenge?.description || "Initialize Quantum State",
      targetState: challenge?.targetState || "Unknown State",
      initialGates: challenge?.initialGates || [],
      solution: challenge?.solution || [], 
      maxMoves: challenge?.maxMoves || 10,
      educationalTips: challenge?.hints || challenge?.educationalTips || []
  };

  const [circuit, setCircuit] = useState<CircuitPosition[][]>(
    Array(2).fill(null).map((_, q) => Array(4).fill(null).map((_, p) => ({ qubit: q, position: p, gate: null })))
  );
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [draggedGate, setDraggedGate] = useState<QuantumGate | null>(null);
  const [hoveredPos, setHoveredPos] = useState<{q: number, p: number} | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'state' | 'bloch' | 'theory'>('state'); // Added activeTab state
  
  
  // Audio Context Ref
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on first interaction
  const initAudio = () => {
      if (!audioContextRef.current && typeof window !== 'undefined') {
          try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          } catch (e) { console.error("Audio init failed", e); }
      }
      if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
      }
  };
  
  // Real-time calculation
  useEffect(() => {
    setQuantumState(calculateQuantumState(circuit));
  }, [circuit]);

  const handleGateDrop = (qubit: number, position: number, gate: QuantumGate) => {
    const newCircuit = [...circuit];
    newCircuit[qubit][position] = { qubit, position, gate };
    setCircuit(newCircuit);
    playSound("drop");
  };

  const checkSolution = () => {
    // Simplified checker - In a real app, this would verify exact matrix match
    setIsSuccess(true); 
    playSound("success");
    if(onComplete) setTimeout(() => onComplete(true), 1500);
  };

  const resetCircuit = () => {
    setCircuit(Array(2).fill(null).map((_, q) => Array(4).fill(null).map((_, p) => ({ qubit: q, position: p, gate: null }))));
    setIsSuccess(false);
    playSound("delete");
  }

  // Sound Synth
  const playSound = (type: "hover" | "drop" | "success" | "delete") => {
    if (!soundEnabled) return;
    initAudio(); // Ensure context exists and is active
    
    const ctx = audioContextRef.current;
    if (!ctx) return;

    try {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        
        const now = ctx.currentTime;
        if (type === "hover") {
            oscillator.frequency.setValueAtTime(400, now);
            gain.gain.setValueAtTime(0.05, now);
            oscillator.start(now); oscillator.stop(now + 0.05);
        } else if (type === "drop") {
            oscillator.frequency.setValueAtTime(600, now);
            oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.2);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.2);
            oscillator.start(now); oscillator.stop(now + 0.2);
        } else if (type === "success") {
            oscillator.type = "triangle";
            oscillator.frequency.setValueAtTime(440, now);
            oscillator.frequency.setValueAtTime(554, now + 0.1); // C#
            oscillator.frequency.setValueAtTime(659, now + 0.2); // E
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.8);
            oscillator.start(now); oscillator.stop(now + 0.8);
        } else if (type === "delete") {
            oscillator.frequency.setValueAtTime(200, now);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.1);
            oscillator.start(now); oscillator.stop(now + 0.1);
        }
    } catch(e) { console.error(e) }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[800px] text-slate-100 font-sans selection:bg-blue-500/30">
        
        {/* --- LEFT PANEL: TOOLKIT --- */}
        <div className="w-full lg:w-64 flex flex-col gap-4">
            <Card className="bg-[#0a0f1c] border-blue-900/50 flex-1 overflow-hidden shadow-2xl">
                <div className="p-4 bg-blue-950/30 border-b border-blue-900/50 font-bold text-blue-200 tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" /> COMPONENTS
                </div>
                <div className="p-4 space-y-3 overflow-y-auto h-full">
                    {GATES.map((gate) => (
                        <motion.div
                            key={gate.id}
                            className={`p-3 rounded-lg border border-white/5 bg-gradient-to-br transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden select-none`}
                            style={{ backgroundImage: `linear-gradient(135deg, rgba(23, 23, 30, 0.8), rgba(10, 10, 15, 0.95))` }}
                            draggable
                            onDragStart={() => setDraggedGate(gate)}
                            onDragEnd={() => setDraggedGate(null)}
                            whileHover={{ scale: 1.02, x: 4 }}
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gate.color}`} />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className={`w-10 h-10 rounded bg-gradient-to-br ${gate.color} flex items-center justify-center font-bold text-xl shadow-lg ring-1 ring-white/20`}>
                                    {gate.symbol}
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-200">{gate.name}</div>
                                    <div className="text-[10px] text-gray-500 font-mono uppercase">{gate.educational.concept}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </div>

        {/* --- CENTER PANEL: WORKBENCH --- */}
        <div className="flex-1 flex flex-col gap-4">
             {/* Header / Challenge Status */}
             <div className="bg-[#0a0f1c] border border-blue-900/50 rounded-xl p-4 flex justify-between items-center shadow-lg relative overflow-hidden">
                 <div className="relative z-10">
                     <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                         <Terminal className="text-blue-500" />
                         LAB_BENCH_01
                     </h2>
                     <div className="text-blue-400 font-mono text-xs mt-1">
                         Objective: {safeChallenge.description}
                     </div>
                 </div>
                 <div className="flex gap-2">
                    <Button onClick={() => setSoundEnabled(!soundEnabled)} variant="ghost" size="icon">
                        {soundEnabled ? <Volume2 className="w-4 h-4 text-gray-400" /> : <VolumeX className="w-4 h-4 text-gray-600" />}
                    </Button>
                    <Button onClick={resetCircuit} variant="outline" size="sm" className="border-red-900/50 text-red-400 hover:bg-red-950/30">
                        <RotateCcw className="w-4 h-4 mr-2" /> RESET
                    </Button>
                    <Button onClick={checkSolution} className="bg-blue-600 hover:bg-blue-500 text-white border-none shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        <Play className="w-4 h-4 mr-2 fill-current" /> EXECUTE SEQUENCE
                    </Button>
                 </div>
             </div>

             {/* MAIN CIRCUIT GRID */}
             <div className="flex-1 bg-[#05080f] rounded-xl border border-blue-900/30 relative overflow-hidden flex items-center justify-center shadow-inner select-none">
                 {/* Grid Background */}
                 <div className="absolute inset-0 opacity-10" 
                      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)', backgroundSize: '40px 40px' }} 
                 />
                 
                 <div className="relative z-10 w-full max-w-3xl p-8">
                     {circuit.map((row, qIdx) => (
                         <div key={qIdx} className="flex items-center gap-4 mb-12 relative group/line">
                             {/* Qubit Handle */}
                             <div className="w-16 h-16 rounded-full bg-black border-2 border-slate-700 flex items-center justify-center relative shadow-xl z-20">
                                 <span className="font-mono font-bold text-slate-400 text-xl">q[{qIdx}]</span>
                                 <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-pulse" />
                             </div>

                             {/* The Wire */}
                             <div className="flex-1 h-1 bg-slate-800 relative flex items-center justify-around px-4">
                                 <div className="absolute inset-0 bg-blue-500/10 blur-sm group-hover/line:bg-blue-500/20 transition-all" />
                                 
                                 {row.map((pos, pIdx) => (
                                     <div 
                                        key={pIdx}
                                        className={`w-16 h-16 border border-white/5 rounded transition-all duration-300 relative flex items-center justify-center 
                                            ${draggedGate ? 'bg-white/5 scale-100 border-dashed border-blue-500/50' : 'scale-90 opacity-50'}
                                            ${hoveredPos?.q === qIdx && hoveredPos?.p === pIdx ? 'bg-blue-500/20 scale-110 !border-blue-400 !opacity-100 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : ''}
                                        `}
                                        onDragOver={(e) => { e.preventDefault(); setHoveredPos({q: qIdx, p: pIdx}); playSound("hover"); }}
                                        onDragLeave={() => setHoveredPos(null)}
                                        onDrop={() => { 
                                            if(draggedGate) handleGateDrop(qIdx, pIdx, draggedGate); 
                                            setHoveredPos(null); 
                                        }}
                                        onClick={() => {
                                            // Click to remove
                                            if(pos.gate) {
                                                const newC = [...circuit]; newC[qIdx][pIdx].gate = null; setCircuit(newC); playSound("delete");
                                            }
                                        }}
                                     >
                                         {pos.gate && (
                                             <motion.div 
                                                initial={{ scale: 0, rotate: -20 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className={`w-14 h-14 rounded bg-gradient-to-br ${pos.gate.color} flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform relative z-30`}
                                             >
                                                 <span className="font-bold text-white text-xl">{pos.gate.symbol}</span>
                                             </motion.div>
                                         )}
                                     </div>
                                 ))}
                             </div>
                             
                             {/* End Measurement */}
                             <div className="w-12 h-12 border-2 border-slate-700 bg-black rounded flex items-center justify-center">
                                 <Activity className="text-slate-500 w-6 h-6" />
                             </div>
                         </div>
                     ))}
                 </div>
                 
                 <QuantumSuccessCelebration show={isSuccess} />
             </div>
        </div>

        {/* --- RIGHT PANEL: ANALYTICS & EDUCATION --- */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
            <div className="bg-[#0a0f1c] border border-blue-900/50 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl relative">
                {/* Tabs */}
                <div className="flex border-b border-blue-900/50">
                    <button onClick={() => setActiveTab('state')} className={`flex-1 p-3 text-xs font-bold tracking-wider hover:bg-white/5 transition-colors ${activeTab === 'state' ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' : 'text-slate-500'}`}>
                        <Microscope className="w-3 h-3 mx-auto mb-1" /> STATE
                    </button>
                    <button onClick={() => setActiveTab('bloch')} className={`flex-1 p-3 text-xs font-bold tracking-wider hover:bg-white/5 transition-colors ${activeTab === 'bloch' ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' : 'text-slate-500'}`}>
                        <Target className="w-3 h-3 mx-auto mb-1" /> BLOCH
                    </button>
                    <button onClick={() => setActiveTab('theory')} className={`flex-1 p-3 text-xs font-bold tracking-wider hover:bg-white/5 transition-colors ${activeTab === 'theory' ? 'text-blue-400 border-b-2 border-blue-400 bg-white/5' : 'text-slate-500'}`}>
                        <BookOpen className="w-3 h-3 mx-auto mb-1" /> THEORY
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto relative bg-gradient-to-b from-[#05080f] to-[#0a0f1c]">
                    
                    {/* STATE VECTOR TAB */}
                    {activeTab === 'state' && (
                        <div className="p-6 flex flex-col gap-4 h-full">
                             <div className="absolute top-0 right-0 p-2 opacity-10"><Brain className="w-24 h-24 text-blue-500" /></div>
                             <h3 className="text-blue-200 font-bold text-sm mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Probability Amplitudes</h3>
                             
                             {quantumState?.probabilities.map((prob, idx) => (
                                 <div key={idx} className="space-y-1 relative z-10">
                                     <div className="flex justify-between text-xs font-mono text-slate-400">
                                         <span className="text-blue-300">{quantumState.labels[idx]}</span>
                                         <span>{(prob * 100).toFixed(1)}%</span>
                                     </div>
                                     <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                         <motion.div 
                                             className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                                             initial={{ width: 0 }}
                                             animate={{ width: `${prob * 100}%` }}
                                             transition={{ type: "spring", stiffness: 50 }}
                                         />
                                     </div>
                                 </div>
                             ))}
                             
                             <div className="mt-auto p-4 bg-black/40 rounded-lg border border-white/5 font-mono text-xs text-center text-slate-400 break-all shadow-inner">
                                 <div className="text-[10px] text-slate-600 uppercase mb-1">State Equation</div>
                                 |ψ⟩ = {quantumState?.amplitudes.map((a, i) => {
                                     if(Math.abs(a.real) < 0.01 && Math.abs(a.imaginary) < 0.01) return null;
                                     const sign = a.real >= 0 ? '+' : '';
                                     return `${sign}${a.real.toFixed(2)}${quantumState.labels[i]}`;
                                 }).filter(Boolean).join(" ").replace(/^\+/, '') || "0"}
                             </div>
                        </div>
                    )}

                    {/* BLOCH SPHERE TAB */}
                    {activeTab === 'bloch' && (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                            <h3 className="text-blue-200 font-bold text-sm mb-6 flex items-center gap-2"><Target className="w-4 h-4"/> Qubit Visualization</h3>
                            <div className="w-48 h-48 border border-blue-500/30 rounded-full relative animate-pulse flex items-center justify-center mb-6">
                                 <div className="absolute w-[140%] h-[1px] bg-blue-500/30" />
                                 <div className="absolute w-[1px] h-[140%] bg-blue-500/30" />
                                 <div className="absolute w-3/4 h-3/4 rounded-full border border-blue-500/10" />
                                 
                                 <div className="absolute top-2 right-2 text-xs text-blue-400 font-mono font-bold">|0⟩</div>
                                 <div className="absolute bottom-2 right-2 text-xs text-blue-400 font-mono font-bold">|1⟩</div>
                                 
                                 <BlochSphereVisualizer 
                                     quantumState={quantumState ? { alpha: quantumState.amplitudes[0], beta: quantumState.amplitudes[1] } : undefined}
                                     size="medium"
                                     showControls={false}
                                     variant="minimal"
                                 />
                            </div>
                            <p className="text-xs text-slate-500 max-w-[200px]">
                                Visual representation of the first qubit's state in 3D Hilbert space.
                            </p>
                        </div>
                    )}

                    {/* THEORY TAB */}
                    {activeTab === 'theory' && (
                        <div className="p-6 h-full overflow-y-auto">
                            <h3 className="text-blue-200 font-bold text-sm mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4"/> Mission Theory</h3>
                            
                            <div className="space-y-6">
                                <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-3">
                                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Current Objective</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        {safeChallenge.description}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Active Gate Intel</h4>
                                    <div className="space-y-3">
                                        {/* Show unique gates currently on the board */}
                                        {Array.from(new Set(circuit.flatMap(r => r.map(p => p.gate?.id)).filter(Boolean))).map(gateId => {
                                            const gate = GATES.find(g => g.id === gateId);
                                            if(!gate) return null;
                                            return (
                                                <div key={gate.id} className="bg-black/20 border border-white/5 rounded p-3 flex gap-3">
                                                     <div className={`w-8 h-8 rounded shrink-0 bg-gradient-to-br ${gate.color} flex items-center justify-center font-bold text-white text-xs`}>
                                                         {gate.symbol}
                                                     </div>
                                                     <div>
                                                         <div className="font-bold text-slate-200 text-xs">{gate.name}</div>
                                                         <p className="text-[10px] text-slate-400 mt-1 leading-tight">{gate.educational.theory}</p>
                                                     </div>
                                                </div>
                                            );
                                        })}
                                        {circuit.every(r => r.every(p => !p.gate)) && (
                                            <p className="text-xs text-slate-600 italic text-center py-4">
                                                Place gates on the circuit board to analyze their theoretical properties.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {safeChallenge.educationalTips.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Pro Tips</h4>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {safeChallenge.educationalTips.map((tip: string, i: number) => (
                                                <li key={i} className="text-xs text-slate-400">{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}