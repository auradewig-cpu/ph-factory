import { z } from 'zod';

export const VOICE_MODE_OPTIONS = [
  { value: 'voiceover_only', label: 'Voiceover saja' },
  { value: 'on_camera_dialogue', label: 'Dialog di depan kamera' },
  { value: 'none', label: 'Tanpa suara' },
] as const;

const voiceModeValues = ['voiceover_only', 'on_camera_dialogue', 'none'] as const;

export const createProductionSchema = z.object({
  formatPresetId: z.coerce.number({ message: 'Format preset wajib dipilih' }),
  hasCharacter: z.coerce.boolean(),
  voiceMode: z.enum(voiceModeValues, { message: 'Mode suara tidak valid' }),
});

export type CreateProductionInput = z.infer<typeof createProductionSchema>;

