import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the environment variables from root .env
dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });

const apiKey = process.env.GEMINI_API_KEY;

console.log('=========================================');
console.log('🔍 TESTING GEMINI API CONFIGURATION');
console.log('=========================================\n');

console.log(`Checking API Key from .env...`);
if (!apiKey) {
  console.error('❌ ERROR: No GEMINI_API_KEY found in your environment variables.');
  console.log('Please check if your .env file exists and has GEMINI_API_KEY set.');
  process.exit(1);
}

// Log a safe preview of the key to verify we loaded it correctly
const keyPreview = apiKey.substring(0, 6) + '...' + apiKey.substring(apiKey.length - 4);
console.log(`✅ Loaded API Key: ${keyPreview}\n`);

async function testGeminiAPI() {
  const modelToTest = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  console.log(`⏳ Initializing GoogleGenAI client and testing model '${modelToTest}'...`);

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const response = await ai.models.generateContent({
      model: modelToTest,
      contents: [{ parts: [{ text: 'Say Hello in one cheerful sentence.' }] }],
    });

    console.log('\n🎉 SUCCESS! Received response from Gemini:');
    console.log('-----------------------------------------');
    console.log(response.text.trim());
    console.log('-----------------------------------------');
    console.log(`\nModel '${modelToTest}' is fully operational with your API key! 🚀`);
  } catch (error) {
    console.log('\n❌ FAILED to generate content. Here are the error details:');
    console.log('-----------------------------------------');
    console.error(error.message || error);
    console.log('-----------------------------------------');

    const errorStr = String(error);
    if (errorStr.includes('API key not valid') || errorStr.includes('API_KEY_INVALID')) {
      console.log('\n💡 DIAGNOSIS: Your API key is invalid.');
      console.log('Make sure you copied the correct key from Google AI Studio.');
    } else if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED')) {
      console.log(`\n💡 DIAGNOSIS: Quota exhausted for model '${modelToTest}'.`);
      console.log("Try setting GEMINI_MODEL=gemini-3.5-flash-lite or gemini-3.1-flash-lite in your .env file.");
    }
  }
}

testGeminiAPI();
