import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  selectedOption: number | null;
  onOptionSelect: (optionIndex: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  selectedOption,
  onOptionSelect,
}) => {
  return (
    <div className="bg-background dark:bg-background p-6 rounded-lg mb-6 animate-slide-up" key={questionIndex}>
      <p className="text-lg font-semibold mb-5 text-text dark:text-text-DEFAULT">{question.questionText}</p>
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <button
              key={index}
              onClick={() => onOptionSelect(index)}
              className={`w-full text-left p-4 border rounded-lg transition-all duration-200 flex items-center transform hover:scale-[1.02] hover:shadow-md
                ${
                  isSelected
                    ? 'bg-primary-light/20 dark:bg-primary/20 border-primary-light dark:border-primary ring-2 ring-primary-light dark:ring-primary shadow-lg'
                    : 'bg-surface dark:bg-surface border-border dark:border-border hover:bg-surface-light dark:hover:bg-surface-light hover:border-primary-light/50 dark:hover:border-primary/50'
                }`}
            >
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full mr-4 flex items-center justify-center border-2 font-bold
                ${
                  isSelected
                    ? 'bg-primary-light dark:bg-primary border-primary-light dark:border-primary text-white'
                    : 'border-border dark:border-border text-text-light-muted dark:text-text-muted'
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-grow font-medium text-text dark:text-text-DEFAULT">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
