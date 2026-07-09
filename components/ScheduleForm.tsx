'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setSchedule } from '@/lib/actions/calendar';
import { CalendarDays, X } from 'lucide-react';

interface Props {
  productionId: number;
  currentDate: string | null;
}

export function ScheduleForm({ productionId, currentDate }: Props) {
  const router = useRouter();
  const [date, setDate] = useState(currentDate?.slice(0, 10) ?? '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await setSchedule(productionId, date || null);
      router.refresh();
    } catch {}
    setLoading(false);
  };

  const handleClear = async () => {
    setLoading(true);
    try {
      await setSchedule(productionId, null);
      setDate('');
      router.refresh();
    } catch {}
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="bg-ph-bg border border-ph-border rounded-[3px] px-2 py-1.5 text-ph-text font-mono text-[10px] outline-none focus:border-ph-amber w-[140px]"
      />
      <button
        onClick={handleSave}
        disabled={loading || !date}
        className="px-[10px] py-[5px] bg-ph-amber text-ph-bg font-display text-[10px] font-bold tracking-[0.1em] rounded-[3px] cursor-pointer hover:bg-ph-amber-dark disabled:opacity-70 transition-colors"
      >
        {loading ? '...' : 'SET'}
      </button>
      {currentDate && (
        <button
          onClick={handleClear}
          disabled={loading}
          className="p-1 bg-transparent border-none cursor-pointer text-ph-muted hover:text-ph-error transition-colors"
          title="Hapus jadwal"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
