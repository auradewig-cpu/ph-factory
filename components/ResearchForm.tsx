'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateResearchReport } from '@/lib/actions/research';
import { Search, Loader2 } from 'lucide-react';

interface Props {
  projectId: number;
}

export function ResearchForm({ projectId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const query = (formData.get('query') as string) || '';

    try {
      await generateResearchReport(projectId, query);
      form.reset();
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal menjalankan riset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      <div className="flex-1 flex flex-col gap-1">
        <input
          type="text"
          name="query"
          placeholder="Kata kunci riset (e.g. gadget review, resep masakan)"
          required
          disabled={loading}
          minLength={3}
          className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[9px] text-ph-text font-sans text-sm outline-none w-full focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1 disabled:opacity-50"
        />
        {error && (
          <div className="text-ph-error font-mono text-[11px] mt-1">{error}</div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-1.5 px-[14px] py-[9px] bg-ph-amber text-ph-bg font-display text-[13px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-ph-amber-dark disabled:opacity-70 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ph-amber flex-shrink-0"
      >
        {loading ? (
          <><Loader2 size={14} className="animate-spin" /> MENGANALISIS YOUTUBE...</>
        ) : (
          <><Search size={14} /> GENERATE RESEARCH</>
        )}
      </button>
    </form>
  );
}
