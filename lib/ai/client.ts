import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAI } from '@ai-sdk/openai';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const geminiModel = googleProvider(process.env.GEMINI_MODEL ?? 'gemini-2.5-flash');

const groqProvider = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const groqModel = groqProvider('llama-3.3-70b-versatile');

const cerebrasProvider = createOpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: 'https://api.cerebras.ai/v1',
});

export const cerebrasModel = cerebrasProvider.chat('gpt-oss-120b');

const mistralProvider = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export const mistralModel = mistralProvider('mistral-small-latest');

const openrouterProvider = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const openrouterModel = openrouterProvider('meta-llama/llama-3.3-70b-instruct:free');
