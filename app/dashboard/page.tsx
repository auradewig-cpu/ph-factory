'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProjectCard, type Project } from '@/components/ProjectCard';
import { NewProjectModal } from '@/components/NewProjectModal';

const INITIAL_PROJECTS: Project[] = [
  { id: 'PHX-001', name: 'Mindset Pagi', niche: 'Self-Development', formats: ['9:16', '1:1'], research: 'fresh', scenes: { done: 8, total: 12 } },
  { id: 'PHX-002', name: 'Korean Street Food', niche: 'Kuliner', formats: ['16:9', '9:16'], research: 'stale', scenes: { done: 3, total: 20 } },
  { id: 'PHX-003', name: 'Tech Review 2026', niche: 'Teknologi', formats: ['16:9'], research: 'fresh', scenes: { done: 15, total: 15 } },
  { id: 'PHX-004', name: 'Home Gym Blueprint', niche: 'Fitness', formats: ['9:16', '16:9'], research: 'fresh', scenes: { done: 5, total: 10 } },
  { id: 'PHX-005', name: 'Crypto Deep Dive', niche: 'Finansial', formats: ['16:9', '1:1'], research: 'stale', scenes: { done: 0, total: 8 } },
  { id: 'PHX-006', name: 'Lofi Study Beats', niche: 'Music / Mood', formats: ['1:1'], research: 'fresh', scenes: { done: 2, total: 6 } },
];

const RESEARCH_REPORTS = [
  { id: 'R001', platform: 'TT', platformLabel: 'TikTok', platformColor: '#EDEAE3', title: 'Analisis Niche Self-Help Q2 2026', age: '3 hari lalu', status: 'fresh' as const },
  { id: 'R002', platform: 'YT', platformLabel: 'YouTube', platformColor: '#D45B4E', title: 'Riset Kompetitor Kuliner Viral', age: '1 minggu lalu', status: 'stale' as const },
  { id: 'R003', platform: 'IG', platformLabel: 'Instagram', platformColor: '#F2A93B', title: 'Format Optimal Reels 2026', age: '2 hari lalu', status: 'fresh' as const },
  { id: 'R004', platform: 'FB', platformLabel: 'Facebook', platformColor: '#2FA6A0', title: 'Demografi Audiens Fitness', age: '2 minggu lalu', status: 'stale' as const },
];

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 min-w-0 bg-ph-surface border border-ph-border rounded-[6px] p-4">
      <div className="font-mono text-[28px] text-ph-text leading-none mb-2 tracking-[-0.01em]">{value}</div>
      <div className="font-sans text-xs text-ph-muted">{label}</div>
    </div>
  );
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

function ResearchCard({ report }: { report: typeof RESEARCH_REPORTS[number] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-ph-surface border rounded-[6px] p-[14px_16px] min-w-[220px] max-w-[260px] flex-shrink-0 cursor-pointer transition-[border-color] duration-150 flex flex-col gap-2.5"
      style={{ borderColor: hovered ? '#2FA6A0' : '#2A2F37' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-[26px] h-[26px] rounded-[4px] bg-ph-bg border border-ph-border flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.02em]" style={{ color: report.platformColor }}>{report.platform}</span>
          </div>
          <span className="font-sans text-[11px] text-ph-muted">{report.platformLabel}</span>
        </div>
        <div
          className="px-[6px] py-[2px] rounded-[3px] border"
          style={{
            background: report.status === 'fresh' ? 'rgba(47,166,160,0.12)' : 'rgba(242,169,59,0.12)',
            borderColor: report.status === 'fresh' ? 'rgba(47,166,160,0.3)' : 'rgba(242,169,59,0.3)',
          }}
        >
          <span
            className="font-mono text-[8px] tracking-[0.06em]"
            style={{ color: report.status === 'fresh' ? '#2FA6A0' : '#F2A93B' }}
          >
            {report.status === 'fresh' ? 'FRESH' : 'STALE — PERLU REFRESH'}
          </span>
        </div>
      </div>
      <div className="font-sans text-xs text-ph-text leading-[1.4]">{report.title}</div>
      <div className="flex items-center gap-1">
        <span className="font-mono text-[10px] text-ph-muted">{report.age}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { label: 'Total Projects', value: String(projects.length).padStart(2, '0') },
    { label: 'Selesai Bulan Ini', value: '04' },
    { label: 'Research Reports Aktif', value: '07' },
    { label: 'Storage Terpakai', value: '2.4 GB' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="flex items-center justify-between px-7 py-5 border-b border-ph-border bg-ph-bg sticky top-0 z-10">
        <div>
          <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text leading-none">DASHBOARD</h1>
          <div className="font-mono text-[10px] text-ph-muted tracking-[0.06em] mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-[18px] py-[9px] bg-ph-amber text-ph-bg font-display text-[15px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-ph-amber-dark outline-offset-2 focus-visible:outline-2 focus-visible:outline-ph-amber"
        >
          <Plus size={15} /> NEW PROJECT
        </button>
      </div>

      <div className="px-7 py-6 flex flex-col gap-7">
        <div className="flex gap-3">
          {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-display text-[16px] font-bold tracking-[0.12em] text-ph-muted">PROJECTS</h2>
            <span className="font-mono text-[10px] text-ph-muted">{projects.length} total</span>
          </div>

          {projects.length === 0 ? <EmptyState /> : (
            <div className="grid grid-cols-3 gap-3">
              {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-display text-[16px] font-bold tracking-[0.12em] text-ph-muted">RECENT RESEARCH REPORTS</h2>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {RESEARCH_REPORTS.map((r) => <ResearchCard key={r.id} report={r} />)}
          </div>
        </div>
      </div>

      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onAdd={(p) => setProjects((prev) => [p, ...prev])} />}
    </div>
  );
}
