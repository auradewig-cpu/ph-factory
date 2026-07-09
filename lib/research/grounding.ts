import { recordApiUsage } from '@/lib/ai/usage';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL_NAME = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';

export async function searchWebGrounded(query: string, platform: string): Promise<{ text: string; sources: string[] }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY tidak dikonfigurasi');

  const prompt = `Cari tren konten dan kompetitor terkini di ${platform} untuk niche/topik: "${query}". Fokus pada: jenis konten yang viral, format yang efektif, dan celah konten yang belum tergarap. Berikan jawaban dalam Bahasa Indonesia yang detail dan spesifik — sertakan contoh nyata.`;

  try {
    const res = await fetch(`${GEMINI_API_BASE}/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Gemini grounding error (${res.status}): ${body.slice(0, 300)}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('\n') ?? '';

    const sources: string[] = [];
    const groundingChunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    for (const chunk of groundingChunks) {
      if (chunk.web?.uri) sources.push(chunk.web.uri);
    }

    return { text, sources };
  } finally {
    await recordApiUsage('gemini');
  }
}
