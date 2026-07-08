'use client';

import { AspectRatioChip } from './AspectRatioChip';

type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9' | '2:3';

export interface Project {
  id: string;
  name: string;
  niche: string;
  formats: AspectRatio[];
  research: 'fresh' | 'stale';
  scenes: { done: number; total: number };
}

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const pct = project.scenes.total > 0 ? Math.round((project.scenes.done / project.scenes.total) * 100) : 0;

  return (
    <div className="bg-ph-surface border border-ph-border rounded-[6px] p-4 flex flex-col gap-3 cursor-pointer transition-all duration-150 hover:border-ph-teal hover:shadow-sm hover:-translate-y-[1px]">
      {/* Top row: ID + research badge */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-ph-muted">{project.id}</span>
        <div
          className="flex items-center gap-1 px-[6px] py-[2px] rounded-[3px] border"
          style={{
            background: project.research === 'fresh' ? 'rgba(47,166,160,0.12)' : 'rgba(242,169,59,0.12)',
            borderColor: project.research === 'fresh' ? 'rgba(47,166,160,0.3)' : 'rgba(242,169,59,0.3)',
          }}
        >
          <div className="w-[5px] h-[5px] rounded-full" style={{ background: project.research === 'fresh' ? '#2FA6A0' : '#F2A93B' }} />
          <span className="font-mono text-[8px] tracking-[0.06em]" style={{ color: project.research === 'fresh' ? '#2FA6A0' : '#F2A93B' }}>
            {project.research === 'fresh' ? 'FRESH' : 'STALE — PERLU REFRESH'}
          </span>
        </div>
      </div>

      {/* Name + niche */}
      <div>
        <div className="font-display text-xl font-bold text-ph-text leading-tight">{project.name}</div>
        <div className="font-sans text-xs text-ph-muted mt-0.5">{project.niche}</div>
      </div>

      {/* Aspect ratio chips */}
      <div className="flex gap-2">
        {project.formats.map((fmt) => (
          <AspectRatioChip key={fmt} ratio={fmt} size="xs" />
        ))}
      </div>

      {/* Scene progress */}
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="font-sans text-[10px] text-ph-muted">Scene</span>
          <span className="font-mono text-[10px] text-ph-text">{project.scenes.done}/{project.scenes.total}</span>
        </div>
        <div className="h-[3px] bg-ph-border rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${pct}%`,
              background: pct === 100 ? '#2FA6A0' : '#F2A93B',
            }}
          />
        </div>
      </div>
    </div>
  );
}
