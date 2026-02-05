import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  Clock, 
  Zap,
  Target,
  Trophy
} from "lucide-react";
import { EnhancedGateSimulator } from "./enhanced-gate-simulator";
import { QuantumJobIntegration } from "./quantum-job-integration";
import { useToast } from "@/hooks/use-toast";
import { QuantumTutorialSystem, QuantumHint } from "./quantum-tutorial-system";

// Import enhanced quantum gates to ensure proper educational data
const ENHANCED_QUANTUM_GATES = [
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
    description: "Quantum NOT gate - flips qubit state",
    matrix: [
      [{ real: 0, imaginary: 0 }, { real: 1, imaginary: 0 }],
      [{ real: 1, imaginary: 0 }, { real: 0, imaginary: 0 }]
    ],
    educational: {
      concept: "Bit Flip",
      visualEffect: "Flips |0⟩ → |1⟩ and |1⟩ → |0⟩",
      realWorldUse: "Error correction, quantum state preparation"
    }
  },
  {
    id: "cnot",
    name: "CNOT",
    symbol: "CNOT",
    color: "bg-gradient-to-r from-purple-500 to-purple-600",
    description: "Controlled NOT - creates entanglement between qubits",
    educational: {
      concept: "Entanglement",
      visualEffect: "Flips target if control is |1⟩",
      realWorldUse: "Bell states, error correction, quantum teleportation"
    }
  }
];

// Helper function to get gate by ID
const getGateById = (id: string) => ENHANCED_QUANTUM_GATES.find(gate => gate.id === id);

// Enhanced challenge types
export interface LevelChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'research';
  points: number;
  timeLimit?: number;
  category: string;
  learningObjectives: string[];
  educationalTips?: string[]; // Added precise learning tips
  challenge: {
    type: 'gate-builder' | 'circuit-analysis' | 'algorithm-implementation' | 'research-project';
    instructions: string;
    targetState?: string;
    initialGates: any[];
    solution: any[];
    maxMoves: number;
    hints?: string[];
  };
}

// Sample challenges for different levels
const LEVEL_CHALLENGES: Record<string, LevelChallenge> = {
  "qb-101": {
    id: "qb-101",
    title: "First Qubit",
    description: "Learn what a qubit is and how it differs from classical bits",
    difficulty: "beginner",
    points: 100,
    timeLimit: 300, // 5 minutes
    category: "Quantum Basics",
    learningObjectives: [
      "Understand the concept of a qubit",
      "Differentiate between |0⟩ and |1⟩ states",
      "Visualize quantum state representation"
    ],
    educationalTips: [
      "Classical bits are either 0 or 1, like a light switch.",
      "Qubits can be in a state of 'superposition', allowing them to be complex combinations of 0 and 1 simultaneously.",
      "The notation |0⟩ is Dirac notation (bra-ket) for a quantum state vector.",
      "In the Bloch sphere representation, |0⟩ is the North Pole and |1⟩ is the South Pole."
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Click on the qubit to see it in the |0⟩ state. This is your first quantum bit!",
      targetState: "|0⟩",
      initialGates: [], // No gates needed for this intro
      solution: [],
      maxMoves: 0
    }
  },
  "qb-102": {
    id: "qb-102", 
    title: "Superposition States",
    description: "Master the concept of quantum superposition with interactive examples",
    difficulty: "beginner",
    points: 150,
    timeLimit: 600, // 10 minutes
    category: "Quantum Basics",
    learningObjectives: [
      "Create superposition using Hadamard gates",
      "Understand equal probability states",
      "Measure superposition outcomes"
    ],
    educationalTips: [
      "The Hadamard gate maps |0⟩ to |+⟩ = (|0⟩ + |1⟩)/√2.",
      "In a uniform superposition, specific outcomes are random but probabilities are exact (50/50).",
      "Superposition is not just 'not knowing' the state; it is a fundamental property of quantum systems."
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Use a Hadamard gate to create superposition. Place it on the first qubit to create the |+⟩ state.",
      targetState: "|+⟩",
      initialGates: [getGateById("hadamard")].filter(Boolean),
      solution: [{ qubit: 0, position: 0, gateId: "hadamard" }],
      maxMoves: 1,
      hints: [
        "The Hadamard gate creates an equal superposition state",
        "Drag the H gate onto the qubit line",
        "The |+⟩ state means (|0⟩ + |1⟩)/√2"
      ]
    }
  },
  "qg-201": {
    id: "qg-201",
    title: "Hadamard Gates",
    description: "Build circuits using Hadamard gates to create superposition",
    difficulty: "intermediate",
    points: 200,
    timeLimit: 900, // 15 minutes
    category: "Quantum Gates",
    learningObjectives: [
      "Master Hadamard gate properties",
      "Create complex superposition states",
      "Understand gate sequences"
    ],
    educationalTips: [
      "Applying Hadamard twice returns the qubit to its original state (H² = I).",
      "Combining H and CNOT gates is the standard way to create Bell states.",
      "This circuit pattern is the 'Hello World' of quantum computing."
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Create a Bell state by first applying Hadamard to qubit 0, then CNOT with qubit 0 as control and qubit 1 as target.",
      targetState: "|Φ+⟩ = (|00⟩ + |11⟩)/√2",
      initialGates: [
        {
          id: "hadamard",
          name: "Hadamard", 
          symbol: "H",
          color: "bg-blue-500",
          description: "Creates superposition"
        },
        {
          id: "cnot",
          name: "CNOT",
          symbol: "⊕", 
          color: "bg-purple-500",
          description: "Controlled-NOT gate"
        }
      ],
      solution: [
        { qubit: 0, position: 0, gateId: "hadamard" },
        { qubit: 0, position: 1, gateId: "cnot" }
      ],
      maxMoves: 2,
      hints: [
        "Start with Hadamard on the control qubit",
        "Then add CNOT to create entanglement",
        "Bell states are maximally entangled"
      ]
    }
  },
  "qr-501": {
    id: "qr-501",
    title: "Quantum Teleportation Protocol",
    description: "Execute a real quantum teleportation circuit on IBM Quantum hardware",
    difficulty: "research",
    points: 500,
    timeLimit: 1800, // 30 minutes
    category: "Quantum Research",
    learningObjectives: [
      "Implement quantum teleportation protocol",
      "Execute circuits on real quantum hardware",
      "Understand quantum measurement and state transfer"
    ],
    educationalTips: [
      "Teleportation moves a quantum state, not matter, from one location to another.",
      "It requires three qubits and two classical bits of information.",
      "The 'No-Cloning Theorem' means the original state must be destroyed to transport it."
    ],
    challenge: {
      type: 'research-project',
      instructions: "Build and execute a quantum teleportation circuit. Create Bell pair entanglement, perform measurements, and apply conditional operations to teleport a qubit state. This will run on real IBM Quantum hardware!",
      targetState: "Teleported |ψ⟩ state",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Start by creating a Bell pair between qubits 1 and 2",
        "Entangle the input qubit (0) with qubit 1 using CNOT", 
        "Measure qubits 0 and 1 to collapse the entangled state",
        "Apply X and Z gates conditionally based on measurement results"
      ]
    }
  },
  "qg-202": {
    id: "qg-202",
    title: "Pauli Gates (X, Y, Z)", 
    description: "Master the three Pauli gates for single-qubit rotations",
    difficulty: "intermediate",
    points: 300,
    timeLimit: 900, // 15 minutes
    category: "Level 2: Basic Quantum Gates",
    learningObjectives: [
      "Master all three Pauli gates",
      "Understand single-qubit rotations",
      "Learn the role of X, Y, Z gates"
    ],
    educationalTips: [
      "Pauli matrices form a basis for separate linear operators on 2-dimensional Hilbert space.",
      "They are their own inverses (X² = Y² = Z² = I).",
      "These gates visualize as 180-degree rotations around the corresponding axes on the Bloch Sphere."
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Learn the three Pauli gates. Apply X gate to flip |0⟩ to |1⟩, then Y gate for complex rotation, then Z gate for phase flip.",
      targetState: "Demonstrate all Pauli rotations",
      initialGates: [
        {
          id: "x",
          name: "Pauli-X",
          symbol: "X",
          color: "bg-red-500",
          description: "Bit flip gate |0⟩ ↔ |1⟩"
        },
        {
          id: "y",
          name: "Pauli-Y",
          symbol: "Y",
          color: "bg-green-500",
          description: "Bit and phase flip"
        },
        {
          id: "z",
          name: "Pauli-Z",
          symbol: "Z",
          color: "bg-blue-500",
          description: "Phase flip gate"
        }
      ],
      solution: [
        { qubit: 0, position: 0, gateId: "x" },
        { qubit: 0, position: 1, gateId: "y" },
        { qubit: 0, position: 2, gateId: "z" }
      ],
      maxMoves: 3,
      hints: [
        "X gate flips |0⟩ → |1⟩ and |1⟩ → |0⟩",
        "Y gate applies both bit and phase flip",
        "Z gate flips the phase: |1⟩ → -|1⟩"
      ]
    }
  },
  "qa-404": {
    id: "qa-404",
    title: "Bell State Analysis",
    description: "Run real Bell state circuits on IBM Quantum hardware",
    difficulty: "advanced",
    points: 400,
    timeLimit: 2400, // 40 minutes
    category: "Quantum Algorithms",
    learningObjectives: [
      "Implement Bell state preparation",
      "Execute algorithms on quantum hardware",
      "Analyze quantum measurement statistics"
    ],
    challenge: {
      type: 'algorithm-implementation',
      instructions: "Implement and execute a Bell state preparation algorithm on real IBM Quantum hardware. Prepare the |Φ+⟩ Bell state and analyze the measurement results to verify entanglement.",
      targetState: "Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Use Hadamard gate on control qubit",
        "Apply CNOT gate to create entanglement",
        "Measure both qubits simultaneously",
        "Check for 50/50 correlation in |00⟩ and |11⟩ states"
      ]
    }
  },
  "qr-502": {
    id: "qr-502",
    title: "Shor's Factoring Algorithm",
    description: "Break RSA encryption using quantum period finding",
    difficulty: "research",
    points: 1200,
    timeLimit: 3600, // 60 minutes
    category: "Level 5: Advanced Research",
    learningObjectives: [
      "Implement Shor's factoring algorithm",
      "Understand quantum period finding",
      "Break RSA encryption with quantum computing"
    ],
    challenge: {
      type: 'research-project',
      instructions: "Implement Shor's algorithm to factor the number 15. Use quantum period finding to discover the period of the function f(x) = a^x mod N, then use classical post-processing to find the factors.",
      targetState: "Factored number: 15 = 3 × 5",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Choose random a coprime to N (e.g., a=7)",
        "Implement quantum period finding using QFT",
        "Measure to find period r of 7^x mod 15",
        "Use classical algorithm: gcd(a^(r/2)±1, N) to find factors"
      ]
    }
  },
  // Missing Level 1 challenge
  "qb-103": {
    id: "qb-103",
    title: "Quantum Measurement",
    description: "Understand how quantum measurement collapses superposition states",
    difficulty: "beginner",
    points: 200,
    timeLimit: 600,
    category: "Level 1: Quantum Fundamentals",
    learningObjectives: [
      "Understand quantum measurement",
      "Learn about state collapse",
      "Explore measurement probabilities"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Create superposition with Hadamard, then measure the qubit. Observe how measurement collapses the superposition.",
      targetState: "Measured state",
      initialGates: [getGateById("hadamard")].filter(Boolean),
      solution: [{ qubit: 0, position: 0, gateId: "hadamard" }],
      maxMoves: 1,
      hints: [
        "Apply Hadamard to create superposition",
        "Measurement will collapse to |0⟩ or |1⟩",
        "Each measurement outcome has 50% probability"
      ]
    }
  },
  // Missing Level 2 challenges
  "qg-203": {
    id: "qg-203",
    title: "Phase Gates (S, T)",
    description: "Learn phase gates and their role in quantum computation",
    difficulty: "intermediate",
    points: 350,
    timeLimit: 900,
    category: "Level 2: Basic Quantum Gates",
    learningObjectives: [
      "Master S and T phase gates",
      "Understand phase rotations",
      "Learn gate relationships"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Apply S gate (π/2 phase) then T gate (π/4 phase) to understand phase rotations.",
      targetState: "Phase rotated state",
      initialGates: [
        { id: "s", name: "S Gate", symbol: "S", color: "bg-indigo-500", description: "π/2 phase gate" },
        { id: "t", name: "T Gate", symbol: "T", color: "bg-pink-500", description: "π/4 phase gate" }
      ],
      solution: [
        { qubit: 0, position: 0, gateId: "s" },
        { qubit: 0, position: 1, gateId: "t" }
      ],
      maxMoves: 2,
      hints: [
        "S gate applies π/2 phase rotation",
        "T gate applies π/4 phase rotation",
        "Phase gates don't change measurement probabilities"
      ]
    }
  },
  "qg-204": {
    id: "qg-204",
    title: "Gate Sequences",
    description: "Combine multiple gates to create complex quantum operations",
    difficulty: "intermediate",
    points: 400,
    timeLimit: 1200,
    category: "Level 2: Basic Quantum Gates",
    learningObjectives: [
      "Combine multiple quantum gates",
      "Understand gate composition",
      "Create complex operations"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Create a sequence: H → X → H to see how gates combine. This creates a Z gate effect!",
      targetState: "H-X-H sequence",
      initialGates: [
        getGateById("hadamard"),
        { id: "x", name: "Pauli-X", symbol: "X", color: "bg-red-500", description: "Bit flip" }
      ].filter(Boolean),
      solution: [
        { qubit: 0, position: 0, gateId: "hadamard" },
        { qubit: 0, position: 1, gateId: "x" },
        { qubit: 0, position: 2, gateId: "hadamard" }
      ],
      maxMoves: 3,
      hints: [
        "Start with Hadamard gate",
        "Apply X gate in the middle",
        "End with another Hadamard - this creates Z gate effect!"
      ]
    }
  },
  // Missing Level 3 challenges
  "qe-301": {
    id: "qe-301",
    title: "CNOT Gates",
    description: "Master controlled-NOT gates for two-qubit operations",
    difficulty: "intermediate",
    points: 450,
    timeLimit: 1200,
    category: "Level 3: Two-Qubit Operations",
    learningObjectives: [
      "Master CNOT gate operation",
      "Understand controlled operations",
      "Create two-qubit interactions"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Use CNOT gate to flip the target qubit only when control is |1⟩. Set up |10⟩ → |11⟩.",
      targetState: "|11⟩ state",
      initialGates: [
        { id: "x", name: "Pauli-X", symbol: "X", color: "bg-red-500", description: "Bit flip" },
        { id: "cnot", name: "CNOT", symbol: "⊕", color: "bg-purple-500", description: "Controlled-NOT" }
      ],
      solution: [
        { qubit: 0, position: 0, gateId: "x" },
        { qubit: 0, position: 1, gateId: "cnot" }
      ],
      maxMoves: 2,
      hints: [
        "First set control qubit to |1⟩ with X gate",
        "Apply CNOT to flip target when control is |1⟩",
        "CNOT flips target only if control is |1⟩"
      ]
    }
  },
  "qe-302": {
    id: "qe-302",
    title: "Entanglement Circuits",
    description: "Create entangled states using CNOT gates and measure correlations",
    difficulty: "intermediate",
    points: 500,
    timeLimit: 1500,
    category: "Level 3: Two-Qubit Operations",
    learningObjectives: [
      "Create quantum entanglement",
      "Understand correlated measurements",
      "Build entangling circuits"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Create entanglement: Apply H to qubit 0, then CNOT with qubit 0 as control. This creates |00⟩ + |11⟩!",
      targetState: "Entangled |Φ+⟩ state",
      initialGates: [
        getGateById("hadamard"),
        { id: "cnot", name: "CNOT", symbol: "⊕", color: "bg-purple-500", description: "Controlled-NOT" }
      ].filter(Boolean),
      solution: [
        { qubit: 0, position: 0, gateId: "hadamard" },
        { qubit: 0, position: 1, gateId: "cnot" }
      ],
      maxMoves: 2,
      hints: [
        "Start with Hadamard on control qubit",
        "Apply CNOT to create entanglement",
        "Result: (|00⟩ + |11⟩)/√2 - perfectly correlated!"
      ]
    }
  },
  "qe-303": {
    id: "qe-303",
    title: "Bell States",
    description: "Generate and analyze the four maximally entangled Bell states",
    difficulty: "intermediate",
    points: 550,
    timeLimit: 1800,
    category: "Level 3: Two-Qubit Operations",
    learningObjectives: [
      "Generate all four Bell states",
      "Understand maximal entanglement",
      "Explore quantum correlations"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Create Bell state |Ψ+⟩ = (|01⟩ + |10⟩)/√2. Use H on qubit 0, X on qubit 1, then CNOT.",
      targetState: "|Ψ+⟩ Bell state",
      initialGates: [
        getGateById("hadamard"),
        { id: "x", name: "Pauli-X", symbol: "X", color: "bg-red-500", description: "Bit flip" },
        { id: "cnot", name: "CNOT", symbol: "⊕", color: "bg-purple-500", description: "Controlled-NOT" }
      ].filter(Boolean),
      solution: [
        { qubit: 0, position: 0, gateId: "hadamard" },
        { qubit: 1, position: 0, gateId: "x" },
        { qubit: 0, position: 1, gateId: "cnot" }
      ],
      maxMoves: 3,
      hints: [
        "Apply Hadamard to qubit 0 for superposition",
        "Apply X to qubit 1 to flip it",
        "Use CNOT to entangle the qubits"
      ]
    }
  },
  "qe-304": {
    id: "qe-304",
    title: "Controlled Operations",
    description: "Master various controlled gates beyond CNOT",
    difficulty: "intermediate",
    points: 600,
    timeLimit: 2400,
    category: "Level 3: Two-Qubit Operations",
    learningObjectives: [
      "Learn controlled-Z gates",
      "Understand controlled rotations",
      "Master multi-qubit operations"
    ],
    challenge: {
      type: 'gate-builder',
      instructions: "Use controlled-Z gate to apply phase only when both qubits are |1⟩. Set up |11⟩ → -|11⟩.",
      targetState: "Controlled-Z effect",
      initialGates: [
        { id: "x", name: "Pauli-X", symbol: "X", color: "bg-red-500", description: "Bit flip" },
        { id: "cz", name: "Controlled-Z", symbol: "CZ", color: "bg-indigo-500", description: "Controlled phase" }
      ],
      solution: [
        { qubit: 0, position: 0, gateId: "x" },
        { qubit: 1, position: 0, gateId: "x" },
        { qubit: 0, position: 1, gateId: "cz" }
      ],
      maxMoves: 3,
      hints: [
        "Set both qubits to |1⟩ with X gates",
        "Apply controlled-Z gate",
        "CZ adds phase -1 only to |11⟩ state"
      ]
    }
  },
  // Missing Level 4 challenges
  "qa-401": {
    id: "qa-401",
    title: "Deutsch Algorithm",
    description: "Implement the first quantum algorithm that shows quantum advantage",
    difficulty: "advanced",
    points: 700,
    timeLimit: 2400,
    category: "Level 4: Quantum Algorithms",
    learningObjectives: [
      "Implement Deutsch algorithm",
      "Understand quantum advantage",
      "Learn quantum parallelism"
    ],
    challenge: {
      type: 'algorithm-implementation',
      instructions: "Implement Deutsch algorithm to determine if a function is constant or balanced with just one query!",
      targetState: "Deutsch algorithm result",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Start with |01⟩ state preparation",
        "Apply Hadamard to both qubits",
        "Apply oracle function Uf",
        "Measure first qubit - result determines function type"
      ]
    }
  },
  "qa-402": {
    id: "qa-402",
    title: "Quantum Fourier Transform",
    description: "Master the QFT - foundation of Shor's algorithm and quantum phase estimation",
    difficulty: "advanced",
    points: 800,
    timeLimit: 3000,
    category: "Level 4: Quantum Algorithms",
    learningObjectives: [
      "Implement quantum Fourier transform",
      "Understand phase estimation",
      "Learn frequency domain operations"
    ],
    challenge: {
      type: 'algorithm-implementation',
      instructions: "Implement 3-qubit Quantum Fourier Transform using Hadamard and controlled phase gates.",
      targetState: "QFT transformed state",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Apply Hadamard and controlled phase rotations",
        "Use decreasing rotation angles: π/2, π/4, π/8...",
        "Finish with SWAP gates to reverse qubit order",
        "QFT extracts frequency information from quantum states"
      ]
    }
  },
  "qa-403": {
    id: "qa-403",
    title: "Grover's Search Algorithm",
    description: "Implement quantum database search with quadratic speedup over classical algorithms",
    difficulty: "advanced",
    points: 900,
    timeLimit: 3600,
    category: "Level 4: Quantum Algorithms",
    learningObjectives: [
      "Implement Grover's search",
      "Understand amplitude amplification",
      "Achieve quadratic speedup"
    ],
    challenge: {
      type: 'algorithm-implementation',
      instructions: "Implement Grover's algorithm to search a 4-item database. Find the marked item in ~√N steps!",
      targetState: "Marked item found",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Start with equal superposition using Hadamard gates",
        "Apply oracle to mark target item",
        "Use diffusion operator to amplify amplitude",
        "Repeat ~√N times for maximum probability"
      ]
    }
  },
  // Missing Level 5 challenges
  "qr-503": {
    id: "qr-503",
    title: "Variational Quantum Eigensolver (VQE)",
    description: "Find molecular ground states using hybrid quantum-classical optimization",
    difficulty: "research",
    points: 1300,
    timeLimit: 4800,
    category: "Level 5: Advanced Research",
    learningObjectives: [
      "Implement VQE algorithm",
      "Optimize variational parameters",
      "Solve quantum chemistry problems"
    ],
    challenge: {
      type: 'research-project',
      instructions: "Use VQE to find the ground state energy of H2 molecule. Optimize ansatz parameters to minimize energy expectation value.",
      targetState: "H2 ground state",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Prepare variational ansatz with parameterized gates",
        "Measure energy expectation value ⟨H⟩",
        "Use classical optimizer to minimize energy",
        "VQE is a hybrid quantum-classical algorithm"
      ]
    }
  },
  "qr-504": {
    id: "qr-504",
    title: "Quantum Error Correction",
    description: "Implement quantum error correction to protect your qubits",
    difficulty: "research",
    points: 1400,
    timeLimit: 5400,
    category: "Level 5: Advanced Research",
    learningObjectives: [
      "Implement Shor's 9-qubit code",
      "Understand error syndromes",
      "Protect quantum information"
    ],
    challenge: {
      type: 'research-project',
      instructions: "Implement Shor's 9-qubit error correction code. Encode, introduce errors, detect, and correct them!",
      targetState: "Error-corrected logical qubit",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Encode logical qubit into 9 physical qubits",
        "Use syndrome measurement to detect errors",
        "Apply correction operations based on syndrome",
        "Error correction enables fault-tolerant quantum computing"
      ]
    }
  },
  "qr-505": {
    id: "qr-505",
    title: "Quantum Machine Learning",
    description: "Train quantum neural networks and implement quantum kernels for ML",
    difficulty: "research",
    points: 1500,
    timeLimit: 6000,
    category: "Level 5: Advanced Research",
    learningObjectives: [
      "Implement quantum neural networks",
      "Use quantum kernels for classification",
      "Explore quantum advantage in ML"
    ],
    challenge: {
      type: 'research-project',
      instructions: "Implement a quantum neural network for binary classification. Train the network using quantum gradients and achieve quantum advantage!",
      targetState: "Trained quantum classifier",
      initialGates: [],
      solution: [],
      maxMoves: 0,
      hints: [
        "Design quantum neural network architecture",
        "Use parameterized quantum circuits as layers",
        "Implement quantum gradient descent",
        "Quantum kernels can provide exponential feature space"
      ]
    }
  }
};

// Export the challenges object and helper functions
export const getChallengeById = (id: string): LevelChallenge | undefined => {
  return LEVEL_CHALLENGES[id];
};

export const getAllChallenges = (): Record<string, LevelChallenge> => {
  return LEVEL_CHALLENGES;
};

// Validation function to check if all levels have corresponding challenges
export const validateChallenges = (levelIds: string[]): { missing: string[], total: number } => {
  const missing = levelIds.filter(id => !LEVEL_CHALLENGES[id]);
  return {

    missing,
    total: levelIds.length
  };
};

// --- Helper to determine next level ---
const getNextLevelId = (currentId: string): string | null => {
  const ids = Object.keys(LEVEL_CHALLENGES);
  const index = ids.indexOf(currentId);
  return (index !== -1 && index < ids.length - 1) ? ids[index + 1] : null;
};

// --- Mission Briefing Component (Next Level Card) ---
interface MissionBriefingProps {
  level: LevelChallenge;
  onDeploy: () => void;
  nextLevel?: LevelChallenge;
}

function MissionBriefing({ level, onDeploy, nextLevel }: MissionBriefingProps) {
  // If there's a next level, show that. Otherwise show replay/completion of current.
  const displayLevel = nextLevel || level;
  const isNext = !!nextLevel;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <Card className="w-full max-w-md bg-[#050B14] border-blue-900/50 shadow-[0_0_50px_rgba(37,99,235,0.2)] relative overflow-hidden text-white border-2">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <CardHeader className="relative z-10 pb-2">
          <div className="flex justify-between items-start">
             <div>
                <motion.h2 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="text-3xl font-black italic tracking-tighter text-white mb-1 uppercase"
                >
                    {displayLevel.title}
                </motion.h2>
                <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                    <span className="w-1 h-4 bg-blue-500 inline-block"/>
                    {displayLevel.category.toUpperCase().replace('LEVEL ', 'LVL ')}
                </div>
             </div>
             <div className="text-right">
                 {isNext && <Badge className="bg-blue-600 animate-pulse">NEXT MISSION</Badge>}
                 {!isNext && <Badge className="bg-green-600">MISSION ACCOMPLISHED</Badge>}
             </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10 pt-4">
            {/* Objective Box */}
            <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Target className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-blue-300 font-bold text-xs uppercase tracking-wider mb-2">Mission Objective</h3>
                <p className="text-gray-300 text-sm leading-relaxed relative z-10">
                    {displayLevel.description || "Initialize quantum system and verify state coherence."}
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 font-mono uppercase mb-1">Threat Level</div>
                    <div className={`font-bold text-lg ${
                        displayLevel.difficulty === 'beginner' ? 'text-green-400' : 
                        displayLevel.difficulty === 'intermediate' ? 'text-blue-400' :
                        displayLevel.difficulty === 'advanced' ? 'text-purple-400' : 'text-red-500'
                    }`}>
                        {displayLevel.difficulty.charAt(0).toUpperCase() + displayLevel.difficulty.slice(1)}
                    </div>
                </div>
                <div className="bg-black/40 border border-white/5 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 font-mono uppercase mb-1">Bounty</div>
                    <div className="font-bold text-lg text-yellow-400 flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400" /> {displayLevel.points}
                    </div>
                </div>
            </div>

            {/* Outcomes/Evals */}
            <div className="bg-black/20 rounded-lg p-4 border border-white/5">
                <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-3">
                    <Zap className="w-3 h-3" /> Outcomes
                </h3>
                <ul className="space-y-2">
                    {displayLevel.learningObjectives.slice(0, 3).map((obj, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                            {obj}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Action Button */}
            <Button 
                onClick={onDeploy}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 text-lg tracking-widest uppercase shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_50px_rgba(37,99,235,0.5)] transition-all border-t border-blue-400"
            >
                {isNext ? (
                    <span className="flex items-center gap-2">Engage Systems <div className="w-4 h-4 text-xs">🚀</div></span>
                ) : (
                    "Re_Deploy"
                )}
            </Button>
            
            {/* Decoration corners */}
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-blue-500/30 rounded-br-lg" />
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface LevelChallengeProps {
  levelId: string;
  onComplete: (levelId: string, success: boolean, timeElapsed: number, nextLevelId?: string | null) => void;
  onBack: () => void;
}

export function LevelChallenge({ levelId, onComplete, onBack }: LevelChallengeProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(-1);
  const [showTutorial, setShowTutorial] = useState(true);
  const [currentHint, setCurrentHint] = useState<string | null>(null);
  const [challengePhase, setChallengePhase] = useState<'tutorial' | 'challenge' | 'completed'>('tutorial');
  const [showMissionBriefing, setShowMissionBriefing] = useState(false);
  const { toast } = useToast();
  
  const challenge = LEVEL_CHALLENGES[levelId];
  
  const nextLevelId = getNextLevelId(levelId);
  const nextLevel = nextLevelId ? LEVEL_CHALLENGES[nextLevelId] : undefined;

  if (!challenge) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Challenge not found: {levelId}</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Levels
        </Button>
      </div>
    );
  }

  const handleChallengeComplete = (success: boolean) => {
    console.log(`🎯 Challenge ${levelId} completion:`, { success, timeElapsed });
    
    if (success) {
      setChallengePhase('completed');
      toast({
        title: "✅ Challenge Completed!",
        description: `Great job! You successfully completed ${challenge.title}`,
      });
      
      // Show Mission Briefing instead of auto-completing
      setTimeout(() => {
        setShowMissionBriefing(true);
      }, 1500);
    } else {
      onComplete(levelId, success, timeElapsed);
    }
  };

  const handleDeployNext = () => {
    // Pass nextLevelId if available
    onComplete(levelId, true, timeElapsed, nextLevelId);
  };

  // Tutorial completion handler
  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setChallengePhase('challenge');
    // Show helpful hint for first-time users
    if (levelId === 'qb-101') {
      setCurrentHint("🎯 Great! Now you're ready to explore your first quantum concepts. Let's start learning!");
      setTimeout(() => setCurrentHint(null), 5000);
    }
  };

  const showNextHint = () => {
    if (challenge.challenge.hints && currentHintIndex < challenge.challenge.hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
      toast({
        title: "💡 Quantum Hint",
        description: challenge.challenge.hints![currentHintIndex + 1],
      });
      // Show educational hint overlay
      setCurrentHint(challenge.challenge.hints![currentHintIndex + 1]);
      setTimeout(() => setCurrentHint(null), 6000);
    }
  };

  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'intermediate': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'advanced': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'research': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative">
      <AnimatePresence>
         {showMissionBriefing && (
             <MissionBriefing 
                 level={challenge}
                 nextLevel={nextLevel}
                 onDeploy={handleDeployNext}
             />
         )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quest
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{challenge.title}</h1>
              <p className="text-gray-600 dark:text-gray-300">{challenge.description}</p>
            </div>
          </div>
          <Badge className={`${getDifficultyColor()} font-semibold`}>
            {challenge.difficulty.toUpperCase()}
          </Badge>
        </motion.div>

        {/* Challenge Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{challenge.points}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold">
                {challenge.timeLimit ? Math.floor(challenge.timeLimit / 60) : '∞'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {challenge.timeLimit ? 'Minutes' : 'No Limit'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{challenge.challenge.maxMoves || '∞'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Max Moves</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold">{challenge.category}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Category</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {challenge.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Challenge Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Challenge Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {challenge.challenge.instructions}
              </p>
              {challenge.challenge.hints && challenge.challenge.hints.length > 0 && (
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showNextHint}
                    disabled={currentHintIndex >= challenge.challenge.hints.length - 1}
                    data-testid="button-hint"
                  >
                    💡 Show Hint ({currentHintIndex + 1}/{challenge.challenge.hints.length})
                  </Button>
                  <span className="text-sm text-gray-500">
                    Hints help you learn, but try solving it first!
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Interactive Challenge Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {challenge.challenge.type === 'gate-builder' && (
            <EnhancedGateSimulator
              challenge={{
                id: challenge.id,
                title: challenge.title,
                description: challenge.challenge.instructions,
                targetState: challenge.challenge.targetState || "|ψ⟩",
                initialGates: challenge.challenge.initialGates,
                solution: challenge.challenge.solution,
                maxMoves: challenge.challenge.maxMoves,
                educationalTips: challenge.learningObjectives
              }}
              onComplete={handleChallengeComplete}
            />
          )}
          
          {(challenge.challenge.type === 'research-project' || challenge.challenge.type === 'algorithm-implementation') && (
            <QuantumJobIntegration
              levelId={challenge.id}
              circuitData={{
                gates: challenge.challenge.solution.map(sol => ({
                  type: sol.gateId,
                  qubit: sol.qubit,
                  position: sol.position
                })),
                qubits: 2
              }}
              expectedResult={challenge.challenge.targetState || "Bell state"}
              onJobComplete={(success, result) => {
                if (success) {
                  toast({
                    title: "🎉 Quantum Execution Complete!",
                    description: `Successfully executed ${challenge.title} on quantum hardware!`,
                  });
                }
                handleChallengeComplete(success);
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}