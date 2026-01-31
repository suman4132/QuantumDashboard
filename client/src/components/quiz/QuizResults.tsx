import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, RotateCcw, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRetake: () => void;
  onBackToDocs: () => void;
}

export default function QuizResults({
  score,
  totalQuestions,
  onRetake,
  onBackToDocs
}: QuizResultsProps) {
  const percentage = (score / totalQuestions) * 100;
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', message: 'Outstanding!', color: 'green' };
    if (percentage >= 80) return { grade: 'A', message: 'Excellent!', color: 'blue' };
    if (percentage >= 70) return { grade: 'B', message: 'Good Job!', color: 'purple' };
    if (percentage >= 60) return { grade: 'C', message: 'Keep Learning!', color: 'yellow' };
    return { grade: 'D', message: 'Review the Material', color: 'red' };
  };

  const { grade, message, color } = getGrade();

  const achievements = [];
  if (percentage === 100) achievements.push({ icon: Trophy, text: 'Perfect Score!', color: 'yellow' });
  if (percentage >= 90) achievements.push({ icon: Star, text: 'Quantum Expert', color: 'blue' });
  if (score >= totalQuestions * 0.7) achievements.push({ icon: TrendingUp, text: 'Quick Learner', color: 'green' });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-8 border border-slate-800 text-center"
    >
      {/* Trophy Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="mb-6"
      >
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-${color}-600/20 to-${color}-800/20 border-2 border-${color}-500/50`}>
          <Trophy className={`w-12 h-12 text-${color}-400`} />
        </div>
      </motion.div>

      {/* Grade */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-4"
      >
        <h2 className="text-5xl font-bold text-white mb-2">{grade}</h2>
        <p className={`text-xl text-${color}-400 font-semibold`}>{message}</p>
      </motion.div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-6"
      >
        <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          {percentage.toFixed(0)}%
        </div>
        <p className="text-slate-400">
          {score} out of {totalQuestions} questions correct
        </p>
      </motion.div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Achievements Unlocked</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring' }}
                  className={`flex items-center gap-2 bg-${achievement.color}-600/10 border border-${achievement.color}-600/30 rounded-full px-4 py-2`}
                >
                  <Icon className={`w-4 h-4 text-${achievement.color}-400`} />
                  <span className={`text-sm font-medium text-${achievement.color}-400`}>
                    {achievement.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mb-8"
      >
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r from-${color}-600 to-${color}-400`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.9 }}
          />
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Button
          onClick={onRetake}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
          data-testid="button-retake-quiz"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </Button>
        <Button
          onClick={onBackToDocs}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-800 gap-2"
          data-testid="button-back-to-docs"
        >
          <BookOpen className="w-4 h-4" />
          Back to Docs
        </Button>
      </motion.div>

      {/* Feedback */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 text-sm text-slate-400"
      >
        {percentage >= 80
          ? "You've mastered this topic! Ready to tackle more advanced concepts."
          : percentage >= 60
            ? "Good progress! Review the material to strengthen your understanding."
            : "Keep studying! Quantum computing takes time to master."}
      </motion.p>
    </motion.div>
  );
}
