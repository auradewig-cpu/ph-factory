'use server';

import { searchJamendoTracks } from '@/lib/music/jamendo';
import { searchFreesoundSounds } from '@/lib/music/freesound';
import { db } from '@/lib/db/client';
import { musicTracks, scenes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function searchMusic(query: string, source: 'jamendo' | 'freesound') {
  if (query.length < 2) throw new Error('Query minimal 2 karakter');

  if (source === 'jamendo') {
    return searchJamendoTracks(query);
  }
  return searchFreesoundSounds(query);
}

export async function attachMusicToScene(
  sceneId: number,
  track: {
    source: 'jamendo' | 'freesound';
    externalId: string;
    name: string;
    artistName: string;
    licenseCcurl: string;
    licenseType: string;
    downloadUrl: string;
  },
) {
  const [existing] = await db
    .select({ id: musicTracks.id })
    .from(musicTracks)
    .where(and(eq(musicTracks.source, track.source), eq(musicTracks.externalId, track.externalId)))
    .limit(1);

  let musicTrackId: number;

  if (existing) {
    musicTrackId = existing.id;
  } else {
    const [inserted] = await db
      .insert(musicTracks)
      .values({
        source: track.source,
        externalId: track.externalId,
        name: track.artistName ? `${track.name} — ${track.artistName}` : track.name,
        licenseUrl: track.licenseCcurl,
        licenseType: track.licenseType,
        commercialSafe: true,
        downloadUrl: track.downloadUrl,
      })
      .returning({ id: musicTracks.id });

    musicTrackId = inserted.id;
  }

  await db
    .update(scenes)
    .set({ musicTrackId })
    .where(eq(scenes.id, sceneId));

  revalidatePath('/projects');
}
