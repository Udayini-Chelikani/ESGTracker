import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "[gemini] WARNING: GEMINI_API_KEY is not set. Classification calls will fail."
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Keep the model name configurable via .env so you can swap
// gemini-2.0-flash <-> gemini-1.5-pro etc. without touching code.
export const geminiModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.2, // low temperature: we want consistent, repeatable classification, not creativity
    responseMimeType: "application/json", // ask Gemini to return raw JSON directly
  },
});
