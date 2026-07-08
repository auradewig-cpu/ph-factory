'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduction } from '@/lib/actions/production';
import { VOICE_MODE_OPTIONS } from '@/lib/validation/production';
import { Plus, X } from 'lucide-react';

interface FormatPreset {
  id: number;
  name: string;
  ratio: string;
}

interface Props {
  projectId: number;
  presets: FormatPreset[];
}

export function ProductionForm({ projectId, presets }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await createProduction(projectId, formData);
      form.reset();
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal membuat production');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-[14px] py-[7px] bg-ph-amber text-ph-bg font-display text-[13px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-ph-amber-dark outline-offset-2 focus-visible:outline-2 focus-visible:outline-ph-amber"
      >
        <Plus size={14} /> BUAT PRODUCTION
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
          <div className="bg-ph-surface border border-ph-border rounded-lg w-full max-w-[420px] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between px-5 py-[14px] border-b border-ph-border sticky top-0 bg-ph-surface z-10">
              <span className="font-display text-base font-bold tracking-[0.12em] text-ph-text">BUAT PRODUCTION</span>
              <button
                onClick={() => setOpen(false)}
                className="bg-transparent border-none cursor-pointer text-ph-muted p-1 rounded-[4px] hover:text-ph-text focus-visible:outline-2 focus-visible:outline-ph-amber"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">FORMAT PRESET</label>
                <select
                  name="formatPresetId"
                  required
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1 appearance-none"
                >
                  <option value="">Pilih format...</option>
                  {presets.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.ratio})</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">MODE SUARA</label>
                <select
                  name="voiceMode"
                  required
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1 appearance-none"
                >
                  <option value="">Pilih mode suara...</option>
                  {VOICE_MODE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasCharacter"
                  value="true"
                  className="accent-ph-amber w-4 h-4"
                />
                <span className="font-sans text-xs text-ph-text">Production ini punya karakter/persona</span>
              </label>

              {error && (
                <div className="text-ph-error font-mono text-[11px] px-[10px] py-2 bg-[rgba(212,91,78,0.1)] border border-[rgba(212,91,78,0.3)] rounded-[4px]">{error}</div>
              )}

              <div className="flex gap-3 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-[9px] bg-transparent border border-ph-border rounded-[4px] text-ph-muted font-sans text-xs cursor-pointer hover:text-ph-text focus-visible:outline-2 focus-visible:outline-ph-amber"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  className="px-4 py-[9px] bg-ph-amber text-ph-bg font-display text-[13px] font-bold tracking-[0.1em] rounded-[4px] border-none cursor-pointer hover:bg-ph-amber-dark focus-visible:outline-2 focus-visible:outline-ph-amber"
                >
                  SIMPAN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
