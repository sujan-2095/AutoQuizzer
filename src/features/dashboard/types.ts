import { Quiz } from '../quiz/types';

export interface DashboardProps {
  quizzes: Quiz[];
  onCreateQuiz: () => void;
  onTakeQuiz: (quizId: string) => void;
  onDeleteQuiz: (quizId: string) => void;
  onDownloadPdf: (quiz: Quiz) => void;
}
