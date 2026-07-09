import { db } from '@/lib/db/client';
import { projects, productions, scenes } from '@/lib/db/schema';
import { count, eq, sql, desc } from 'drizzle-orm';
import { cloudinary } from '@/lib/cloudinary/client';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStorageUsage(): Promise<string> {
  try {
    const usage = await cloudinary.api.usage();
    const bytes = usage?.storage?.usage as number | undefined;
    if (typeof bytes === 'number' && bytes > 0) {
      return (bytes / 1024 / 1024 / 1024).toFixed(2) + ' GB';
    }
  } catch {
    // Cloudinary API gagal — tidak perlu crash halaman
  }
  return '—';
}

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

export default async function DashboardPage() {
  const [[{ count: totalProjects }], [{ count: totalProductions }], [{ count: completedProductions }], storageUsed] = await Promise.all([
    db.select({ count: count() }).from(projects),
    db.select({ count: count() }).from(productions),
    db.select({ count: count() }).from(productions).where(eq(productions.status, 'completed')),
    getStorageUsage(),
  ]);

  const recentProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      niche: projects.niche,
      targetPlatforms: projects.targetPlatforms,
      createdAt: projects.createdAt,
      sceneCount: sql<number>`coalesce((
        select count(*)::int from ${scenes}
        inner join ${productions} on ${productions.id} = ${scenes.productionId}
        where ${productions.projectId} = ${projects.id}
      ), 0)`,
    })
    .from(projects)
    .orderBy(desc(projects.createdAt))
    .limit(6);

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="flex items-center justify-between px-7 py-5 border-b border-ph-border bg-ph-bg sticky top-0 z-10">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text leading-none">DASHBOARD</h1>
          <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-1.5 px-[18px] py-[9px] bg-ph-amber text-ph-bg font-display text-[15px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-ph-amber-dark outline-offset-2 focus-visible:outline-2 focus-visible:outline-ph-amber no-underline"
        >
          <Plus size={15} /> NEW PROJECT
        </Link>
      </div>

      <div className="px-7 py-6 flex flex-col gap-7">
        {/* Stats */}
        <div className="flex gap-3">
          <StatCard label="Total Projects" value={String(totalProjects).padStart(2, '0')} />
          <StatCard label="Total Productions" value={String(totalProductions).padStart(2, '0')} />
          <StatCard label="Production Selesai" value={String(completedProductions).padStart(2, '0')} />
          <StatCard label="Storage Terpakai" value={storageUsed} />
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-display text-[16px] font-bold tracking-[0.12em] text-ph-muted">PROJECTS</h2>
            <span className="font-mono text-[10px] text-ph-muted">{totalProjects} total</span>
          </div>

          {recentProjects.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-3 gap-3">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="bg-ph-surface border border-ph-border rounded-[6px] p-4 flex flex-col gap-3 transition-all duration-150 hover:border-ph-teal hover:shadow-sm hover:-translate-y-[1px] no-underline"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ph-muted">#{p.id}</span>
                    <span className="font-mono text-[10px] text-ph-text">{p.sceneCount} scene</span>
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

        {/* Research placeholder */}
        <div className="bg-ph-surface border border-ph-border rounded-lg p-5">
          <h2 className="font-display text-[16px] font-bold tracking-[0.12em] text-ph-muted mb-3">RECENT RESEARCH REPORTS</h2>
          <div className="flex flex-col items-center justify-center py-8 border border-dashed border-ph-border rounded-lg text-center">
            <div className="font-display text-base font-bold tracking-[0.06em] text-ph-muted mb-1">Research Engine belum tersedia</div>
            <div className="font-sans text-xs text-ph-muted">Fitur riset niche/tren akan datang di fase berikutnya.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-0 bg-ph-surface border border-ph-border rounded-[6px] p-4">
      <div className="font-mono text-[28px] text-ph-text leading-none mb-2 tracking-[-0.01em]">{value}</div>
      <div className="font-sans text-xs text-ph-muted">{label}</div>
    </div>
  );
}
