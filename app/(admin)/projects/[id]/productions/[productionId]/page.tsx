import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db/client';
import { productions, formatPresets, projects, assets, musicTracks } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { listScenesByProduction } from '@/lib/actions/scene';
import { GenerateScenesForm, CopyButton, VoiceoverButton } from '@/components/SceneClient';
import { MusicPicker } from '@/components/MusicPicker';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface Props {
  params: Promise<{ id: string; productionId: string }>;
}

const SCENE_TYPE_LABEL: Record<string, string> = { hook: 'Hook', body: 'Body', cta: 'CTA' };
const VOICE_LABEL: Record<string, string> = { voiceover_only: 'Voiceover', on_camera_dialogue: 'On Camera', none: 'No Audio' };

export default async function ProductionDetailPage({ params }: Props) {
  const { id, productionId } = await params;
  const projectId = Number(id);
  const prodId = Number(productionId);
  if (isNaN(projectId) || isNaN(prodId)) notFound();

  const [prod] = await db
    .select({
      id: productions.id,
      platform: productions.platform,
      hasCharacter: productions.hasCharacter,
      voiceMode: productions.voiceMode,
      status: productions.status,
      presetName: formatPresets.name,
      presetRatio: formatPresets.ratio,
      projectName: projects.name,
    })
    .from(productions)
    .leftJoin(formatPresets, eq(productions.formatPresetId, formatPresets.id))
    .leftJoin(projects, eq(productions.projectId, projects.id))
    .where(eq(productions.id, prodId))
    .limit(1);

  if (!prod) notFound();

  const sceneList = await listScenesByProduction(prodId);

  const narrationAssetIds = sceneList
    .map((s) => s.narrationAssetId)
    .filter((id): id is number => id !== null);

  const narrationAssetRows = narrationAssetIds.length > 0
    ? await db
        .select({ id: assets.id, cloudinaryUrl: assets.cloudinaryUrl })
        .from(assets)
        .where(inArray(assets.id, narrationAssetIds))
    : [];
  const narrationAssetMap = new Map(narrationAssetRows.map((a) => [a.id, a.cloudinaryUrl]));

  const musicTrackIds = sceneList
    .map((s) => s.musicTrackId)
    .filter((id): id is number => id !== null);

  const musicTrackRows = musicTrackIds.length > 0
    ? await db
        .select({ id: musicTracks.id, trackName: musicTracks.name })
        .from(musicTracks)
        .where(inArray(musicTracks.id, musicTrackIds))
    : [];
  const musicTrackMap = new Map(musicTrackRows.map((m) => [m.id, m]));

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="flex items-center gap-4 px-7 py-5 border-b border-ph-border bg-ph-bg sticky top-0 z-10">
        <Link
          href={`/projects/${projectId}`}
          className="flex items-center gap-1 text-ph-muted font-mono text-[11px] no-underline hover:text-ph-text transition-colors"
        >
          <ArrowLeft size={14} /> KEMBALI
        </Link>
        <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text leading-none">{prod.presetName}</h1>
      </div>

      <div className="px-7 py-6 flex flex-col gap-6 max-w-4xl">
        {/* Info + Generate */}
        <div className="bg-ph-surface border border-ph-border rounded-lg p-5 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-mono text-[10px] text-ph-muted">{prod.presetRatio} · {prod.platform}</div>
            <div className="font-sans text-xs text-ph-muted">
              {VOICE_LABEL[prod.voiceMode]}{prod.hasCharacter ? ' · Dengan Karakter' : ''}
            </div>
            <span className="font-mono text-[9px] px-[6px] py-[2px] rounded-[3px] border text-ph-amber border-ph-amber/30 bg-[rgba(242,169,59,0.07)] uppercase self-start mt-1">{prod.status}</span>
          </div>
          <GenerateScenesForm productionId={prodId} />
        </div>

        {/* Scene list */}
        {sceneList.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase">Scenes ({sceneList.length})</h2>
            </div>
            {sceneList.map((scene) => (
              <div key={scene.id} className="bg-ph-surface border border-ph-border rounded-lg p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl font-bold text-ph-text">#{scene.sceneNumber}</span>
                    <span className="font-mono text-[10px] px-[6px] py-[2px] rounded-[3px] border border-ph-teal/30 text-ph-teal bg-[rgba(47,166,160,0.07)] uppercase">{SCENE_TYPE_LABEL[scene.sceneType]}</span>
                    <span className="font-mono text-[10px] text-ph-muted">{scene.cameraTechnique.replace(/_/g, ' ')}</span>
                    <span className="font-mono text-[10px] text-ph-muted">· {scene.continuityType}</span>
                    <span className="font-mono text-[10px] text-ph-muted">· {scene.durationSeconds}s · {scene.maxWords} kata</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-ph-muted tracking-[0.06em] uppercase">Image Prompt</span>
                      <CopyButton text={scene.imagePrompt} />
                    </div>
                    <p className="font-sans text-xs text-ph-text leading-[1.6] whitespace-pre-wrap">{scene.imagePrompt}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-ph-muted tracking-[0.06em] uppercase">Video Prompt</span>
                      <CopyButton text={scene.videoPrompt} />
                    </div>
                    <p className="font-sans text-xs text-ph-text leading-[1.6] whitespace-pre-wrap">{scene.videoPrompt}</p>
                  </div>
                </div>

                {scene.scriptNarration && (
                  <div className="border-t border-ph-border pt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[9px] text-ph-muted tracking-[0.06em] uppercase">Narration</span>
                      <VoiceoverButton
                        sceneId={scene.id}
                        narrationAudioUrl={scene.narrationAssetId ? (narrationAssetMap.get(scene.narrationAssetId) ?? null) : null}
                      />
                    </div>
                    <p className="font-sans text-xs text-ph-text mt-1 italic">{scene.scriptNarration}</p>
                  </div>
                )}
                <div className="border-t border-ph-border pt-3 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-ph-muted tracking-[0.06em] uppercase">Music / SFX</span>
                  <div className="flex items-center gap-2">
                    {scene.musicTrackId && musicTrackMap.has(scene.musicTrackId) && (
                      <span className="font-mono text-[10px] text-ph-muted truncate max-w-[160px]">{musicTrackMap.get(scene.musicTrackId)?.trackName}</span>
                    )}
                    <MusicPicker
                      sceneId={scene.id}
                      attachedTrack={scene.musicTrackId && musicTrackMap.has(scene.musicTrackId)
                        ? { name: musicTrackMap.get(scene.musicTrackId)!.trackName, artistName: '' }
                        : null}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-ph-surface border border-ph-border rounded-lg p-5">
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-ph-border rounded-lg text-center">
              <div className="font-display text-base font-bold tracking-[0.06em] text-ph-muted mb-1">BELUM ADA SCENE</div>
              <div className="font-sans text-xs text-ph-muted">Generate scene menggunakan AI untuk production ini.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
