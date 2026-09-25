import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from './Icons';

export { SunIcon, MoonIcon };

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-surface-light dark:bg-surface-light hover:bg-border dark:hover:bg-border transition-all duration-300 group"
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-text-muted dark:text-text-muted group-hover:text-yellow-400 group-hover:rotate-90 transition-all duration-300" />
      ) : (
        <MoonIcon className="h-5 w-5 text-text-light-muted group-hover:text-primary-light group-hover:-rotate-12 transition-all duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
