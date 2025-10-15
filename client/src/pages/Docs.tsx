import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, Atom, Zap, Brain, Cpu, Shield, ChevronRight, Home, Menu, X, 
  Code, Rocket, Lightbulb, HelpCircle, BookOpen, Star, ArrowUp, GraduationCap 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BlochSphere from '@/components/quantum/BlochSphere';
import QuantumParticles from '@/components/quantum/QuantumParticles';
import QuantumGates from '@/components/quantum/QuantumGates';
import QuantumCircuitDiagram from '@/components/docs/QuantumCircuitDiagram';
import QubitComparisonDiagram from '@/components/docs/QubitComparisonDiagram';
import AlgorithmTimeline from '@/components/docs/AlgorithmTimeline';
import CodeExample from '@/components/docs/CodeExample';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const sections = [
  { id: 'intro', title: 'Introduction', icon: Book },
  { id: 'quickstart', title: 'Quick Start', icon: Rocket },
  { id: 'basics', title: 'Quantum Basics', icon: Atom },
  { id: 'superposition', title: 'Superposition', icon: Zap },
  { id: 'entanglement', title: 'Entanglement', icon: Brain },
  { id: 'gates', title: 'Quantum Gates', icon: Cpu },
  { id: 'circuits', title: 'Quantum Circuits', icon: Code },
  { id: 'algorithms', title: 'Algorithms', icon: Shield },
  { id: 'timeline', title: 'Timeline', icon: Star },
  { id: 'bestpractices', title: 'Best Practices', icon: Lightbulb },
  { id: 'faq', title: 'FAQ', icon: HelpCircle },
  { id: 'resources', title: 'Resources', icon: BookOpen },
  { id: 'quiz', title: 'Test Your Knowledge', icon: GraduationCap },
];

const codeExamples = {
  basicCircuit: `# Create a simple quantum circuit
from qiskit import QuantumCircuit, execute, Aer

# Initialize a 2-qubit circuit
qc = QuantumCircuit(2, 2)

# Apply Hadamard gate to create superposition
qc.h(0)

# Apply CNOT for entanglement
qc.cx(0, 1)

# Measure the qubits
qc.measure([0, 1], [0, 1])

# Execute the circuit
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1000)
result = job.result()
counts = result.get_counts(qc)

print(counts)  # {'00': 501, '11': 499}`,

  grovers: `# Grover's Algorithm for database search
from qiskit import QuantumCircuit
from qiskit.circuit.library import GroverOperator

# Create oracle for target state |11⟩
oracle = QuantumCircuit(2)
oracle.cz(0, 1)

# Create Grover operator
grover_op = GroverOperator(oracle)

# Build full circuit
qc = QuantumCircuit(2)
qc.h([0, 1])  # Initialize superposition
qc.append(grover_op, [0, 1])  # Apply Grover
qc.measure_all()`,

  vqe: `# Variational Quantum Eigensolver (VQE)
from qiskit.algorithms import VQE
from qiskit.algorithms.optimizers import SLSQP
from qiskit.circuit.library import TwoLocal
from qiskit.primitives import Estimator

# Define the ansatz (parameterized circuit)
ansatz = TwoLocal(
    num_qubits=2,
    rotation_blocks='ry',
    entanglement_blocks='cz'
)

# Set up VQE
vqe = VQE(
    estimator=Estimator(),
    ansatz=ansatz,
    optimizer=SLSQP(maxiter=100)
)

# Run VQE to find ground state energy
result = vqe.compute_minimum_eigenvalue(hamiltonian)
print(f"Ground state energy: {result.eigenvalue}")`
};

const faqs = [
  {
    q: "What is quantum advantage?",
    a: "Quantum advantage (or quantum supremacy) is achieved when a quantum computer can solve a problem that would be practically impossible for classical computers. Google's Sycamore processor achieved this in 2019 by performing a calculation in 200 seconds that would take classical supercomputers 10,000 years."
  },
  {
    q: "How many qubits do we need for practical quantum computing?",
    a: "For breaking RSA-2048 encryption using Shor's algorithm, estimates suggest we need around 4,000-20,000 logical qubits. Considering error correction overhead (each logical qubit needs ~1,000 physical qubits), we're looking at millions of physical qubits. Current systems have 50-1,000+ qubits."
  },
  {
    q: "What is quantum decoherence?",
    a: "Decoherence is the loss of quantum properties due to environmental interference. Qubits are extremely fragile and can lose their quantum state in microseconds. This is why quantum computers require near-absolute zero temperatures and isolation from electromagnetic interference."
  },
  {
    q: "Can quantum computers break all encryption?",
    a: "Quantum computers threaten asymmetric encryption (RSA, ECC) but not all encryption. Symmetric encryption like AES-256 remains secure with doubled key sizes. Post-quantum cryptography is being developed to resist quantum attacks."
  },
  {
    q: "What are the main quantum computing platforms?",
    a: "Major platforms include: IBM Quantum (superconducting qubits), Google Quantum AI (superconducting), IonQ (trapped ions), Rigetti Computing (superconducting), D-Wave (quantum annealing), and Amazon Braket (cloud access to multiple systems)."
  }
];

export default function Docs() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('intro');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    if (id === 'quiz') {
      navigate('/quiz');
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors" data-testid="button-home">
            <Home className="w-5 h-5" />
            <span className="font-semibold">QuantumCloud</span>
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
          
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => navigate('/')} className="text-slate-300 hover:text-white transition-colors" data-testid="link-home">Home</button>
            <button onClick={() => navigate('/dashboard')} className="text-slate-300 hover:text-white transition-colors" data-testid="link-dashboard">Dashboard</button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 bg-slate-900/50 backdrop-blur-sm rounded-lg p-4 border border-slate-800">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-400" />
                Contents
              </h3>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                          activeSection === section.id
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                        whileHover={{ x: 5 }}
                        data-testid={`button-nav-${section.id}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{section.title}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </ScrollArea>
            </div>
          </aside>

          <main className="flex-1">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-8 border border-slate-800">
              {/* Introduction */}
              <section id="intro" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 flex items-center gap-3">
                    <Book className="w-10 h-10 text-blue-400" />
                    Quantum Computing Documentation
                  </h1>
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                    Welcome to the comprehensive guide to quantum computing. This documentation will take you from fundamental concepts to advanced quantum algorithms and real-world applications. Master the future of computing with interactive visualizations and hands-on examples.
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6 mb-8"
                >
                  <h3 className="text-white font-semibold mb-3 text-xl">What You'll Master</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'Quantum mechanics principles and computing applications',
                      'Qubits, superposition, and quantum entanglement',
                      'Quantum gates, circuits, and algorithm design',
                      'Industry-standard algorithms and their implementations',
                      'Best practices for quantum software development',
                      'Real-world use cases across industries'
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <ChevronRight className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                <QuantumParticles />
              </section>

              {/* Quick Start */}
              <section id="quickstart" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Rocket className="w-8 h-8 text-blue-400" />
                    Quick Start Guide
                  </h2>
                  
                  <div className="space-y-6">
                    <p className="text-slate-300 leading-relaxed">
                      Get started with quantum computing in minutes. Follow these steps to create your first quantum circuit and run your first quantum program.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { step: '1', title: 'Setup Environment', desc: 'Install Qiskit or access cloud platforms', icon: '🔧' },
                        { step: '2', title: 'Create Circuit', desc: 'Build your quantum circuit with gates', icon: '⚡' },
                        { step: '3', title: 'Run & Analyze', desc: 'Execute and visualize results', icon: '📊' }
                      ].map((item, index) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 border border-slate-700 hover:border-blue-500/50 transition-all"
                        >
                          <div className="text-4xl mb-3">{item.icon}</div>
                          <div className="text-sm text-blue-400 font-semibold mb-2">Step {item.step}</div>
                          <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>

                    <CodeExample
                      title="Your First Quantum Circuit"
                      code={codeExamples.basicCircuit}
                      language="python"
                    />
                  </div>
                </motion.div>
              </section>

              {/* Quantum Basics */}
              <section id="basics" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Atom className="w-8 h-8 text-purple-400" />
                    Quantum Computing Fundamentals
                  </h2>
                  
                  <div className="space-y-6 text-slate-300">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-semibold text-white mb-3">What is Quantum Computing?</h3>
                      <p className="leading-relaxed mb-4">
                        Quantum computing harnesses the principles of quantum mechanics to process information in fundamentally different ways than classical computers. By leveraging quantum phenomena like superposition and entanglement, quantum computers can solve certain problems exponentially faster than their classical counterparts.
                      </p>
                    </motion.div>

                    <QubitComparisonDiagram />

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-semibold text-white mb-3">The Bloch Sphere Representation</h3>
                      <p className="leading-relaxed mb-4">
                        The Bloch sphere is a geometrical representation of a qubit's quantum state. Every point on the surface of the sphere represents a possible pure quantum state. The north pole represents |0⟩, the south pole represents |1⟩, and all other points represent superposition states.
                      </p>
                      <BlochSphere />
                      <p className="text-sm text-slate-400 mt-2 italic">
                        Interactive 3D visualization: The yellow arrow shows the qubit state vector rotating on the Bloch sphere. Drag to rotate, scroll to zoom.
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </section>

              {/* Superposition */}
              <section id="superposition" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-400" />
                    Superposition Principle
                  </h2>
                  
                  <div className="space-y-6 text-slate-300">
                    <p className="leading-relaxed">
                      Superposition is one of the most fundamental principles of quantum mechanics. It allows a quantum system to exist in multiple states simultaneously until measured. This is what gives quantum computers their extraordinary computational power.
                    </p>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg p-6"
                    >
                      <h3 className="text-white font-semibold mb-3">Mathematical Representation</h3>
                      <p className="mb-2">A qubit in superposition can be written as:</p>
                      <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm mb-3">
                        |ψ⟩ = α|0⟩ + β|1⟩
                      </div>
                      <p className="text-sm">
                        where α and β are complex numbers called probability amplitudes, and |α|² + |β|² = 1
                      </p>
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">Key Properties</h3>
                      <div className="space-y-3">
                        {[
                          { title: 'Parallel Processing', desc: 'A quantum computer with n qubits can represent 2ⁿ states simultaneously, enabling massive parallelism' },
                          { title: 'Measurement Collapse', desc: 'When measured, a qubit collapses to either |0⟩ or |1⟩ with probability |α|² or |β|² respectively' },
                          { title: 'Quantum Interference', desc: 'Quantum algorithms use constructive and destructive interference to amplify correct answers and cancel wrong ones' }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-start gap-3 bg-slate-800/30 p-4 rounded-lg hover:bg-slate-800/50 transition-colors"
                          >
                            <ChevronRight className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <strong className="text-white">{item.title}:</strong> {item.desc}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Entanglement */}
              <section id="entanglement" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-pink-400" />
                    Quantum Entanglement
                  </h2>
                  
                  <div className="space-y-6 text-slate-300">
                    <p className="leading-relaxed">
                      Quantum entanglement is a phenomenon where two or more qubits become correlated in such a way that the state of one qubit cannot be described independently of the others, even when separated by large distances. Einstein famously called this "spooky action at a distance."
                    </p>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-lg p-6"
                    >
                      <h3 className="text-white font-semibold mb-3">Bell State (EPR Pair)</h3>
                      <p className="mb-2">A maximally entangled two-qubit state:</p>
                      <div className="bg-slate-900/50 p-4 rounded-lg font-mono text-sm mb-3">
                        |Φ⁺⟩ = (|00⟩ + |11⟩) / √2
                      </div>
                      <p className="text-sm">
                        Measuring one qubit instantly determines the state of the other, regardless of distance
                      </p>
                    </motion.div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">Applications of Entanglement</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { icon: Shield, title: 'Quantum Cryptography', desc: 'Enables perfectly secure communication through quantum key distribution (QKD)', color: 'pink' },
                          { icon: Zap, title: 'Quantum Teleportation', desc: 'Transfers quantum states between distant locations using entanglement', color: 'purple' },
                          { icon: Cpu, title: 'Quantum Computing', desc: 'Essential resource for quantum algorithms and error correction', color: 'blue' },
                          { icon: Brain, title: 'Quantum Sensing', desc: 'Enhances measurement precision beyond classical limits', color: 'green' }
                        ].map((app, index) => {
                          const Icon = app.icon;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-pink-500/50 transition-all"
                            >
                              <h4 className={`text-${app.color}-400 font-semibold mb-2 flex items-center gap-2`}>
                                <Icon className="w-5 h-5" />
                                {app.title}
                              </h4>
                              <p className="text-sm">{app.desc}</p>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Quantum Gates */}
              <section id="gates" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Cpu className="w-8 h-8 text-cyan-400" />
                    Quantum Gates & Operations
                  </h2>
                  
                  <div className="space-y-6 text-slate-300">
                    <p className="leading-relaxed">
                      Quantum gates are the building blocks of quantum circuits. Unlike classical logic gates, quantum gates are reversible and operate on qubits in superposition, enabling quantum parallelism.
                    </p>

                    <QuantumGates />
                    <p className="text-sm text-slate-400 italic text-center">
                      Interactive 3D visualization: Explore common quantum gates (drag to rotate, scroll to zoom)
                    </p>

                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">Essential Quantum Gates</h3>
                      <div className="space-y-4">
                        {[
                          { 
                            name: 'Hadamard Gate (H)', 
                            color: 'cyan', 
                            desc: 'Creates superposition by transforming |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ - |1⟩)/√2',
                            matrix: 'H = 1/√2 [ 1   1 ]\n           [ 1  -1 ]'
                          },
                          { 
                            name: 'Pauli-X Gate (X)', 
                            color: 'purple', 
                            desc: 'Quantum NOT gate, flips |0⟩ ↔ |1⟩ (equivalent to classical NOT)',
                            matrix: 'X = [ 0  1 ]\n    [ 1  0 ]'
                          },
                          { 
                            name: 'Pauli-Z Gate (Z)', 
                            color: 'pink', 
                            desc: 'Phase flip gate, leaves |0⟩ unchanged but flips the sign of |1⟩',
                            matrix: 'Z = [ 1   0 ]\n    [ 0  -1 ]'
                          },
                          { 
                            name: 'CNOT Gate', 
                            color: 'green', 
                            desc: 'Two-qubit gate that flips target qubit if control qubit is |1⟩, creates entanglement',
                            matrix: 'CNOT = [ 1  0  0  0 ]\n       [ 0  1  0  0 ]\n       [ 0  0  0  1 ]\n       [ 0  0  1  0 ]'
                          },
                          { 
                            name: 'T Gate (π/8)', 
                            color: 'orange', 
                            desc: 'Applies a π/4 phase rotation, essential for universal quantum computation',
                            matrix: 'T = [ 1      0     ]\n    [ 0   e^(iπ/4) ]'
                          }
                        ].map((gate, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all"
                          >
                            <h4 className={`text-${gate.color}-400 font-semibold mb-2`}>{gate.name}</h4>
                            <p className="text-sm mb-3">{gate.desc}</p>
                            <div className="bg-slate-900/50 p-3 rounded font-mono text-xs whitespace-pre">
                              {gate.matrix}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Quantum Circuits */}
              <section id="circuits" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Code className="w-8 h-8 text-green-400" />
                    Building Quantum Circuits
                  </h2>
                  
                  <div className="space-y-6 text-slate-300">
                    <p className="leading-relaxed">
                      Quantum circuits are sequences of quantum gates applied to qubits. They form the fundamental computational model for quantum algorithms. Understanding how to design and optimize circuits is essential for quantum programming.
                    </p>

                    <QuantumCircuitDiagram />

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {[
                        { title: 'Circuit Depth', desc: 'Number of sequential gate layers. Lower depth reduces decoherence errors.' },
                        { title: 'Gate Count', desc: 'Total number of gates. Minimizing gates improves fidelity.' },
                        { title: 'Connectivity', desc: 'Some hardware requires specific qubit connections for two-qubit gates.' },
                        { title: 'Measurement', desc: 'Collapses quantum states to classical bits for readout.' }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-slate-800/30 p-4 rounded-lg border border-slate-700"
                        >
                          <h4 className="text-green-400 font-semibold mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Quantum Algorithms */}
              <section id="algorithms" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-emerald-400" />
                    Quantum Algorithms
                  </h2>
                  
                  <div className="space-y-6 text-slate-300">
                    <p className="leading-relaxed">
                      Quantum algorithms leverage superposition, entanglement, and interference to solve certain problems exponentially faster than classical algorithms. Here are the most important quantum algorithms that are transforming computing.
                    </p>

                    <div className="space-y-4">
                      {[
                        {
                          title: "1. Shor's Algorithm (1994)",
                          desc: "Factors large numbers exponentially faster than classical algorithms, threatening RSA encryption.",
                          classical: "O(e^(n^1/3))",
                          quantum: "O(n³)",
                          apps: "Cryptanalysis, number theory",
                          gradient: "from-blue-600/20 to-cyan-600/20",
                          border: "border-blue-500/30"
                        },
                        {
                          title: "2. Grover's Algorithm (1996)",
                          desc: "Searches unsorted databases quadratically faster than classical search.",
                          classical: "O(N)",
                          quantum: "O(√N)",
                          apps: "Database search, optimization, pattern matching",
                          gradient: "from-purple-600/20 to-pink-600/20",
                          border: "border-purple-500/30"
                        },
                        {
                          title: "3. Quantum Phase Estimation (QPE)",
                          desc: "Estimates eigenvalues of unitary operators, foundational for many quantum algorithms.",
                          apps: "Quantum chemistry, machine learning, Shor's algorithm",
                          gradient: "from-green-600/20 to-emerald-600/20",
                          border: "border-green-500/30"
                        },
                        {
                          title: "4. Variational Quantum Eigensolver (VQE)",
                          desc: "Hybrid quantum-classical algorithm for finding ground state energies of molecules.",
                          apps: "Drug discovery, material science, quantum chemistry",
                          gradient: "from-orange-600/20 to-red-600/20",
                          border: "border-orange-500/30"
                        },
                        {
                          title: "5. Quantum Approximate Optimization (QAOA)",
                          desc: "Solves combinatorial optimization problems on near-term quantum devices.",
                          apps: "Supply chain, financial portfolio optimization, traffic flow",
                          gradient: "from-indigo-600/20 to-blue-600/20",
                          border: "border-indigo-500/30"
                        }
                      ].map((algo, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`bg-gradient-to-r ${algo.gradient} border ${algo.border} rounded-lg p-6`}
                        >
                          <h4 className="text-xl font-semibold text-white mb-3">{algo.title}</h4>
                          <p className="mb-3">{algo.desc}</p>
                          {algo.classical && algo.quantum && (
                            <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                              <div className="bg-slate-900/30 p-2 rounded">
                                <strong className="text-blue-400">Classical:</strong> {algo.classical}
                              </div>
                              <div className="bg-slate-900/30 p-2 rounded">
                                <strong className="text-purple-400">Quantum:</strong> {algo.quantum}
                              </div>
                            </div>
                          )}
                          <div className="bg-slate-900/50 p-3 rounded-lg">
                            <strong className="text-white">Applications:</strong> {algo.apps}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <CodeExample
                      title="Grover's Search Algorithm"
                      code={codeExamples.grovers}
                      language="python"
                    />

                    <CodeExample
                      title="Variational Quantum Eigensolver (VQE)"
                      code={codeExamples.vqe}
                      language="python"
                    />
                  </div>
                </motion.div>
              </section>

              {/* Timeline */}
              <section id="timeline" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Star className="w-8 h-8 text-yellow-400" />
                    Quantum Computing Timeline
                  </h2>
                  <p className="text-slate-300 mb-8 leading-relaxed">
                    From theoretical foundations to practical quantum supremacy, explore the key milestones in the evolution of quantum computing.
                  </p>
                  <AlgorithmTimeline />
                </motion.div>
              </section>

              {/* Best Practices */}
              <section id="bestpractices" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Lightbulb className="w-8 h-8 text-amber-400" />
                    Best Practices for Quantum Development
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        title: 'Minimize Circuit Depth',
                        desc: 'Reduce the number of sequential gate layers to minimize decoherence. Use gate optimization techniques and circuit transpilation.',
                        tips: ['Use native gates when possible', 'Combine adjacent gates', 'Apply circuit optimization passes']
                      },
                      {
                        title: 'Error Mitigation Strategies',
                        desc: 'Current quantum computers are noisy. Implement error mitigation techniques to improve result accuracy.',
                        tips: ['Zero-noise extrapolation', 'Readout error mitigation', 'Probabilistic error cancellation']
                      },
                      {
                        title: 'Choose the Right Algorithm',
                        desc: 'Not all problems benefit from quantum computing. Analyze your problem to determine if quantum advantage is achievable.',
                        tips: ['Identify quantum-friendly problems', 'Consider hybrid approaches', 'Benchmark against classical methods']
                      },
                      {
                        title: 'Hardware-Aware Compilation',
                        desc: 'Different quantum hardware has different connectivity and gate sets. Compile circuits specific to your target device.',
                        tips: ['Respect qubit topology', 'Use hardware-native gates', 'Minimize SWAP gates']
                      },
                      {
                        title: 'Validate with Simulation',
                        desc: 'Always test your circuits with classical simulators before running on real quantum hardware.',
                        tips: ['Use state vector simulators', 'Test with noise models', 'Verify expected outcomes']
                      }
                    ].map((practice, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/30 rounded-lg p-6"
                      >
                        <h3 className="text-xl font-semibold text-white mb-2">{practice.title}</h3>
                        <p className="text-slate-300 mb-4">{practice.desc}</p>
                        <div className="space-y-2">
                          {practice.tips.map((tip, tipIndex) => (
                            <div key={tipIndex} className="flex items-start gap-2 text-sm text-slate-400">
                              <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* FAQ */}
              <section id="faq" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-blue-400" />
                    Frequently Asked Questions
                  </h2>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => {
                      const [isOpen, setIsOpen] = useState(false);
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-slate-800/30 rounded-lg border border-slate-700 overflow-hidden"
                        >
                          <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-800/50 transition-colors"
                            data-testid={`button-faq-${index}`}
                          >
                            <h3 className="text-white font-semibold pr-4">{faq.q}</h3>
                            <ChevronRight className={`w-5 h-5 text-blue-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="px-6 pb-4"
                              >
                                <p className="text-slate-300 leading-relaxed">{faq.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </section>

              {/* Resources */}
              <section id="resources" className="mb-16 scroll-mt-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-purple-400" />
                    Additional Resources
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        category: 'Learning Platforms',
                        resources: [
                          { name: 'IBM Quantum Learning', desc: 'Free courses and tutorials' },
                          { name: 'Qiskit Textbook', desc: 'Comprehensive quantum computing guide' },
                          { name: 'Microsoft Quantum Katas', desc: 'Interactive programming exercises' }
                        ],
                        color: 'blue'
                      },
                      {
                        category: 'Quantum Frameworks',
                        resources: [
                          { name: 'Qiskit (IBM)', desc: 'Open-source quantum SDK' },
                          { name: 'Cirq (Google)', desc: 'Python library for NISQ algorithms' },
                          { name: 'PennyLane', desc: 'Quantum machine learning library' }
                        ],
                        color: 'purple'
                      },
                      {
                        category: 'Research Papers',
                        resources: [
                          { name: 'arXiv Quantum Physics', desc: 'Latest research preprints' },
                          { name: 'Nature Quantum Information', desc: 'Peer-reviewed journal' },
                          { name: 'Quantum Journal', desc: 'Open-access quantum research' }
                        ],
                        color: 'green'
                      },
                      {
                        category: 'Cloud Platforms',
                        resources: [
                          { name: 'IBM Quantum Experience', desc: 'Access real quantum computers' },
                          { name: 'Amazon Braket', desc: 'Quantum computing service' },
                          { name: 'Azure Quantum', desc: 'Microsoft quantum cloud' }
                        ],
                        color: 'orange'
                      }
                    ].map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`bg-gradient-to-br from-${section.color}-900/20 to-${section.color}-800/10 rounded-lg p-6 border border-${section.color}-700/30`}
                      >
                        <h3 className={`text-xl font-semibold text-${section.color}-400 mb-4`}>{section.category}</h3>
                        <ul className="space-y-3">
                          {section.resources.map((resource, rIndex) => (
                            <li key={rIndex} className="flex items-start gap-2">
                              <ChevronRight className={`w-4 h-4 text-${section.color}-400 mt-1 flex-shrink-0`} />
                              <div>
                                <div className="text-white font-medium">{resource.name}</div>
                                <div className="text-sm text-slate-400">{resource.desc}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* Call to Action */}
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-8 text-center"
              >
                <h3 className="text-2xl font-bold text-white mb-3">Ready to Start Your Quantum Journey?</h3>
                <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                  Explore our platform to experiment with quantum circuits, run simulations, and build quantum applications. Join the quantum revolution and shape the future of computing.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    className="bg-blue-600 hover:bg-blue-700" 
                    data-testid="button-get-started"
                  >
                    Get Started
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/')} 
                    variant="outline" 
                    className="border-slate-600 text-white hover:bg-slate-800" 
                    data-testid="button-back-home"
                  >
                    Back to Home
                  </Button>
                </div>
              </motion.section>
            </div>
          </main>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 transition-colors"
            data-testid="button-scroll-top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
