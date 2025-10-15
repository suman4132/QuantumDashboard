import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Brain, 
  Zap, 
  Target,
  Trophy,
  Star,
  Lock,
  CheckCircle,
  Code,
  Atom,
  Cpu,
  Network
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuantumParticleEffects } from "./quantum-particle-effects";

// Advanced quantum algorithms and challenges
interface AdvancedChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'expert' | 'research' | 'pioneer';
  category: 'algorithms' | 'cryptography' | 'simulation' | 'optimization' | 'ml';
  points: number;
  timeLimit: number; // in minutes
  prerequisites: string[];
  learningObjectives: string[];
  realWorldApplication: string;
  algorithm: {
    name: string;
    complexity: string;
    quantumAdvantage: string;
    classicalComparison: string;
  };
  implementation: {
    qubits: number;
    gates: number;
    depth: number;
    steps: string[];
  };
  locked: boolean;
  completed: boolean;
}

// Advanced quantum challenges dataset
const ADVANCED_CHALLENGES: AdvancedChallenge[] = [
  {
    id: "grovers-search",
    title: "Grover's Search Algorithm",
    description: "Implement quantum search to find a marked item in an unsorted database with quadratic speedup",
    difficulty: "expert",
    category: "algorithms",
    points: 750,
    timeLimit: 45,
    prerequisites: ["superposition", "oracle-construction", "amplitude-amplification"],
    learningObjectives: [
      "Understand quantum search principles",
      "Implement oracle functions",
      "Apply amplitude amplification",
      "Achieve quadratic speedup over classical search"
    ],
    realWorldApplication: "Database search, cryptanalysis, optimization problems",
    algorithm: {
      name: "Grover's Algorithm",
      complexity: "O(√N)",
      quantumAdvantage: "Quadratic speedup over classical O(N)",
      classicalComparison: "Classical requires N/2 queries on average, quantum needs ~√N"
    },
    implementation: {
      qubits: 4,
      gates: 24,
      depth: 8,
      steps: [
        "Initialize qubits in equal superposition",
        "Apply oracle to mark target state",
        "Apply diffusion operator (inversion about average)",
        "Repeat oracle + diffusion ~√N times",
        "Measure to find marked item"
      ]
    },
    locked: false,
    completed: false
  },
  {
    id: "shors-factoring",
    title: "Shor's Factoring Algorithm",
    description: "Break RSA encryption by factoring large integers using quantum period finding",
    difficulty: "pioneer",
    category: "cryptography",
    points: 1200,
    timeLimit: 90,
    prerequisites: ["quantum-fourier-transform", "modular-arithmetic", "period-finding"],
    learningObjectives: [
      "Understand quantum period finding",
      "Implement Quantum Fourier Transform",
      "Apply modular exponentiation",
      "Factor integers exponentially faster than classical"
    ],
    realWorldApplication: "Breaking RSA encryption, cryptanalysis, number theory",
    algorithm: {
      name: "Shor's Algorithm",
      complexity: "O(log³N)",
      quantumAdvantage: "Exponential speedup over best known classical algorithms",
      classicalComparison: "Classical factoring is exponential, quantum is polynomial"
    },
    implementation: {
      qubits: 12,
      gates: 156,
      depth: 24,
      steps: [
        "Choose random number a < N",
        "Create superposition of powers",
        "Apply modular exponentiation",
        "Perform Quantum Fourier Transform",
        "Measure to find period",
        "Use period to factor N"
      ]
    },
    locked: true,
    completed: false
  },
  {
    id: "vqe-molecular",
    title: "Variational Quantum Eigensolver",
    description: "Find ground state energy of molecules using hybrid quantum-classical optimization",
    difficulty: "expert",
    category: "simulation",
    points: 900,
    timeLimit: 60,
    prerequisites: ["hamiltonian-simulation", "variational-circuits", "optimization"],
    learningObjectives: [
      "Understand molecular Hamiltonians",
      "Implement variational circuits",
      "Optimize quantum parameters",
      "Calculate molecular ground states"
    ],
    realWorldApplication: "Drug discovery, materials science, catalyst design",
    algorithm: {
      name: "VQE",
      complexity: "Polynomial in problem size",
      quantumAdvantage: "Exponential memory savings for large molecules",
      classicalComparison: "Classical methods scale exponentially with system size"
    },
    implementation: {
      qubits: 8,
      gates: 64,
      depth: 12,
      steps: [
        "Encode molecular Hamiltonian",
        "Prepare variational ansatz",
        "Measure energy expectation",
        "Optimize parameters classically",
        "Iterate until convergence"
      ]
    },
    locked: false,
    completed: false
  },
  {
    id: "qaoa-optimization",
    title: "QAOA for MaxCut Problem",
    description: "Solve combinatorial optimization using Quantum Approximate Optimization Algorithm",
    difficulty: "expert",
    category: "optimization",
    points: 850,
    timeLimit: 50,
    prerequisites: ["parameterized-circuits", "classical-optimization", "cost-functions"],
    learningObjectives: [
      "Understand combinatorial optimization",
      "Implement QAOA circuits",
      "Optimize mixing and cost parameters",
      "Find approximate solutions to NP-hard problems"
    ],
    realWorldApplication: "Portfolio optimization, logistics, network design, scheduling",
    algorithm: {
      name: "QAOA",
      complexity: "Depends on circuit depth p",
      quantumAdvantage: "Potential advantage for large optimization problems",
      classicalComparison: "May outperform classical heuristics for specific problems"
    },
    implementation: {
      qubits: 6,
      gates: 48,
      depth: 10,
      steps: [
        "Encode optimization problem as Hamiltonian",
        "Apply problem Hamiltonian evolution",
        "Apply mixer Hamiltonian evolution",
        "Repeat p times with different parameters",
        "Measure and optimize parameters"
      ]
    },
    locked: false,
    completed: false
  },
  {
    id: "qml-classification",
    title: "Quantum Machine Learning",
    description: "Implement quantum neural networks for pattern classification with quantum advantage",
    difficulty: "research",
    category: "ml",
    points: 1000,
    timeLimit: 75,
    prerequisites: ["parameterized-circuits", "data-encoding", "gradient-estimation"],
    learningObjectives: [
      "Encode classical data in quantum states",
      "Design quantum neural networks",
      "Train with quantum gradient descent",
      "Achieve quantum advantage in learning"
    ],
    realWorldApplication: "Pattern recognition, image classification, natural language processing",
    algorithm: {
      name: "Quantum Neural Networks",
      complexity: "Polynomial in parameters",
      quantumAdvantage: "Exponential feature space, faster training",
      classicalComparison: "Classical neural nets limited by polynomial feature maps"
    },
    implementation: {
      qubits: 10,
      gates: 80,
      depth: 16,
      steps: [
        "Encode input data as quantum states",
        "Apply parameterized quantum circuits",
        "Measure output probability distributions",
        "Calculate cost function gradients",
        "Update parameters via gradient descent"
      ]
    },
    locked: true,
    completed: false
  },
  {
    id: "quantum-teleportation-network",
    title: "Quantum Internet Protocol",
    description: "Build quantum communication network with entanglement distribution and teleportation",
    difficulty: "pioneer",
    category: "cryptography",
    points: 1100,
    timeLimit: 80,
    prerequisites: ["quantum-teleportation", "entanglement-distribution", "quantum-error-correction"],
    learningObjectives: [
      "Understand quantum communication protocols",
      "Implement distributed entanglement",
      "Design quantum error correction",
      "Build secure quantum networks"
    ],
    realWorldApplication: "Quantum internet, secure communications, distributed quantum computing",
    algorithm: {
      name: "Quantum Internet Protocol",
      complexity: "Scales with network size",
      quantumAdvantage: "Unconditional security, quantum parallelism",
      classicalComparison: "Classical networks vulnerable to eavesdropping"
    },
    implementation: {
      qubits: 16,
      gates: 200,
      depth: 32,
      steps: [
        "Generate entangled pairs",
        "Distribute entanglement across network",
        "Implement quantum error correction",
        "Perform quantum teleportation",
        "Verify communication integrity"
      ]
    },
    locked: true,
    completed: false
  }
];

interface AdvancedQuantumChallengesProps {
  userLevel: number;
  completedChallenges: string[];
  onChallengeStart: (challengeId: string) => void;
}

export function AdvancedQuantumChallenges({ 
  userLevel, 
  completedChallenges, 
  onChallengeStart 
}: AdvancedQuantumChallengesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedChallenge, setSelectedChallenge] = useState<AdvancedChallenge | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const { toast } = useToast();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'expert': return 'from-purple-600 to-purple-700';
      case 'research': return 'from-red-600 to-red-700';
      case 'pioneer': return 'from-yellow-600 to-yellow-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'algorithms': return <Brain className="h-5 w-5" />;
      case 'cryptography': return <Lock className="h-5 w-5" />;
      case 'simulation': return <Atom className="h-5 w-5" />;
      case 'optimization': return <Target className="h-5 w-5" />;
      case 'ml': return <Network className="h-5 w-5" />;
      default: return <Code className="h-5 w-5" />;
    }
  };

  const filteredChallenges = selectedCategory === "all" 
    ? ADVANCED_CHALLENGES 
    : ADVANCED_CHALLENGES.filter(c => c.category === selectedCategory);

  const handleChallengeClick = (challenge: AdvancedChallenge) => {
    if (challenge.locked) {
      toast({
        title: "🔒 Challenge Locked",
        description: "Complete prerequisite challenges to unlock this algorithm",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedChallenge(challenge);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 2000);
  };

  const startChallenge = (challengeId: string) => {
    onChallengeStart(challengeId);
    toast({
      title: "🚀 Quantum Algorithm Started!",
      description: "Prepare for advanced quantum computing challenge",
    });
  };

  return (
    <div className="space-y-8 relative">
      {/* Particle Effects */}
      <QuantumParticleEffects
        trigger={showParticles ? "quantum-burst" : undefined}
        intensity="high"
        effectType="quantum"
        width={800}
        height={600}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          🧠 Advanced Quantum Algorithms
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Master cutting-edge quantum algorithms that power the quantum revolution
        </p>
      </motion.div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
          <TabsTrigger value="cryptography">Crypto</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="ml">ML</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-8">
          {/* Challenge Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Card className={`overflow-hidden ${challenge.locked ? 'opacity-60' : 'hover:shadow-xl cursor-pointer'} transition-all duration-300 ${
                  challenge.completed ? 'ring-2 ring-green-500' : ''
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(challenge.category)}
                        <Badge className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white`}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {challenge.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {challenge.locked && <Lock className="h-5 w-5 text-gray-400" />}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{challenge.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {challenge.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Algorithm Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-3 rounded-lg">
                      <div className="text-xs space-y-1">
                        <div><strong>Algorithm:</strong> {challenge.algorithm.name}</div>
                        <div><strong>Complexity:</strong> {challenge.algorithm.complexity}</div>
                        <div><strong>Advantage:</strong> {challenge.algorithm.quantumAdvantage}</div>
                      </div>
                    </div>

                    {/* Implementation Details */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-semibold">{challenge.implementation.qubits}</div>
                        <div className="text-gray-600 dark:text-gray-400">Qubits</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-semibold">{challenge.implementation.gates}</div>
                        <div className="text-gray-600 dark:text-gray-400">Gates</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div className="font-semibold">{challenge.timeLimit}m</div>
                        <div className="text-gray-600 dark:text-gray-400">Time</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-sm">{challenge.points} pts</span>
                      </div>
                      <Button
                        size="sm"
                        disabled={challenge.locked}
                        onClick={() => handleChallengeClick(challenge)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        data-testid={`button-challenge-${challenge.id}`}
                      >
                        {challenge.completed ? 'Review' : 'Start'}
                        <Rocket className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{selectedChallenge.title}</h3>
                  <Button variant="ghost" onClick={() => setSelectedChallenge(null)}>
                    ✕
                  </Button>
                </div>

                {/* Algorithm Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Algorithm Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Complexity:</strong> {selectedChallenge.algorithm.complexity}</div>
                      <div><strong>Quantum Advantage:</strong> {selectedChallenge.algorithm.quantumAdvantage}</div>
                      <div><strong>vs Classical:</strong> {selectedChallenge.algorithm.classicalComparison}</div>
                      <div><strong>Real-world Use:</strong> {selectedChallenge.realWorldApplication}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Implementation</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Qubits Required:</strong> {selectedChallenge.implementation.qubits}</div>
                      <div><strong>Gate Count:</strong> {selectedChallenge.implementation.gates}</div>
                      <div><strong>Circuit Depth:</strong> {selectedChallenge.implementation.depth}</div>
                    </div>
                  </div>
                </div>

                {/* Learning Objectives */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Learning Objectives</h4>
                  <ul className="space-y-1 text-sm">
                    {selectedChallenge.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Implementation Steps */}
                <div>
                  <h4 className="text-lg font-semibold mb-3">Implementation Steps</h4>
                  <ol className="space-y-2 text-sm">
                    {selectedChallenge.implementation.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Prerequisites */}
                {selectedChallenge.prerequisites.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Prerequisites</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedChallenge.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => startChallenge(selectedChallenge.id)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    data-testid="button-start-advanced-challenge"
                  >
                    <Rocket className="h-4 w-4 mr-2" />
                    Start Challenge
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedChallenge(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}