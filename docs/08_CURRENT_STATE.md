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
POLLINATIONS_API_KEY=          # Fallback TTS jika HF Space down/rate-limited
HF_TOKEN=                      # UTAMA — untuk @gradio/client ke NihalGazi/Text-To-Speech-Unlimited (rate limit lebih baik dg token, gratis daftar HF)
```

## Struktur folder aktual
(Belum ada — lihat rencana di 04_CODING_CONVENTIONS.md, update di sini begitu berbeda dari rencana)

## Dependency versi kunci
(Isi begitu package.json ada — terutama versi `ai` SDK, `@ai-sdk/google`, `@openrouter/ai-sdk-provider`, karena API-nya sering berubah cepat)

## Environment variables baru (auth)
```
AUTH_SECRET=              # Auto-generate via `npx auth secret` atau `node -e "crypto.randomBytes(33).toString('base64')"`
ADMIN_EMAIL=              # Email admin tunggal untuk login (default: admin@ph.com)
ADMIN_PASSWORD_HASH=      # bcrypt hash password admin — generate via `npx tsx scripts/hash-password.ts "password_anda"`
```
