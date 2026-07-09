import { generateObject } from 'ai';
import { geminiModel, groqModel, openrouterModel } from './client';
import { recordApiUsage } from './usage';

const PROVIDERS = [
  { name: 'gemini' as const, model: geminiModel },
  { name: 'groq' as const, model: groqModel },
  { name: 'openrouter' as const, model: openrouterModel },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateObjectWithFallback(params: {
  schema: any;
  prompt: string;
}): Promise<{ object: any; providerUsed: string }> {
  const errors: string[] = [];
  for (const { name, model } of PROVIDERS) {
    try {
      const result = await generateObject({ model, schema: params.schema, prompt: params.prompt });
      await recordApiUsage(name);
      return { ...result, providerUsed: name };
    } catch (err) {
      await recordApiUsage(name);
      errors.push(`${name}: ${err instanceof Error ? err.message : String(err)}`);
      continue;
    }
  }
  throw new Error(`Semua provider AI gagal:\n${errors.join('\n')}`);
}
