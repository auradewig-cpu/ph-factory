# PH Factory — Task/Todo Tracker (Live Status)

Update REAL-TIME selama kerja — beda dari 03_TASKS.md (breakdown awal, statis). Kalau ada task yang di-skip atau berubah dari rencana, catat alasannya di sini.

| Task ID | Deskripsi | Status | Catatan/alasan perubahan |
|---|---|---|---|
| T0.1 | Init Next.js + TS + Tailwind | Selesai | Hasil migrasi dari Figma export, build production sukses |
| T0.2 | Setup Neon Postgres | Selesai | db:push sukses, terverifikasi query nyata (bukan cuma build) di localhost & Vercel |
| T0.4 | Setup Cloudinary (storage & delivery, satu-satunya layer storage) | Selesai | Upload foto persona terverifikasi berhasil di production Vercel |
| T0.5 | Setup Vercel AI SDK + provider | Dikerjakan | Gemini sudah terhubung & terverifikasi. Groq/OpenRouter fallback BELUM diimplementasi (cuma rencana di ADR-002) |
| T0.6 | Setup Jamendo + Freesound client | Belum mulai | — |
| T0.7 | Auth sederhana (demo credential) | Dikerjakan | Baru UI login hasil migrasi Figma, BELUM ada logic verifikasi kredensial ke database — perlu diputuskan apakah jadi prioritas mengingat app sudah live di URL publik Vercel tanpa proteksi |
| T0.8 | Struktur folder | Selesai | Sesuai 04_CODING_CONVENTIONS.md, hasil migrasi Figma |
| T1.2 | Halaman login (UI) | Dikerjakan | Visual sudah ada, belum terhubung backend — lihat T0.7 |
| T1.3 | Admin shell/layout | Dikerjakan | Sidebar + layout dasar ada (dashboard + 7 placeholder). Halaman /dashboard MASIH data dummy hasil Figma, belum terhubung ke DB |
| T1.4 | Project CRUD | Selesai | Create + list terverifikasi jalan di Vercel production (bukan cuma localhost) |
| T1.5 | Persona CRUD + upload foto referensi | Selesai | Kompilasi description template terverifikasi benar, upload Cloudinary terverifikasi jalan di production |
| T1.6 | Setup Drizzle ORM + schema | Selesai | Direview berlapis (circular FK dgn AnyPgColumn, storage Cloudinary-only, this-binding Proxy) |
| — | Production CRUD (platform di-derive dari format_presets) | Selesai | Termasuk seed 8 format_presets |
| T2.1 | Director Engine v1 (generate scene via Gemini) | Selesai | Upsert (bukan delete+insert biar aman tanpa transaction — neon-http tidak dukung transaction), maxDuration=60 aktif. Uji beban 20 scene di Vercel BELUM ada hasilnya (sempat terhambat error env var Gemini yang belum di-set) |
| T3.4 | TTS/voiceover (baru) | Belum mulai | UTAMA: HuggingFace Space NihalGazi/Text-To-Speech-Unlimited via @gradio/client (butuh HF_TOKEN, gratis daftar) — cek exact param via "Use via API" di Space tsb SEBELUM koding, jangan tebak urutan argumen. FALLBACK: Pollinations TTS (POST gen.pollinations.ai/v1/audio/speech, butuh POLLINATIONS_API_KEY dari enter.pollinations.ai, sistem kredit Pollen) kalau HF Space down/sleep/rate-limited. Trigger: voiceMode='voiceover_only' atau 'on_camera_dialogue'. Simpan ke tabel assets (type: 'audio', sudah ada di schema) |

## Belum diputuskan / masih menggantung
- [ ] Hasil uji generate 20 scene di Vercel (setelah GEMINI_API_KEY dipastikan ter-set) — menentukan perlu job-queue (tabel `jobs`) atau tidak
- [ ] Prioritas auth sungguhan (T0.7) — app sudah live di URL publik tanpa proteksi apa pun
- [ ] Halaman /dashboard menghubungkan ke data asli (masih dummy dari Figma)

Status yang valid: `Belum mulai` / `Dikerjakan` / `Selesai` / `Diskip` / `Diubah` (kalau Diskip/Diubah wajib isi kolom catatan).
