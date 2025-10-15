import { Question } from '@/components/quiz/QuizQuestion';

export const quantumQuizzes: Record<string, Question[]> = {
  basics: [
    {
      id: 'basics-1',
      question: 'What is the fundamental unit of quantum information?',
      type: 'multiple-choice',
      options: ['Bit', 'Qubit', 'Byte', 'Quantum Byte'],
      correctAnswer: 1,
      explanation: 'A qubit (quantum bit) is the fundamental unit of quantum information, analogous to a classical bit but capable of existing in superposition.',
      difficulty: 'beginner',
      category: 'Quantum Basics'
    },
    {
      id: 'basics-2',
      question: 'Can a qubit be in both |0⟩ and |1⟩ states simultaneously?',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Yes! This is called superposition - a qubit can exist in a combination of both states until measured.',
      difficulty: 'beginner',
      category: 'Quantum Basics'
    },
    {
      id: 'basics-3',
      question: 'What happens when you measure a qubit in superposition?',
      type: 'multiple-choice',
      options: [
        'It stays in superposition',
        'It collapses to either |0⟩ or |1⟩',
        'It becomes entangled',
        'It creates a new qubit'
      ],
      correctAnswer: 1,
      explanation: 'When measured, a qubit in superposition collapses to either |0⟩ or |1⟩ with probabilities determined by its quantum state.',
      difficulty: 'beginner',
      category: 'Quantum Basics'
    },
    {
      id: 'basics-4',
      question: 'How many classical bits of information can one qubit store when measured?',
      type: 'multiple-choice',
      options: ['1 bit', '2 bits', '4 bits', 'Infinite bits'],
      correctAnswer: 0,
      explanation: 'When measured, a qubit yields only 1 classical bit of information (0 or 1). However, before measurement, it can be in a superposition of states.',
      difficulty: 'intermediate',
      category: 'Quantum Basics'
    },
    {
      id: 'basics-5',
      question: 'The Bloch sphere represents the state of a single qubit.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Correct! The Bloch sphere is a geometrical representation where every point on the surface represents a possible pure state of a qubit.',
      difficulty: 'beginner',
      category: 'Quantum Basics'
    }
  ],
  
  superposition: [
    {
      id: 'super-1',
      question: 'Which quantum gate creates an equal superposition from |0⟩?',
      type: 'multiple-choice',
      options: ['X Gate', 'Z Gate', 'Hadamard Gate', 'CNOT Gate'],
      correctAnswer: 2,
      explanation: 'The Hadamard gate transforms |0⟩ into (|0⟩ + |1⟩)/√2, creating an equal superposition of both states.',
      difficulty: 'intermediate',
      category: 'Superposition'
    },
    {
      id: 'super-2',
      question: 'In the state |ψ⟩ = α|0⟩ + β|1⟩, what must be true about α and β?',
      type: 'multiple-choice',
      options: [
        'α + β = 1',
        '|α|² + |β|² = 1',
        'α = β',
        'α and β must be real numbers'
      ],
      correctAnswer: 1,
      explanation: 'The probability amplitudes must satisfy |α|² + |β|² = 1 (normalization condition). α and β can be complex numbers.',
      difficulty: 'intermediate',
      category: 'Superposition'
    },
    {
      id: 'super-3',
      question: 'A quantum computer with 3 qubits can represent how many states simultaneously?',
      type: 'multiple-choice',
      options: ['3 states', '6 states', '8 states', '9 states'],
      correctAnswer: 2,
      explanation: 'With n qubits, a quantum computer can represent 2ⁿ states simultaneously. For 3 qubits: 2³ = 8 states.',
      difficulty: 'intermediate',
      category: 'Superposition'
    },
    {
      id: 'super-4',
      question: 'Quantum interference is used to amplify correct answers in quantum algorithms.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Yes! Quantum algorithms use constructive interference to amplify correct answers and destructive interference to cancel out wrong answers.',
      difficulty: 'intermediate',
      category: 'Superposition'
    }
  ],

  entanglement: [
    {
      id: 'ent-1',
      question: 'What did Einstein call quantum entanglement?',
      type: 'multiple-choice',
      options: [
        'Quantum magic',
        'Spooky action at a distance',
        'Quantum correlation',
        'Impossible phenomenon'
      ],
      correctAnswer: 1,
      explanation: 'Einstein famously called entanglement "spooky action at a distance" because he was skeptical about its non-local nature.',
      difficulty: 'beginner',
      category: 'Entanglement'
    },
    {
      id: 'ent-2',
      question: 'Which gate is commonly used to create entanglement?',
      type: 'multiple-choice',
      options: ['Hadamard', 'CNOT', 'Pauli-X', 'Phase Gate'],
      correctAnswer: 1,
      explanation: 'The CNOT (Controlled-NOT) gate, when applied after a Hadamard gate, is the standard way to create entanglement between qubits.',
      difficulty: 'intermediate',
      category: 'Entanglement'
    },
    {
      id: 'ent-3',
      question: 'In a Bell state, measuring one qubit affects the other instantaneously.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'In a maximally entangled Bell state, measuring one qubit instantly determines the state of the other, regardless of distance.',
      difficulty: 'intermediate',
      category: 'Entanglement'
    },
    {
      id: 'ent-4',
      question: 'What is the Bell state |Φ⁺⟩ equal to?',
      type: 'multiple-choice',
      options: [
        '(|00⟩ + |11⟩) / √2',
        '(|01⟩ + |10⟩) / √2',
        '|00⟩ + |01⟩',
        '|0⟩ ⊗ |1⟩'
      ],
      correctAnswer: 0,
      explanation: 'The Bell state |Φ⁺⟩ = (|00⟩ + |11⟩) / √2 is a maximally entangled state where both qubits are perfectly correlated.',
      difficulty: 'advanced',
      category: 'Entanglement'
    }
  ],

  gates: [
    {
      id: 'gates-1',
      question: 'Which gate is the quantum equivalent of the classical NOT gate?',
      type: 'multiple-choice',
      options: ['Hadamard', 'Pauli-X', 'Pauli-Z', 'Phase'],
      correctAnswer: 1,
      explanation: 'The Pauli-X gate flips |0⟩ to |1⟩ and vice versa, making it equivalent to the classical NOT gate.',
      difficulty: 'beginner',
      category: 'Quantum Gates'
    },
    {
      id: 'gates-2',
      question: 'Are quantum gates reversible?',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Yes! All quantum gates must be reversible (unitary). This is a fundamental requirement of quantum mechanics.',
      difficulty: 'intermediate',
      category: 'Quantum Gates'
    },
    {
      id: 'gates-3',
      question: 'What does the Pauli-Z gate do to the state |1⟩?',
      type: 'multiple-choice',
      options: [
        'Flips it to |0⟩',
        'Applies a phase flip: |1⟩ → -|1⟩',
        'Creates superposition',
        'Does nothing'
      ],
      correctAnswer: 1,
      explanation: 'The Z gate applies a phase flip to |1⟩, changing it to -|1⟩, while leaving |0⟩ unchanged.',
      difficulty: 'intermediate',
      category: 'Quantum Gates'
    },
    {
      id: 'gates-4',
      question: 'The T gate is essential for universal quantum computation.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'The T gate (π/8 gate) combined with Hadamard and CNOT gates forms a universal gate set for quantum computation.',
      difficulty: 'advanced',
      category: 'Quantum Gates'
    },
    {
      id: 'gates-5',
      question: 'How many qubits does the CNOT gate operate on?',
      type: 'multiple-choice',
      options: ['1', '2', '3', 'Variable'],
      correctAnswer: 1,
      explanation: 'CNOT is a two-qubit gate with a control qubit and a target qubit. It flips the target if the control is |1⟩.',
      difficulty: 'beginner',
      category: 'Quantum Gates'
    }
  ],

  algorithms: [
    {
      id: 'algo-1',
      question: 'What is the main application of Shor\'s algorithm?',
      type: 'multiple-choice',
      options: [
        'Database searching',
        'Integer factorization',
        'Sorting numbers',
        'Machine learning'
      ],
      correctAnswer: 1,
      explanation: 'Shor\'s algorithm efficiently factors large integers, which threatens RSA encryption security.',
      difficulty: 'intermediate',
      category: 'Algorithms'
    },
    {
      id: 'algo-2',
      question: 'Grover\'s algorithm provides quadratic speedup for unsorted database search.',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'Grover\'s algorithm searches an unsorted database of N items in O(√N) time, compared to O(N) classically - a quadratic speedup.',
      difficulty: 'intermediate',
      category: 'Algorithms'
    },
    {
      id: 'algo-3',
      question: 'Which algorithm is used for finding ground state energies in quantum chemistry?',
      type: 'multiple-choice',
      options: ['Shor\'s', 'Grover\'s', 'VQE', 'Deutsch-Jozsa'],
      correctAnswer: 2,
      explanation: 'VQE (Variational Quantum Eigensolver) is a hybrid quantum-classical algorithm designed to find ground state energies of molecules.',
      difficulty: 'advanced',
      category: 'Algorithms'
    },
    {
      id: 'algo-4',
      question: 'What is the time complexity of Shor\'s algorithm?',
      type: 'multiple-choice',
      options: [
        'O(2ⁿ)',
        'O(n³)',
        'O(n log n)',
        'O(√n)'
      ],
      correctAnswer: 1,
      explanation: 'Shor\'s algorithm runs in polynomial time O(n³), exponentially faster than the best known classical algorithms.',
      difficulty: 'advanced',
      category: 'Algorithms'
    },
    {
      id: 'algo-5',
      question: 'QAOA is designed specifically for near-term quantum devices (NISQ era).',
      type: 'true-false',
      correctAnswer: 'True',
      explanation: 'QAOA (Quantum Approximate Optimization Algorithm) is designed for NISQ (Noisy Intermediate-Scale Quantum) devices and solves combinatorial optimization problems.',
      difficulty: 'advanced',
      category: 'Algorithms'
    }
  ]
};

export type QuizCategory = keyof typeof quantumQuizzes;

export const quizCategories: { id: QuizCategory; title: string; description: string; difficulty: string; icon: string }[] = [
  {
    id: 'basics',
    title: 'Quantum Basics',
    description: 'Test your understanding of fundamental quantum concepts',
    difficulty: 'Beginner',
    icon: '🔬'
  },
  {
    id: 'superposition',
    title: 'Superposition',
    description: 'Challenge yourself on quantum superposition principles',
    difficulty: 'Intermediate',
    icon: '⚡'
  },
  {
    id: 'entanglement',
    title: 'Entanglement',
    description: 'Explore quantum entanglement and correlation',
    difficulty: 'Intermediate',
    icon: '🔗'
  },
  {
    id: 'gates',
    title: 'Quantum Gates',
    description: 'Master quantum gates and circuit operations',
    difficulty: 'Intermediate',
    icon: '🎯'
  },
  {
    id: 'algorithms',
    title: 'Quantum Algorithms',
    description: 'Test knowledge of major quantum algorithms',
    difficulty: 'Advanced',
    icon: '🚀'
  }
];
