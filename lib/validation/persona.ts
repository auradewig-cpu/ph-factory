import { z } from 'zod';

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Pria' },
  { value: 'female', label: 'Wanita' },
  { value: 'duo', label: 'Duo (Pria + Wanita)' },
] as const;

export const ETHNICITY_OPTIONS = [
  { value: 'southeast_asian', label: 'Asia Tenggara' },
  { value: 'east_asian', label: 'Asia Timur' },
  { value: 'south_asian', label: 'Asia Selatan' },
  { value: 'caucasian', label: 'Kaukasia' },
  { value: 'african', label: 'Afrika' },
  { value: 'latin', label: 'Latin' },
  { value: 'middle_eastern', label: 'Timur Tengah' },
  { value: 'mixed', label: 'Mixed' },
] as const;

export const STYLE_OPTIONS = [
  { value: 'casual_modern', label: 'Kasual Modern' },
  { value: 'professional', label: 'Profesional' },
  { value: 'trendy_streetwear', label: 'Trendy/Streetwear' },
  { value: 'traditional', label: 'Tradisional' },
  { value: 'sporty', label: 'Sporty' },
  { value: 'glamour', label: 'Glamour' },
] as const;

const genderValues = GENDER_OPTIONS.map((o) => o.value) as [string, ...string[]];
const ethnicityValues = ETHNICITY_OPTIONS.map((o) => o.value) as [string, ...string[]];
const styleValues = STYLE_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const ETHNICITY_LABEL: Record<string, string> = Object.fromEntries(
  ETHNICITY_OPTIONS.map((o) => [o.value, o.label]),
);

export const STYLE_LABEL: Record<string, string> = Object.fromEntries(
  STYLE_OPTIONS.map((o) => [o.value, o.label]),
);

export const createPersonaSchema = z.object({
  name: z.string().min(1, 'Nama persona wajib diisi'),
  gender: z.enum(genderValues, { message: 'Jenis kelamin tidak valid' }),
  age: z.coerce.number().min(18, 'Minimal 18 tahun').max(65, 'Maksimal 65 tahun'),
  ethnicity: z.enum(ethnicityValues, { message: 'Etnik tidak valid' }),
  style: z.enum(styleValues, { message: 'Style tidak valid' }),
  physicalTrait: z.string().optional(),
});

export type CreatePersonaInput = z.infer<typeof createPersonaSchema>;
