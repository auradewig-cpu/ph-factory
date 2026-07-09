import Link from 'next/link';
import { listAllProductions } from '@/lib/actions/production';
import { Film } from 'lucide-react';

export const dynamic = 'force-dynamic';

const VOICE_LABEL: Record<string, string> = { voiceover_only: 'Voiceover', on_camera_dialogue: 'On Camera', none: 'No Audio' };

export default async function DirectorPage() {
  const productions = await listAllProductions();

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="px-7 py-5 border-b border-ph-border sticky top-0 z-10 bg-ph-bg">
        <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text">DIRECTOR STUDIO</h1>
      </div>

      <div className="px-7 py-6 flex flex-col gap-4 max-w-4xl">
        {productions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-ph-border rounded-lg text-center">
            <Film size={32} className="text-ph-muted mb-3 opacity-40" />
            <div className="font-display text-base font-bold tracking-[0.06em] text-ph-muted mb-1">BELUM ADA PRODUCTION</div>
            <div className="font-sans text-xs text-ph-muted">Buat production baru dari halaman project.</div>
          </div>
        ) : (
          productions.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.projectId}/productions/${p.id}`}
              className="bg-ph-surface border border-ph-border rounded-lg p-4 flex items-center gap-4 no-underline transition-all duration-150 hover:border-ph-teal hover:shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="font-display text-base font-bold text-ph-text">{p.presetName ?? `Production #${p.id}`}</div>
                <div className="font-mono text-[10px] text-ph-muted mt-0.5">
                  {p.projectName} · {p.presetRatio} · {p.platform}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {p.hasCharacter && (
                  <span className="font-mono text-[9px] text-ph-teal border border-ph-teal/30 rounded-[3px] px-[6px] py-[2px]">CHARACTER</span>
                )}
                <span className="font-mono text-[9px] text-ph-muted">{VOICE_LABEL[p.voiceMode]}</span>
                <span className="font-mono text-[9px] px-[6px] py-[2px] rounded-[3px] border text-ph-amber border-ph-amber/30 bg-[rgba(242,169,59,0.07)] uppercase">{p.status}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
