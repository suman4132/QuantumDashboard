import { motion } from 'framer-motion';
import { Trophy, Target, Zap } from 'lucide-react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
  streak: number;
}

export default function QuizProgress({
  currentQuestion,
  totalQuestions,
  correctAnswers,
  streak
}: QuizProgressProps) {
  const progress = ((currentQuestion - 1) / totalQuestions) * 100;
  const accuracy = currentQuestion > 1 ? (correctAnswers / (currentQuestion - 1)) * 100 : 0;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-800 mb-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-blue-400">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-600/10 border border-green-600/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400 font-medium">Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-white">{Math.round(accuracy)}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Correct</span>
          </div>
          <p className="text-2xl font-bold text-white">{correctAnswers}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-orange-600/10 border border-orange-600/30 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-400 font-medium">Streak</span>
          </div>
          <p className="text-2xl font-bold text-white">{streak}</p>
        </motion.div>
      </div>
    </div>
  );
}
