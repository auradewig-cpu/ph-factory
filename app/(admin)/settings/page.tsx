const packageJson = await import('@/package.json', { with: { type: 'json' } }).then(m => m.default).catch(() => null);
import { Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

const ENV_VARS = [
  'GEMINI_API_KEY',
  'GROQ_API_KEY',
  'CEREBRAS_API_KEY',
  'MISTRAL_API_KEY',
  'OPENROUTER_API_KEY',
  'YOUTUBE_API_KEY',
  'JAMENDO_CLIENT_ID',
  'FREESOUND_API_KEY',
  'POLLINATIONS_API_KEY',
] as const;

async function checkEnv(name: string): Promise<'ADA' | 'KOSONG'> {
  return (process.env[name]?.length ?? 0) > 0 ? 'ADA' : 'KOSONG';
}

export default async function SettingsPage() {
  const version = packageJson?.version ?? '—';
  const statuses = await Promise.all(ENV_VARS.map(async (name) => ({ name, status: await checkEnv(name) })));

  return (
    <div className="flex-1 flex flex-col bg-ph-bg overflow-y-auto h-full">
      <div className="px-7 py-5 border-b border-ph-border sticky top-0 z-10 bg-ph-bg">
        <h1 className="font-display text-[28px] font-bold tracking-[0.1em] text-ph-text">SETTINGS</h1>
      </div>

      <div className="px-7 py-6 flex flex-col gap-8 max-w-3xl">
        {/* App Info */}
        <div className="bg-ph-surface border border-ph-border rounded-lg p-5">
          <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase mb-4">Aplikasi</h2>
          <div className="flex items-center justify-between py-2 border-b border-ph-border">
            <span className="font-sans text-xs text-ph-muted">Version</span>
            <span className="font-mono text-xs text-ph-text">{version}</span>
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-ph-surface border border-ph-border rounded-lg p-5">
          <h2 className="font-display text-sm font-bold tracking-[0.12em] text-ph-muted uppercase mb-4">API Keys</h2>
          <div className="flex flex-col gap-1">
            {statuses.map(({ name, status }) => (
              <div key={name} className="flex items-center justify-between py-2 border-b border-ph-border last:border-b-0">
                <span className="font-mono text-[11px] text-ph-text">{name}</span>
                <span className={`font-mono text-[10px] px-[8px] py-[2px] rounded-[3px] ${
                  status === 'ADA' ? 'text-ph-teal bg-[rgba(47,166,160,0.07)] border border-ph-teal/30' : 'text-ph-error bg-[rgba(212,91,78,0.07)] border border-ph-error/30'
                }`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
