'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPersona } from '@/lib/actions/persona';
import { GENDER_OPTIONS, ETHNICITY_OPTIONS, STYLE_OPTIONS } from '@/lib/validation/persona';
import { Plus, X } from 'lucide-react';

interface Props {
  projectId: number;
}

export function PersonaForm({ projectId }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await createPersona(projectId, formData);
      form.reset();
      setOpen(false);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal menyimpan persona');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-[14px] py-[7px] bg-ph-amber text-ph-bg font-display text-[13px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-ph-amber-dark outline-offset-2 focus-visible:outline-2 focus-visible:outline-ph-amber"
      >
        <Plus size={14} /> TAMBAH PERSONA
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
          <div className="bg-ph-surface border border-ph-border rounded-lg w-full max-w-[480px] shadow-[0_16px_48px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-[14px] border-b border-ph-border sticky top-0 bg-ph-surface z-10">
              <span className="font-display text-base font-bold tracking-[0.12em] text-ph-text">TAMBAH PERSONA</span>
              <button
                onClick={() => setOpen(false)}
                className="bg-transparent border-none cursor-pointer text-ph-muted p-1 rounded-[4px] hover:text-ph-text focus-visible:outline-2 focus-visible:outline-ph-amber"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">NAMA PERSONA</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Sarah - Host Utama"
                  required
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">JENIS KELAMIN</label>
                <div className="flex gap-2">
                  {GENDER_OPTIONS.map((o) => (
                    <label
                      key={o.value}
                      className="flex items-center gap-2 px-3 py-2 border border-ph-border rounded-[4px] cursor-pointer font-sans text-xs text-ph-text hover:border-ph-muted has-[:checked]:border-ph-amber has-[:checked]:bg-[rgba(242,169,59,0.07)] transition-colors"
                    >
                      <input type="radio" name="gender" value={o.value} required className="accent-ph-amber" />
                      {o.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">USIA</label>
                  <input
                    type="number"
                    name="age"
                    min={18}
                    max={65}
                    required
                    className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">STYLE</label>
                  <select
                    name="style"
                    required
                    className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1 appearance-none"
                  >
                    <option value="">Pilih style...</option>
                    {STYLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">ETNIK</label>
                <select
                  name="ethnicity"
                  required
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1 appearance-none"
                >
                  <option value="">Pilih etnik...</option>
                  {ETHNICITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">CIRI FISIK <span className="text-ph-muted font-normal">(opsional)</span></label>
                <input
                  type="text"
                  name="physicalTrait"
                  placeholder="e.g. rambut pendek, berkacamata, tinggi 170cm"
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">FOTO REFERENSI <span className="text-ph-muted font-normal">(opsional, maks 10MB)</span></label>
                <input
                  type="file"
                  name="referenceImage"
                  accept="image/*"
                  className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[9px] text-ph-text font-sans text-sm file:mr-3 file:py-1 file:px-3 file:rounded-[4px] file:border file:border-ph-border file:bg-ph-surface file:text-ph-text file:text-xs file:cursor-pointer outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
                />
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
