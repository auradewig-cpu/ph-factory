const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

interface SearchResult {
  videoId: string;
  title: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
}

interface VideoStats {
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

interface ChannelStats {
  subscriberCount: string;
}

async function youtubeFetch(path: string, params: Record<string, string>) {
  const url = new URL(`${YOUTUBE_API_BASE}/${path}`);
  url.searchParams.set('key', process.env.YOUTUBE_API_KEY ?? '');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`YouTube API ${path} error (${res.status}): ${body.slice(0, 300)}`);
  }
  return res.json();
}

export async function searchTopVideos(
  query: string,
  opts?: { publishedAfter?: string },
): Promise<SearchResult[]> {
  const params: Record<string, string> = {
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: '15',
  };

  if (opts?.publishedAfter) {
    params.order = 'date';
    params.publishedAfter = opts.publishedAfter;
  } else {
    params.order = 'viewCount';
  }

  const data = await youtubeFetch('search', params);
  return (data.items ?? []).map((item: any) => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
  }));
}

export async function getVideoStats(videoIds: string[]): Promise<Record<string, VideoStats>> {
  if (videoIds.length === 0) return {};
  const data = await youtubeFetch('videos', {
    id: videoIds.join(','),
    part: 'statistics,contentDetails',
  });
  const map: Record<string, VideoStats> = {};
  for (const item of data.items ?? []) {
    map[item.id] = {
      viewCount: item.statistics?.viewCount ?? '0',
      likeCount: item.statistics?.likeCount ?? '0',
      commentCount: item.statistics?.commentCount ?? '0',
    };
  }
  return map;
}

export async function getChannelStats(channelIds: string[]): Promise<Record<string, ChannelStats>> {
  if (channelIds.length === 0) return {};
  const data = await youtubeFetch('channels', {
    id: channelIds.join(','),
    part: 'statistics',
  });
  const map: Record<string, ChannelStats> = {};
  for (const item of data.items ?? []) {
    map[item.id] = {
      subscriberCount: item.statistics?.subscriberCount ?? '0',
    };
  }
  return map;
}
