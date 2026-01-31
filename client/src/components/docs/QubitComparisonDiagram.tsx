import { motion } from 'framer-motion';

export default function QubitComparisonDiagram() {
  return (
    <div className="grid md:grid-cols-2 gap-6 my-8">
      {/* Classical Bit */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-lg p-6 border border-blue-700"
      >
        <h4 className="text-xl font-semibold text-blue-400 mb-4">Classical Bit</h4>
        <div className="flex justify-center gap-8 mb-6">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-2">
              0
            </div>
            <p className="text-sm text-slate-300">State: OFF</p>
          </motion.div>
          <div className="flex items-center text-slate-400">OR</div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold text-white mb-2">
              1
            </div>
            <p className="text-sm text-slate-300">State: ON</p>
          </motion.div>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>✓ Definite state (0 or 1)</li>
          <li>✓ Sequential processing</li>
          <li>✓ Deterministic outcomes</li>
          <li>✗ Limited parallelism</li>
        </ul>
      </motion.div>

      {/* Quantum Bit */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-purple-900/50 to-pink-800/30 rounded-lg p-6 border border-purple-700"
      >
        <h4 className="text-xl font-semibold text-purple-400 mb-4">Quantum Bit (Qubit)</h4>
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="text-center"
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white mb-2 relative">
              <span className="absolute">0</span>
              <span className="absolute opacity-70">+</span>
              <span className="absolute">1</span>
            </div>
            <p className="text-sm text-slate-300 mt-2">Superposition State</p>
          </motion.div>
        </div>
        <ul className="space-y-2 text-sm text-slate-300">
          <li>✓ Multiple states simultaneously</li>
          <li>✓ Parallel processing (2ⁿ states)</li>
          <li>✓ Quantum interference</li>
          <li>✓ Exponential power scaling</li>
        </ul>
      </motion.div>
    </div>
  );
}
