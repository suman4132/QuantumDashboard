import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import QuizQuestion, { Question } from './QuizQuestion';
import QuizProgress from './QuizProgress';
import QuizResults from './QuizResults';
import { Button } from '@/components/ui/button';
import { quantumQuizzes, quizCategories, QuizCategory } from '@/data/quizData';

interface QuizProps {
  onBack: () => void;
}

export default function Quiz({ onBack }: QuizProps) {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestions = selectedCategory ? quantumQuizzes[selectedCategory] : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleStartQuiz = (category: QuizCategory) => {
    setSelectedCategory(category);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setStreak(0);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (answer: string | number) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setStreak(0);
    setQuizCompleted(false);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setStreak(0);
    setQuizCompleted(false);
  };

  // Category Selection View
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-12">
        <div className="container mx-auto px-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-slate-300 hover:text-white mb-8"
            data-testid="button-back-to-docs"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Quantum Computing Quiz
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Test your knowledge and track your progress. Choose a topic to begin your quantum learning journey!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quizCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-sm rounded-lg p-6 border border-slate-800 hover:border-blue-500/50 transition-all group cursor-pointer"
                onClick={() => handleStartQuiz(category.id)}
                data-testid={`quiz-category-${category.id}`}
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {category.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    category.difficulty === 'Beginner' ? 'bg-green-600/20 text-green-400' :
                    category.difficulty === 'Intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {category.difficulty}
                  </span>
                  <span className="text-sm text-slate-500">
                    {quantumQuizzes[category.id].length} questions
                  </span>
                </div>
                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartQuiz(category.id);
                  }}
                  data-testid={`button-start-${category.id}`}
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Completed View
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-12">
        <div className="container mx-auto px-6 max-w-3xl">
          <Button
            onClick={handleBackToCategories}
            variant="ghost"
            className="text-slate-300 hover:text-white mb-8"
            data-testid="button-back-to-categories"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>

          <QuizResults
            score={correctAnswers}
            totalQuestions={currentQuestions.length}
            onRetake={handleRetake}
            onBackToDocs={onBack}
          />
        </div>
      </div>
    );
  }

  // Quiz In Progress View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <Button
          onClick={handleBackToCategories}
          variant="ghost"
          className="text-slate-300 hover:text-white mb-8"
          data-testid="button-back-to-categories"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>

        <QuizProgress
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={currentQuestions.length}
          correctAnswers={correctAnswers}
          streak={streak}
        />

        <AnimatePresence mode="wait">
          <QuizQuestion
            key={currentQuestion.id}
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            showResult={showResult}
            onNext={handleNextQuestion}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
