import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  Play, 
  Check, 
  X, 
  Zap, 
  Target,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types for quantum gates and circuits
interface QuantumGate {
  id: string;
  name: string;
  symbol: string;
  color: string;
  description: string;
  matrix?: number[][];
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
}

// Available quantum gates
const QUANTUM_GATES: QuantumGate[] = [
  {
    id: "hadamard",
    name: "Hadamard",
    symbol: "H",
    color: "bg-blue-500",
    description: "Creates superposition - puts qubit in equal probability of |0⟩ and |1⟩",
    matrix: [[1, 1], [1, -1]]
  },
  {
    id: "pauli-x",
    name: "Pauli-X",
    symbol: "X",
    color: "bg-red-500", 
    description: "Bit flip - flips |0⟩ to |1⟩ and |1⟩ to |0⟩"
  },
  {
    id: "pauli-y",
    name: "Pauli-Y",
    symbol: "Y", 
    color: "bg-yellow-500",
    description: "Bit and phase flip combined"
  },
  {
    id: "pauli-z",
    name: "Pauli-Z",
    symbol: "Z",
    color: "bg-green-500",
    description: "Phase flip - adds π phase to |1⟩ state"
  },
  {
    id: "cnot",
    name: "CNOT",
    symbol: "⊕",
    color: "bg-purple-500",
    description: "Controlled-NOT - flips target qubit if control is |1⟩"
  }
];

// Sample challenge
const SAMPLE_CHALLENGE: Challenge = {
  id: "superposition-intro",
  title: "Create Superposition",
  description: "Use a Hadamard gate to put the first qubit into superposition state |+⟩ = (|0⟩ + |1⟩)/√2",
  targetState: "|+⟩ ⊗ |0⟩",
  initialGates: [QUANTUM_GATES[0]], // Only Hadamard available
  solution: [{ qubit: 0, position: 0, gateId: "hadamard" }],
  maxMoves: 1
};

interface GateSimulatorProps {
  challenge?: Challenge;
  onComplete?: (success: boolean) => void;
}

export function GateSimulator({ challenge = SAMPLE_CHALLENGE, onComplete }: GateSimulatorProps) {
  const [circuit, setCircuit] = useState<CircuitPosition[][]>(
    Array(2).fill(null).map((_, qubit) =>
      Array(4).fill(null).map((_, pos) => ({ qubit, position: pos, gate: null }))
    )
  );
  const [draggedGate, setDraggedGate] = useState<QuantumGate | null>(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  const resetCircuit = useCallback(() => {
    setCircuit(
      Array(2).fill(null).map((_, qubit) =>
        Array(4).fill(null).map((_, pos) => ({ qubit, position: pos, gate: null }))
      )
    );
    setMoves(0);
    setIsComplete(false);
    setShowResult(false);
  }, []);

  const checkSolution = useCallback(() => {
    const currentCircuit = circuit.flatMap(row => 
      row.filter(pos => pos.gate !== null).map(pos => ({
        qubit: pos.qubit,
        position: pos.position,
        gateId: pos.gate!.id
      }))
    );

    const isCorrect = challenge.solution.length === currentCircuit.length &&
      challenge.solution.every(solution => 
        currentCircuit.some(current => 
          current.qubit === solution.qubit && 
          current.gateId === solution.gateId
        )
      );

    setIsComplete(isCorrect);
    setShowResult(true);

    if (isCorrect) {
      toast({
        title: "🎉 Challenge Solved!",
        description: `You created the target state in ${moves} moves!`,
      });
      onComplete?.(true);
    } else {
      toast({
        title: "Not quite right",
        description: "Try a different gate arrangement. Check the target state!",
        variant: "destructive"
      });
    }
  }, [circuit, challenge.solution, moves, toast, onComplete]);

  const handleDrop = useCallback((qubit: number, position: number) => {
    if (!draggedGate) return;

    const newCircuit = [...circuit];
    newCircuit[qubit][position] = { qubit, position, gate: draggedGate };
    
    setCircuit(newCircuit);
    setMoves(prev => prev + 1);
    setDraggedGate(null);
  }, [circuit, draggedGate]);

  const removeGate = useCallback((qubit: number, position: number) => {
    const newCircuit = [...circuit];
    newCircuit[qubit][position] = { qubit, position, gate: null };
    setCircuit(newCircuit);
  }, [circuit]);

  return (
    <div className="space-y-6">
      {/* Challenge Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {challenge.title}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {challenge.description}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Target State:</span>
              <Badge variant="outline" className="font-mono">
                {challenge.targetState}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Moves:</span>
              <Badge variant={moves > challenge.maxMoves ? "destructive" : "secondary"}>
                {moves}/{challenge.maxMoves}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gate Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Available Gates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {challenge.initialGates.map((gate) => (
                <motion.div
                  key={gate.id}
                  drag
                  dragSnapToOrigin
                  onDragStart={() => setDraggedGate(gate)}
                  onDragEnd={() => setDraggedGate(null)}
                  whileDrag={{ scale: 1.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`${gate.color} text-white p-4 rounded-lg cursor-grab active:cursor-grabbing shadow-lg`}
                  data-testid={`gate-${gate.id}`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{gate.symbol}</div>
                    <div className="text-xs font-medium">{gate.name}</div>
                  </div>
                  <div className="text-xs mt-2 opacity-90">{gate.description}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quantum Circuit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5" />
              Quantum Circuit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Qubit Lines */}
              {circuit.map((row, qubitIndex) => (
                <div key={qubitIndex} className="flex items-center gap-2">
                  <div className="w-12 text-sm font-mono">
                    |q{qubitIndex}⟩
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="h-px bg-gray-400 flex-1 relative">
                      {/* Gate Positions */}
                      <div className="absolute inset-0 flex items-center justify-around">
                        {row.map((position) => (
                          <motion.div
                            key={`${position.qubit}-${position.position}`}
                            onDrop={() => handleDrop(position.qubit, position.position)}
                            onDragOver={(e) => e.preventDefault()}
                            className="relative"
                            data-testid={`position-${position.qubit}-${position.position}`}
                          >
                            {position.gate ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                onClick={() => removeGate(position.qubit, position.position)}
                                className={`${position.gate.color} text-white w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer shadow-lg`}
                              >
                                <span className="text-lg font-bold">
                                  {position.gate.symbol}
                                </span>
                              </motion.div>
                            ) : (
                              <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-sm font-mono text-right">
                    {qubitIndex === 0 ? (isComplete ? challenge.targetState.split(' ⊗ ')[0] : '|0⟩') : '|0⟩'}
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={checkSolution}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                data-testid="button-run-circuit"
              >
                <Play className="h-4 w-4 mr-2" />
                Run Circuit
              </Button>
              <Button 
                variant="outline"
                onClick={resetCircuit}
                data-testid="button-reset-circuit"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">
                  {isComplete ? "🎉" : "🤔"}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {isComplete ? "Success!" : "Try Again"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {isComplete 
                    ? `You successfully created the target state in ${moves} moves!`
                    : "The circuit didn't produce the expected result. Check the target state and try different gates."
                  }
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowResult(false)}
                    variant={isComplete ? "default" : "outline"}
                    className="flex-1"
                  >
                    {isComplete ? "Continue" : "Try Again"}
                  </Button>
                  {!isComplete && (
                    <Button
                      onClick={() => {
                        resetCircuit();
                        setShowResult(false);
                      }}
                      variant="outline"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}