import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const geminiModel = googleProvider(process.env.GEMINI_MODEL ?? 'gemini-2.5-flash');
