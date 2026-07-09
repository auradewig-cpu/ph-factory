'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchApiUsageStatus } from '@/lib/actions/api-usage';

const STATUS_COLOR: Record<string, string> = {
  green: 'text-ph-teal',
  yellow: 'text-ph-amber',
  red: 'text-ph-error',
};

const PROVIDER_LABEL: Record<string, string> = {
  gemini: 'GEMINI',
  groq: 'GROQ',
  openrouter: 'OROUTER',
};

export function ApiStatusWidget({ collapsed }: { collapsed: boolean }) {
  const [statuses, setStatuses] = useState<{ provider: string; count: number; limit: number; status: string }[]>([]);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchApiUsageStatus();
      setStatuses(data);
    } catch {}
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (collapsed) {
    const worstStatus = statuses.reduce((worst, s) => {
      const order = ['green', 'yellow', 'red'];
      return order.indexOf(s.status) > order.indexOf(worst) ? s.status : worst;
    }, 'green');

    return (
      <div className="border-t border-ph-border px-0 py-2 flex justify-center">
        <span className={`text-[9px] font-mono ${STATUS_COLOR[worstStatus]}`}>●</span>
      </div>
    );
  }

  return (
    <div className="border-t border-ph-border px-[14px] py-2.5">
      <div className="text-[9px] font-mono text-ph-muted mb-1.5 tracking-wider">API QUOTA</div>
      {statuses.map((s) => (
        <div key={s.provider} className="flex items-center justify-between text-[10px] font-mono leading-[18px]">
          <span className="text-ph-muted">{PROVIDER_LABEL[s.provider] ?? s.provider.toUpperCase()}</span>
          <span className="flex items-center gap-1">
            <span className={STATUS_COLOR[s.status]}>●</span>
            <span className="text-ph-text">{s.count}</span>
            <span className="text-ph-muted">/{s.limit}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
