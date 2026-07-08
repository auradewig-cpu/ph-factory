import { google } from '@ai-sdk/google';

export const geminiModel = google(process.env.GEMINI_MODEL ?? 'gemini-2.5-flash');
