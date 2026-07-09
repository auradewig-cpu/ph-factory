import { db } from '@/lib/db/client';
import { assets, projects, musicTracks, scenes } from '@/lib/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { ImageIcon, Music, FileAudio } from 'lucide-react';

export const dynamic = 'force-dynamic';

const TYPE_LABEL: Record<string, string> = {
  image: 'Image',
  video_frame: 'Video Frame',
  audio: 'Narasi Audio',
  reference_photo: 'Reference Photo',
};

export default async function AssetsPage() {
  const assetRows = await db
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

  const musicRows = await db
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

  const dedupMusic = [...new Map(musicRows.map((m) => [m.id, m])).values()];

  const images = assetRows.filter((a) => a.type === 'reference_photo' || a.type === 'video_frame');
  const audios = assetRows.filter((a) => a.type === 'audio');

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="px-7 py-5 border-b border-ph-border sticky top-0 z-10 bg-ph-bg">
        <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text">ASSET &amp; MUSIC LIBRARY</h1>
      </div>

      <div className="px-7 py-6 flex flex-col gap-8 max-w-4xl">
        {/* Images */}
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase mb-3">Gambar ({images.length})</h2>
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-ph-border rounded-lg text-center">
              <div className="font-sans text-xs text-ph-muted">Belum ada gambar tersimpan.</div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {images.map((a) => (
                <div key={a.id} className="bg-ph-surface border border-ph-border rounded-lg overflow-hidden">
                  <img src={a.cloudinaryUrl} alt="" className="w-full h-[100px] object-cover" />
                  <div className="p-2">
                    <div className="font-mono text-[9px] text-ph-muted">{TYPE_LABEL[a.type] ?? a.type}</div>
                    <div className="font-mono text-[8px] text-ph-muted mt-0.5">{a.projectName ?? '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audio Narasi */}
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase mb-3">Narasi Audio ({audios.length})</h2>
          {audios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-ph-border rounded-lg text-center">
              <FileAudio size={24} className="text-ph-muted mb-2 opacity-40" />
              <div className="font-sans text-xs text-ph-muted">Belum ada narasi audio.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {audios.map((a) => (
                <div key={a.id} className="bg-ph-surface border border-ph-border rounded-lg p-3 flex items-center gap-3">
                  <FileAudio size={16} className="text-ph-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] text-ph-muted">{a.projectName ?? '—'}</div>
                  </div>
                  <audio controls src={a.cloudinaryUrl} className="h-[28px] w-[200px]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Musik */}
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase mb-3">Musik / SFX ({dedupMusic.length})</h2>
          {dedupMusic.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-ph-border rounded-lg text-center">
              <Music size={24} className="text-ph-muted mb-2 opacity-40" />
              <div className="font-sans text-xs text-ph-muted">Belum ada musik terpasang.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {dedupMusic.map((m) => (
                <div key={m.id} className="bg-ph-surface border border-ph-border rounded-lg p-3 flex items-center gap-3">
                  <Music size={16} className="text-ph-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-xs text-ph-text">{m.name}</div>
                    <div className="font-mono text-[9px] text-ph-muted mt-0.5">{m.source} · {m.licenseType}</div>
                  </div>
                  {m.downloadUrl && (
                    <audio controls src={m.downloadUrl} className="h-[28px] w-[200px]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
