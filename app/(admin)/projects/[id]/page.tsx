import { db } from '@/lib/db/client';
import { projects, personas, assets, formatPresets } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ArrowLeft, ImageIcon, Lightbulb, Youtube, Clock, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { PersonaForm } from '@/components/PersonaForm';
import { ProductionForm } from '@/components/ProductionForm';
import { ResearchForm } from '@/components/ResearchForm';
import { listProductionsByProject } from '@/lib/actions/production';
import { listResearchReports } from '@/lib/actions/research';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);
  if (isNaN(projectId)) notFound();

  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1);

  if (!project) notFound();

  const personaList = await db
    .select()
    .from(personas)
    .where(eq(personas.projectId, projectId))
    .orderBy(personas.createdAt);

  const assetIds = personaList
    .map((p) => p.referenceImageAssetId)
    .filter((id): id is number => id !== null);

  const assetRows = assetIds.length > 0
    ? await db.select().from(assets).where(inArray(assets.id, assetIds))
    : [];
  const assetMap = new Map(assetRows.map((a) => [a.id, a]));

  const productionList = await listProductionsByProject(projectId);

  const researchList = await listResearchReports(projectId);

  const presetList = await db
    .select({ id: formatPresets.id, name: formatPresets.name, ratio: formatPresets.ratio })
    .from(formatPresets)
    .orderBy(formatPresets.id);

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="flex items-center gap-4 px-7 py-5 border-b border-ph-border bg-ph-bg sticky top-0 z-10">
        <Link
          href="/projects"
          className="flex items-center gap-1 text-ph-muted font-mono text-[11px] no-underline hover:text-ph-text transition-colors"
        >
          <ArrowLeft size={14} /> KEMBALI
        </Link>
        <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text leading-none">{project.name}</h1>
      </div>

      <div className="px-7 py-6 flex flex-col gap-8 max-w-3xl">
        {/* Info card */}
        <div className="bg-ph-surface border border-ph-border rounded-lg p-5 flex flex-col gap-4">
          <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase">Informasi Project</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mb-1">ID</div>
              <div className="font-mono text-sm text-ph-text">#{project.id}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mb-1">NICHE</div>
              <div className="font-sans text-sm text-ph-text">{project.niche}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mb-1">BAHASA</div>
              <div className="font-mono text-sm text-ph-text">{project.language === 'id' ? 'Indonesia' : project.language}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mb-1">DIBUAT</div>
              <div className="font-mono text-sm text-ph-text">
                {new Date(project.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mb-2">PLATFORM TARGET</div>
            <div className="flex flex-wrap gap-2">
              {project.targetPlatforms.map((p) => (
                <span key={p} className="font-mono text-[11px] text-ph-teal border border-ph-teal/30 rounded-[3px] px-[8px] py-[3px]">{p}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Personas section */}
        <div className="bg-ph-surface border border-ph-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase">Personas</h2>
            <PersonaForm projectId={projectId} />
          </div>

          {personaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-ph-border rounded-lg text-center">
              <div className="font-display text-base font-bold tracking-[0.06em] text-ph-muted mb-1">BELUM ADA PERSONA</div>
              <div className="font-sans text-xs text-ph-muted">Tambahkan karakter/ persona untuk project ini.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {personaList.map((persona) => {
                const asset = persona.referenceImageAssetId ? assetMap.get(persona.referenceImageAssetId) : undefined;
                const descPreview = persona.description.length > 120
                  ? persona.description.slice(0, 120) + '...'
                  : persona.description;

                return (
                  <div key={persona.id} className="flex gap-4 bg-ph-bg border border-ph-border rounded-lg p-4 items-start">
                    {asset ? (
                      <img
                        src={asset.cloudinaryUrl}
                        alt={persona.name}
                        className="w-14 h-14 rounded-[6px] object-cover flex-shrink-0 border border-ph-border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-[6px] border border-ph-border flex items-center justify-center flex-shrink-0 bg-ph-surface">
                        <ImageIcon size={18} className="text-ph-muted" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-display text-base font-bold text-ph-text">{persona.name}</div>
                      <div className="font-sans text-xs text-ph-muted mt-1 leading-[1.5]">{descPreview}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Research Reports section */}
        <div className="bg-ph-surface border border-ph-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase">Research Reports</h2>
            <ResearchForm projectId={projectId} />
          </div>

          {researchList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-ph-border rounded-lg text-center">
              <div className="font-display text-base font-bold tracking-[0.06em] text-ph-muted mb-1">BELUM ADA RISET</div>
              <div className="font-sans text-xs text-ph-muted">Generate riset YouTube untuk mendapatkan wawasan konten.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {researchList.map((report) => {
                const rf = report.rawFindings as {
                  query?: string;
                  synthesis?: { summary?: string; patterns?: string[]; contentGapSuggestions?: string[]; recommendedHookStyles?: string[] };
                } | null;
                const synthesis = rf?.synthesis;

                return (
                  <div key={report.id} className="bg-ph-bg border border-ph-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[9px] text-ph-teal border border-ph-teal/30 rounded-[3px] px-[6px] py-[2px] flex items-center gap-1">
                          <Youtube size={10} /> YOUTUBE
                        </span>
                        {report.isStale ? (
                          <span className="font-mono text-[9px] text-ph-amber border border-ph-amber/30 rounded-[3px] px-[6px] py-[2px] bg-[rgba(242,169,59,0.07)]">STALE</span>
                        ) : (
                          <span className="font-mono text-[9px] text-ph-teal border border-ph-teal/30 rounded-[3px] px-[6px] py-[2px]">FRESH</span>
                        )}
                      </div>
                      <span className="font-mono text-[9px] text-ph-muted flex items-center gap-1 flex-shrink-0">
                        <CalendarDays size={10} />
                        {new Date(report.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    {rf?.query && (
                      <div className="font-mono text-[10px] text-ph-muted mb-2">
                        Query: &quot;{rf.query}&quot;
                      </div>
                    )}

                    {synthesis?.summary && (
                      <div className="font-sans text-sm text-ph-text leading-[1.6] mb-3">{synthesis.summary}</div>
                    )}

                    {synthesis?.patterns && synthesis.patterns.length > 0 && (
                      <div className="mb-3">
                        <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mb-1.5 flex items-center gap-1">
                          <Lightbulb size={10} /> POLA KONTEN
                        </div>
                        <ul className="list-disc list-inside flex flex-col gap-1">
                          {synthesis.patterns.map((p, i) => (
                            <li key={i} className="font-sans text-xs text-ph-text leading-[1.5]">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {synthesis?.contentGapSuggestions && synthesis.contentGapSuggestions.length > 0 && (
                      <div className="mb-3">
                        <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mb-1.5">IDE KONTEN (GAP)</div>
                        <ul className="list-disc list-inside flex flex-col gap-1">
                          {synthesis.contentGapSuggestions.map((p, i) => (
                            <li key={i} className="font-sans text-xs text-ph-text leading-[1.5]">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {synthesis?.recommendedHookStyles && synthesis.recommendedHookStyles.length > 0 && (
                      <div>
                        <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mb-1.5">HOOK REKOMENDASI</div>
                        <ul className="list-disc list-inside flex flex-col gap-1">
                          {synthesis.recommendedHookStyles.map((p, i) => (
                            <li key={i} className="font-sans text-xs text-ph-text leading-[1.5]">{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Productions section */}
        <div className="bg-ph-surface border border-ph-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase">Productions</h2>
            <ProductionForm projectId={projectId} presets={presetList} />
          </div>

          {productionList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-ph-border rounded-lg text-center">
              <div className="font-display text-base font-bold tracking-[0.06em] text-ph-muted mb-1">BELUM ADA PRODUCTION</div>
              <div className="font-sans text-xs text-ph-muted">Buat production untuk project ini berdasarkan format preset.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {productionList.map((prod) => (
                <Link
                  key={prod.id}
                  href={`/projects/${projectId}/productions/${prod.id}`}
                  className="flex items-center gap-4 bg-ph-bg border border-ph-border rounded-lg p-4 no-underline transition-all duration-150 hover:border-ph-teal hover:shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-base font-bold text-ph-text">{prod.presetName ?? `#${prod.formatPresetId}`}</div>
                    <div className="font-mono text-[10px] text-ph-muted mt-0.5">{prod.presetRatio} · {prod.platform}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    {prod.hasCharacter && (
                      <span className="font-mono text-[9px] text-ph-teal border border-ph-teal/30 rounded-[3px] px-[6px] py-[2px]">CHARACTER</span>
                    )}
                    <span className="font-mono text-[9px] text-ph-muted">{prod.voiceMode === 'voiceover_only' ? 'VOICEOVER' : prod.voiceMode === 'on_camera_dialogue' ? 'ON CAMERA' : 'NO AUDIO'}</span>
                    <span className="font-mono text-[9px] px-[6px] py-[2px] rounded-[3px] border text-ph-amber border-ph-amber/30 bg-[rgba(242,169,59,0.07)] uppercase">{prod.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
