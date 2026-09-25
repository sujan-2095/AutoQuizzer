import { GoogleGenAI } from '@google/genai';
import { config } from '../config/config.js';
import { buildQuizPrompt } from './ai/quizPrompt.js';
import { quizSchema } from './ai/quizSchema.js';

export const geminiService = {
  async verifyConnection() {
    if (!config.GEMINI_API_KEY) {
      console.warn('⚠️  WARNING: No GEMINI_API_KEY found in configuration.');
      return false;
    }

    const preferredModel = config.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const candidateModels = [
      preferredModel,
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

    for (const model of candidateModels) {
      try {
        await ai.models.generateContent({
          model,
          contents: [{ parts: [{ text: 'ping' }] }],
        });
        config.ACTIVE_MODEL = model;
        console.log(`✅ Gemini API connected & authenticated successfully with model: '${model}'.`);
        return true;
      } catch (error) {
        const errStr = String(error);
        if (errStr.includes('API key not valid') || errStr.includes('API_KEY_INVALID')) {
          console.error('❌ Error: Your Gemini API Key is invalid. Please check your .env file.');
          return false;
        } else if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
          console.warn(`⚠️  Model '${model}' quota exceeded (429). Checking next candidate...`);
        } else if (errStr.includes('NOT_FOUND') || errStr.includes('404')) {
          console.warn(`⚠️  Model '${model}' not available (404). Checking next candidate...`);
        } else {
          console.warn(`⚠️  Model '${model}' test error: ${error.message}. Checking next candidate...`);
        }
      }
    }

    console.error('❌ WARNING: All Gemini model candidates failed verification.');
    return false;
  },

  async generateQuiz({ content, numQuestions, difficulty }) {
    if (!config.GEMINI_API_KEY) {
      const error = new Error('Gemini API key not configured on server');
      error.status = 500;
      throw error;
    }

    const preferredModel = config.ACTIVE_MODEL || config.GEMINI_MODEL || 'gemini-3.5-flash-lite';
    const modelsToTry = [
      preferredModel,
      'gemini-3.1-flash-lite',
      'gemini-flash-lite-latest',
      'gemini-3.5-flash',
    ].filter((m, idx, arr) => arr.indexOf(m) === idx);

    const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
    const prompt = buildQuizPrompt({ content, numQuestions, difficulty });

    const sendRequest = async (modelToUse) => {
      const request = {
        model: modelToUse,
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: quizSchema,
        },
      };

      const response = await ai.models.generateContent(request);

      if (!response.text) {
        throw new Error('The AI model returned an empty response.');
      }

      const jsonText = response.text.trim();
      const quizData = JSON.parse(jsonText);

      // Validation
      if (
        !quizData ||
        !quizData.questions ||
        !Array.isArray(quizData.questions) ||
        quizData.questions.length === 0 ||
        !quizData.difficulty
      ) {
        throw new Error('Invalid quiz data structure');
      }

      if (
        quizData.questions.some(
          (q) =>
            !q.questionText ||
            !q.options ||
            q.options.length !== 4 ||
            q.correctAnswerIndex === undefined ||
            q.correctAnswerIndex < 0 ||
            q.correctAnswerIndex >= 4
        )
      ) {
        throw new Error('Invalid question structure');
      }

      return quizData;
    };

    let lastError = null;
    for (const model of modelsToTry) {
      try {
        const result = await sendRequest(model);
        config.ACTIVE_MODEL = model;
        return result;
      } catch (err) {
        lastError = err;
        const errStr = String(err);
        if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('503')) {
          console.warn(`⚠️ Warning: Model '${model}' hit quota limit or temporary error. Trying fallback...`);
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('Failed to generate quiz with any available Gemini model.');
  },
};

export default geminiService;
