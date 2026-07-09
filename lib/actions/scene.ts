'use server';

import { generateScenesResponseSchema } from '@/lib/validation/scene';
import { generateObjectWithFallback } from '@/lib/ai/fallback';
import { compileMasterPrompt } from '@/lib/prompt-engine/masterPrompt';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { productions, projects, formatPresets, personas, scenes } from '@/lib/db/schema';
import { eq, and, gt, sql } from 'drizzle-orm';

export async function generateScenes(productionId: number, sceneCount: number) {
  if (sceneCount < 2 || sceneCount > 20) throw new Error('Jumlah scene harus antara 2-20');

  const [prod] = await db
    .select({
      id: productions.id,
      projectId: productions.projectId,
      platform: productions.platform,
      hasCharacter: productions.hasCharacter,
      voiceMode: productions.voiceMode,
      formatPresetId: productions.formatPresetId,
    })
    .from(productions)
    .where(eq(productions.id, productionId))
    .limit(1);

  if (!prod) throw new Error('Production tidak ditemukan');

  const [proj] = await db
    .select({ niche: projects.niche, language: projects.language })
    .from(projects)
    .where(eq(projects.id, prod.projectId))
    .limit(1);

  if (!proj) throw new Error('Project tidak ditemukan');

  let presetRatio = '16:9';
  if (prod.formatPresetId) {
    const [preset] = await db
      .select({ ratio: formatPresets.ratio })
      .from(formatPresets)
      .where(eq(formatPresets.id, prod.formatPresetId))
      .limit(1);
    if (preset) presetRatio = preset.ratio;
  }

  let personaDescription: string | undefined;
  if (prod.hasCharacter) {
    const [persona] = await db
      .select({ description: personas.description })
      .from(personas)
      .where(eq(personas.projectId, prod.projectId))
      .limit(1);
    if (persona) personaDescription = persona.description;
  }

  const masterPrompt = compileMasterPrompt({
    niche: proj.niche,
    platform: prod.platform,
    ratio: presetRatio,
    sceneCount,
    hasCharacter: prod.hasCharacter,
    personaDescription,
    voiceMode: prod.voiceMode,
    language: proj.language as 'id' | 'en',
  });

  const { object } = await generateObjectWithFallback({
    schema: generateScenesResponseSchema,
    prompt: masterPrompt,
  });

  const sorted = [...object.scenes].sort((a, b) => a.sceneNumber - b.sceneNumber);

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].sceneNumber !== i + 1) {
      throw new Error(`Scene number tidak urut: AI mengembalikan nomor ${sorted[i].sceneNumber} pada urutan ke-${i + 1}`);
    }
  }

  const seen = new Set<number>();
  for (const s of sorted) {
    if (seen.has(s.sceneNumber)) throw new Error(`Duplikat scene number: ${s.sceneNumber}`);
    seen.add(s.sceneNumber);
  }

  if (sorted.length > 0 && sorted[0].sceneType !== 'hook') {
    throw new Error('Scene 1 harus bertipe hook');
  }
  if (sorted.length > 0 && sorted[sorted.length - 1].sceneType !== 'cta') {
    throw new Error('Scene terakhir harus bertipe cta');
  }

  await db
    .insert(scenes)
    .values(sorted.map((s) => ({
      productionId,
      sceneNumber: s.sceneNumber,
      sceneType: s.sceneType,
      cameraTechnique: s.cameraTechnique,
      continuityType: s.continuityType,
      imagePrompt: s.imagePrompt,
      videoPrompt: s.videoPrompt,
      scriptNarration: s.scriptNarration,
      durationSeconds: s.durationSeconds,
      maxWords: s.maxWords,
      speechPace: s.speechPace,
    })))
    .onConflictDoUpdate({
      target: [scenes.productionId, scenes.sceneNumber],
      set: {
        sceneType: sql`excluded.scene_type`,
        cameraTechnique: sql`excluded.camera_technique`,
        continuityType: sql`excluded.continuity_type`,
        imagePrompt: sql`excluded.image_prompt`,
        videoPrompt: sql`excluded.video_prompt`,
        scriptNarration: sql`excluded.script_narration`,
        durationSeconds: sql`excluded.duration_seconds`,
        maxWords: sql`excluded.max_words`,
        speechPace: sql`excluded.speech_pace`,
      },
    });

  await db
    .delete(scenes)
    .where(and(
      eq(scenes.productionId, productionId),
      gt(scenes.sceneNumber, sorted.length),
    ));

  revalidatePath(`/projects/${prod.projectId}`);
  revalidatePath(`/projects/${prod.projectId}/productions/${productionId}`);
}

export async function listScenesByProduction(productionId: number) {
  const rows = await db
    .select()
    .from(scenes)
    .where(eq(scenes.productionId, productionId))
    .orderBy(scenes.sceneNumber);

  return rows;
}
