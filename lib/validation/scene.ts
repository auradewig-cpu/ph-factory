import { z } from 'zod';

export const sceneSchema = z.object({
  sceneNumber: z.number().int().min(1),
  sceneType: z.enum(['hook', 'body', 'cta']),
  cameraTechnique: z.enum([
    'drone_aerial_reveal',
    'drone_orbit',
    'walkthrough_steadicam',
    'dolly_zoom',
    'static_wide_establish',
    'rack_focus_detail',
    'pov_handheld_product',
    'pov_gimbal_follow',
  ]),
  continuityType: z.enum(['continuous', 'match_cut', 'hard_cut']),
  imagePrompt: z.string().min(50),
  videoPrompt: z.string().min(50),
  scriptNarration: z.string().nullable(),
  durationSeconds: z.number().int().min(5).max(120),
  maxWords: z.number().int().min(5).max(100),
  speechPace: z.string(),
});

export const generateScenesResponseSchema = z.object({
  scenes: z.array(sceneSchema),
});
