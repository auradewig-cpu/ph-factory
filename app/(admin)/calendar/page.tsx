import { db } from '@/lib/db/client';
import { productions, projects, formatPresets } from '@/lib/db/schema';
import { eq, desc, isNotNull, isNull } from 'drizzle-orm';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { ScheduleForm } from '@/components/ScheduleForm';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const rows = await db
    .select({
      id: productions.id,
      platform: productions.platform,
      status: productions.status,
      scheduledPublishAt: productions.scheduledPublishAt,
      presetName: formatPresets.name,
      presetRatio: formatPresets.ratio,
      projectName: projects.name,
      projectId: projects.id,
    })
    .from(productions)
    .leftJoin(formatPresets, eq(productions.formatPresetId, formatPresets.id))
    .leftJoin(projects, eq(productions.projectId, projects.id))
    .where(isNotNull(productions.scheduledPublishAt))
    .orderBy(desc(productions.scheduledPublishAt));

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="px-7 py-5 border-b border-ph-border sticky top-0 z-10 bg-ph-bg">
        <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text">CONTENT CALENDAR</h1>
      </div>

      <div className="px-7 py-6 flex flex-col gap-4 max-w-3xl">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-ph-border rounded-lg text-center">
            <CalendarDays size={32} className="text-ph-muted mb-3 opacity-40" />
            <div className="font-display text-base font-bold tracking-[0.06em] text-ph-muted mb-1">BELUM ADA JADWAL</div>
            <div className="font-sans text-xs text-ph-muted">Atur jadwal publish production dari halaman project.</div>
          </div>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="bg-ph-surface border border-ph-border rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Link href={`/projects/${r.projectId}/productions/${r.id}`} className="font-display text-base font-bold text-ph-text no-underline hover:text-ph-amber transition-colors">
                  {r.presetName ?? `Production #${r.id}`}
                </Link>
                <div className="font-mono text-[10px] text-ph-muted mt-0.5">{r.projectName} · {r.presetRatio} · {r.platform}</div>
              </div>
              <div className="flex items-center gap-3">
                {r.scheduledPublishAt && (
                  <span className="font-mono text-[10px] text-ph-teal flex items-center gap-1">
                    <CalendarDays size={10} />
                    {new Date(r.scheduledPublishAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                )}
                <ScheduleForm productionId={r.id} currentDate={r.scheduledPublishAt?.toISOString() ?? null} />
              </div>
            </div>
          ))
        )}

        <div className="mt-4">
          <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase mb-3">Semua Production (Atur Jadwal)</h2>
          <UnscheduledList />
        </div>
      </div>
    </div>
  );
}

async function UnscheduledList() {
  const onlyUnscheduled = await db
    .select({
      id: productions.id,
      platform: productions.platform,
      status: productions.status,
      presetName: formatPresets.name,
      presetRatio: formatPresets.ratio,
      projectName: projects.name,
      projectId: projects.id,
    })
    .from(productions)
    .leftJoin(formatPresets, eq(productions.formatPresetId, formatPresets.id))
    .leftJoin(projects, eq(productions.projectId, projects.id))
    .where(isNull(productions.scheduledPublishAt))
    .orderBy(desc(productions.createdAt));

  if (onlyUnscheduled.length === 0) {
    return <div className="font-sans text-xs text-ph-muted">Semua production sudah terjadwal.</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {onlyUnscheduled.map((r) => (
        <div key={r.id} className="bg-ph-surface border border-ph-border rounded-lg p-3 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-sans text-xs text-ph-text">{r.presetName ?? `Production #${r.id}`}</div>
            <div className="font-mono text-[9px] text-ph-muted">{r.projectName} · {r.presetRatio} · {r.platform}</div>
          </div>
          <ScheduleForm productionId={r.id} currentDate={null} />
        </div>
      ))}
    </div>
  );
}
