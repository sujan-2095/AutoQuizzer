import { userRepository } from '../repositories/userRepository.js';
import { quizRepository } from '../repositories/quizRepository.js';

export const quizService = {
  async getQuizzesByUserEmail(email) {
    if (!email) {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(trimmedEmail);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return quizRepository.findQuizzesByUserId(user.id);
  },

  async createQuiz(email, quiz) {
    if (!email || !quiz) {
      const error = new Error('Email and quiz data are required');
      error.status = 400;
      throw error;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(trimmedEmail);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return quizRepository.createQuiz(user.id, quiz);
  },

  async updateQuizScore(email, quizId, score) {
    if (!email || score === undefined) {
      const error = new Error('Email and score are required');
      error.status = 400;
      throw error;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(trimmedEmail);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    const exists = quizRepository.findQuizByIdAndUserId(quizId, user.id);
    if (!exists) {
      const error = new Error('Quiz not found');
      error.status = 404;
      throw error;
    }

    quizRepository.updateScore(quizId, score);
    return { success: true };
  },

  async deleteQuiz(email, quizId) {
    if (!email) {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(trimmedEmail);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    quizRepository.deleteQuiz(quizId, user.id);
    return { success: true };
  },
};

export default quizService;
