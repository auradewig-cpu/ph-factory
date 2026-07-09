# PH Factory — Task/Todo Tracker (Live Status)

Update REAL-TIME selama kerja — beda dari 03_TASKS.md (breakdown awal, statis). Kalau ada task yang di-skip atau berubah dari rencana, catat alasannya di sini.

| Task ID | Deskripsi | Status | Catatan/alasan perubahan |
|---|---|---|---|
| T0.1 | Init Next.js + TS + Tailwind | Selesai | Hasil migrasi dari Figma export, build production sukses |
| T0.2 | Setup Neon Postgres | Selesai | db:push sukses, terverifikasi query nyata di localhost & Vercel |
| T0.4 | Setup Cloudinary (storage & delivery) | Selesai | Upload foto persona terverifikasi berhasil di production Vercel |
| T0.5 | Setup Vercel AI SDK + provider | **SELESAI** | Gemini, Groq (llama-3.3-70b-versatile), Cerebras (gpt-oss-120b via .chat()), Mistral (mistral-small-latest), OpenRouter (meta-llama/llama-3.3-70b-instruct:free). Fallback otomatis: Gemini→Groq→Cerebras→Mistral→OpenRouter dengan logging per-provider ke api_usage_log. Widget kuota di sidebar (hijau/kuning/merah). |
| T0.6 | Setup Jamendo + Freesound client | Belum mulai | — |
| T0.7 | Auth sungguhan (Auth.js v5 + Credentials) | **SELESAI PENUH** | Login/logout & proteksi proxy.ts terverifikasi di production. 3 insiden selama pengerjaan: (1) hash placeholder testing tertinggal, (2) script test Playwright menimpa ADMIN_PASSWORD_HASH dengan hash password test, (3) tanda kutip di .env.local bikin value $ dianggap variable substitution — semua sudah dicatat di 06_ERROR_LOG.md |
| T0.8 | Struktur folder | Selesai | Sesuai 04_CODING_CONVENTIONS.md |
| T1.2 | Halaman login (UI + logic) | Selesai | Terhubung Auth.js v5 sungguhan, termasuk toggle show/hide password |
| T1.3 | Admin shell/layout | **SELESAI PENUH** | Direstrukturisasi ke app/(admin)/ — sidebar konsisten di /dashboard dan /projects, terverifikasi visual di production |
| T1.4 | Project CRUD | Selesai | Terverifikasi jalan di Vercel production |
| T1.5 | Persona CRUD + upload foto referensi | Selesai | Kompilasi description template benar, upload Cloudinary terverifikasi |
| T1.6 | Setup Drizzle ORM + schema | Selesai | Direview berlapis (circular FK, storage Cloudinary-only, this-binding Proxy) |
| — | Production CRUD (platform di-derive dari format_presets) | Selesai | Termasuk seed 8 format_presets |
| T2.1 | Director Engine v1 (generate scene via Gemini) | **SELESAI PENUH** | Uji beban 20 scene di Vercel: ~15-20 detik, jauh di bawah maxDuration=60. Job-queue tidak diperlukan |
| — | Dashboard terhubung data asli | **SELESAI PENUH** | Semua data dummy terhapus, termasuk fix query sceneCount (ambiguous column) |
| T3.4 | TTS/voiceover (baru) | **SELESAI** | HF Space NihalGazi/Text-To-Speech-Unlimited + POLLINATIONS_API_KEY sbg api_key_input (premium tier). Limit truncation dinaikkan dari 195 → 950. Terverifikasi langsung via script: API menerima hingga ≥10.000 karakter tanpa error. Scene #1 (289 chars) terkirim utuh, audio ~11,3 detik. Safety net 950 cukup untuk semua scene realistic. |
| T3.5 | Audio tags di masterPrompt | **SELESAI** | 5 tag ([laughs],[sighs],[excited],[whispers],[gasps]) terverifikasi berfungsi di HF Space TTS. Diintegrasikan ke compileMasterPrompt() (hanya untuk voiceMode selain 'none'). Gemini akan menyisipkan tag secara wajar (1-2 per scene, tidak dipaksakan). |
| — | 5 halaman placeholder ke app/(admin)/ | **SELESAI** | Sidebar konsisten di semua 7 menu, terverifikasi user di production Vercel |
| — | loading.tsx untuk navigasi instan | **SELESAI** | 4 file loading.tsx skeleton (dashboard + projects 3 level), TS compile zero error, terverifikasi di localhost |
| T2.2 | Research Engine v1 — YouTube backend | **SELESAI** | lib/youtube/client.ts (search, stats, channel) + lib/actions/research.ts (orkestrasi + sintesis Gemini). CATATAN: YouTube API key perlu di-enable manual di Google Cloud Console (YouTube Data API v3) sebelum bisa dipakai. UI menyusul (Fase 2 terpisah). |
 
## Belum diputuskan / masih menggantung
- [ ] Login localhost gagal ("Credential tidak valid") meski Vercel production
      berhasil — belum diselesaikan, ditunda karena tidak mengganggu pemakaian
      (user kerja dari production). Kemungkinan .env.local lokal beda dari yang
      terakhir terverifikasi jalan. Investigasi ulang kalau development lokal
      dibutuhkan lagi nanti.

- [ ] Groq/OpenRouter fallback — SUDAH diimplementasi (T0.5), tinggal pantau apakah OpenRouter rate limit mengganggu

## Pelajaran proses penting (jangan diulang)
- Selalu verifikasi `git show HEAD` setelah push — laporan "berhasil" tidak cukup
- Jangan beri instruksi "task tunggal, jangan sentuh file lain" tanpa cek dulu `git status` — bisa membuat perubahan lain yang sah jadi menggantung
- Script test otomatis DILARANG menyentuh file kredensial (lihat AGENTS.md)
- Value env var yang mengandung karakter `$` (seperti hash bcrypt) JANGAN dibungkus tanda kutip di .env*

Status yang valid: `Belum mulai` / `Dikerjakan` / `Selesai` / `Diskip` / `Diubah` (kalau Diskip/Diubah wajib isi kolom catatan).
