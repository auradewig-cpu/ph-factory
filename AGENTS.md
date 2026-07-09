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

## Aturan keras — kredensial (WAJIB DIPATUHI, TANPA PENGECUALIAN)

- JANGAN PERNAH mengubah, menimpa, atau "memperbaiki" `ADMIN_EMAIL`,
  `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`, atau baris apa pun di `.env.local`
  yang berkaitan dengan kredensial — sebagai bagian dari task apa pun,
  termasuk debugging, testing, atau task yang terlihat tidak berkaitan.
  Ini murni hak dan privasi user, opencode tidak pernah tahu (dan tidak
  boleh tahu) password asli user.
- JANGAN PERNAH membuat script test otomatis (Playwright, dsb) yang mencoba
  login pakai password hardcode/tebakan (seperti "test123"). Kalau perlu
  test alur login, MINTA user melakukannya manual, atau tanyakan dulu
  sebelum membuat kredensial test terpisah.
- Kalau menemukan sesuatu yang terlihat "salah" di `.env.local` (hash
  berubah, format aneh, dll), JANGAN diperbaiki sepihak — LAPORKAN ke user
  apa yang ditemukan dan tanya dulu, karena kemungkinan besar itu perubahan
  sah yang sengaja dilakukan user sendiri.
- Insiden yang pernah terjadi (jangan diulang): script test-sidebar.cjs
  pernah menimpa ADMIN_PASSWORD_HASH dengan hash password test "test123"
  karena login test-nya gagal — menghancurkan password asli user tanpa izin.

## Full detail
- Struktur folder & konvensi penamaan: `docs/04_CODING_CONVENTIONS.md`
- Data model & arsitektur lengkap: `docs/02_TECH_SPEC.md`
- Breakdown task awal: `docs/03_TASKS.md`
