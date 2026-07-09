const FREESOUND_BASE = 'https://freesound.org/apiv2';

interface FreesoundSoundRaw {
  id: number;
  name: string;
  license: string;
  previews: Record<string, string>;
  download: string;
  duration: number;
}

export interface SafeTrack {
  externalId: string;
  name: string;
  artistName: string;
  licenseCcurl: string;
  licenseType: string;
  downloadUrl: string;
  previewUrl: string;
  duration: number;
  source: 'freesound';
}

function isLicenseSafe(license: string): boolean {
  if (!license) return false;
  const lower = license.toLowerCase();
  if (lower.includes('/zero/') || lower.includes('publicdomain')) return true;
  if (lower.includes('sampling+')) return false;
  if (lower.includes('nc') || lower.includes('nd')) return false;
  if (lower.includes('/by-sa/')) return true;
  if (lower.includes('/by/')) return true;
  if (lower.includes('cc0') || lower.includes('creative commons 0') || lower.includes('cc0 1.0')) return true;
  const isAttribution = lower === 'attribution' || lower.includes('attribution');
  const hasRestriction = lower.includes('noncommercial') || lower.includes('noderivs');
  if (isAttribution && !hasRestriction) return true;
  return false;
}

function extractLicenseType(license: string): string {
  const lower = license.toLowerCase();
  if (lower.includes('/zero/') || lower.includes('publicdomain') || lower.includes('cc0')) return 'cc0';
  if (lower.includes('/by-sa/') || lower.includes('by-sa')) return 'by-sa';
  if (lower.includes('/by/') || lower.includes('by')) return 'by';
  return 'unknown';
}

export async function searchFreesoundSounds(query: string): Promise<SafeTrack[]> {
  const apiKey = process.env.FREESOUND_API_KEY;
  if (!apiKey) throw new Error('FREESOUND_API_KEY tidak dikonfigurasi');

  const url = new URL(`${FREESOUND_BASE}/search/text/`);
  url.searchParams.set('token', apiKey);
  url.searchParams.set('query', query);
  url.searchParams.set('fields', 'id,name,license,previews,download,duration');
  url.searchParams.set('page_size', '50');
  url.searchParams.set('sort', 'rating_desc');

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Freesound API error (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const rawSounds: FreesoundSoundRaw[] = data.results ?? [];

  const safe: SafeTrack[] = [];
  for (const s of rawSounds) {
    if (isLicenseSafe(s.license)) {
      safe.push({
        externalId: String(s.id),
        name: s.name,
        artistName: '',
        licenseCcurl: s.license,
        licenseType: extractLicenseType(s.license),
        downloadUrl: s.download,
        previewUrl: s.previews?.['preview-hq-mp3'] ?? '',
        duration: s.duration,
        source: 'freesound',
      });
    }
  }

  return safe;
}
