import React from 'react';

interface QuestionCountSelectorProps {
  numQuestions: number;
  onNumQuestionsChange: (count: number) => void;
  timeLimit: number;
  onTimeLimitChange: (limit: number) => void;
}

export const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({
  numQuestions,
  onNumQuestionsChange,
  timeLimit,
  onTimeLimitChange,
}) => {
  return (
    <>
      <div>
        <label htmlFor="numQuestions" className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-1">
          Number of Questions
        </label>
        <input
          id="numQuestions"
          type="number"
          value={numQuestions}
          onChange={(e) => onNumQuestionsChange(parseInt(e.target.value, 10) || 5)}
          min="5"
          max="50"
          step="5"
          className="w-full px-4 py-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary focus:border-transparent transition-all duration-300 text-text dark:text-text-DEFAULT"
        />
      </div>
      <div>
        <label htmlFor="timeLimit" className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-1">
          Time Limit (Mins)
        </label>
        <select
          id="timeLimit"
          value={timeLimit}
          onChange={(e) => onTimeLimitChange(parseInt(e.target.value, 10))}
          className="w-full px-4 py-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary focus:border-transparent transition-all duration-300 text-text dark:text-text-DEFAULT"
        >
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={30}>30</option>
        </select>
      </div>
    </>
  );
};

export default QuestionCountSelector;
