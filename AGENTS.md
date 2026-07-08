# PH Factory — Agent Instructions

Proyek personal: aplikasi web production house digital (riset niche + director engine
scene-by-scene + output prompt multi-platform). Lihat `docs/01_PRD.md` untuk detail
lengkap kalau perlu konteks produk yang lebih dalam.

## Tech stack
- Next.js (App Router) + TypeScript, di-deploy ke Vercel
- Database: Neon (Postgres)
- Storage: Cloudflare R2 (asset asli) + Cloudinary (transform/delivery gambar)
- LLM: Vercel AI SDK (`ai` package) + `@ai-sdk/google` (Gemini), provider Groq & OpenRouter
- Musik/SFX: Jamendo API + Freesound API — WAJIB filter lisensi (`license_ccurl`) sebelum
  dipakai, tolak CC-BY-NC/ND untuk konten komersial
- Validasi: Zod di semua form/API payload/hasil parsing JSON dari LLM

## Urutan kerja wajib tiap sesi
1. Baca konteks yang sudah otomatis dimuat lewat `opencode.json` (current state, progress
   log, error log, task tracker, coding conventions) — sudah ter-include, tidak perlu
   dibaca manual lagi.
2. Kerjakan task sesuai `docs/09_TASK_TRACKER.md`, jangan menebak scope di luar itu.
3. Kalau ragu soal keputusan arsitektur, cek `docs/07_ADR.md` dulu sebelum bertanya/menebak.
4. Setelah selesai kerja: update `docs/05_PROGRESS_LOG.md`, `docs/09_TASK_TRACKER.md`,
   dan `docs/06_ERROR_LOG.md` (kalau ada error yang di-solve) — jangan tunda ke sesi lain.
5. Kalau bikin keputusan teknis besar (ganti library/pendekatan), tambahkan entri baru
   di `docs/07_ADR.md` SEBELUM lanjut coding.

## Full detail
- Struktur folder & konvensi penamaan: `docs/04_CODING_CONVENTIONS.md`
- Data model & arsitektur lengkap: `docs/02_TECH_SPEC.md`
- Breakdown task awal: `docs/03_TASKS.md`
