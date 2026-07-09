import { db } from '@/lib/db/client';
import { apiUsageLog } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function recordApiUsage(provider: string) {
  const today = new Date().toISOString().slice(0, 10);
  await db
    .insert(apiUsageLog)
    .values({ provider, date: today, requestCount: 1 })
    .onConflictDoUpdate({
      target: [apiUsageLog.provider, apiUsageLog.date],
      set: { requestCount: sql`${apiUsageLog.requestCount} + 1` },
    });
}

// PERINGATAN: angka limit di bawah ini PERKIRAAN kasar berdasarkan tier
// gratis masing-masing provider. Bisa berbeda dari limit sesungguhnya
// tergantung tier akun. User perlu sesuaikan sendiri kalau meleset.
//
// CATATAN: limit Cerebras & Mistral sebenarnya diukur per TOKEN, bukan
// per REQUEST seperti Gemini/Groq — jadi indikator warna untuk dua
// provider ini kurang akurat dibanding yang lain. Ini keterbatasan yang
// harus diketahui, bukan bug.
const ESTIMATED_DAILY_LIMIT: Record<string, number> = {
  gemini: 250,
  groq: 1000,
  cerebras: 500,
  mistral: 1000,
  openrouter: 200,
};

export async function getApiUsageStatus() {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .select()
    .from(apiUsageLog)
    .where(eq(apiUsageLog.date, today));

  const providers = ['gemini', 'groq', 'cerebras', 'mistral', 'openrouter'];
  return providers.map((p) => {
    const row = rows.find((r) => r.provider === p);
    const count = row?.requestCount ?? 0;
    const limit = ESTIMATED_DAILY_LIMIT[p] ?? 100;
    const pct = count / limit;
    const status = pct >= 0.9 ? 'red' : pct >= 0.7 ? 'yellow' : 'green';
    return { provider: p, count, limit, status };
  });
}
