'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { AspectRatioChip } from './AspectRatioChip';
import type { Project } from './ProjectCard';

type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3';

const FORMATS: AspectRatio[] = ['16:9', '9:16', '1:1', '4:3'];
const NICHES = ['Self-Development', 'Kuliner', 'Teknologi', 'Fitness', 'Finansial', 'Music / Mood', 'Travel', 'Edukasi', 'Hiburan'];

interface Props {
  onClose: () => void;
  onAdd: (project: Project) => void;
}

export function NewProjectModal({ onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [formats, setFormats] = useState<AspectRatio[]>([]);
  const [error, setError] = useState('');

  const toggleFormat = (fmt: AspectRatio) => {
    setFormats((prev) => (prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama project harus diisi.');
      return;
    }
    if (formats.length === 0) {
      setError('Pilih minimal satu format target.');
      return;
    }
    const newProject: Project = {
      id: `PHX-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: name.trim(),
      niche: niche || 'General',
      formats: [...formats],
      research: 'fresh',
      scenes: { done: 0, total: 0 },
    };
    onAdd(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
      <div className="bg-ph-surface border border-ph-border rounded-lg w-full max-w-[420px] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between px-5 py-[14px] border-b border-ph-border">
          <span className="font-display text-base font-bold tracking-[0.12em] text-ph-text">BUAT PROJECT BARU</span>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-ph-muted p-1 rounded-[4px] hover:text-ph-text focus-visible:outline-2 focus-visible:outline-ph-amber"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">NAMA PROJECT</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="e.g. Mindset Pagi"
              className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">NICHE</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1 appearance-none"
            >
              <option value="">Pilih niche...</option>
              {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">FORMAT TARGET</label>
            <div className="flex gap-2">
              {FORMATS.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => toggleFormat(fmt)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-[4px] border cursor-pointer transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ph-amber ${
                    formats.includes(fmt)
                      ? 'border-ph-amber bg-[rgba(242,169,59,0.07)]'
                      : 'border-ph-border bg-transparent hover:border-ph-muted'
                  }`}
                >
                  <AspectRatioChip ratio={fmt} size="xs" />
                  <span className={`font-mono text-[9px] ${formats.includes(fmt) ? 'text-ph-amber' : 'text-ph-muted'}`}>{fmt}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-ph-error font-mono text-[11px] px-[10px] py-2 bg-[rgba(212,91,78,0.1)] border border-[rgba(212,91,78,0.3)] rounded-[4px]">{error}</div>
          )}

          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-[9px] bg-transparent border border-ph-border rounded-[4px] text-ph-muted font-sans text-xs cursor-pointer hover:text-ph-text focus-visible:outline-2 focus-visible:outline-ph-amber"
            >
              BATAL
            </button>
            <button
              type="submit"
              className="px-4 py-[9px] bg-ph-amber text-ph-bg font-display text-[13px] font-bold tracking-[0.1em] rounded-[4px] border-none cursor-pointer hover:bg-ph-amber-dark focus-visible:outline-2 focus-visible:outline-ph-amber"
            >
              BUAT PROJECT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
