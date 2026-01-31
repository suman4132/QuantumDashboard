import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'code';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: string | number | null;
  onAnswerSelect: (answer: string | number) => void;
  showResult: boolean;
  onNext: () => void;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult,
  onNext
}: QuizQuestionProps) {
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-8 border border-slate-800"
    >
      {/* Difficulty Badge */}
      <div className="flex items-center justify-between mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          question.difficulty === 'beginner' ? 'bg-green-600/20 text-green-400' :
          question.difficulty === 'intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
          'bg-red-600/20 text-red-400'
        }`}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
        <span className="text-sm text-slate-400">{question.category}</span>
      </div>

      {/* Question */}
      <h3 className="text-xl font-semibold text-white mb-6 leading-relaxed">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.type === 'multiple-choice' && question.options?.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === question.correctAnswer;
          
          return (
            <motion.button
              key={index}
              onClick={() => !showResult && onAnswerSelect(index)}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                !showResult
                  ? isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                  : isCorrectOption
                    ? 'border-green-500 bg-green-500/10'
                    : isSelected
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-700 bg-slate-800/20'
              }`}
              data-testid={`option-${index}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white">{option}</span>
                {showResult && (
                  <span>
                    {isCorrectOption && <Check className="w-5 h-5 text-green-400" />}
                    {isSelected && !isCorrectOption && <X className="w-5 h-5 text-red-400" />}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}

        {question.type === 'true-false' && ['True', 'False'].map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectOption = option === question.correctAnswer;
          
          return (
            <motion.button
              key={index}
              onClick={() => !showResult && onAnswerSelect(option)}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.02 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                !showResult
                  ? isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
                  : isCorrectOption
                    ? 'border-green-500 bg-green-500/10'
                    : isSelected
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-slate-700 bg-slate-800/20'
              }`}
              data-testid={`option-${option.toLowerCase()}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{option}</span>
                {showResult && (
                  <span>
                    {isCorrectOption && <Check className="w-5 h-5 text-green-400" />}
                    {isSelected && !isCorrectOption && <X className="w-5 h-5 text-red-400" />}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation (shown after answer) */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mb-6 p-4 rounded-lg border ${
            isCorrect
              ? 'bg-green-600/10 border-green-500/30'
              : 'bg-red-600/10 border-red-500/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className={`w-5 h-5 mt-0.5 ${isCorrect ? 'text-green-400' : 'text-red-400'}`} />
            <div>
              <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">{question.explanation}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Button */}
      {showResult && (
        <Button
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700"
          data-testid="button-next-question"
        >
          Next Question
        </Button>
      )}
    </motion.div>
  );
}
