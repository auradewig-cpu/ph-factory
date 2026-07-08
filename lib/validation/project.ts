import { z } from 'zod';

export const NICHE_OPTIONS = [
  { value: 'affiliate_product', label: '🛒 Affiliate Video Product' },
  { value: 'real_estate', label: '🏠 Agen Properti' },
  { value: 'web_builder', label: '💻 Web Builder / Jasa Website' },
  { value: 'fashion_beauty', label: '💄 Fashion & Beauty' },
  { value: 'food_beverage', label: '🍜 Kuliner & F&B' },
  { value: 'education_course', label: '📚 Edukasi & Online Course' },
  { value: 'health_wellness', label: '🏋️ Kesehatan & Wellness' },
  { value: 'travel_tourism', label: '✈️ Travel & Wisata' },
  { value: 'finance_investment', label: '💰 Finance & Investasi' },
  { value: 'saas_app', label: '📱 SaaS / Aplikasi Digital' },
  { value: 'personal_brand', label: '🎤 Personal Branding' },
  { value: 'dropship_ecommerce', label: '📦 Dropship / E-Commerce' },
  { value: 'local_service', label: '🔧 Jasa Lokal' },
  { value: 'event_organizer', label: '🎪 Event & Entertainment' },
] as const;

export const PLATFORM_OPTIONS = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram_reels', label: 'Instagram Reels' },
  { value: 'youtube_shorts', label: 'YouTube Shorts' },
  { value: 'facebook_reels', label: 'Facebook Reels' },
  { value: 'xiaohongshu', label: 'Xiaohongshu / RedNote' },
  { value: 'shopee_video', label: 'Shopee Video' },
] as const;

const nicheValues = NICHE_OPTIONS.map((o) => o.value) as [string, ...string[]];
const platformValues = PLATFORM_OPTIONS.map((o) => o.value) as [string, ...string[]];

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Nama project wajib diisi').max(200),
  niche: z.enum(nicheValues, { message: 'Niche tidak valid' }),
  targetPlatforms: z
    .array(z.enum(platformValues, { message: 'Platform tidak valid' }))
    .min(1, 'Pilih minimal satu platform target'),
  language: z.enum(['id', 'en']).default('id'),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
