# PH Factory — Current State / Context Snapshot

⚠️ Dokumen ini PALING SERING BASI. Update SETIAP KALI ada perubahan stack/struktur/dependency — jangan tunda.

Terakhir update: [ISI TANGGAL SESI TERAKHIR]

## Status proyek
Belum ada kode. Baru tahap dokumen perencanaan (sesi ini).

## Stack terpasang (isi begitu repo di-init)
- Next.js: (belum diinit)
- Node version: (TBD)
- ORM: (belum diputuskan — Drizzle atau Prisma, putuskan di Fase 0 dan catat di ADR)
- Package manager: (TBD — npm/pnpm)

## Environment variables yang dibutuhkan (rencana)
```
DATABASE_URL=              # Neon Postgres
GEMINI_API_KEY=
GROQ_API_KEY=
OPENROUTER_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JAMENDO_CLIENT_ID=
FREESOUND_API_KEY=
YOUTUBE_API_KEY=
POLLINATIONS_API_KEY=          # BELUM dipakai kode — cuma untuk fallback resmi (gen.pollinations.ai) kalau nanti endpoint legacy di lib/tts/pollinations.ts bermasalah. Tidak perlu diisi sekarang.
HF_TOKEN=                      # TIDAK dipakai — rencana awal pakai @gradio/client dibatalkan, TTS final panggil text.pollinations.ai langsung tanpa auth. Boleh dikosongkan.
```

## Struktur folder aktual
(Belum ada — lihat rencana di 04_CODING_CONVENTIONS.md, update di sini begitu berbeda dari rencana)

## Dependency versi kunci
(Isi begitu package.json ada — terutama versi `ai` SDK, `@ai-sdk/google`, `@openrouter/ai-sdk-provider`, karena API-nya sering berubah cepat)

## Demo credentials (untuk prototype/testing)
- Email: `admin@ph.com`
- Password: `ph123`
