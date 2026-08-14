import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root directory and override system variables
dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

export const config = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  PORT: process.env.PORT || 5000
};

// Validate required environment variables
if (!config.GEMINI_API_KEY) {
  console.error('❌ CRITICAL: GEMINI_API_KEY not found in environment');
  console.error('📁 Looking for .env file at:', path.join(__dirname, '.env'));
  console.error('💡 Make sure server/.env exists with GEMINI_API_KEY=your_key');
} else {
  console.log('✅ Gemini API key loaded successfully');
}
