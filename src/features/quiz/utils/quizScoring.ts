import { Question, UserAnswer } from '../types';

export const calculateCorrectCount = (questions: Question[], answers: UserAnswer[]): number => {
  return questions.reduce((count, question, index) => {
    return count + (question.correctAnswerIndex === answers[index]?.selectedOption ? 1 : 0);
  }, 0);
};

export const calculateScorePercentage = (correctCount: number, totalQuestions: number): number => {
  if (totalQuestions === 0) return 0;
  return (correctCount / totalQuestions) * 100;
};

export const calculateQuizScore = (questions: Question[], answers: UserAnswer[]): number => {
  const correct = calculateCorrectCount(questions, answers);
  return calculateScorePercentage(correct, questions.length);
};

export const getScoreColorClass = (score: number): string => {
  if (score >= 80) return 'text-green-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
};
