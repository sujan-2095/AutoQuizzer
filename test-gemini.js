import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the environment variables from .env
dotenv.config({ path: path.join(__dirname, '.env'), override: true });

const apiKey = process.env.GEMINI_API_KEY;

console.log("=========================================");
console.log("🔍 TESTING GEMINI API CONFIGURATION");
console.log("=========================================\n");

console.log(`Checking API Key from .env...`);
if (!apiKey) {
    console.error("❌ ERROR: No GEMINI_API_KEY found in your environment variables.");
    console.log("Please check if your .env.local file exists and has GEMINI_API_KEY set.");
    process.exit(1);
}

// Log a safe preview of the key to verify we loaded it correctly
const keyPreview = apiKey.substring(0, 6) + "..." + apiKey.substring(apiKey.length - 4);
console.log(`✅ Loaded API Key: ${keyPreview}\n`);

async function testGeminiAPI() {
    console.log("⏳ Initializing GoogleGenAI client and sending a test prompt ('Say Hello')...");

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });

        // Simple test request
        const request = {
            model: "gemini-3.5-flash",
            contents: [{ parts: [{ text: "Say Hello" }] }],
        };

        const response = await ai.models.generateContent(request);

        console.log("\n🎉 SUCCESS! Received response from Gemini:");
        console.log("-----------------------------------------");
        console.log(response.text);
        console.log("-----------------------------------------");
        console.log("\nYour API key is fully working! 🚀");

    } catch (error) {
        console.log("\n❌ FAILED to generate content. Here are the error details:");
        console.log("-----------------------------------------");
        console.error(error);
        console.log("-----------------------------------------");

        const errorStr = String(error);
        if (errorStr.includes('API key not valid') || errorStr.includes('API_KEY_INVALID')) {
            console.log("\n💡 DIAGNOSIS: Your API key is invalid.");
            console.log("Make sure you copied the correct key from Google AI Studio.");
            console.log("Valid keys typically start with 'AIzaSy'.");
        }
    }
}

testGeminiAPI();
