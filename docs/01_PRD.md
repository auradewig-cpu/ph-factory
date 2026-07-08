# PH Factory — Product Requirements Document

Status: draft v0.1 · Living document — update tiap ada perubahan scope besar, jangan tunggu selesai project.

## 1. Ringkasan produk

PH Factory adalah aplikasi web pribadi (single-user) yang berfungsi sebagai "production house" digital: merancang konten untuk semua platform (YouTube 16:9/9:16, Instagram Reels/Post, TikTok, Facebook) mulai dari riset niche/tren, perancangan skenario per scene (director mode), sampai output prompt siap pakai (image + video) plus aset musik/SFX bebas lisensi dalam satu paket.

PH Factory **tidak** menggantikan AI image/video generator (Google Flow, Kling, Runway, dll) — perannya adalah "penulis skenario yang presisi" yang menghasilkan prompt dan parameter, bukan menggenerate video itu sendiri.

## 2. Masalah yang diselesaikan

- Riset niche/tren manual itu lambat dan tidak terstruktur.
- Menyusun scene-by-scene yang konsisten (karakter, kamera, transisi) untuk banyak platform sekaligus itu repetitif.
- Sumber musik/SFX gratis sering melanggar lisensi tanpa disadari (klaim hak cipta).
- Tidak ada tempat untuk menyimpan riset, karakter, dan rencana konten yang reusable lintas project.

## 3. Dua mesin inti

**Research Engine** — mengumpulkan sinyal niche/tren/kompetitor.
- YouTube: kuat, berbasis YouTube Data API v3 resmi (statistik channel, video populer, gap analysis).
- TikTok/Instagram/Facebook: tidak ada API riset kompetitor resmi yang bisa diakses individu → pendekatan realistis adalah web search grounding (Gemini/LLM mensintesis dari artikel, studi kasus, berita tren), bukan scraping langsung.
- Riset punya timestamp, ditandai "stale" setelah 14 hari, ada tombol refresh eksplisit.

**Director Engine** — menyusun scene by scene.
- Tiga sumbu independen per scene: `has_character` (boolean), `voice_mode` (voiceover_only / on_camera_dialogue / none), `camera_technique` (enum terstruktur, lihat 02_TECH_SPEC.md).
- Output dua prompt terpisah per scene: `image_prompt` dan `video_prompt` (bukan satu field gabungan seperti ViralFrame).
- Strategi kontinuitas visual hybrid per scene: `continuous` (chain dari frame terakhir), `match_cut` (regenerate + reference image), `hard_cut` (regenerate murni dari teks + character_sheet).
- Musik/SFX otomatis direkomendasikan dari Jamendo (musik) + Freesound (SFX), difilter lisensi (CC0/CC-BY only untuk komersial, tolak CC-BY-NC/ND).

## 4. Object model (ringkas — detail di 02_TECH_SPEC.md)

Project → Persona/Character Sheet → Research Report → Content Plan → Production → Scene → Asset.

## 5. Matriks platform × format

| Platform | Format | Rasio |
|---|---|---|
| YouTube | Long-form | 16:9 |
| YouTube | Shorts | 9:16 |
| Instagram | Reels | 9:16 |
| Instagram | Feed post | 1:1 / 4:5 |
| TikTok | Video | 9:16 |
| TikTok | Carousel gambar | 9:16 |
| Facebook | Reels/Video | 9:16 |
| Facebook | Post | 1:1 |

Diimplementasikan sebagai **Format Preset** reusable, bukan hardcode per platform.

## 6. Non-goals (v1)

- Tidak melakukan assembly video otomatis (ffmpeg stitching) — user tetap merakit scene manual di editor eksternal, minimal untuk fase awal.
- Tidak generate gambar/video sendiri secara default — hanya prompt (opsional preview via Pollinations bisa dipertimbangkan fase lanjut).
- Tidak scraping TikTok/Instagram langsung.

## 7. Belum diputuskan (isi setelah diskusi lanjutan)

- [ ] Prioritas MVP: Research Engine dulu vs Director Engine dulu vs keduanya-tapi-1-platform.
- [ ] Skema JSON scene final lengkap (field-level).
- [ ] Detail flywheel analitik (publish → ukur performa → feedback ke riset) — fase 2.
