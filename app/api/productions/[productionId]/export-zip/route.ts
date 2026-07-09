import { auth } from '@/auth';
import { db } from '@/lib/db/client';
import { productions, projects, formatPresets, scenes, assets, musicTracks } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import JSZip from 'jszip';

export const maxDuration = 60;

export async function GET(_req: Request, { params }: { params: Promise<{ productionId: string }> }) {
  const session = await auth();
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { productionId } = await params;
  const prodId = Number(productionId);
  if (isNaN(prodId)) return new Response('Invalid production ID', { status: 400 });

  const [prod] = await db
    .select({
      id: productions.id,
      platform: productions.platform,
      hasCharacter: productions.hasCharacter,
      voiceMode: productions.voiceMode,
      status: productions.status,
      projectName: projects.name,
      projectNiche: projects.niche,
      presetName: formatPresets.name,
      presetRatio: formatPresets.ratio,
    })
    .from(productions)
    .leftJoin(formatPresets, eq(productions.formatPresetId, formatPresets.id))
    .leftJoin(projects, eq(productions.projectId, projects.id))
    .where(eq(productions.id, prodId))
    .limit(1);

  if (!prod) return new Response('Production not found', { status: 404 });

  const sceneRows = await db
    .select()
    .from(scenes)
    .where(eq(scenes.productionId, prodId))
    .orderBy(scenes.sceneNumber);

  const narrationAssetIds = sceneRows
    .map((s) => s.narrationAssetId)
    .filter((id): id is number => id !== null);

  const narrationAssets = narrationAssetIds.length > 0
    ? await db.select().from(assets).where(inArray(assets.id, narrationAssetIds))
    : [];
  const narrationUrlMap = new Map(narrationAssets.map((a) => [a.sceneId, a.cloudinaryUrl]));

  const musicTrackIds = sceneRows
    .map((s) => s.musicTrackId)
    .filter((id): id is number => id !== null);

  const musicTracksRows = musicTrackIds.length > 0
    ? await db
        .select()
        .from(musicTracks)
        .where(inArray(musicTracks.id, musicTrackIds))
    : [];
  const musicInfoById = new Map(musicTracksRows.map((m) => [m.id, m]));

  const zip = new JSZip();

  const errors: string[] = [];

  const infoLines = [
    `Production Export — ${new Date().toISOString()}`,
    `Project: ${prod.projectName}`,
    `Niche: ${prod.projectNiche}`,
    `Format: ${prod.presetName ?? '-'} (${prod.presetRatio ?? '-'})`,
    `Platform: ${prod.platform}`,
    `Total Scenes: ${sceneRows.length}`,
    '',
    '=== Scene Summary ===',
  ];

  for (const scene of sceneRows) {
    const folder = zip.folder(`scene_${scene.sceneNumber}_${scene.sceneType}`)!;

    folder.file('image_prompt.txt', scene.imagePrompt);
    folder.file('video_prompt.txt', scene.videoPrompt);

    if (scene.scriptNarration) {
      folder.file('narration.txt', scene.scriptNarration);
    }

    if (scene.narrationAssetId) {
      const url = narrationUrlMap.get(scene.sceneNumber);
      if (url) {
        try {
          const audioRes = await fetch(url);
          if (audioRes.ok) {
            folder.file('narration_audio.mp3', Buffer.from(await audioRes.arrayBuffer()));
          } else {
            errors.push(`scene_${scene.sceneNumber}/narration_audio.mp3 — fetch failed (${audioRes.status})`);
          }
        } catch {
          errors.push(`scene_${scene.sceneNumber}/narration_audio.mp3 — fetch error`);
        }
      }
    }

    const musicInfo = scene.musicTrackId ? musicInfoById.get(scene.musicTrackId) : undefined;
    if (musicInfo?.downloadUrl) {
      try {
        const musicRes = await fetch(musicInfo.downloadUrl);
        if (musicRes.ok) {
          folder.file('music_sfx.mp3', Buffer.from(await musicRes.arrayBuffer()));
          const licLines = [
            `Track: ${musicInfo.name}`,
            `License Type: ${musicInfo.licenseType}`,
            `License URL: ${musicInfo.licenseUrl ?? '-'}`,
          ];
          folder.file('music_license.txt', licLines.join('\n'));
        } else {
          errors.push(`scene_${scene.sceneNumber}/music_sfx.mp3 — fetch failed (${musicRes.status})`);
        }
      } catch {
        errors.push(`scene_${scene.sceneNumber}/music_sfx.mp3 — fetch error`);
      }
    }

    infoLines.push(`  #${scene.sceneNumber} [${scene.sceneType}] ${scene.cameraTechnique} — ${scene.durationSeconds}s`);
  }

  infoLines.push('');

  if (errors.length > 0) {
    infoLines.push('=== Failed Files ===');
    for (const err of errors) {
      infoLines.push(`  ${err}`);
    }
  }

  zip.file('production_info.txt', infoLines.join('\n'));

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="production-${prodId}.zip"`,
    },
  });
}
