import React from 'react';
import { ClockIcon } from '@/components/ui/Icons';

interface QuizTimerProps {
  timeLeft: number | null;
  formattedTime: string;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({ timeLeft, formattedTime }) => {
  if (timeLeft === null) return null;

  return (
    <div className="flex items-center space-x-1.5 text-text-light-muted dark:text-text-muted font-semibold bg-background dark:bg-background px-3 py-1.5 rounded-full border border-border dark:border-border text-sm">
      <ClockIcon className="h-4 w-4" />
      <span>{formattedTime}</span>
    </div>
  );
};

export default QuizTimer;
