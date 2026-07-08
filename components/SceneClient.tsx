'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateScenes } from '@/lib/actions/scene';
import { Copy, Sparkles, Check } from 'lucide-react';

interface Props {
  productionId: number;
}

export function GenerateScenesForm({ productionId }: Props) {
  const router = useRouter();
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await generateScenes(productionId, count);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal generate scene');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] text-ph-muted tracking-[0.06em]">JUMLAH SCENE (2-20)</label>
        <input
          type="number"
          min={2}
          max={20}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-24 bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[9px] text-ph-text font-mono text-sm outline-none focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-1.5 px-[14px] py-[9px] bg-ph-amber text-ph-bg font-display text-[13px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer transition-colors duration-150 hover:bg-ph-amber-dark disabled:opacity-70 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ph-amber"
      >
        <Sparkles size={14} /> {loading ? 'GENERATING...' : 'GENERATE'}
      </button>
      {error && <span className="font-mono text-[11px] text-ph-error">{error}</span>}
    </form>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 bg-transparent border border-ph-border rounded-[3px] px-[6px] py-[2px] cursor-pointer text-ph-muted hover:text-ph-text hover:border-ph-muted transition-colors font-mono text-[9px]"
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? 'COPIED' : 'COPY'}
    </button>
  );
}
