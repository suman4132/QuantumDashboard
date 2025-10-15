import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb,
  Target,
  Zap,
  Brain,
  CheckCircle,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { QuantumParticleEffects } from "./quantum-particle-effects";

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  concept: string;
  visualAid?: 'bloch-sphere' | 'circuit' | 'particles' | 'math';
  interactiveElement?: React.ReactNode;
  tips: string[];
  nextButton: string;
}

interface QuantumTutorialSystemProps {
  levelId: string;
  onComplete: () => void;
  onSkip: () => void;
}

const tutorialData: Record<string, TutorialStep[]> = {
  'qb-101': [
    {
      id: 'qubit-intro',
      title: 'Welcome to Quantum Computing! 🎉',
      content: 'A qubit is the fundamental unit of quantum information. Unlike classical bits that are either 0 or 1, qubits can exist in a "superposition" of both states simultaneously!',
      concept: 'Quantum Superposition',
      visualAid: 'particles',
      tips: [
        'Think of a spinning coin - it\'s neither heads nor tails until it lands',
        'Qubits can process multiple possibilities at once',
        'This gives quantum computers their incredible power'
      ],
      nextButton: 'Explore Superposition →'
    },
    {
      id: 'superposition-demo',
      title: 'Superposition in Action ⚡',
      content: 'When we measure a qubit in superposition, it "collapses" to either |0⟩ or |1⟩. The probability of each outcome depends on the qubit\'s quantum state.',
      concept: 'Quantum Measurement',
      visualAid: 'bloch-sphere',
      tips: [
        'The Bloch sphere shows all possible qubit states',
        'North pole = |0⟩, South pole = |1⟩',
        'Equator = superposition states'
      ],
      nextButton: 'Ready for Gates! →'
    }
  ],
  'qg-201': [
    {
      id: 'hadamard-intro',
      title: 'The Hadamard Gate - Your Quantum Swiss Army Knife! 🔧',
      content: 'The Hadamard gate (H) is one of the most important quantum gates. It creates perfect superposition from any basis state and is the foundation of many quantum algorithms.',
      concept: 'Quantum Gates',
      visualAid: 'circuit',
      tips: [
        'H|0⟩ = (|0⟩ + |1⟩)/√2 - equal superposition',
        'H|1⟩ = (|0⟩ - |1⟩)/√2 - superposition with phase',
        'Applying H twice returns to original state'
      ],
      nextButton: 'Build Your Circuit →'
    }
  ],
  'qa-401': [
    {
      id: 'grovers-intro',
      title: 'Grover\'s Quantum Search - Finding Needles in Haystacks! 🔍',
      content: 'Grover\'s algorithm can search unsorted databases quadratically faster than any classical algorithm. Instead of checking N items, it only needs ~√N steps!',
      concept: 'Quantum Algorithms',
      visualAid: 'particles',
      tips: [
        'Classical search: O(N) - check every item',
        'Grover\'s search: O(√N) - quadratic speedup',
        'Works by amplifying the amplitude of correct answers'
      ],
      nextButton: 'Implement Grover\'s →'
    }
  ]
};

const conceptExplanations = {
  'Quantum Superposition': {
    description: 'The ability of quantum systems to exist in multiple states simultaneously until measured',
    realWorldExample: 'Like Schrödinger\'s cat being both alive and dead until observed',
    applications: ['Quantum algorithms', 'Parallel computation', 'Quantum sensing']
  },
  'Quantum Measurement': {
    description: 'The process that collapses a quantum superposition into a definite classical state',
    realWorldExample: 'Like observing which way the spinning coin lands',
    applications: ['Reading quantum computation results', 'Quantum error detection', 'Quantum communication']
  },
  'Quantum Gates': {
    description: 'Operations that manipulate qubits, analogous to logic gates in classical computing',
    realWorldExample: 'Like switches and transformers in an electrical circuit',
    applications: ['Building quantum circuits', 'Implementing algorithms', 'Error correction']
  },
  'Quantum Algorithms': {
    description: 'Step-by-step procedures that leverage quantum mechanics for computational advantages',
    realWorldExample: 'Like having a GPS that can explore all routes simultaneously',
    applications: ['Cryptography', 'Optimization', 'Machine learning', 'Drug discovery']
  }
};

export function QuantumTutorialSystem({ levelId, onComplete, onSkip }: QuantumTutorialSystemProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConcept, setShowConcept] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = tutorialData[levelId] || [];
  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (steps.length > 0) {
      setProgress(((currentStep + 1) / steps.length) * 100);
    }
  }, [currentStep, steps.length]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(currentStep + 1);
      setIsAnimating(false);
    } else {
      onComplete();
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }
  };

  const toggleConcept = () => {
    setShowConcept(!showConcept);
  };

  if (!currentStepData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No tutorial available for this level.</p>
        <Button onClick={onSkip} variant="outline" className="ml-4">
          Skip to Challenge
        </Button>
      </div>
    );
  }

  const conceptInfo = conceptExplanations[currentStepData.concept as keyof typeof conceptExplanations];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold">Quantum Tutorial</h2>
            <p className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</p>
          </div>
        </div>
        <Button onClick={onSkip} variant="ghost" size="sm">
          Skip Tutorial
        </Button>
      </div>

      <Progress value={progress} className="h-2" />

      {/* Main Tutorial Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tutorial Step */}
        <div className="md:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    {currentStepData.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {currentStepData.concept}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    {currentStepData.content}
                  </p>

                  {/* Visual Aid */}
                  {currentStepData.visualAid === 'particles' && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 h-40 relative overflow-hidden">
                      <QuantumParticleEffects
                        effectType="quantum"
                        intensity="medium"
                        width={400}
                        height={160}
                        trigger={currentStep.toString()}
                      />
                    </div>
                  )}

                  {currentStepData.visualAid === 'bloch-sphere' && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 h-40 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          Bloch<br />Sphere
                        </div>
                        <p className="text-xs text-gray-600 mt-2">Interactive visualization coming soon!</p>
                      </div>
                    </div>
                  )}

                  {currentStepData.visualAid === 'circuit' && (
                    <div className="bg-gray-50 rounded-lg p-4 h-40 flex items-center justify-center">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
                          |0⟩
                        </div>
                        <div className="w-16 h-12 bg-purple-500 rounded flex items-center justify-center text-white font-bold">
                          H
                        </div>
                        <div className="w-16 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm">
                          Measure
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactive Element */}
                  {currentStepData.interactiveElement}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {currentStepData.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Concept Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Brain className="h-4 w-4 text-purple-600" />
                Quantum Concept
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold text-purple-700">{currentStepData.concept}</h4>
                <p className="text-sm text-gray-600 mt-1">{conceptInfo?.description}</p>
              </div>

              <Button
                onClick={toggleConcept}
                variant="outline"
                size="sm"
                className="w-full"
                data-testid="button-toggle-concept"
              >
                {showConcept ? 'Hide Details' : 'Learn More'}
              </Button>

              <AnimatePresence>
                {showConcept && conceptInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div>
                      <h5 className="text-sm font-semibold">Real-World Example:</h5>
                      <p className="text-xs text-gray-600">{conceptInfo.realWorldExample}</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-semibold">Applications:</h5>
                      <ul className="text-xs text-gray-600">
                        {conceptInfo.applications.map((app: string, index: number) => (
                          <li key={index} className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0 || isAnimating}
          variant="outline"
          data-testid="button-tutorial-previous"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-blue-600' : 
                index < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={isAnimating}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
          data-testid="button-tutorial-next"
        >
          {currentStepData.nextButton}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// Quantum Hint System for ongoing help
interface QuantumHintProps {
  hint: string;
  visible: boolean;
  onDismiss: () => void;
}

export function QuantumHint({ hint, visible, onDismiss }: QuantumHintProps) {
  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50"
      >
        <Card className="max-w-sm border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{hint}</p>
                <Button
                  onClick={onDismiss}
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-6 px-2 text-xs"
                  data-testid="button-dismiss-hint"
                >
                  Got it!
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}