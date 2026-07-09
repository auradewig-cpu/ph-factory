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
| T2.1 | Director Engine v1 (generate scene via Gemini) | **SELESAI PENUH** | Uji beban 20 scene di Vercel production: ~15-20 detik, jauh di bawah maxDuration=60. Job-queue TIDAK diperlukan untuk sekarang. Root cause fix terakhir: @ai-sdk/google butuh apiKey eksplisit via createGoogleGenerativeAI(), tidak otomatis baca GEMINI_API_KEY (SDK expect GOOGLE_GENERATIVE_AI_API_KEY secara default) |
| T3.4 | TTS/voiceover (baru) | Belum mulai | UTAMA: HuggingFace Space NihalGazi/Text-To-Speech-Unlimited via @gradio/client (butuh HF_TOKEN, gratis daftar) — cek exact param via "Use via API" di Space tsb SEBELUM koding, jangan tebak urutan argumen. FALLBACK: Pollinations TTS (POST gen.pollinations.ai/v1/audio/speech, butuh POLLINATIONS_API_KEY dari enter.pollinations.ai, sistem kredit Pollen) kalau HF Space down/sleep/rate-limited. Trigger: voiceMode='voiceover_only' atau 'on_camera_dialogue'. Simpan ke tabel assets (type: 'audio', sudah ada di schema) |

| T0.7 | Auth sungguhan (Auth.js v5 + Credentials) | **SELESAI PENUH** | Terverifikasi login/logout & proteksi proxy.ts berfungsi di production. Sempat 2x insiden: (1) hash password placeholder testing tidak sengaja tertinggal di .env.local, (2) fix query dashboard sempat cuma di working directory, belum ter-commit — pelajaran: selalu verifikasi git show HEAD setelah push, jangan percaya laporan "berhasil" begitu saja |
| — | Dashboard terhubung data asli | **SELESAI PENUH** | Semua data dummy terhapus, termasuk fix query sceneCount (ambiguous column — qualifier tabel eksplisit) |

## Belum diputuskan / masih menggantung
- [ ] Prioritas auth sungguhan (T0.7) — app sudah live di URL publik tanpa proteksi apa pun
- [ ] Halaman /dashboard menghubungkan ke data asli (masih dummy dari Figma)
- [ ] Prioritas fitur TTS voiceover (T3.4)

Status yang valid: `Belum mulai` / `Dikerjakan` / `Selesai` / `Diskip` / `Diubah` (kalau Diskip/Diubah wajib isi kolom catatan).
