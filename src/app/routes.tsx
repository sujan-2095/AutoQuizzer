import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserAnswer } from '@/features/auth/types';
import { Quiz, QuizDraft } from '@/features/quiz/types';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizzes, saveQuiz, deleteQuiz, updateQuizScore } from '@/features/quiz/services/quizService';
import { saveQuizDraft, clearQuizDraft } from '@/features/quiz/utils/quizDraftStorage';
import { downloadQuizAsPdf } from '@/services/pdfService';
import { calculateQuizScore } from '@/features/quiz/utils/quizScoring';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WaveBackground from '@/components/layout/WaveBackground';
import Modal from '@/components/ui/Modal';
import { DownloadIcon, PlayIcon } from '@/components/ui/Icons';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import QuizCreator from '@/features/quiz/pages/QuizCreator';
import QuizTaker from '@/features/quiz/pages/QuizTaker';
import QuizResults from '@/features/quiz/pages/QuizResults';

export const AppRoutes: React.FC = () => {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [appState, setAppState] = useState<AppState>(() =>
    isAuthenticated ? AppState.DASHBOARD : AppState.LOGIN
  );
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizResults, setQuizResults] = useState<{ answers: UserAnswer[]; score: number } | null>(null);
  const [newQuizCreated, setNewQuizCreated] = useState<Quiz | null>(null);

  // Unsaved changes confirmation state
  const [isDirty, setIsDirty] = useState(false);
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);
  const [nextState, setNextState] = useState<AppState | null>(null);
  const creatorRef = useRef<{ getDraftData: () => QuizDraft }>(null);

  // Sync state when user logs in or out
  useEffect(() => {
    if (user) {
      getQuizzes(user.email).then((loadedQuizzes) => {
        setQuizzes(loadedQuizzes);
        setAppState((prev) => (prev === AppState.LOGIN || prev === AppState.REGISTER ? AppState.DASHBOARD : prev));
      });
    } else {
      setQuizzes([]);
      setActiveQuiz(null);
      setQuizResults(null);
      setNewQuizCreated(null);
      setAppState(AppState.LOGIN);
    }
  }, [user]);

  const handleLogin = async (email: string): Promise<boolean> => {
    const success = await login(email);
    if (success) {
      const userQuizzes = await getQuizzes(email);
      setQuizzes(userQuizzes);
      setAppState(AppState.DASHBOARD);
      return true;
    }
    return false;
  };

  const handleRegister = async (email: string): Promise<boolean> => {
    const success = await register(email);
    if (success) {
      setQuizzes([]);
      setAppState(AppState.DASHBOARD);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    logout();
  };

  const handleQuizCreated = async (quiz: Quiz) => {
    if (user) {
      const success = await saveQuiz(user.email, quiz);
      if (success) {
        const updatedQuizzes = await getQuizzes(user.email);
        setQuizzes(updatedQuizzes);
        setNewQuizCreated(quiz);
      }
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (user) {
      const success = await deleteQuiz(user.email, quizId);
      if (success) {
        const updatedQuizzes = await getQuizzes(user.email);
        setQuizzes(updatedQuizzes);
      }
    }
  };

  const handleTakeQuiz = (quizId: string) => {
    const quizToTake = quizzes.find((q) => q.id === quizId);
    if (quizToTake) {
      setActiveQuiz(quizToTake);
      setQuizResults(null);
      setNewQuizCreated(null);
      setAppState(AppState.TAKING_QUIZ);
    }
  };

  const handleQuizSubmit = async (answers: UserAnswer[]) => {
    if (activeQuiz && user) {
      const score = calculateQuizScore(activeQuiz.questions, answers);

      await updateQuizScore(user.email, activeQuiz.id, score);
      const updatedQuizzes = await getQuizzes(user.email);
      setQuizzes(updatedQuizzes);

      setQuizResults({ answers, score });
      setAppState(AppState.VIEWING_RESULTS);
    }
  };

  const handleRestart = () => {
    setActiveQuiz(null);
    setQuizResults(null);
    setAppState(AppState.DASHBOARD);
  };

  const closeModalAndNavigate = (state: AppState) => {
    setNewQuizCreated(null);
    navigate(state);
  };

  const navigate = (state: AppState) => {
    if (state === AppState.DASHBOARD || state === AppState.CREATING) {
      setActiveQuiz(null);
      setQuizResults(null);
    }
    if (appState === AppState.CREATING || appState === AppState.TAKING_QUIZ) {
      setIsDirty(false);
    }
    setAppState(state);
  };

  const handleRequestNavigation = (targetState: AppState) => {
    if (targetState === appState) return;

    if (isDirty && (appState === AppState.CREATING || appState === AppState.TAKING_QUIZ)) {
      setNextState(targetState);
      setShowNavigationConfirm(true);
    } else {
      navigate(targetState);
    }
  };

  const handleCloseNavigationModal = () => {
    setShowNavigationConfirm(false);
    setNextState(null);
  };

  const handleConfirmLeave = () => {
    if (nextState) {
      navigate(nextState);
    }
    handleCloseNavigationModal();
  };

  const handleConfirmDiscard = () => {
    if (appState === AppState.CREATING) {
      clearQuizDraft();
    }
    handleConfirmLeave();
  };

  const handleConfirmSave = () => {
    if (appState === AppState.CREATING && creatorRef.current) {
      const draftData = creatorRef.current.getDraftData();
      saveQuizDraft(draftData);
    }
    handleConfirmLeave();
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.LOGIN:
        return (
          <LoginPage
            onLogin={handleLogin}
            onNavigateToRegister={() => navigate(AppState.REGISTER)}
          />
        );
      case AppState.REGISTER:
        return (
          <RegisterPage
            onRegister={handleRegister}
            onNavigateToLogin={() => navigate(AppState.LOGIN)}
          />
        );
      case AppState.DASHBOARD:
        return (
          <Dashboard
            quizzes={quizzes}
            onCreateQuiz={() => navigate(AppState.CREATING)}
            onTakeQuiz={handleTakeQuiz}
            onDeleteQuiz={handleDeleteQuiz}
            onDownloadPdf={downloadQuizAsPdf}
          />
        );
      case AppState.CREATING:
        return (
          <QuizCreator
            ref={creatorRef}
            onQuizCreated={handleQuizCreated}
            onCancel={() => handleRequestNavigation(AppState.DASHBOARD)}
            setIsDirty={setIsDirty}
          />
        );
      case AppState.TAKING_QUIZ:
        return activeQuiz ? (
          <QuizTaker quiz={activeQuiz} onQuizSubmit={handleQuizSubmit} setIsDirty={setIsDirty} />
        ) : null;
      case AppState.VIEWING_RESULTS:
        return activeQuiz && quizResults ? (
          <QuizResults
            quiz={activeQuiz}
            userAnswers={quizResults.answers}
            score={quizResults.score}
            onRestart={handleRestart}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-background dark:bg-background min-h-screen flex flex-col font-sans transition-colors duration-300">
      {/* Animated Wave Background - Only on Dashboard */}
      {appState === AppState.DASHBOARD && <WaveBackground />}

      <Header
        isLoggedIn={isAuthenticated}
        onLogout={handleLogout}
        onNavigate={handleRequestNavigation}
      />

      <main
        className={`${
          appState === AppState.LOGIN || appState === AppState.REGISTER
            ? ''
            : 'container mx-auto px-4 py-8'
        } flex-grow relative z-10`}
      >
        {renderContent()}
      </main>

      <Footer />

      {/* Quiz Completion Modal */}
      <Modal
        isOpen={!!newQuizCreated}
        onClose={() => closeModalAndNavigate(AppState.DASHBOARD)}
        title="Quiz Generated Successfully!"
      >
        {newQuizCreated && (
          <div>
            <p className="text-text-muted mb-6">
              Your quiz "{newQuizCreated.title}" is ready. What would you like to do next?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleTakeQuiz(newQuizCreated.id)}
                className="w-full flex items-center justify-center bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-hover transition-all duration-300 shadow-lg hover:shadow-primary/40"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Take Quiz
              </button>
              <button
                onClick={() => {
                  downloadQuizAsPdf(newQuizCreated);
                  closeModalAndNavigate(AppState.DASHBOARD);
                }}
                className="w-full flex items-center justify-center bg-surface-light text-text-DEFAULT py-3 px-4 rounded-lg font-semibold hover:bg-border transition-colors"
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => closeModalAndNavigate(AppState.DASHBOARD)}
                className="w-full flex items-center justify-center text-sm text-text-muted py-2 px-4 rounded-lg hover:bg-surface-light transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Navigation Confirmation Modal */}
      <Modal
        isOpen={showNavigationConfirm}
        onClose={handleCloseNavigationModal}
        title={appState === AppState.CREATING ? 'Unsaved Changes' : 'Leave Quiz?'}
      >
        {appState === AppState.CREATING ? (
          <div>
            <p className="text-text-muted mb-6">
              You have unsaved changes. Would you like to save them as a draft before exiting?
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleConfirmSave}
                className="w-full text-center bg-primary text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors"
              >
                Save & Exit
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="w-full text-center bg-danger/20 text-danger py-2.5 px-4 rounded-lg font-semibold hover:bg-danger/30 transition-colors"
              >
                Discard & Exit
              </button>
              <button
                onClick={handleCloseNavigationModal}
                className="w-full text-center text-sm text-text-muted py-2 px-4 rounded-lg hover:bg-surface-light transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-text-muted mb-6">
              Are you sure you want to leave? Your current progress will be lost.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseNavigationModal}
                className="px-4 py-2 text-sm font-semibold text-text-muted hover:bg-surface-light rounded-lg transition-colors"
              >
                Stay
              </button>
              <button
                onClick={handleConfirmLeave}
                className="px-4 py-2 text-sm font-semibold text-white bg-danger hover:bg-danger-hover rounded-lg transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppRoutes;
