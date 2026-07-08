# PH Factory — Current State / Context Snapshot

⚠️ Dokumen ini PALING SERING BASI. Update SETIAP KALI ada perubahan stack/struktur/dependency — jangan tunda.

Terakhir update: [ISI TANGGAL SESI TERAKHIR]

## Status proyek
Belum ada kode. Baru tahap dokumen perencanaan (sesi ini).

## Stack terpasang
- **Framework:** Next.js 16.2.10 (App Router, Turbopack)
- **ORM:** Drizzle ORM 0.45.2 + Drizzle Kit 0.31.10
- **Database:** Neon Postgres (driver: @neondatabase/serverless)
- **Storage & delivery:** Cloudinary 2.10.0 (SDK resmi)
- **CSS:** Tailwind CSS v4.1.12
- **Package manager:** pnpm 11.7.0
- **TypeScript:** 5.8.3

## Environment variables yang dibutuhkan (rencana)
```
DATABASE_URL=              # Neon Postgres
GEMINI_API_KEY=
GEMINI_MODEL=         # gemini-2.5-flash (default)
GROQ_API_KEY=
OPENROUTER_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JAMENDO_CLIENT_ID=
FREESOUND_API_KEY=
YOUTUBE_API_KEY=
```

Catatan: Cloudinary adalah satu-satunya storage layer. Tidak ada R2/Cloudflare.
Video hasil generate tidak disimpan — hanya gambar (referensi karakter, frame chaining)
dan audio (musik/SFX) yang disimpan di Cloudinary.

## Struktur folder aktual
(Belum ada — lihat rencana di 04_CODING_CONVENTIONS.md, update di sini begitu berbeda dari rencana)

## Dependency versi kunci
- `next`: 16.2.10
- `react`/`react-dom`: 19.2.7
- `drizzle-orm`: 0.45.2
- `drizzle-kit`: 0.31.10
- `@neondatabase/serverless`: 1.1.0
- `cloudinary`: 2.10.0
- `tailwindcss`: 4.1.12

## Demo credentials (untuk prototype/testing)
- Email: `admin@ph.com`
- Password: `ph123`
