'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchMusic, attachMusicToScene } from '@/lib/actions/music';
import { Search, Loader2, Music, X, Play, Square } from 'lucide-react';

interface TrackResult {
  externalId: string;
  name: string;
  artistName: string;
  licenseCcurl: string;
  licenseType: string;
  downloadUrl: string;
  previewUrl: string;
  duration: number;
  source: 'jamendo' | 'freesound';
}

interface Props {
  sceneId: number;
  attachedTrack?: { name: string; artistName: string } | null;
}

const LICENSE_BADGE: Record<string, { label: string; color: string }> = {
  cc0: { label: 'CC0', color: 'text-ph-teal border-ph-teal/30' },
  'by-sa': { label: 'BY-SA', color: 'text-ph-amber border-ph-amber/30' },
  by: { label: 'CC-BY', color: 'text-ph-teal border-ph-teal/30' },
};

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MusicPicker({ sceneId, attachedTrack }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState<'jamendo' | 'freesound'>('jamendo');
  const [results, setResults] = useState<TrackResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [attaching, setAttaching] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [playing, setPlaying] = useState<string | null>(null);

  const handleSearch = async () => {
    if (query.length < 2) return;
    setError('');
    setLoading(true);
    setResults([]);
    try {
      const data = await searchMusic(query, source);
      setResults(data as TrackResult[]);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal mencari musik');
    } finally {
      setLoading(false);
    }
  };

  const handleAttach = async (track: TrackResult, index: number) => {
    setAttaching(index);
    setError('');
    try {
      await attachMusicToScene(sceneId, {
        source: track.source,
        externalId: track.externalId,
        name: track.name,
        artistName: track.artistName,
        licenseCcurl: track.licenseCcurl,
        licenseType: track.licenseType,
        downloadUrl: track.downloadUrl,
      });
      router.refresh();
      setOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Gagal memasang musik');
    } finally {
      setAttaching(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 border border-ph-border rounded-[3px] px-[6px] py-[2px] cursor-pointer text-ph-muted hover:text-ph-text hover:border-ph-muted transition-colors font-mono text-[9px]"
      >
        <Music size={10} />
        {attachedTrack ? 'GANTI' : 'PILIH MUSIK'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
          <div className="bg-ph-surface border border-ph-border rounded-lg w-full max-w-[560px] shadow-[0_16px_48px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-[14px] border-b border-ph-border sticky top-0 bg-ph-surface z-10">
              <span className="font-display text-base font-bold tracking-[0.12em] text-ph-text">PILIH MUSIK / SFX</span>
              <button
                onClick={() => setOpen(false)}
                className="bg-transparent border-none cursor-pointer text-ph-muted p-1 rounded-[4px] hover:text-ph-text focus-visible:outline-2 focus-visible:outline-ph-amber"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Cari musik atau SFX..."
                  className="flex-1 bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[9px] text-ph-text font-sans text-sm outline-none focus:border-ph-amber"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => setSource('jamendo')}
                    className={`px-3 py-[9px] rounded-[4px] font-mono text-[10px] cursor-pointer border transition-colors ${
                      source === 'jamendo'
                        ? 'bg-ph-amber text-ph-bg border-ph-amber font-bold'
                        : 'bg-transparent text-ph-muted border-ph-border hover:text-ph-text'
                    }`}
                  >
                    JAMENDO
                  </button>
                  <button
                    onClick={() => setSource('freesound')}
                    className={`px-3 py-[9px] rounded-[4px] font-mono text-[10px] cursor-pointer border transition-colors ${
                      source === 'freesound'
                        ? 'bg-ph-amber text-ph-bg border-ph-amber font-bold'
                        : 'bg-transparent text-ph-muted border-ph-border hover:text-ph-text'
                    }`}
                  >
                    FREESOUND
                  </button>
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || query.length < 2}
                  className="flex items-center gap-1.5 px-[12px] py-[9px] bg-ph-amber text-ph-bg font-display text-[12px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer hover:bg-ph-amber-dark disabled:opacity-70 transition-colors flex-shrink-0"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                  CARI
                </button>
              </div>

              {error && (
                <div className="text-ph-error font-mono text-[11px] px-[10px] py-2 bg-[rgba(212,91,78,0.1)] border border-[rgba(212,91,78,0.3)] rounded-[4px]">{error}</div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-8 text-ph-muted font-mono text-[11px]">
                  <Loader2 size={14} className="animate-spin mr-2" /> MENCARI...
                </div>
              )}

              {!loading && results.length === 0 && query && !error && (
                <div className="text-center py-8 text-ph-muted font-mono text-[11px]">
                  TIDAK ADA HASIL AMAN — semua track di sumber ini mungkin pakai lisensi non-komersial.
                </div>
              )}

              {results.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="text-ph-muted font-mono text-[9px] tracking-[0.06em]">
                    {results.length} TRACK AMAN DITEMUKAN
                  </div>
                  {results.map((track, i) => {
                    const badge = LICENSE_BADGE[track.licenseType];
                    return (
                      <div key={`${track.source}-${track.externalId}`} className="bg-ph-bg border border-ph-border rounded-lg p-3 flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (playing === `${i}`) { setPlaying(null); return; }
                            setPlaying(`${i}`);
                          }}
                          disabled={!track.previewUrl}
                          className="flex-shrink-0 w-8 h-8 rounded-[4px] bg-ph-surface border border-ph-border flex items-center justify-center cursor-pointer hover:bg-ph-muted/20 transition-colors disabled:opacity-40"
                          title={track.previewUrl ? 'Preview' : 'No preview'}
                        >
                          {playing === `${i}` ? <Square size={12} className="text-ph-error" /> : <Play size={12} className="text-ph-text" />}
                        </button>
                        {playing === `${i}` && track.previewUrl && (
                          <audio src={track.previewUrl} autoPlay onEnded={() => setPlaying(null)} className="hidden" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-sans text-xs text-ph-text truncate">{track.name}</div>
                          <div className="font-mono text-[9px] text-ph-muted mt-0.5">
                            {track.artistName || 'Unknown'} · {formatDuration(track.duration)}
                          </div>
                        </div>
                        {badge && (
                          <span className={`font-mono text-[9px] border rounded-[3px] px-[6px] py-[2px] ${badge.color}`}>{badge.label}</span>
                        )}
                        <button
                          onClick={() => handleAttach(track, i)}
                          disabled={attaching === i}
                          className="flex items-center gap-1 px-[10px] py-[5px] bg-ph-amber text-ph-bg font-display text-[11px] font-bold tracking-[0.1em] rounded-[4px] cursor-pointer hover:bg-ph-amber-dark disabled:opacity-70 transition-colors flex-shrink-0"
                        >
                          {attaching === i ? <Loader2 size={10} className="animate-spin" /> : null}
                          PAKAI
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
