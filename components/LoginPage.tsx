'use client';

import { useState } from 'react';
import { AspectRatioChip } from './AspectRatioChip';

interface Props {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (email === 'admin@ph.com' && password === 'ph123') {
        onLogin();
      } else {
        setError('Credential tidak valid. Gunakan demo credentials di bawah.');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-ph-bg font-sans">
      {/* Scanline overlay — login screen only */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
          zIndex: 1,
        }}
      />

      {/* Build info */}
      <div className="absolute top-5 left-6 z-[2] font-mono text-[10px] text-ph-muted tracking-[0.1em]">
        PHF v2.1.0 · BUILD 20260708
      </div>

      {/* System status */}
      <div className="absolute top-5 right-6 z-[2] flex items-center gap-2">
        <div className="w-[6px] h-[6px] rounded-full bg-ph-teal shadow-[0_0_6px_rgba(47,166,160,0.8)]" />
        <span className="font-mono text-[10px] text-ph-muted tracking-[0.1em]">SYSTEM ONLINE</span>
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-[360px] mx-4 bg-ph-surface border border-ph-border rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-[2]">
        {/* Bezel header */}
        <div className="flex items-center gap-2 px-4 py-[10px] border-b border-ph-border">
          <div className="w-2 h-2 rounded-full bg-ph-error" />
          <div className="w-2 h-2 rounded-full bg-ph-amber" />
          <div className="w-2 h-2 rounded-full bg-ph-teal" />
          <span className="ml-2 font-mono text-[9px] text-ph-muted tracking-[0.12em]">AUTH TERMINAL — SECURE SESSION</span>
        </div>

        <div className="px-8 py-8 pb-7">
          {/* Wordmark */}
          <div className="text-center mb-8">
            <div className="font-display text-[40px] font-bold tracking-[0.18em] text-ph-text leading-none">PH FACTORY</div>
            <div className="font-mono text-[9px] text-ph-muted tracking-[0.25em] mt-2">PRODUCTION MANAGEMENT SYSTEM</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ph.com"
                required
                className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none w-full box-border transition-[border-color,outline] duration-150 focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-sans text-[11px] font-medium text-ph-muted tracking-[0.1em]">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-ph-bg border border-ph-border rounded-[4px] px-3 py-[10px] text-ph-text font-sans text-sm outline-none w-full box-border transition-[border-color,outline] duration-150 focus:border-ph-amber focus:outline-2 focus:outline-ph-amber focus:outline-offset-1"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-[10px] py-2 bg-[rgba(212,91,78,0.1)] border border-[rgba(212,91,78,0.3)] rounded-[4px]">
                <span className="text-ph-error text-xs">⚠</span>
                <span className="font-mono text-[11px] text-ph-error">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-ph-amber text-ph-bg font-display text-[17px] font-bold tracking-[0.18em] border-none rounded-[4px] py-3 cursor-pointer transition-[background,transform] duration-150 mt-1 outline-offset-2 focus-visible:outline-2 focus-visible:outline-ph-amber disabled:opacity-70 disabled:cursor-not-allowed hover:bg-ph-amber-dark"
            >
              {loading ? 'AUTHENTICATING...' : 'MASUK'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5 px-3 py-[10px] bg-ph-bg border border-ph-border rounded-[4px]">
            <div className="font-mono text-[9px] text-ph-muted tracking-[0.15em] mb-[5px]">DEMO CREDENTIALS</div>
            <div className="font-mono text-xs text-ph-text">
              admin@ph.com
              <span className="text-ph-border mx-[6px]">/</span>
              ph123
            </div>
          </div>
        </div>

        {/* Aspect ratio chip — bottom right */}
        <div className="absolute bottom-4 right-4 opacity-60">
          <AspectRatioChip ratio="16:9" size="sm" decorative />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 z-[2] font-mono text-[9px] text-ph-muted tracking-[0.08em] text-center">
        © 2026 PH FACTORY · INTERNAL USE ONLY · ALL SESSIONS LOGGED
      </div>
    </div>
  );
}
