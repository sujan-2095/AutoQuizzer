import { QuizDraft } from '../types';

const DRAFT_KEY = 'autoquizzer_quiz_draft';

export const saveQuizDraft = (draft: QuizDraft): void => {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save quiz draft to localStorage:', error);
  }
};

export const getQuizDraft = (): QuizDraft | null => {
  try {
    const draftJson = localStorage.getItem(DRAFT_KEY);
    return draftJson ? JSON.parse(draftJson) : null;
  } catch (error) {
    console.error('Failed to retrieve quiz draft from localStorage:', error);
    return null;
  }
};

export const clearQuizDraft = (): void => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear quiz draft from localStorage:', error);
  }
};
