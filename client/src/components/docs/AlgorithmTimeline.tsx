import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';

const milestones = [
  { year: '1985', title: 'Deutsch Algorithm', desc: 'First quantum algorithm', color: 'from-blue-500 to-cyan-500' },
  { year: '1994', title: "Shor's Algorithm", desc: 'Integer factorization', color: 'from-purple-500 to-pink-500' },
  { year: '1996', title: "Grover's Algorithm", desc: 'Database search', color: 'from-green-500 to-emerald-500' },
  { year: '2001', title: 'First Implementation', desc: "Shor's on 7-qubit system", color: 'from-orange-500 to-red-500' },
  { year: '2014', title: 'VQE & QAOA', desc: 'Near-term algorithms', color: 'from-indigo-500 to-purple-500' },
  { year: '2019', title: 'Quantum Supremacy', desc: 'Google Sycamore', color: 'from-yellow-500 to-orange-500' },
];

export default function AlgorithmTimeline() {
  return (
    <div className="relative py-8">
      {/* Timeline line */}
      <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600" />
      
      <div className="space-y-8">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.year}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
          >
            {/* Timeline dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              className={`absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${milestone.color} z-10`}
            />
            
            {/* Content card */}
            <div className={`ml-20 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
              <div className={`bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors`}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className={`text-lg font-bold bg-gradient-to-r ${milestone.color} bg-clip-text text-transparent`}>
                    {milestone.year}
                  </span>
                </div>
                <h4 className="text-white font-semibold mb-1">{milestone.title}</h4>
                <p className="text-sm text-slate-400">{milestone.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg px-6 py-3">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">The Future of Quantum Computing Awaits</span>
        </div>
      </motion.div>
    </div>
  );
}
