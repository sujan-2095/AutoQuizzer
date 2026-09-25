import { geminiService } from '../services/geminiService.js';

export const geminiController = {
  async generateQuiz(req, res, next) {
    const { content, numQuestions, difficulty } = req.body;

    if (!content || !numQuestions) {
      return res.status(400).json({ error: 'Content and numQuestions are required' });
    }

    try {
      const quizData = await geminiService.generateQuiz({ content, numQuestions, difficulty });
      res.json({ quizData });
    } catch (error) {
      console.error('Gemini API error in controller:', error);

      const errorString = String(error);
      if (errorString.includes('API key not valid') || errorString.includes('API_KEY_INVALID')) {
        return res.status(401).json({ error: 'Invalid API key. Please check your Gemini API key in .env' });
      }
      if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
        return res.status(429).json({ error: 'Gemini API quota exceeded. Please wait a moment or try again later.' });
      }
      if (errorString.includes('SAFETY')) {
        return res.status(400).json({ error: 'Content violated safety policies' });
      }
      if (errorString.includes('400')) {
        return res.status(400).json({ error: 'Invalid request - content might be too long or malformed' });
      }
      if (errorString.includes('500') || errorString.includes('503')) {
        return res.status(503).json({ error: 'AI service temporarily unavailable' });
      }

      res.status(error.status || 500).json({ error: error.message || 'Failed to generate quiz' });
    }
  },
};

export default geminiController;
