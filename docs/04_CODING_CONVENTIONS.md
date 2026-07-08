# PH Factory — Coding Conventions

Status: draft v0.1. Tujuan: konsistensi antar sesi opencode/DeepSeek, supaya tiap sesi baru tidak menebak gaya kode.

## Struktur folder (usulan awal)

```
/app                    → Next.js App Router pages
  /(auth)/login
  /(admin)/projects
  /(admin)/projects/[id]
  /(admin)/settings
  /api                  → route handlers (hanya untuk yang butuh sembunyikan key/server-side)
/lib
  /db                   → schema + client Neon
  /ai                   → wrapper Vercel AI SDK per provider + fallback logic
  /prompt-engine         → masterPrompt.ts analog, camera taxonomy, continuity logic
  /music                 → jamendo.ts, freesound.ts, license-filter.ts
  /storage                → r2.ts, cloudinary.ts
/components
  /ui                    → primitive (button, card, dst — shadcn style)
  /admin                 → komponen spesifik admin panel
/types                    → shared TS types/interfaces (Scene, Production, dst — cerminan 02_TECH_SPEC.md §3)
```

## Aturan penamaan

- File: `kebab-case.ts` / komponen React: `PascalCase.tsx`
- Field DB & JSON: `snake_case` (konsisten dengan konvensi ViralFrame PRD yang jadi referensi awal)
- Enum: `SCREAMING_SNAKE` untuk konstanta, tapi value string tetap `snake_case` (mis. `"drone_aerial_reveal"`)

## Validasi

- Semua input form & payload API divalidasi Zod sebelum masuk DB.
- Semua respons LLM (JSON) divalidasi ulang dengan schema Zod yang sama dengan skema `Scene`/`Production` — jangan percaya output LLM mentah-mentah.

## Error handling

- Setiap pemanggilan API eksternal (LLM, Jamendo, Freesound, YouTube) dibungkus try/catch, gagal → catat ke `error_log` (lihat 06_ERROR_LOG.md) dengan format: tanggal, layer, pesan error, task terkait.
- Jangan pernah silent-fail — kalau fetch gagal tanpa error yang jelas (seperti kejadian `web_fetch` di sesi diskusi ini), treat sebagai error, bukan asumsi sukses.

## Commit / progress

- Setiap akhir sesi kerja, update 05_PROGRESS_LOG.md — jangan tunda ke sesi berikutnya.
- Keputusan teknis besar (ganti library, ganti pendekatan) → catat di 07_ADR.md sebelum lanjut coding, bukan sesudah.

## Pola data referensi (lookup data)

Data referensi/lookup yang jarang berubah (format_presets, dsb) diambil di Server
Component induk dan dioper sebagai prop ke form client, BUKAN lewat REST API route
terpisah kecuali benar-benar dibutuhkan dari luar Next.js.

## Urutan baca wajib di awal sesi opencode baru

1. 08_CURRENT_STATE.md
2. 05_PROGRESS_LOG.md
3. 06_ERROR_LOG.md
4. 09_TASK_TRACKER.md
