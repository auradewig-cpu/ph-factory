import { config } from 'dotenv';
config({ path: '.env.local' });

import { count } from 'drizzle-orm';
import { formatPresets } from './schema';

const PRESETS = [
  { name: 'YouTube Long-form',      platform: 'youtube_long',      ratio: '16:9',  durationRange: null as string | null },
  { name: 'YouTube Shorts',         platform: 'youtube_shorts',    ratio: '9:16',  durationRange: '15-60s' },
  { name: 'Instagram Reels',        platform: 'instagram_reels',   ratio: '9:16',  durationRange: '15-90s' },
  { name: 'Instagram Feed Post',    platform: 'instagram_post',    ratio: '1:1',   durationRange: null },
  { name: 'TikTok Video',           platform: 'tiktok_video',      ratio: '9:16',  durationRange: '15-60s' },
  { name: 'TikTok Carousel',        platform: 'tiktok_carousel',   ratio: '9:16',  durationRange: null },
  { name: 'Facebook Reels/Video',   platform: 'facebook_reels',    ratio: '9:16',  durationRange: '15-60s' },
  { name: 'Facebook Post',          platform: 'facebook_post',     ratio: '1:1',   durationRange: null },
] as const;

async function seed() {
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle } = await import('drizzle-orm/neon-http');

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const [row] = await db.select({ c: count() }).from(formatPresets);

  if (row.c > 0) {
    console.log(`format_presets already seeded (${row.c} rows), skipping.`);
    process.exit(0);
  }

  for (const p of PRESETS) {
    await db.insert(formatPresets).values(p);
  }

  console.log(`Inserted ${PRESETS.length} format_presets.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
