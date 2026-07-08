'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { personas, assets } from '@/lib/db/schema';
import { createPersonaSchema, ETHNICITY_LABEL, STYLE_LABEL } from '@/lib/validation/persona';
import { uploadAsset } from '@/lib/cloudinary/upload';
import { eq } from 'drizzle-orm';

function compileDescription(data: {
  gender: string;
  age: number;
  ethnicity: string;
  style: string;
  physicalTrait?: string;
}): string {
  const ethnicityLabel = ETHNICITY_LABEL[data.ethnicity] ?? data.ethnicity;
  const styleLabel = STYLE_LABEL[data.style] ?? data.style;
  const trait = data.physicalTrait?.trim() ?? '';

  if (data.gender === 'duo') {
    const traitPart = trait ? `, ${trait}` : '';
    return `Duo characters: ${data.age}-year-old ${ethnicityLabel} male and ${data.age}-year-old ${ethnicityLabel} female, both in ${styleLabel}${traitPart}. Both characters MUST appear together in all scenes unless scene type requires solo shot.`;
  }

  const genderLabel = data.gender === 'male' ? 'male' : 'female';
  const traitPart = trait ? `, ${trait}` : '';
  return `${data.age}-year-old ${ethnicityLabel} ${genderLabel}, ${styleLabel}${traitPart}`;
}

export async function createPersona(projectId: number, formData: FormData) {
  const parsed = createPersonaSchema.parse({
    name: formData.get('name'),
    gender: formData.get('gender'),
    age: formData.get('age'),
    ethnicity: formData.get('ethnicity'),
    style: formData.get('style'),
    physicalTrait: formData.get('physicalTrait') || undefined,
  });

  let referenceImageAssetId: number | null = null;

  const file = formData.get('referenceImage');
  if (file instanceof File && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Ukuran foto maksimal 10MB');
    }
    if (!file.type.startsWith('image/')) {
      throw new Error('File harus berupa gambar');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadAsset({ file: buffer, projectId, type: 'reference_photo', mimeType: file.type });

    const [asset] = await db
      .insert(assets)
      .values({
        projectId,
        cloudinaryUrl: uploadResult.cloudinaryUrl,
        cloudinaryPublicId: uploadResult.cloudinaryPublicId,
        type: 'reference_photo',
      })
      .returning();

    referenceImageAssetId = asset.id;
  }

  const description = compileDescription(parsed);

  await db.insert(personas).values({
    projectId,
    name: parsed.name,
    description,
    referenceImageAssetId,
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function listPersonasByProject(projectId: number) {
  const rows = await db
    .select()
    .from(personas)
    .where(eq(personas.projectId, projectId))
    .orderBy(personas.createdAt);

  return rows;
}
