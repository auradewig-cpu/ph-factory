'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/lib/actions/project';
import { NICHE_OPTIONS, PLATFORM_OPTIONS } from '@/lib/validation/project';
import { Plus, X } from 'lucide-react';

export function ProjectForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('');
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [language, setLanguage] = useState<'id' | 'en'>('id');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePlatform = (p: string) => {
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createProject({ name, niche, targetPlatforms: platforms, language });
      setName('');
      setNiche('');
      setPlatforms([]);
      setLanguage('id');
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal membuat project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-[18px] py-[9px] bg-ph-amber text-ph-bg font-display text-[15px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-ph-amber-dark outline-offset-2 focus-visible:outline-2 focus-visible:outline-ph-amber"
      >
        <Plus size={15} /> NEW PROJECT
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
          <div className="bg-ph-surface border border-ph-border rounded-lg w-full max-w-[420px] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between px-5 py-[14px] border-b border-ph-border">
              <span className="font-display text-base font-bold tracking-[0.12em] text-ph-text">BUAT PROJECT BARU</span>
              <button
                onClick={() => setOpen(false)}
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
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mindset Pagi"
                  required
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">NICHE</label>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  required
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1 appearance-none"
                >
                  <option value="">Pilih niche...</option>
                  {NICHE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">PLATFORM TARGET</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORM_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => togglePlatform(o.value)}
                      className={`px-3 py-1.5 rounded-[4px] border text-xs font-sans cursor-pointer transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ph-amber ${
                        platforms.includes(o.value)
                          ? 'border-ph-amber bg-[rgba(242,169,59,0.07)] text-ph-amber'
                          : 'border-ph-border text-ph-muted bg-transparent hover:border-ph-muted'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">BAHASA</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'id' | 'en')}
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1 appearance-none"
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

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
                  disabled={loading}
                  className="px-4 py-[9px] bg-ph-amber text-ph-bg font-display text-[13px] font-bold tracking-[0.1em] rounded-[4px] border-none cursor-pointer disabled:opacity-70 hover:bg-ph-amber-dark focus-visible:outline-2 focus-visible:outline-ph-amber"
                >
                  {loading ? 'MENYIMPAN...' : 'BUAT PROJECT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
