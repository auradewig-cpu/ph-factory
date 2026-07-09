# PH Factory — Current State / Context Snapshot

⚠️ Dokumen ini PALING SERING BASI. Update SETIAP KALI ada perubahan stack/struktur/dependency — jangan tunda.

Terakhir update: 9 Juli 2026 (opencode-DeepSeek)

## Environment variables yang dipakai kode
```
DATABASE_URL=              # Neon Postgres
GEMINI_API_KEY=            # Dipakai: lib/ai/client.ts (Gemini via @ai-sdk/google)
GROQ_API_KEY=              # Dipakai: lib/ai/client.ts (Groq via @ai-sdk/groq) — fallback AI
CEREBRAS_API_KEY=          # Dipakai: lib/ai/client.ts (Cerebras via @ai-sdk/openai .chat()) — fallback AI
MISTRAL_API_KEY=           # Dipakai: lib/ai/client.ts (Mistral via @ai-sdk/mistral) — fallback AI
OPENROUTER_API_KEY=        # Dipakai: lib/ai/client.ts (OpenRouter via @openrouter/ai-sdk-provider) — fallback AI
CLOUDINARY_CLOUD_NAME=     # Dipakai: lib/cloudinary/upload.ts
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JAMENDO_CLIENT_ID=         # Belum dipakai
FREESOUND_API_KEY=         # Belum dipakai
YOUTUBE_API_KEY=           # Belum dipakai
POLLINATIONS_API_KEY=      # Dipakai: lib/tts/hf-space.ts (api_key_input HF Space) — premium tier
HF_TOKEN=                  # TIDAK dipakai
```

## Dependency versi kunci (dari package.json)
- `ai` SDK: ^7.0.16
- `@ai-sdk/google`: ^4.0.8 (Gemini provider)
- `@ai-sdk/groq`: ^4.0.5 (Groq provider — fallback)
- `@ai-sdk/openai`: ^4.0.8 (Cerebras provider via .chat() — fallback)
- `@ai-sdk/mistral`: ^4.0.6 (Mistral provider — fallback)
- `@openrouter/ai-sdk-provider`: ^3.0.0 (OpenRouter provider — fallback)

## Demo credentials (untuk prototype/testing)
- Email: `admin@ph.com`
- Password: `ph123`
