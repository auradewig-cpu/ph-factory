'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { scenes, productions, projects, assets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadAsset } from '@/lib/cloudinary/upload';

export async function attachChainFrame(sceneId: number, fileBuffer: Buffer, mimeType: string) {
  if (fileBuffer.length > 10 * 1024 * 1024) {
    throw new Error('Ukuran file maksimal 10MB');
  }
  if (!mimeType.startsWith('image/')) {
    throw new Error('File harus berupa gambar');
  }

  const [scene] = await db
    .select({ id: scenes.id, continuityType: scenes.continuityType, productionId: scenes.productionId })
    .from(scenes)
    .where(eq(scenes.id, sceneId))
    .limit(1);

  if (!scene) throw new Error('Scene tidak ditemukan');
  if (scene.continuityType !== 'continuous') {
    throw new Error('Chain frame hanya bisa diupload untuk scene dengan continuityType continuous');
  }

  const [prod] = await db
    .select({ projectId: productions.projectId })
    .from(productions)
    .where(eq(productions.id, scene.productionId))
    .limit(1);

  if (!prod) throw new Error('Production tidak ditemukan');

  const uploadResult = await uploadAsset({
    file: fileBuffer,
    projectId: prod.projectId,
    type: 'video_frame',
    mimeType,
  });

  const [asset] = await db
    .insert(assets)
    .values({
      projectId: prod.projectId,
      sceneId: scene.id,
      type: 'video_frame',
      cloudinaryUrl: uploadResult.cloudinaryUrl,
      cloudinaryPublicId: uploadResult.cloudinaryPublicId,
    })
    .returning({ id: assets.id });

  await db
    .update(scenes)
    .set({ chainAssetId: asset.id })
    .where(eq(scenes.id, sceneId));

  revalidatePath('/projects');
}
