import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Star,
  Zap,
  Target,
  Crown,
  Award,
  ChevronRight,
  Play,
  Lock,
  CheckCircle,
  BarChart3,
  Users,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  LevelChallenge,
  validateChallenges,
  getChallengeById,
} from "@/components/quantum/level-challenges";
import { GalaxyMap } from "@/components/quantum/galaxy-map";
import { MissionControl } from "@/components/quantum/mission-control";

// Types for the learning system
export interface Level {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "research";
  points: number;
  completed: boolean;
  locked: boolean;
  category: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface UserProgress {
  totalPoints: number;
  level: number;
  streak: number;
  completedLevels: number;
  rank: number;
  achievements: Achievement[];
}

// Enhanced quantum learning levels with proper progressive difficulty and prerequisites
const mockLevels: Level[] = [
  // === LEVEL 1: QUANTUM FUNDAMENTALS (100-200 points) ===
  {
    id: "qb-101",
    title: "First Qubit",
    description: "Learn what a qubit is and how it differs from classical bits",
    difficulty: "beginner",
    points: 100,
    completed: true,
    locked: false,
    category: "Level 1: Quantum Fundamentals",
  },
  {
    id: "qb-102",
    title: "Superposition States",
    description:
      "Master the concept of quantum superposition with interactive examples",
    difficulty: "beginner",
    points: 150,
    completed: true,
    locked: false,
    category: "Level 1: Quantum Fundamentals",
  },
  {
    id: "qb-103",
    title: "Quantum Measurement",
    description:
      "Understand how quantum measurement collapses superposition states",
    difficulty: "beginner",
    points: 200,
    completed: false,
    locked: false, // Unlocks after qb-102
    category: "Level 1: Quantum Fundamentals",
  },

  // === LEVEL 2: BASIC QUANTUM GATES (250-400 points) ===
  {
    id: "qg-201",
    title: "Hadamard Gates",
    description: "Build circuits using Hadamard gates to create superposition",
    difficulty: "intermediate",
    points: 250,
    completed: false,
    locked: false, // Unlocks after Level 1 completion
    category: "Level 2: Basic Quantum Gates",
  },
  {
    id: "qg-202",
    title: "Pauli Gates (X, Y, Z)",
    description: "Master the three Pauli gates for single-qubit rotations",
    difficulty: "intermediate",
    points: 300,
    completed: false,
    locked: true, // Unlocks after qg-201
    category: "Level 2: Basic Quantum Gates",
  },
  {
    id: "qg-203",
    title: "Phase Gates (S, T)",
    description: "Learn phase gates and their role in quantum computation",
    difficulty: "intermediate",
    points: 350,
    completed: false,
    locked: true, // Unlocks after qg-202
    category: "Level 2: Basic Quantum Gates",
  },
  {
    id: "qg-204",
    title: "Gate Sequences",
    description: "Combine multiple gates to create complex quantum operations",
    difficulty: "intermediate",
    points: 400,
    completed: false,
    locked: true, // Unlocks after qg-203
    category: "Level 2: Basic Quantum Gates",
  },

  // === LEVEL 3: TWO-QUBIT OPERATIONS (450-600 points) ===
  {
    id: "qe-301",
    title: "CNOT Gates",
    description: "Master controlled-NOT gates for two-qubit operations",
    difficulty: "intermediate",
    points: 450,
    completed: false,
    locked: true, // Unlocks after Level 2 completion
    category: "Level 3: Two-Qubit Operations",
  },
  {
    id: "qe-302",
    title: "Entanglement Circuits",
    description:
      "Create entangled states using CNOT gates and measure correlations",
    difficulty: "intermediate",
    points: 500,
    completed: false,
    locked: true, // Unlocks after qe-301
    category: "Level 3: Two-Qubit Operations",
  },
  {
    id: "qe-303",
    title: "Bell States",
    description:
      "Generate and analyze the four maximally entangled Bell states",
    difficulty: "intermediate",
    points: 550,
    completed: false,
    locked: true, // Unlocks after qe-302
    category: "Level 3: Two-Qubit Operations",
  },
  {
    id: "qe-304",
    title: "Controlled Operations",
    description: "Master various controlled gates beyond CNOT",
    difficulty: "intermediate",
    points: 600,
    completed: false,
    locked: true, // Unlocks after qe-303
    category: "Level 3: Two-Qubit Operations",
  },

  // === LEVEL 4: QUANTUM ALGORITHMS (700-1000 points) ===
  {
    id: "qa-401",
    title: "Deutsch Algorithm",
    description:
      "Implement the first quantum algorithm that shows quantum advantage",
    difficulty: "advanced",
    points: 700,
    completed: false,
    locked: true, // Unlocks after Level 3 completion
    category: "Level 4: Quantum Algorithms",
  },
  {
    id: "qa-402",
    title: "Quantum Fourier Transform",
    description:
      "Master the QFT - foundation of Shor's algorithm and quantum phase estimation",
    difficulty: "advanced",
    points: 800,
    completed: false,
    locked: true, // Unlocks after qa-401
    category: "Level 4: Quantum Algorithms",
  },
  {
    id: "qa-403",
    title: "Grover's Search Algorithm",
    description:
      "Implement quantum database search with quadratic speedup over classical algorithms",
    difficulty: "advanced",
    points: 900,
    completed: false,
    locked: true, // Unlocks after qa-402
    category: "Level 4: Quantum Algorithms",
  },
  {
    id: "qa-404",
    title: "Bell State Analysis",
    description:
      "Run advanced Bell state circuits and analyze results on IBM Quantum hardware",
    difficulty: "advanced",
    points: 1000,
    completed: false,
    locked: true, // Unlocks after qa-403
    category: "Level 4: Quantum Algorithms",
  },

  // === LEVEL 5: ADVANCED QUANTUM COMPUTING (1100-1500 points) ===
  {
    id: "qr-501",
    title: "Quantum Teleportation Protocol",
    description:
      "Execute a real quantum teleportation circuit on IBM Quantum hardware",
    difficulty: "research",
    points: 1100,
    completed: false,
    locked: true, // Unlocks after Level 4 completion
    category: "Level 5: Advanced Research",
  },
  {
    id: "qr-502",
    title: "Shor's Factoring Algorithm",
    description: "Break RSA encryption using quantum period finding",
    difficulty: "research",
    points: 1200,
    completed: false,
    locked: true, // Unlocks after qr-501
    category: "Level 5: Advanced Research",
  },
  {
    id: "qr-503",
    title: "Variational Quantum Eigensolver (VQE)",
    description:
      "Find molecular ground states using hybrid quantum-classical optimization",
    difficulty: "research",
    points: 1300,
    completed: false,
    locked: true, // Unlocks after qr-502
    category: "Level 5: Advanced Research",
  },
  {
    id: "qr-504",
    title: "Quantum Error Correction",
    description: "Implement quantum error correction to protect your qubits",
    difficulty: "research",
    points: 1400,
    completed: false,
    locked: true, // Unlocks after qr-503
    category: "Level 5: Advanced Research",
  },
  {
    id: "qr-505",
    title: "Quantum Machine Learning",
    description:
      "Train quantum neural networks and implement quantum kernels for ML",
    difficulty: "research",
    points: 1500,
    completed: false,
    locked: true, // Unlocks after qr-504
    category: "Level 5: Advanced Research",
  },
];

// Expanded achievement system with more rewards
const mockAchievements: Achievement[] = [
  {
    id: "first-steps",
    title: "Quantum Beginner",
    description: "Complete your first quantum challenge",
    icon: "🎯",
    unlocked: true,
    rarity: "common",
  },
  {
    id: "superposition-master",
    title: "Superposition Master",
    description: "Master the art of quantum superposition",
    icon: "⚡",
    unlocked: true,
    rarity: "rare",
  },
  {
    id: "entanglement-explorer",
    title: "Entanglement Explorer",
    description: "Create your first entangled quantum state",
    icon: "🔗",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "quantum-pioneer",
    title: "Research Pioneer",
    description: "Complete a research-level quantum challenge",
    icon: "🚀",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "algorithm-master",
    title: "Algorithm Master",
    description: "Successfully implement 5 quantum algorithms",
    icon: "🧠",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "hardware-hero",
    title: "Hardware Hero",
    description: "Run 50 jobs on real IBM Quantum hardware",
    icon: "⚡",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "speedrun-champion",
    title: "Speedrun Champion",
    description: "Complete 10 levels in under 30 minutes",
    icon: "⚡",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "perfectionist",
    title: "Quantum Perfectionist",
    description: "Achieve 100% accuracy on 20 quantum jobs",
    icon: "💎",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "educator",
    title: "Quantum Educator",
    description: "Help 10 other students with quantum concepts",
    icon: "📚",
    unlocked: false,
    rarity: "rare",
  },
];

  // --- GAMIFICATION CONSTANTS ---
  const LEVEL_THRESHOLDS = {
    1: 0,
    2: 300,
    3: 750,
    4: 1500,
    5: 3000,
    6: 5000, // Master level
  };

  const calculateUserLevel = (totalPoints: number): number => {
    if (totalPoints >= LEVEL_THRESHOLDS[6]) return 6;
    if (totalPoints >= LEVEL_THRESHOLDS[5]) return 5;
    if (totalPoints >= LEVEL_THRESHOLDS[4]) return 4;
    if (totalPoints >= LEVEL_THRESHOLDS[3]) return 3;
    if (totalPoints >= LEVEL_THRESHOLDS[2]) return 2;
    return 1;
  };

  const getNextLevelXP = (currentPoints: number): number => {
    const level = calculateUserLevel(currentPoints);
    if (level >= 6) return 10000; // Cap
    return LEVEL_THRESHOLDS[level + 1 as keyof typeof LEVEL_THRESHOLDS] || 10000;
  };

  // --- MOCK DATA & HELPERS ---
  const completedMockLevels = mockLevels.filter((l) => l.completed);
  const mockUserProgress: UserProgress = {
    totalPoints: 250,
    level: calculateUserLevel(250),
    streak: 1,
    completedLevels: completedMockLevels.length,
    rank: 42,
    achievements: mockAchievements.filter((a) => a.unlocked),
  };

  // Base leaderboard with other players (excluding "You")
  const baseLeaderboard = [
    { name: "QuantumExplorer", points: 2450, avatar: "👑" },
    { name: "QubitMaster", points: 2340, avatar: "⚡" },
    { name: "EntanglePro", points: 2180, avatar: "🔬" },
    { name: "CircuitBuilder", points: 240, avatar: "⚙️" },
    { name: "AlgoMaster", points: 235, avatar: "🧠" },
    { name: "QuantumNewbie", points: 220, avatar: "🌟" },
    { name: "ErrorFixer", points: 210, avatar: "🔧" },
    { name: "MLQuantum", points: 205, avatar: "🤖" },
  ];

  // Function to calculate dynamic leaderboard with current user points
  const calculateDynamicLeaderboard = (userPoints: number) => {
    // Create array with all players including current user
    const allPlayers = [
      ...baseLeaderboard,
      { name: "You", points: userPoints, avatar: "🎯" },
    ];

    // Sort by points descending
    const sortedPlayers = allPlayers.sort((a, b) => b.points - a.points);

    // Add ranks
    return sortedPlayers.map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
  };

  // Function to calculate user rank based on current points
  const calculateUserRank = (userPoints: number): number => {
    const playersWithHigherPoints = baseLeaderboard.filter(
      (player) => player.points > userPoints
    );
    return playersWithHigherPoints.length + 1;
  };

  const levelProgression: Record<string, string[]> = {
    "qb-103": ["qb-102"],
    "qg-201": ["qb-101", "qb-102", "qb-103"],
    "qg-202": ["qg-201"],
    "qg-203": ["qg-202"],
    "qg-204": ["qg-203"],
    "qe-301": ["qg-204"],
    "qe-302": ["qe-301"],
    "qe-303": ["qe-302"],
    "qe-304": ["qe-303"],
    "qa-401": ["qe-304"],
    "qa-402": ["qa-401"],
    "qa-403": ["qa-402"],
    "qa-404": ["qa-403"],
    "qr-501": ["qa-404"],
    "qr-502": ["qr-501"],
    "qr-503": ["qr-502"],
    "qr-504": ["qr-503"],
    "qr-505": ["qr-504"],
  };

  const shouldUnlockLevel = (levelId: string, completedLevels: Level[]): boolean => {
    const prerequisites = levelProgression[levelId];
    if (!prerequisites) return true;
    return prerequisites.every((prereqId) =>
      completedLevels.some((level) => level.id === prereqId && level.completed)
    );
  };

  const updateLevelLocking = (updatedLevels: Level[]): Level[] => {
    return updatedLevels.map((level) => ({
      ...level,
      locked: !shouldUnlockLevel(level.id, updatedLevels),
    }));
  };

  export default function QuantumQuest() {

  const [selectedTab, setSelectedTab] = useState("learn");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // --- STATE PERSISTENCE ---
  
  // Initialize state from LocalStorage or Default
  const [levels, setLevels] = useState<Level[]>(() => {
    const saved = localStorage.getItem('quantum_levels');
    return saved ? JSON.parse(saved) : updateLevelLocking(mockLevels); // Ensure locking is correct on fresh start
  });

  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('quantum_progress');
    if (saved) return JSON.parse(saved);
    return mockUserProgress;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('quantum_achievements');
    return saved ? JSON.parse(saved) : mockAchievements;
  });

  // Persist state whenever it changes
  useEffect(() => {
    localStorage.setItem('quantum_levels', JSON.stringify(levels));
  }, [levels]);

  useEffect(() => {
    localStorage.setItem('quantum_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('quantum_achievements', JSON.stringify(achievements));
  }, [achievements]);


  const { toast } = useToast();

  // Calculate dynamic leaderboard based on current user progress
  const dynamicLeaderboard = calculateDynamicLeaderboard(
    userProgress.totalPoints
  );

  // Validate challenges on mount
  useEffect(() => {
    // Only run validation once on mount
    const levelIds = levels.map((level) => level.id);
    const validation = validateChallenges(levelIds);
    if (validation.missing.length > 0) {
      console.warn("⚠️ Missing challenges for levels:", validation.missing);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  // --- GAME LOGIC ---

  // Function to check and unlock achievements based on new state
  const checkAchievements = (currentPoints: number, completedCount: number, currentAchievements: Achievement[]): Achievement[] => {
      let updatedAchievements = [...currentAchievements];
      let newlyUnlocked: Achievement[] = [];

      const unlock = (id: string) => {
          const index = updatedAchievements.findIndex(a => a.id === id);
          if (index !== -1 && !updatedAchievements[index].unlocked) {
              updatedAchievements[index] = { ...updatedAchievements[index], unlocked: true };
              newlyUnlocked.push(updatedAchievements[index]);
          }
      };

      // Achievement Logic
      if (completedCount >= 1) unlock("first-steps");
      if (currentPoints >= 500) unlock("superposition-master"); 
      if (completedCount >= 5) unlock("entanglement-explorer");
      if (completedCount >= 10) unlock("quantum-pioneer");
      if (currentPoints >= 1000) unlock("algorithm-master");

      // Notify for new unlocks
      newlyUnlocked.forEach(achievement => {
           toast({
              title: "🏆 Achievement Unlocked!",
              description: achievement.title,
              variant: "default", // or a custom gold variant if available
          });
      });

      return updatedAchievements;
  };


  // Level completion handler
  const completeLevel = (level: Level) => {
    // Prevent duplicate completion
    if (level.completed) {
      toast({
        title: "Replay Complete",
        description: `You replayed ${level.title}. Practice makes perfect!`,
      });
      return;
    }

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    toast({
      title: "🎉 Level Completed!",
      description: `You earned ${level.points} XP for mastering ${level.title}`,
    });

    // 1. Update Levels
    const updatedLevels = levels.map((l) =>
      l.id === level.id ? { ...l, completed: true } : l
    );
    // Recalculate locks based on new completion status
    const finalLevels = updateLevelLocking(updatedLevels);
    setLevels(finalLevels);

    // 2. Calculate New Stats
    const completedLevelsCount = finalLevels.filter((l) => l.completed).length;
    const newTotalPoints = userProgress.totalPoints + level.points;
    const oldUserLevel = calculateUserLevel(userProgress.totalPoints);
    const newUserLevel = calculateUserLevel(newTotalPoints);
    const newUserRank = calculateUserRank(newTotalPoints);

    // 3. Check Achievements
    const updatedAchievements = checkAchievements(newTotalPoints, completedLevelsCount, achievements);
    setAchievements(updatedAchievements);

    // 4. Update User Progress
    setUserProgress((prev) => ({
      ...prev,
      totalPoints: newTotalPoints,
      completedLevels: completedLevelsCount,
      level: newUserLevel,
      streak: prev.streak + 1, // Simple streak increment for now
      rank: newUserRank,
      achievements: updatedAchievements.filter(a => a.unlocked)
    }));

    // 5. Notifications for Unlocked Content
    const newlyUnlocked = finalLevels.filter(
      (l, index) => levels[index].locked && !l.locked
    );

    if (newlyUnlocked.length > 0) {
      setTimeout(() => {
        toast({
          title: "🔓 New Levels Unlocked!",
          description: `${newlyUnlocked.map((l) => l.title).join(", ")} available now!`,
        });
      }, 1500);
    }

    // 6. Level Up Notification
    if (newUserLevel > oldUserLevel) {
      setTimeout(() => {
        toast({
          title: "🚀 LEVEL UP!",
          description: `You are now Level ${newUserLevel}!`,
          className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none"
        });
      }, 2000);
    }
  };

  // Challenge completion handler
  const handleChallengeComplete = (
    levelId: string,
    success: boolean,
    timeElapsed: number,
    nextLevelId?: string | null
  ) => {
    const level = levels.find((l) => l.id === levelId);
    if (level && success) {
      completeLevel(level);
    }
    
    // If next level is requested and valid, switch to it; otherwise go back to map
    if (nextLevelId) {
      // Small delay for effect
      setTimeout(() => setCurrentChallenge(nextLevelId), 500);
    } else {
      setCurrentChallenge(null);
    }
  };

  const handleStartChallenge = (level: Level) => {
    if (!level.locked) {
      if (level.completed) {
        toast({
          title: "Replay Challenge",
          description: `Starting replay of ${level.title}. Note: No additional points will be awarded.`,
        });
      }
      setCurrentChallenge(level.id);
    }
  };

  const getDifficultyColor = (difficulty: Level["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-blue-500";
      case "advanced":
        return "bg-purple-500";
      case "research":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRarityColor = (rarity: Achievement["rarity"]) => {
    switch (rarity) {
      case "common":
        return "text-gray-600";
      case "rare":
        return "text-blue-600";
      case "epic":
        return "text-purple-600";
      case "legendary":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  // Calculate XP targets for MissionControl
  const currentLevel = calculateUserLevel(userProgress.totalPoints);
  const currentLevelBaseXP = LEVEL_THRESHOLDS[currentLevel as keyof typeof LEVEL_THRESHOLDS] || 0;
  const nextLevelXPTarget = LEVEL_THRESHOLDS[(currentLevel + 1) as keyof typeof LEVEL_THRESHOLDS] || 10000;

  return (
    <div className="min-h-screen bg-[#050B14] text-white">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                  transition: {
                    duration: 3,
                    delay: Math.random() * 2,
                  },
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <MissionControl 
        user={userProgress} 
        xpTarget={nextLevelXPTarget} 
        prevLevelTarget={currentLevelBaseXP} 
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header - Back Button Only (rest is in HUD) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="max-w-7xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-900 border border-gray-800">
            <TabsTrigger value="learn" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Play className="h-4 w-4" />
              Galaxy Map
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Award className="h-4 w-4" />
              Artifacts
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="flex items-center gap-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Trophy className="h-4 w-4" />
              Rankings
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
          </TabsList>

          {/* Galaxy Map View */}
          <TabsContent value="learn" className="space-y-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-4">
                     <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Quantum Constellation</h2>
                     <p className="text-sm text-gray-400">Navigate the stars to unlock quantum mastery</p>
                </div>
                <GalaxyMap levels={levels} onLevelClick={handleStartChallenge} />
            </motion.div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`${
                      achievement.unlocked
                        ? "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
                        : "opacity-60"
                    }`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{achievement.icon}</div>
                      <h3
                        className={`font-bold mb-2 ${getRarityColor(
                          achievement.rarity
                        )}`}
                      >
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {achievement.description}
                      </p>
                      <Badge
                        variant={achievement.unlocked ? "default" : "secondary"}
                        className={`${getRarityColor(
                          achievement.rarity
                        )} capitalize`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              {dynamicLeaderboard.map((player, index) => (
                <motion.div
                  key={player.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`mb-3 ${
                      player.name === "You"
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300"
                        : ""
                    }`}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            player.rank <= 3
                              ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          {player.rank <= 3 ? (
                            <Crown className="h-4 w-4" />
                          ) : (
                            player.rank
                          )}
                        </div>
                        <div className="text-2xl">{player.avatar}</div>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            {player.points} points
                          </div>
                        </div>
                      </div>
                      {player.rank <= 3 && (
                        <Trophy
                          className={`h-6 w-6 ${
                            player.rank === 1
                              ? "text-yellow-500"
                              : player.rank === 2
                              ? "text-gray-400"
                              : "text-orange-600"
                          }`}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Progress Analytics */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Learning Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Calculate level progress dynamically */}
                    {(() => {
                      const levelGroups = {
                        "Level 1: Quantum Fundamentals": levels.filter(
                          (l) => l.category === "Level 1: Quantum Fundamentals"
                        ),
                        "Level 2: Basic Quantum Gates": levels.filter(
                          (l) => l.category === "Level 2: Basic Quantum Gates"
                        ),
                        "Level 3: Two-Qubit Operations": levels.filter(
                          (l) => l.category === "Level 3: Two-Qubit Operations"
                        ),
                        "Level 4: Quantum Algorithms": levels.filter(
                          (l) => l.category === "Level 4: Quantum Algorithms"
                        ),
                        "Level 5: Advanced Research": levels.filter(
                          (l) => l.category === "Level 5: Advanced Research"
                        ),
                      };

                      return Object.entries(levelGroups).map(
                        ([levelName, levelList]) => {
                          const completed = levelList.filter(
                            (l) => l.completed
                          ).length;
                          const total = levelList.length;
                          const progress =
                            total > 0 ? (completed / total) * 100 : 0;

                          return (
                            <div key={levelName}>
                              <div className="flex justify-between mb-2">
                                <span>{levelName}</span>
                                <span>
                                  {completed}/{total}
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          );
                        }
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">
                          Completed "Superposition States"
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          +150 points
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">
                          Completed "First Qubit"
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          +100 points
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Award className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">
                          Unlocked "Quantum Beginner"
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Achievement earned
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Level Challenge View */}
        <AnimatePresence>
          {currentChallenge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-white dark:bg-gray-900 z-50 overflow-y-auto"
            >
              <LevelChallenge
                key={currentChallenge}
                levelId={currentChallenge}
                onComplete={handleChallengeComplete}
                onBack={() => setCurrentChallenge(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
