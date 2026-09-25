import React from 'react';
import { AppState } from '@/features/auth/types';
import { AutoQuizzerLogo } from '@/components/ui/Icons';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigate: (state: AppState) => void;
}

export const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout, onNavigate }) => {
  return (
    <header className="bg-surface dark:bg-surface/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border dark:border-border/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div
          className="flex items-center space-x-3 cursor-pointer group transition-transform duration-300 hover:scale-105"
          onClick={() => isLoggedIn && onNavigate(AppState.DASHBOARD)}
        >
          <AutoQuizzerLogo className="h-8 w-auto text-primary dark:text-primary group-hover:text-primary-hover transition-colors duration-300" />
          <h1 className="text-xl font-bold text-text dark:text-text-DEFAULT transition-colors duration-300">
            AutoQuizzer
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Component */}
          <ThemeToggle />

          {isLoggedIn && (
            <>
              <button
                onClick={() => onNavigate(AppState.DASHBOARD)}
                className="px-4 py-2 text-sm font-medium text-text-light-muted dark:text-text-muted hover:bg-surface-hover dark:hover:bg-surface-light rounded-md transition-all duration-300"
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate(AppState.CREATING)}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary-light dark:bg-primary hover:bg-primary-light-hover dark:hover:bg-primary-hover rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Create Quiz
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-text-light-muted dark:text-text-muted hover:bg-surface-hover dark:hover:bg-surface-light rounded-md transition-all duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
