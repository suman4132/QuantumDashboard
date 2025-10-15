import { motion } from 'framer-motion';

export default function QuantumCircuitDiagram() {
  return (
    <div className="bg-slate-900/50 rounded-lg p-8 border border-slate-700 overflow-x-auto">
      <svg width="100%" height="200" viewBox="0 0 800 200" className="min-w-[600px]">
        {/* Qubit lines */}
        <motion.line
          x1="50" y1="50" x2="750" y2="50"
          stroke="#64748b"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.line
          x1="50" y1="100" x2="750" y2="100"
          stroke="#64748b"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        <motion.line
          x1="50" y1="150" x2="750" y2="150"
          stroke="#64748b"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />

        {/* Qubit labels */}
        <text x="20" y="55" fill="#94a3b8" fontSize="14">|q₀⟩</text>
        <text x="20" y="105" fill="#94a3b8" fontSize="14">|q₁⟩</text>
        <text x="20" y="155" fill="#94a3b8" fontSize="14">|q₂⟩</text>

        {/* Hadamard Gate on q0 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <rect x="130" y="30" width="40" height="40" fill="#3b82f6" stroke="#60a5fa" strokeWidth="2" rx="4"/>
          <text x="150" y="55" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle">H</text>
        </motion.g>

        {/* X Gate on q1 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <rect x="230" y="80" width="40" height="40" fill="#a855f7" stroke="#c084fc" strokeWidth="2" rx="4"/>
          <text x="250" y="105" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle">X</text>
        </motion.g>

        {/* CNOT Gate */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <circle cx="350" cy="50" r="8" fill="#10b981" stroke="#34d399" strokeWidth="2"/>
          <line x1="350" y1="58" x2="350" y2="142" stroke="#10b981" strokeWidth="2"/>
          <circle cx="350" cy="150" r="15" fill="transparent" stroke="#10b981" strokeWidth="2"/>
          <line x1="335" y1="150" x2="365" y2="150" stroke="#10b981" strokeWidth="2"/>
          <line x1="350" y1="135" x2="350" y2="165" stroke="#10b981" strokeWidth="2"/>
        </motion.g>

        {/* Z Gate on q1 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <rect x="450" y="80" width="40" height="40" fill="#ec4899" stroke="#f472b6" strokeWidth="2" rx="4"/>
          <text x="470" y="105" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle">Z</text>
        </motion.g>

        {/* T Gate on q2 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <rect x="550" y="130" width="40" height="40" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" rx="4"/>
          <text x="570" y="155" fill="white" fontSize="18" fontWeight="bold" textAnchor="middle">T</text>
        </motion.g>

        {/* Measurement on q0 */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <rect x="650" y="30" width="50" height="40" fill="#0891b2" stroke="#06b6d4" strokeWidth="2" rx="4"/>
          <path d="M 660 60 Q 675 45, 690 60" stroke="white" strokeWidth="2" fill="transparent"/>
          <line x1="675" y1="45" x2="675" y2="60" stroke="white" strokeWidth="2"/>
        </motion.g>

        {/* Animated quantum flow */}
        <motion.circle
          r="6"
          fill="#60a5fa"
          initial={{ cx: 50, cy: 50 }}
          animate={{ cx: 750, cy: 50 }}
          transition={{ duration: 2, delay: 2, repeat: Infinity, repeatDelay: 1 }}
        />
      </svg>
      <p className="text-sm text-slate-400 mt-4 text-center">
        Quantum Circuit Example: H → X → CNOT → Z → T → Measurement
      </p>
    </div>
  );
}
