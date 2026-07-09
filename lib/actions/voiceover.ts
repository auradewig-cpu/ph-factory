'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { scenes, productions, assets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generateVoiceover } from '@/lib/tts/hf-space';
import { uploadAsset } from '@/lib/cloudinary/upload';

const SCENE_TYPE_EMOTION: Record<string, string> = {
  hook: 'excited',
  body: 'neutral',
  cta: 'urgent',
};

export async function generateSceneVoiceover(sceneId: number) {
  const [scene] = await db
    .select({
      id: scenes.id,
      scriptNarration: scenes.scriptNarration,
      sceneType: scenes.sceneType,
      productionId: scenes.productionId,
    })
    .from(scenes)
    .where(eq(scenes.id, sceneId))
    .limit(1);

  if (!scene) throw new Error('Scene tidak ditemukan');
  if (!scene.scriptNarration) throw new Error('Scene ini tidak punya narasi untuk dikonversi ke suara');

  const [prod] = await db
    .select({ projectId: productions.projectId })
    .from(productions)
    .where(eq(productions.id, scene.productionId))
    .limit(1);

  if (!prod) throw new Error('Production tidak ditemukan');

  const emotion = SCENE_TYPE_EMOTION[scene.sceneType] ?? 'neutral';

  const audioBuffer = await generateVoiceover({
    text: scene.scriptNarration,
    emotion,
  });

  const uploadResult = await uploadAsset({
    file: audioBuffer,
    projectId: prod.projectId,
    type: 'audio',
  });

  const [asset] = await db
    .insert(assets)
    .values({
      projectId: prod.projectId,
      sceneId,
      type: 'audio',
      cloudinaryUrl: uploadResult.cloudinaryUrl,
      cloudinaryPublicId: uploadResult.cloudinaryPublicId,
    })
    .returning({ id: assets.id });

  await db
    .update(scenes)
    .set({ narrationAssetId: asset.id })
    .where(eq(scenes.id, sceneId));

  revalidatePath(`/projects/${prod.projectId}`);
  revalidatePath(`/projects/${prod.projectId}/productions/${scene.productionId}`);
}
