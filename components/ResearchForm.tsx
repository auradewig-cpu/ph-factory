'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateResearchReport, generateSocialResearchReport } from '@/lib/actions/research';
import { Search, Loader2 } from 'lucide-react';

interface Props {
  projectId: number;
}

const PLATFORMS = [
  { id: 'youtube', label: 'YouTube' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
] as const;

const LOADING_LABEL: Record<string, string> = {
  youtube: 'MENGANALISIS YOUTUBE...',
  tiktok: 'MENCARI TREN TIKTOK...',
  instagram: 'MENCARI TREN INSTAGRAM...',
  facebook: 'MENCARI TREN FACEBOOK...',
};

export function ResearchForm({ projectId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [platform, setPlatform] = useState('youtube');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const query = (formData.get('query') as string) || '';

    try {
      if (platform === 'youtube') {
        await generateResearchReport(projectId, query);
      } else {
        await generateSocialResearchReport(projectId, query, platform as 'tiktok' | 'instagram' | 'facebook');
      }
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlatform(p.id)}
            disabled={loading}
            className={`px-3 py-[6px] rounded-[4px] font-mono text-[10px] cursor-pointer border transition-colors disabled:opacity-50 ${
              platform === p.id
                ? 'bg-ph-amber text-ph-bg border-ph-amber font-bold'
                : 'bg-transparent text-ph-muted border-ph-border hover:text-ph-text'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-start gap-3">
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
            <><Loader2 size={14} className="animate-spin" /> {LOADING_LABEL[platform]}</>
          ) : (
            <><Search size={14} /> GENERATE RESEARCH</>
          )}
        </button>
      </div>
    </form>
  );
}
