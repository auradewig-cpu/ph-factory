const VALID_VOICES = new Set([
  'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'coral',
  'verse', 'ballad', 'ash', 'sage', 'amuch', 'dan',
]);

interface GenerateVoiceoverParams {
  text: string;
  emotion?: string;
  voice?: string;
}

const MAX_INPUT_LENGTH = 950;

function truncateToSentence(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen);
  const lastPeriod = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?'),
  );
  if (lastPeriod > maxLen * 0.5) {
    return truncated.slice(0, lastPeriod + 1);
  }
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.slice(0, lastSpace === -1 ? maxLen : lastSpace) + '...';
}

const SPACE_BASE = 'https://nihalgazi-text-to-speech-unlimited.hf.space/gradio_api';

function parseSseData(text: string): unknown[] | null {
  for (const line of text.split('\n')) {
    if (line.startsWith('data: ')) {
      try {
        return JSON.parse(line.slice(6));
      } catch {}
    }
  }
  return null;
}

export async function generateVoiceover(params: GenerateVoiceoverParams): Promise<Buffer> {
  const emotion = params.emotion ?? 'neutral';
  const voice = params.voice ?? 'alloy';

  if (!VALID_VOICES.has(voice)) {
    throw new Error(`Voice tidak valid: "${voice}"`);
  }
  const truncatedText = truncateToSentence(params.text, MAX_INPUT_LENGTH);
  if (truncatedText !== params.text) {
    console.log(`[TTS] Teks dipotong dari ${params.text.length} ke ${truncatedText.length} karakter`);
  }

  const startRes = await fetch(`${SPACE_BASE}/call/text_to_speech_app`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        truncatedText,
        voice,
        emotion,
        true,
        12345,
        process.env.POLLINATIONS_API_KEY,
      ],
    }),
  });

  if (!startRes.ok) {
    throw new Error(`HF Space start failed: ${startRes.status} ${await startRes.text()}`);
  }

  const { event_id } = await startRes.json();
  if (!event_id) throw new Error('HF Space tidak mengembalikan event_id');

  const pollRes = await fetch(`${SPACE_BASE}/call/text_to_speech_app/${event_id}`);
  const pollText = await pollRes.text();

  const data = parseSseData(pollText);
  if (!data || !Array.isArray(data)) {
    throw new Error(`HF Space response tidak valid: ${pollText.slice(0, 200)}`);
  }

  const audioInfo = (data[0] as { url?: string } | null);
  if (!audioInfo?.url) {
    const statusMsg = data[1] as string;
    throw new Error(`HF Space gagal generate audio: ${statusMsg}`);
  }

  const audioRes = await fetch(audioInfo.url);
  const buffer = Buffer.from(await audioRes.arrayBuffer());

  if (buffer.length < 1000) {
    throw new Error(`Audio hasil terlalu kecil (${buffer.length} bytes)`);
  }
  return buffer;
}
