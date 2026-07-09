'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { attachChainFrame } from '@/lib/actions/chain';
import { ImageIcon, Upload, Loader2 } from 'lucide-react';

interface Props {
  sceneId: number;
  continuityType: string;
  chainFrameUrl: string | null;
}

export function ChainFrameUpload({ sceneId, continuityType, chainFrameUrl }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (continuityType !== 'continuous') return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB');
      e.target.value = '';
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      e.target.value = '';
      return;
    }

    setLoading(true);
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      await attachChainFrame(sceneId, buffer, file.type);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal upload frame');
    } finally {
      setLoading(false);
    }
  };

  if (chainFrameUrl) {
    return (
      <div className="flex items-center gap-3 bg-ph-bg border border-ph-border rounded-lg p-3">
        <img
          src={chainFrameUrl}
          alt="Reference frame"
          className="w-[80px] h-[80px] object-cover rounded-[4px] border border-ph-border flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[9px] text-ph-muted tracking-[0.06em] uppercase">Reference Frame</div>
          <div className="font-sans text-[10px] text-ph-text mt-0.5 truncate">
            Frame terakhir scene sebelumnya — gunakan sebagai referensi visual continuity
          </div>
        </div>
        <label className="flex items-center gap-1 px-[8px] py-[4px] bg-transparent border border-ph-border rounded-[3px] cursor-pointer text-ph-muted hover:text-ph-text hover:border-ph-muted transition-colors font-mono text-[9px] flex-shrink-0">
          <Upload size={10} /> GANTI
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={loading} />
        </label>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-ph-bg border border-dashed border-ph-border rounded-lg p-3">
      <div className="w-[80px] h-[80px] rounded-[4px] border border-ph-border flex items-center justify-center flex-shrink-0 bg-ph-surface">
        <ImageIcon size={20} className="text-ph-muted" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[9px] text-ph-muted tracking-[0.06em] uppercase">Reference Frame</div>
        <div className="font-sans text-[10px] text-ph-text mt-0.5">
          Upload frame terakhir scene sebelumnya untuk kontinuitas visual
        </div>
        {error && (
          <div className="text-ph-error font-mono text-[10px] mt-1">{error}</div>
        )}
      </div>
      <label className="flex items-center gap-1 px-[10px] py-[5px] bg-ph-amber text-ph-bg font-display text-[10px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer hover:bg-ph-amber-dark transition-colors flex-shrink-0">
        {loading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
        {loading ? 'UPLOADING...' : 'UPLOAD FRAME'}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={loading} />
      </label>
    </div>
  );
}
