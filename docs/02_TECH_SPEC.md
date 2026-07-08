# PH Factory — Tech Spec / Architecture Doc

Status: draft v0.1 · Update tiap ada perubahan stack/struktur — lalu sinkronkan ke 08_CURRENT_STATE.md.

## 1. Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Hosting | Vercel | Sesuai keputusan awal, serverless, Next.js native |
| Framework | Next.js (App Router) + TypeScript | Ekosistem Vercel AI SDK paling matang di sini |
| Database | Neon (Postgres) | Data relasional (Project→Persona→Research→Production→Scene→Asset), lebih cocok dari D1 untuk relasi banyak |
| Storage & delivery asset | Cloudinary (free tier) | Simpan & transform gambar kecil (foto referensi karakter, frame chaining) + audio (musik/SFX). **Video hasil generate TIDAK PERNAH disimpan di sini** — selalu diproses dan disimpan user sendiri di PC. Cloudinary dipilih sendirian (bukan R2+Cloudinary) karena volume asset yang tersimpan kecil (gambar+audio saja), sehingga kolam 25 kredit/bulan free tier Cloudinary aman dipakai — lihat ADR-007. |
| LLM layer | Vercel AI SDK (`vercel/ai`) + `@ai-sdk/google` (Gemini) + community provider Groq + `@openrouter/ai-sdk-provider` | Native untuk Vercel/Next.js, format output seragam lintas provider, tidak perlu reinvent apiClient.ts custom |
| Musik | Jamendo API (utama) + Freesound API (SFX) | Satu-satunya sumber gratis dgn endpoint audio resmi + link download; WAJIB filter `license_ccurl` sebelum dipakai (tolak CC-BY-NC/ND untuk konten komersial) |
| Riset YouTube | YouTube Data API v3 | Resmi, gratis, 10.000 unit/hari |
| Riset platform lain | Web search grounding (lewat LLM) | Tidak ada API riset kompetitor resmi utk TikTok/IG/FB yang bisa diakses individu |
| Validasi form | Zod | Schema-driven, type-safe |

## 2. Prinsip arsitektur kunci

1. **Panggil LLM/provider langsung dari browser bila memungkinkan** — hindari timeout serverless function Vercel untuk request panjang. Kalau harus lewat API route (butuh sembunyikan key), pastikan ada job status di DB, bukan bergantung sepenuhnya pada koneksi browser tetap terbuka.
2. **API key sensitif (kalau disimpan di server/Neon, bukan cuma di client) wajib dienkripsi at-rest.** Jangan simpan plaintext.
3. **Setiap riset punya `created_at` dan status `fresh`/`stale`** (stale setelah 14 hari) — tampilkan badge di UI, jangan diam-diam pakai data basi.
4. **Job queue minimal** untuk proses berantai (generate banyak scene sekaligus) — tabel `jobs` dengan status pending/processing/done/failed per unit kerja, supaya proses bisa dilanjut walau tab browser tertutup.
5. **Quota/usage tracking** — tabel `api_usage_log` (provider, tanggal, jumlah request) supaya ada peringatan sebelum limit harian provider gratis habis.

## 3. Data model (entitas utama)

```
Project
  id, name, niche, target_platforms[], language, status, created_at

Persona (Character Sheet)
  id, project_id, name, description (text lengkap, identik dipakai di image_prompt & video_prompt),
  reference_image_asset_id (nullable), created_at

ResearchReport
  id, project_id, platform, summary, raw_findings (json), created_at, status (fresh|stale)

ContentPlan
  id, project_id, title, duration_days, generated_from_report_id, created_at

Production
  id, project_id, content_plan_id (nullable), platform (derived dari
  format_presets.platform — BUKAN input independen), format_preset_id,
  has_character (bool), voice_mode (voiceover_only|on_camera_dialogue|none),
  status, created_at

Scene
  id, production_id, scene_number, scene_type (hook|body|cta),
  camera_technique (enum), continuity_type (continuous|match_cut|hard_cut),
  chain_source (previous_frame_asset_id|character_sheet_reference|none),
  image_prompt, video_prompt, script_narration, music_track_id (nullable),
  duration_seconds, max_words, speech_pace

Asset
  id, project_id, scene_id (nullable), type (image|video_frame|audio|reference_photo),
  cloudinary_url (notNull), cloudinary_public_id (notNull), created_at
  Catatan: type "video_frame" di sini artinya SCREENSHOT/frame tunggal (gambar diam)
  yang diupload balik untuk chaining, BUKAN file video utuh. File video utuh tidak
  pernah masuk ke Asset.

FormatPreset
  id, name, platform, ratio, duration_range, caption_style

MusicTrack (cache hasil pencarian, opsional)
  id, source (jamendo|freesound), external_id, license_url, license_type,
  commercial_safe (bool, derived dari license_type), download_url

Job
  id, type, related_id, status (pending|processing|done|failed), error_message, created_at

ApiUsageLog
  id, provider, date, request_count
```

## 4. Camera technique enum (Director Engine)

```
drone_aerial_reveal, drone_orbit, walkthrough_steadicam, dolly_zoom,
static_wide_establish, rack_focus_detail, pov_handheld_product, pov_gimbal_follow
```

## 5. Continuity strategy (per scene transition)

| Tipe | Kapan | Aksi |
|---|---|---|
| `continuous` | Scene lanjutan tanpa jeda waktu/lokasi | Chain: frame terakhir video scene sebelumnya jadi starting image |
| `match_cut` | Lokasi/karakter sama, ganti sudut kamera/momen | Regenerate image baru + reference image (character sheet/produk) sebagai anchor |
| `hard_cut` | Lompat ke lokasi/waktu/adegan baru | Regenerate murni dari teks + character_sheet identik |

## 6. Belum diputuskan

- [ ] Skema JSON lengkap field-level untuk `Scene` (final).
- [ ] Mekanisme job queue detail (polling vs webhook vs cron Vercel).
- [ ] Breakdown skill Research Engine (berapa tahap, urutan panggilan).
