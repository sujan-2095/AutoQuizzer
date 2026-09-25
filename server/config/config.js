import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Locate .env in root directory
const rootEnvPath = path.resolve(__dirname, '../../.env');
const cwdEnvPath = path.resolve(process.cwd(), '.env');
const envPath = fs.existsSync(rootEnvPath) ? rootEnvPath : cwdEnvPath;

dotenv.config({ path: envPath });

export const config = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  PORT: process.env.PORT || 5000,
  DB_PATH: process.env.DB_PATH,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
};

// Validate required environment variables
if (!config.GEMINI_API_KEY) {
  console.error('❌ CRITICAL: GEMINI_API_KEY not found in environment');
  console.error('📁 Looking for .env file at:', envPath);
  console.error('💡 Make sure .env exists with GEMINI_API_KEY=your_key');
} else {
  console.log('✅ Gemini API key loaded successfully');
}

export default config;
