import React from 'react';
import { Difficulty } from '../types';

interface DifficultySelectorProps {
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  difficulty,
  onDifficultyChange,
}) => {
  return (
    <div className="animate-fade-in">
      <label htmlFor="difficulty" className="block text-sm font-medium text-text-light-muted dark:text-text-muted mb-1">
        Difficulty
      </label>
      <select
        id="difficulty"
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
        className="w-full px-4 py-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary focus:border-transparent transition-all duration-300 text-text dark:text-text-DEFAULT"
      >
        {Object.values(Difficulty).map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DifficultySelector;
