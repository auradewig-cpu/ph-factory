'use server';

import { db } from '@/lib/db/client';
import { assets, projects, musicTracks, scenes } from '@/lib/db/schema';
import { eq, desc, inArray, sql } from 'drizzle-orm';

export async function listAllAssets() {
  const rows = await db
    .select({
      id: assets.id,
      type: assets.type,
      cloudinaryUrl: assets.cloudinaryUrl,
      sceneId: assets.sceneId,
      createdAt: assets.createdAt,
      projectName: projects.name,
      projectId: projects.id,
    })
    .from(assets)
    .leftJoin(projects, eq(assets.projectId, projects.id))
    .orderBy(desc(assets.createdAt));

  return rows;
}

export async function listAllMusicTracks() {
  const rows = await db
    .select({
      id: musicTracks.id,
      name: musicTracks.name,
      source: musicTracks.source,
      licenseType: musicTracks.licenseType,
      downloadUrl: musicTracks.downloadUrl,
    })
    .from(musicTracks)
    .innerJoin(scenes, eq(musicTracks.id, scenes.musicTrackId))
    .orderBy(desc(musicTracks.id));

  const deduped = new Map<number, typeof rows[0]>();
  for (const r of rows) deduped.set(r.id, r);
  return [...deduped.values()];
}
