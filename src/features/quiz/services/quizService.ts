import { Quiz } from '../types';
import { apiClient } from '@/services/apiClient';

export const getQuizzes = async (userEmail: string): Promise<Quiz[]> => {
  try {
    const data = await apiClient.get<{ quizzes: Quiz[] }>(
      `/quiz/user/${encodeURIComponent(userEmail)}`
    );
    return data.quizzes || [];
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};

export const saveQuiz = async (userEmail: string, quiz: Quiz): Promise<boolean> => {
  try {
    await apiClient.post('/quiz', { email: userEmail, quiz });
    return true;
  } catch (error) {
    console.error('Error saving quiz:', error);
    return false;
  }
};

export const updateQuizScore = async (
  userEmail: string,
  quizId: string,
  score: number
): Promise<boolean> => {
  try {
    await apiClient.patch(`/quiz/${quizId}/score`, { email: userEmail, score });
    return true;
  } catch (error) {
    console.error('Error updating quiz score:', error);
    return false;
  }
};

export const deleteQuiz = async (userEmail: string, quizId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/quiz/${quizId}`, { email: userEmail });
    return true;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return false;
  }
};
