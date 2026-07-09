'use server';

import { z } from 'zod';
import { generateObjectWithFallback } from '@/lib/ai/fallback';
import { searchTopVideos, getVideoStats, getChannelStats } from '@/lib/youtube/client';
import { researchQuerySchema, researchSynthesisSchema } from '@/lib/validation/research';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db/client';
import { researchReports } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

function daysAgoIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export async function generateResearchReport(projectId: number, query: string) {
  researchQuerySchema.parse({ query, projectId });

  const [topVideos, trendingVideos] = await Promise.all([
    searchTopVideos(query),
    searchTopVideos(query, { publishedAfter: daysAgoIso(14) }),
  ]);

  const topIds = new Set(topVideos.map((v) => v.videoId));
  const allIds = [...new Set([...topVideos, ...trendingVideos].map((v) => v.videoId))];
  const allChannelIds = [...new Set([...topVideos, ...trendingVideos].map((v) => v.channelId))];

  const [statsMap, channelMap] = await Promise.all([
    getVideoStats(allIds),
    getChannelStats(allChannelIds),
  ]);

  const enrichedTop = topVideos.map((v) => ({
    ...v,
    ...statsMap[v.videoId],
    ...channelMap[v.channelId],
    category: 'top' as const,
  }));

  const enrichedTrending = trendingVideos.map((v) => ({
    ...v,
    ...statsMap[v.videoId],
    ...channelMap[v.channelId],
    category: topIds.has(v.videoId) ? 'top_trending' : 'trending',
  }));

  const rawFindings = {
    query,
    topVideos: enrichedTop,
    trendingVideos: enrichedTrending,
  };

  const prompt = `Anda adalah analis konten YouTube. Berikut adalah data mentah video tentang "${query}" yang diambil dari YouTube API.

DATA VIDEO TERPOPULER (sepanjang masa, diurutkan oleh view count):
${enrichedTop.map((v, i) => `${i + 1}. "${v.title}" — ${Number(v.viewCount).toLocaleString()} views, ${Number(v.subscriberCount ?? 0).toLocaleString()} subs, ${v.channelTitle}`).join('\n')}

DATA VIDEO TRENDING (14 hari terakhir):
${enrichedTrending.map((v, i) => `${i + 1}. "${v.title}" — ${Number(v.viewCount).toLocaleString()} views, ${Number(v.subscriberCount ?? 0).toLocaleString()} subs, ${v.channelTitle}`).join('\n')}

Analisis data di atas dan berikan:
1. Ringkasan (summary): 3-5 kalimat tentang tren konten apa yang berhasil di niche ini
2. Patterns: pola judul, format, atau pendekatan yang sering dipakai video berperforma tinggi
3. ContentGapSuggestions: ide konten yang belum banyak dibuat kompetitor tapi punya potensi tinggi
4. RecommendedHookStyles: gaya hook pembuka yang paling efektif untuk niche ini

Gunakan data nyata di atas sebagai dasar analisis — jangan mengarang tanpa data.`;

  const { object: synthesis } = await generateObjectWithFallback({
    schema: researchSynthesisSchema,
    prompt,
  });

  const [report] = await db
    .insert(researchReports)
    .values({
      projectId,
      platform: 'youtube',
      summary: synthesis.summary,
      rawFindings: {
        ...rawFindings,
        synthesis,
      },
      status: 'fresh',
    })
    .returning({ id: researchReports.id });

  revalidatePath(`/projects/${projectId}`);

  return report.id;
}

export async function listResearchReports(projectId: number) {
  const rows = await db
    .select()
    .from(researchReports)
    .where(eq(researchReports.projectId, projectId))
    .orderBy(desc(researchReports.createdAt));

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);

  return rows.map((r) => ({
    ...r,
    isStale: r.createdAt < cutoff,
  }));
}
