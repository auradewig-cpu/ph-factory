import { z } from 'zod';

export const researchQuerySchema = z.object({
  query: z.string().min(3, 'Query minimal 3 karakter'),
  projectId: z.number().int().positive(),
});

export const researchSynthesisSchema = z.object({
  summary: z.string(),
  patterns: z.array(z.string()),
  contentGapSuggestions: z.array(z.string()),
  recommendedHookStyles: z.array(z.string()),
});
