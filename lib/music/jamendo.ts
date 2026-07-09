const JAMENDO_BASE = 'https://api.jamendo.com/v3.0';

interface JamendoTrackRaw {
  id: string;
  name: string;
  artist_name: string;
  license_ccurl: string;
  audiodownload: string;
  duration: number;
}

export interface SafeTrack {
  externalId: string;
  name: string;
  artistName: string;
  licenseCcurl: string;
  licenseType: string;
  downloadUrl: string;
  duration: number;
  source: 'jamendo';
}

function isLicenseSafe(licenseCcurl: string): boolean {
  if (!licenseCcurl) return false;
  const lower = licenseCcurl.toLowerCase();
  if (lower.includes('/zero/') || lower.includes('publicdomain')) return true;
  if (lower.includes('nc') || lower.includes('nd')) return false;
  if (lower.includes('/by/') || lower.includes('/by-sa/') || lower.includes('/by/3.0') || lower.includes('/by-sa/3.0')) return true;
  if (lower.includes('/zero/1.0') || lower.includes('/zero/2.0') || lower.includes('/zero/4.0')) return true;
  if (lower.includes('cc0')) return true;
  return false;
}

function extractLicenseType(licenseCcurl: string): string {
  const lower = licenseCcurl.toLowerCase();
  if (lower.includes('/zero/') || lower.includes('publicdomain') || lower.includes('cc0')) return 'cc0';
  if (lower.includes('/by-sa/')) return 'by-sa';
  if (lower.includes('/by/')) return 'by';
  return 'unknown';
}

export async function searchJamendoTracks(query: string): Promise<SafeTrack[]> {
  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) throw new Error('JAMENDO_CLIENT_ID tidak dikonfigurasi');

  const url = new URL(`${JAMENDO_BASE}/tracks/`);
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '20');
  url.searchParams.set('search', query);
  url.searchParams.set('include', 'musicinfo+licenses');

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Jamendo API error (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const rawTracks: JamendoTrackRaw[] = data.results ?? [];

  const safe: SafeTrack[] = [];
  for (const t of rawTracks) {
    if (isLicenseSafe(t.license_ccurl)) {
      safe.push({
        externalId: t.id,
        name: t.name,
        artistName: t.artist_name,
        licenseCcurl: t.license_ccurl,
        licenseType: extractLicenseType(t.license_ccurl),
        downloadUrl: t.audiodownload,
        duration: t.duration,
        source: 'jamendo',
      });
    }
  }

  return safe;
}
