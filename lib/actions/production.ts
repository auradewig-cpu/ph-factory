'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { productions, formatPresets, projects } from '@/lib/db/schema';
import { createProductionSchema } from '@/lib/validation/production';
import { eq, desc } from 'drizzle-orm';

export async function createProduction(projectId: number, formData: FormData) {
  const parsed = createProductionSchema.parse({
    formatPresetId: formData.get('formatPresetId'),
    hasCharacter: formData.get('hasCharacter'),
    voiceMode: formData.get('voiceMode'),
  });

  const [preset] = await db
    .select()
    .from(formatPresets)
    .where(eq(formatPresets.id, parsed.formatPresetId))
    .limit(1);

  if (!preset) throw new Error('Format preset tidak ditemukan');

  await db.insert(productions).values({
    projectId,
    formatPresetId: parsed.formatPresetId,
    platform: preset.platform,
    hasCharacter: parsed.hasCharacter ?? false,
    voiceMode: parsed.voiceMode,
    status: 'draft',
  });

  revalidatePath(`/projects/${projectId}`);
}

export async function listProductionsByProject(projectId: number) {
  const rows = await db
    .select({
      id: productions.id,
      projectId: productions.projectId,
      platform: productions.platform,
      formatPresetId: productions.formatPresetId,
      hasCharacter: productions.hasCharacter,
      voiceMode: productions.voiceMode,
      status: productions.status,
      createdAt: productions.createdAt,
      presetName: formatPresets.name,
      presetRatio: formatPresets.ratio,
    })
    .from(productions)
    .leftJoin(formatPresets, eq(productions.formatPresetId, formatPresets.id))
    .where(eq(productions.projectId, projectId))
    .orderBy(productions.createdAt);

  return rows;
}

export async function listAllProductions() {
  const rows = await db
    .select({
      id: productions.id,
      platform: productions.platform,
      status: productions.status,
      hasCharacter: productions.hasCharacter,
      voiceMode: productions.voiceMode,
      createdAt: productions.createdAt,
      presetName: formatPresets.name,
      presetRatio: formatPresets.ratio,
      projectName: projects.name,
      projectId: projects.id,
    })
    .from(productions)
    .leftJoin(formatPresets, eq(productions.formatPresetId, formatPresets.id))
    .leftJoin(projects, eq(productions.projectId, projects.id))
    .orderBy(desc(productions.createdAt));

  return rows;
}
