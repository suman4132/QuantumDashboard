import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RotateCcw, 
  Play, 
  Check, 
  X, 
  Zap, 
  Target,
  ArrowRight,
  Sparkles,
  Music,
  Volume2,
  VolumeX,
  Eye,
  Brain,
  Calculator
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuantumParticleEffects, QuantumSuccessCelebration } from "./quantum-particle-effects";
import { BlochSphereVisualizer } from "./bloch-sphere-visualizer";

// Enhanced quantum state representation
interface QuantumState {
  amplitudes: Complex[];
  probabilities: number[];
  labels: string[];
}

interface Complex {
  real: number;
  imaginary: number;
}

// Enhanced quantum gate with matrix operations
interface QuantumGate {
  id: string;
  name: string;
  symbol: string;
  color: string;
  description: string;
  matrix: Complex[][];
  educational: {
    concept: string;
    visualEffect: string;
    realWorldUse: string;
  };
}

interface CircuitPosition {
  qubit: number;
  position: number;
  gate: QuantumGate | null;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  targetState: string;
  initialGates: QuantumGate[];
  solution: { qubit: number; position: number; gateId: string }[];
  maxMoves: number;
  educationalTips: string[];
}

// Enhanced quantum gates with complete matrices and educational content
const ENHANCED_QUANTUM_GATES: QuantumGate[] = [
  {
    id: "hadamard",
    name: "Hadamard",
    symbol: "H",
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    description: "Creates equal superposition - the foundation of quantum computing",
    matrix: [
      [{ real: 1/Math.sqrt(2), imaginary: 0 }, { real: 1/Math.sqrt(2), imaginary: 0 }],
      [{ real: 1/Math.sqrt(2), imaginary: 0 }, { real: -1/Math.sqrt(2), imaginary: 0 }]
    ],
    educational: {
      concept: "Superposition",
      visualEffect: "Transforms |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ - |1⟩)/√2",
      realWorldUse: "Used in quantum algorithms like Grover's search and Shor's factoring"
    }
  },
  {
    id: "pauli-x",
    name: "Pauli-X",
    symbol: "X",
    color: "bg-gradient-to-r from-red-500 to-red-600",
    description: "Quantum NOT gate - flips qubit states like a classical bit flip",
    matrix: [
      [{ real: 0, imaginary: 0 }, { real: 1, imaginary: 0 }],
      [{ real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }]
    ],
    educational: {
      concept: "Bit Flip",
      visualEffect: "Flips |0⟩ ↔ |1⟩",
      realWorldUse: "Error correction and quantum state manipulation"
    }
  },
  {
    id: "pauli-y",
    name: "Pauli-Y",
    symbol: "Y",
    color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
    description: "Combined bit and phase flip - rotates around Y-axis of Bloch sphere",
    matrix: [
      [{ real: 0, imaginary: 0 }, { real: 0, imaginary: -1 }],
      [{ real: 0, imaginary: 1 }, { real: 0, imaginary: 0 }]
    ],
    educational: {
      concept: "Y-Rotation",
      visualEffect: "Applies both bit flip and phase: |0⟩ → i|1⟩, |1⟩ → -i|0⟩",
      realWorldUse: "Quantum error correction and universal gate sets"
    }
  },
  {
    id: "pauli-z",
    name: "Pauli-Z",
    symbol: "Z",
    color: "bg-gradient-to-r from-green-500 to-green-600",
    description: "Phase flip gate - adds π phase to |1⟩ state without changing probabilities",
    matrix: [
      [{ real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }],
      [{ real: 0, imaginary: 0 }, { real: -1, imaginary: 0 }]
    ],
    educational: {
      concept: "Phase Flip",
      visualEffect: "Leaves |0⟩ unchanged, flips phase of |1⟩: |1⟩ → -|1⟩",
      realWorldUse: "Phase-based quantum algorithms and interference effects"
    }
  },
  {
    id: "cnot",
    name: "CNOT",
    symbol: "⊕",
    color: "bg-gradient-to-r from-purple-500 to-purple-600",
    description: "Controlled-NOT - creates entanglement between qubits",
    matrix: [
      [{ real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }, { real: 0, imaginary: 0 }, { real: 0, imaginary: 0 }],
      [{ real: 0, imaginary: 0 }, { real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }, { real: 0, imaginary: 0 }],
      [{ real: 0, imaginary: 0 }, { real: 0, imaginary: 0 }, { real: 0, imaginary: 0 }, { real: 1, imaginary: 0 }],
      [{ real: 0, imaginary: 0 }, { real: 0, imaginary: 0 }, { real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }]
    ],
    educational: {
      concept: "Entanglement",
      visualEffect: "Flips target qubit if control is |1⟩, creates Bell states",
      realWorldUse: "Quantum cryptography, teleportation, and error correction"
    }
  }
];

// Quantum state calculation utilities
const calculateQuantumState = (circuit: CircuitPosition[][]): QuantumState => {
  // Start with |00⟩ state
  let state: Complex[] = [
    { real: 1, imaginary: 0 }, // |00⟩
    { real: 0, imaginary: 0 }, // |01⟩
    { real: 0, imaginary: 0 }, // |10⟩
    { real: 0, imaginary: 0 }  // |11⟩
  ];

  // Apply gates in order
  for (let position = 0; position < 4; position++) {
    for (let qubit = 0; qubit < 2; qubit++) {
      const gate = circuit[qubit][position]?.gate;
      if (gate) {
        state = applyGate(state, gate, qubit);
      }
    }
  }

  const probabilities = state.map(amp => amp.real * amp.real + amp.imaginary * amp.imaginary);
  const labels = ["|00⟩", "|01⟩", "|10⟩", "|11⟩"];

  return { amplitudes: state, probabilities, labels };
};

const applyGate = (state: Complex[], gate: QuantumGate, qubit: number): Complex[] => {
  const newState = [...state];
  
  if (gate.id === "hadamard") {
    const h = 1 / Math.sqrt(2);
    for (let i = 0; i < 4; i++) {
      const bit = (i >> (1 - qubit)) & 1;
      const otherBit = i ^ (1 << (1 - qubit));
      if (bit === 0) {
        const oldValue = { ...state[i] };
        newState[i] = {
          real: h * (oldValue.real + state[otherBit].real),
          imaginary: h * (oldValue.imaginary + state[otherBit].imaginary)
        };
        newState[otherBit] = {
          real: h * (oldValue.real - state[otherBit].real),
          imaginary: h * (oldValue.imaginary - state[otherBit].imaginary)
        };
      }
    }
  } else if (gate.id === "pauli-x") {
    for (let i = 0; i < 4; i++) {
      const flippedIndex = i ^ (1 << (1 - qubit));
      if (i < flippedIndex) {
        [newState[i], newState[flippedIndex]] = [newState[flippedIndex], newState[i]];
      }
    }
  } else if (gate.id === "pauli-z") {
    for (let i = 0; i < 4; i++) {
      const bit = (i >> (1 - qubit)) & 1;
      if (bit === 1) {
        newState[i] = {
          real: -state[i].real,
          imaginary: -state[i].imaginary
        };
      }
    }
  }
  
  return newState;
};

// Sound effects utility
const playSound = (frequency: number, duration: number = 100) => {
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (e) {
      // Silently fail if audio is not supported
    }
  }
};

interface EnhancedGateSimulatorProps {
  challenge?: Challenge;
  onComplete?: (success: boolean) => void;
}

export function EnhancedGateSimulator({ challenge, onComplete }: EnhancedGateSimulatorProps) {
  const [circuit, setCircuit] = useState<CircuitPosition[][]>(
    Array(2).fill(null).map((_, qubit) =>
      Array(4).fill(null).map((_, pos) => ({ qubit, position: pos, gate: null }))
    )
  );
  const [draggedGate, setDraggedGate] = useState<QuantumGate | null>(null);
  const [selectedGate, setSelectedGate] = useState<QuantumGate | null>(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStateDetails, setShowStateDetails] = useState(false);
  const [animatingGate, setAnimatingGate] = useState<{qubit: number, position: number} | null>(null);
  const [particleEffect, setParticleEffect] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showBlochSphere, setShowBlochSphere] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  // Default challenge if none provided
  const defaultChallenge: Challenge = {
    id: "superposition-intro",
    title: "Create Superposition",
    description: "Use a Hadamard gate to put the first qubit into superposition state",
    targetState: "|+⟩ ⊗ |0⟩",
    initialGates: [ENHANCED_QUANTUM_GATES[0]], // Only Hadamard
    solution: [{ qubit: 0, position: 0, gateId: "hadamard" }],
    maxMoves: 1,
    educationalTips: [
      "The Hadamard gate creates superposition",
      "Superposition means the qubit is in both |0⟩ and |1⟩ states simultaneously",
      "This is the foundation of quantum computing's power"
    ]
  };

  const currentChallenge = challenge || defaultChallenge;

  // Calculate quantum state whenever circuit changes
  useEffect(() => {
    const state = calculateQuantumState(circuit);
    setQuantumState(state);
  }, [circuit]);

  const resetCircuit = useCallback(() => {
    setCircuit(
      Array(2).fill(null).map((_, qubit) =>
        Array(4).fill(null).map((_, pos) => ({ qubit, position: pos, gate: null }))
      )
    );
    setMoves(0);
    setIsComplete(false);
    setShowResult(false);
    if (soundEnabled) playSound(200, 150);
  }, [soundEnabled]);

  const checkSolution = useCallback(() => {
    const currentCircuit = circuit.flatMap(row => 
      row.filter(pos => pos.gate !== null).map(pos => ({
        qubit: pos.qubit,
        position: pos.position,
        gateId: pos.gate!.id
      }))
    );

    const isCorrect = currentChallenge.solution.length === currentCircuit.length &&
      currentChallenge.solution.every(solution => 
        currentCircuit.some(current => 
          current.qubit === solution.qubit && 
          current.gateId === solution.gateId
        )
      );

    setIsComplete(isCorrect);
    setShowResult(true);

    if (isCorrect) {
      if (soundEnabled) playSound(600, 300); // Success sound
      setShowCelebration(true);
      setParticleEffect('quantum-burst');
      toast({
        title: "🎉 Quantum State Achieved!",
        description: `Perfect! You created the target state in ${moves} moves!`,
      });
      setTimeout(() => {
        setShowCelebration(false);
        setParticleEffect(null);
        onComplete?.(true); // Call completion after celebration
      }, 1500); // Reduced delay so completion happens sooner
    } else {
      if (soundEnabled) playSound(200, 200); // Error sound
      toast({
        title: "State Mismatch",
        description: "The quantum state doesn't match the target. Try again!",
        variant: "destructive"
      });
    }
  }, [circuit, currentChallenge.solution, moves, toast, onComplete, soundEnabled]);

  const placeGate = useCallback((qubit: number, position: number, gate: QuantumGate) => {
    const newCircuit = [...circuit];
    newCircuit[qubit][position] = { qubit, position, gate };
    
    setCircuit(newCircuit);
    setMoves(prev => prev + 1);
    
    // Animate gate placement with particle effects
    setAnimatingGate({ qubit, position });
    setParticleEffect('gate-placement');
    setTimeout(() => {
      setAnimatingGate(null);
      setParticleEffect(null);
    }, 500);
    
    // Play gate-specific sound
    if (soundEnabled) {
      const gateFrequencies: Record<string, number> = {
        hadamard: 440,
        "pauli-x": 330,
        "pauli-y": 370,
        "pauli-z": 415,
        cnot: 523
      };
      playSound(gateFrequencies[gate.id] || 400, 100);
    }
  }, [circuit, soundEnabled]);

  const handleDrop = useCallback((qubit: number, position: number) => {
    if (!draggedGate && !selectedGate) return;
    
    const gate = draggedGate || selectedGate;
    if (!gate) return;

    placeGate(qubit, position, gate);
    setDraggedGate(null);
    setSelectedGate(null);
    setIsDragging(false);
  }, [draggedGate, selectedGate, placeGate]);

  const handleCircuitClick = useCallback((qubit: number, position: number) => {
    if (circuit[qubit][position].gate) {
      // Remove gate if clicking on existing gate
      removeGate(qubit, position);
      return;
    }
    
    if (selectedGate) {
      // Place selected gate
      placeGate(qubit, position, selectedGate);
      setSelectedGate(null);
    }
  }, [circuit, selectedGate, placeGate]);

  const removeGate = useCallback((qubit: number, position: number) => {
    const newCircuit = [...circuit];
    newCircuit[qubit][position] = { qubit, position, gate: null };
    setCircuit(newCircuit);
    if (soundEnabled) playSound(150, 100);
  }, [circuit, soundEnabled]);

  return (
    <div className="space-y-6">
      {/* Enhanced Challenge Info with Educational Content */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              {currentChallenge.title}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                data-testid="button-toggle-sound"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStateDetails(!showStateDetails)}
                data-testid="button-toggle-details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBlochSphere(!showBlochSphere)}
                data-testid="button-toggle-bloch"
              >
                <Target className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {currentChallenge.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Target State:</span>
                  <Badge variant="outline" className="font-mono text-blue-600">
                    {currentChallenge.targetState}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Moves:</span>
                  <Badge variant={moves > currentChallenge.maxMoves ? "destructive" : "secondary"}>
                    {moves}/{currentChallenge.maxMoves}
                  </Badge>
                </div>
              </div>
              <Progress value={(moves / currentChallenge.maxMoves) * 100} className="h-2" />
            </div>
            
            {/* Educational Tips */}
            <div className="bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <Brain className="h-4 w-4" />
                Learning Tips
              </h4>
              <ul className="text-xs space-y-1">
                {currentChallenge.educationalTips.map((tip, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={`grid ${showBlochSphere ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        {/* Enhanced Gate Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quantum Gate Toolkit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {currentChallenge.initialGates.map((gate) => (
                <motion.div
                  key={gate.id}
                  drag
                  dragSnapToOrigin
                  onDragStart={() => {
                    setDraggedGate(gate);
                    setIsDragging(true);
                  }}
                  onDragEnd={() => {
                    setDraggedGate(null);
                    setIsDragging(false);
                  }}
                  onClick={() => {
                    if (!isDragging) {
                      setSelectedGate(selectedGate?.id === gate.id ? null : gate);
                      toast({
                        title: selectedGate?.id === gate.id ? "Gate Deselected" : "Gate Selected",
                        description: selectedGate?.id === gate.id ? "Click on a circuit position to place the gate" : `${gate.name} selected. Click on a circuit position to place it.`,
                      });
                    }
                  }}
                  whileDrag={{ scale: 1.1, rotate: 5 }}
                  whileHover={{ scale: 1.02 }}
                  className={`${gate.color} text-white p-4 rounded-xl cursor-pointer shadow-lg border-2 transition-all ${
                    selectedGate?.id === gate.id ? 'border-yellow-300 ring-2 ring-yellow-300' : 'border-white/20'
                  } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                  data-testid={`gate-${gate.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold bg-white/20 rounded-lg w-12 h-12 flex items-center justify-center">
                      {gate.symbol}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{gate.name}</h4>
                      <p className="text-sm opacity-90">{gate.description}</p>
                      {selectedGate?.id === gate.id && (
                        <div className="text-xs mt-1 bg-yellow-400/20 px-2 py-1 rounded">
                          Click circuit to place gate
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Educational info */}
                  {gate.educational && (
                    <div className="mt-3 p-2 bg-white/10 rounded-lg text-xs space-y-1">
                      <div><strong>Concept:</strong> {gate.educational.concept}</div>
                      <div><strong>Effect:</strong> {gate.educational.visualEffect}</div>
                      <div><strong>Used in:</strong> {gate.educational.realWorldUse}</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bloch Sphere Visualization */}
        {showBlochSphere && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <BlochSphereVisualizer
              quantumState={quantumState ? {
                alpha: quantumState.amplitudes[0],
                beta: quantumState.amplitudes[1]
              } : undefined}
              showControls={false}
              size="medium"
            />
          </motion.div>
        )}

        {/* Quantum State Visualization */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Quantum State Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quantumState && (
              <div className="space-y-4">
                {/* State Probabilities Visualization */}
                <div className="space-y-2">
                  {quantumState.labels.map((label, index) => {
                    const probability = quantumState.probabilities[index];
                    const amplitude = quantumState.amplitudes[index];
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-1"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-sm">{label}</span>
                          <span className="text-xs text-gray-600">
                            {(probability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={probability * 100} 
                            className="h-3"
                          />
                          <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${probability * 100}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          />
                        </div>
                        {showStateDetails && (
                          <div className="text-xs text-gray-500 font-mono">
                            Amplitude: {amplitude.real.toFixed(3)} + {amplitude.imaginary.toFixed(3)}i
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* State Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="font-medium">Current State:</div>
                    <div className="font-mono text-xs">
                      {quantumState.amplitudes.map((amp, index) => {
                        if (Math.abs(amp.real) < 0.001 && Math.abs(amp.imaginary) < 0.001) return '';
                        const sign = index === 0 ? '' : ' + ';
                        const coeff = Math.abs(amp.real - 1) < 0.001 ? '' : amp.real.toFixed(3);
                        return `${sign}${coeff}${quantumState.labels[index]}`;
                      }).filter(Boolean).join('') || '|00⟩'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quantum Circuit Builder */}
      <Card className="relative overflow-hidden">
        {/* Particle Effects Overlay */}
        <QuantumParticleEffects
          trigger={particleEffect || undefined}
          intensity="medium"
          effectType={isComplete ? 'success' : 'quantum'}
          width={800}
          height={200}
          className="absolute inset-0 pointer-events-none z-10"
        />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Quantum Circuit Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Circuit Grid */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-6 rounded-xl">
              {circuit.map((row, qubitIndex) => (
                <div key={qubitIndex} className="flex items-center gap-2 mb-4 last:mb-0">
                  {/* Qubit Label */}
                  <div className="w-12 text-center">
                    <Badge variant="outline" className="font-mono">
                      q{qubitIndex}
                    </Badge>
                  </div>

                  {/* Quantum Wire */}
                  <div className="flex-1 relative">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-400 dark:bg-gray-600" />
                    <div className="flex gap-4 relative z-10">
                      {row.map((position, posIndex) => (
                        <motion.div
                          key={`${qubitIndex}-${posIndex}`}
                          className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 ${
                            position.gate 
                              ? 'border-solid border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-dashed border-gray-300 dark:border-gray-600'
                          } ${
                            (draggedGate || selectedGate) && !position.gate 
                              ? 'border-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30' 
                              : ''
                          } ${
                            position.gate 
                              ? 'hover:bg-red-50 dark:hover:bg-red-900/20' 
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDrop(qubitIndex, posIndex);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('bg-green-100', 'dark:bg-green-900/40');
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('bg-green-100', 'dark:bg-green-900/40');
                          }}
                          onClick={() => handleCircuitClick(qubitIndex, posIndex)}
                          whileHover={{ scale: 1.05 }}
                          animate={
                            animatingGate?.qubit === qubitIndex && animatingGate?.position === posIndex
                              ? { scale: [1, 1.2, 1], rotate: [0, 360, 0] }
                              : {}
                          }
                          data-testid={`circuit-position-${qubitIndex}-${posIndex}`}
                        >
                          {position.gate && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className={`${position.gate.color} text-white w-full h-full rounded-lg flex items-center justify-center font-bold text-lg shadow-lg`}
                            >
                              {position.gate.symbol}
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* State Indicator */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {qubitIndex}
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions and Help */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                How to Use the Circuit Builder:
              </h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                <div>
                  <strong>🖱️ Drag & Drop:</strong>
                  <ul className="mt-1 space-y-1 ml-4">
                    <li>• Drag gates from toolkit to circuit positions</li>
                    <li>• Drop zones turn green when valid</li>
                  </ul>
                </div>
                <div>
                  <strong>👆 Click Mode:</strong>
                  <ul className="mt-1 space-y-1 ml-4">
                    <li>• Click gate to select (highlighted in yellow)</li>
                    <li>• Click circuit position to place gate</li>
                    <li>• Click placed gates to remove them</li>
                  </ul>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <strong>🎯 Goal:</strong> Create the quantum state <span className="font-mono bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{currentChallenge.targetState}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={checkSolution}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                data-testid="button-check-solution"
              >
                <Check className="h-4 w-4 mr-2" />
                Check Solution
              </Button>
              <Button
                onClick={resetCircuit}
                variant="outline"
                data-testid="button-reset-circuit"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Circuit
              </Button>
              <Button
                onClick={() => setShowStateDetails(!showStateDetails)}
                variant="ghost"
                data-testid="button-toggle-advanced"
              >
                <Brain className="h-4 w-4 mr-2" />
                {showStateDetails ? 'Hide' : 'Show'} Details
              </Button>
              {selectedGate && (
                <Button 
                  onClick={() => setSelectedGate(null)} 
                  variant="secondary" 
                  size="sm"
                  data-testid="button-deselect"
                >
                  <X className="h-4 w-4 mr-2" />
                  Deselect Gate
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Celebration */}
      <QuantumSuccessCelebration
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />

      {/* Result Display */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className={`${isComplete ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-red-50 border-red-200 dark:bg-red-900/20'}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-green-500' : 'bg-red-500'
                  } text-white`}>
                    {isComplete ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {isComplete ? '🎉 Quantum State Achieved!' : '❌ State Mismatch'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {isComplete 
                        ? `Perfect! You successfully created the target quantum state in ${moves} moves.`
                        : 'The current quantum state doesn\'t match the target. Try adjusting your circuit!'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}