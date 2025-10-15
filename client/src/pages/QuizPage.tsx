import { useNavigate } from 'react-router-dom';
import Quiz from '@/components/quiz/Quiz';

export default function QuizPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/docs');
  };

  return <Quiz onBack={handleBack} />;
}
