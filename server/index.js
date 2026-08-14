import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { config } from './config.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import geminiRoutes from './routes/gemini.js';
import { initDatabase } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize database
await initDatabase();

async function verifyGeminiAPI() {
  console.log('⏳ Verifying Gemini API connection...');
  if (!config.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: No GEMINI_API_KEY found in configuration.');
    return;
  }
  try {
    const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
    await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ parts: [{ text: "ping" }] }],
    });
    console.log('✅ Gemini API is fully operational and authenticated.');
  } catch (error) {
    console.error('❌ WARNING: Gemini API test failed during startup.');
    const errStr = String(error);
    if (errStr.includes('API key not valid') || errStr.includes('API_KEY_INVALID')) {
      console.error('   -> Error: Your API Key is invalid. Please check your .env file.');
    } else if (errStr.includes('NOT_FOUND') || errStr.includes('404')) {
      console.error('   -> Error: The model (gemini-3.5-flash) is not supported by your account.');
    } else if (errStr.includes('UNAVAILABLE') || errStr.includes('503')) {
      console.error('   -> Error: The Gemini API is currently experiencing high demand.');
    } else {
      console.error('   -> Error details:', error.message);
    }
  }
}

await verifyGeminiAPI();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/gemini', geminiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AutoQuizzer API is running' });
});

// Serve frontend static files in production
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route to serve React app for non-API requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AutoQuizzer server running on port ${PORT}`);
});
