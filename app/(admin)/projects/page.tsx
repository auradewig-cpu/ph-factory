import { listProjects } from '@/lib/actions/project';
import { ProjectForm } from '@/components/ProjectForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 border border-dashed border-ph-border rounded-lg text-center">
      <div className="mb-6 opacity-40">
        {[40, 56, 40].map((w, i) => (
          <div key={i} className="h-[2px] bg-ph-muted rounded-[1px] mx-auto my-[6px]" style={{ width: w }} />
        ))}
        <div className="w-6 h-6 border-[1.5px] border-ph-muted rounded-[2px] mx-auto mt-3" />
      </div>
      <div className="font-display text-[22px] font-bold tracking-[0.06em] text-ph-text mb-2">BELUM ADA PROJECT</div>
      <div className="font-sans text-xs text-ph-muted max-w-[280px]">Mulai riset niche pertamamu dan buat project baru untuk memulai produksi konten.</div>
    </div>
  );
}

export default async function ProjectsPage() {
  const allProjects = await listProjects();

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="flex items-center justify-between px-7 py-5 border-b border-ph-border bg-ph-bg sticky top-0 z-10">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text leading-none">PROJECTS</h1>
          <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mt-1">{allProjects.length} total</div>
        </div>
        <ProjectForm />
      </div>

      <div className="px-7 py-6">
        {allProjects.length === 0 ? <EmptyState /> : (
          <div className="grid grid-cols-3 gap-3">
            {allProjects.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="bg-ph-surface border border-ph-border rounded-[6px] p-4 flex flex-col gap-3 transition-all duration-150 hover:border-ph-teal hover:shadow-sm hover:-translate-y-[1px] no-underline"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-ph-muted">#{p.id}</span>
                  <span className="font-mono text-[8px] text-ph-muted">
                    {new Date(p.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                <div>
                  <div className="font-display text-xl font-bold text-ph-text leading-tight">{p.name}</div>
                  <div className="font-sans text-xs text-ph-muted mt-0.5">{p.niche}</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {p.targetPlatforms.map((platform) => (
                    <span key={platform} className="font-mono text-[9px] text-ph-teal border border-ph-teal/30 rounded-[3px] px-[6px] py-[2px]">
                      {platform}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
