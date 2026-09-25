import { quizService } from '../services/quizService.js';

export const quizController = {
  async getQuizzes(req, res, next) {
    try {
      const { email } = req.params;
      const quizzes = await quizService.getQuizzesByUserEmail(email);
      res.json({ quizzes });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error('Get quizzes error:', error);
      res.status(500).json({ error: 'Failed to get quizzes' });
    }
  },

  async createQuiz(req, res, next) {
    try {
      const { email, quiz } = req.body;
      const createdQuiz = await quizService.createQuiz(email, quiz);
      res.status(201).json({ message: 'Quiz created successfully', quiz: createdQuiz });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error('Create quiz error:', error);
      res.status(500).json({ error: 'Failed to create quiz' });
    }
  },

  async updateScore(req, res, next) {
    try {
      const { quizId } = req.params;
      const { email, score } = req.body;
      await quizService.updateQuizScore(email, quizId, score);
      res.json({ message: 'Score updated successfully' });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error('Update score error:', error);
      res.status(500).json({ error: 'Failed to update score' });
    }
  },

  async deleteQuiz(req, res, next) {
    try {
      const { quizId } = req.params;
      const { email } = req.body;
      await quizService.deleteQuiz(email, quizId);
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error('Delete quiz error:', error);
      res.status(500).json({ error: 'Failed to delete quiz' });
    }
  },
};

export default quizController;
