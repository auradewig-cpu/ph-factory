import { Client } from '@gradio/client';

const VALID_VOICES = new Set([
  'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer', 'coral',
  'verse', 'ballad', 'ash', 'sage', 'amuch', 'dan',
]);

interface GenerateVoiceoverParams {
  text: string;
  emotion?: string;
  voice?: string;
}

export async function generateVoiceover(params: GenerateVoiceoverParams): Promise<Buffer> {
  const emotion = params.emotion ?? 'neutral';
  const voice = params.voice ?? 'alloy';

  if (!VALID_VOICES.has(voice)) {
    throw new Error(`Voice tidak valid: "${voice}"`);
  }
  if (params.text.length > 200) {
    throw new Error(`Teks terlalu panjang untuk TTS (${params.text.length} karakter, maks 200). Perlu strategi pemotongan — lihat catatan di 09_TASK_TRACKER.md`);
  }

  const app = await Client.connect('NihalGazi/Text-To-Speech-Unlimited');
  const result = await app.predict('/text_to_speech_app', {
    prompt: params.text,
    voice,
    emotion,
    use_random_seed: true,
    api_key_input: process.env.POLLINATIONS_API_KEY,
  }) as { data: unknown[] };

  const audioInfo = (result.data[0] as { url?: string } | null);
  if (!audioInfo?.url) {
    const statusMsg = result.data[1] as string;
    throw new Error(`HF Space gagal generate audio: ${statusMsg}`);
  }

  const audioRes = await fetch(audioInfo.url);
  const buffer = Buffer.from(await audioRes.arrayBuffer());

  if (buffer.length < 1000) {
    throw new Error(`Audio hasil terlalu kecil (${buffer.length} bytes)`);
  }
  return buffer;
}
