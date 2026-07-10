# PH Factory — Task/Todo Tracker (Live Status)

Update REAL-TIME selama kerja — beda dari 03_TASKS.md (breakdown awal, statis). Kalau ada task yang di-skip atau berubah dari rencana, catat alasannya di sini.

| Task ID | Deskripsi | Status | Catatan/alasan perubahan |
|---|---|---|---|
| T0.1 | Init Next.js + TS + Tailwind | Selesai | Hasil migrasi dari Figma export, build production sukses |
| T0.2 | Setup Neon Postgres | Selesai | db:push sukses, terverifikasi query nyata di localhost & Vercel |
| T0.4 | Setup Cloudinary (storage & delivery) | Selesai | Upload foto persona terverifikasi berhasil di production Vercel |
| T0.5 | Setup Vercel AI SDK + provider | Dikerjakan | Gemini terhubung & terverifikasi. Groq/OpenRouter fallback BELUM diimplementasi (rencana di ADR-002) |
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
| T3.4 | TTS/voiceover (baru) | Belum mulai | UTAMA: HF Space NihalGazi/Text-To-Speech-Unlimited via @gradio/client (HF_TOKEN). FALLBACK: Pollinations TTS (POLLINATIONS_API_KEY). Trigger: voiceMode ≠ 'none'. Simpan ke assets (type: 'audio') |
| — | 5 halaman placeholder ke app/(admin)/ | **SELESAI** | Sidebar konsisten di semua 7 menu, terverifikasi user di production Vercel |
| — | loading.tsx untuk navigasi instan | **SELESAI** | Highlight sidebar sekarang instan saat klik menu berdata (Dashboard/Projects), terverifikasi langsung oleh user di production |

## Belum diputuskan / masih menggantung
- [ ] Login localhost gagal ("Credential tidak valid") meski Vercel production
      berhasil — belum diselesaikan, ditunda karena tidak mengganggu pemakaian
      (user kerja dari production). Kemungkinan .env.local lokal beda dari yang
      terakhir terverifikasi jalan. Investigasi ulang kalau development lokal
      dibutuhkan lagi nanti.
- [ ] Prioritas fitur TTS voiceover (T3.4)
- [ ] Groq/OpenRouter fallback belum diimplementasi (T0.5)

## Pelajaran proses penting (jangan diulang)
- Selalu verifikasi `git show HEAD` setelah push — laporan "berhasil" tidak cukup
- Jangan beri instruksi "task tunggal, jangan sentuh file lain" tanpa cek dulu `git status` — bisa membuat perubahan lain yang sah jadi menggantung
- Script test otomatis DILARANG menyentuh file kredensial (lihat AGENTS.md)
- Value env var yang mengandung karakter `$` (seperti hash bcrypt) JANGAN dibungkus tanda kutip di .env*

Status yang valid: `Belum mulai` / `Dikerjakan` / `Selesai` / `Diskip` / `Diubah` (kalau Diskip/Diubah wajib isi kolom catatan).

| — | Research Engine v1 (YouTube) | **SELESAI PENUH** | YouTube Data API v3 (top by viewCount + trending 14 hari) + sintesis Gemini berbasis data nyata. Terverifikasi kualitas hasil oleh user — insight spesifik (bukan generic), bukan halusinasi. Fallback 5-provider AI + widget kuota terkonfirmasi berfungsi. |
| — | Fallback 5-provider (Gemini/Groq/Cerebras/Mistral/OpenRouter) + widget kuota | **SELESAI PENUH** | Terverifikasi visual di sidebar production, indikator hijau/kuning/merah berfungsi dengan data usage asli |

| — | Research Engine multi-platform (TikTok/IG/FB) | **SELESAI PENUH** | lib/research/grounding.ts — Google Search grounding via Gemini REST API langsung (bukan Vercel AI SDK — investigasi lengkap membuktikan syntax provider-executed tool belum bisa dipastikan dalam waktu wajar, REST API dipilih sebagai jalan pasti). generateSocialResearchReport() di research.ts, pola sama seperti YouTube (grounding → generateObjectWithFallback untuk sintesis). recordApiUsage tercatat. Terverifikasi kualitas: hasil TikTok jelas berbeda dan spesifik dari hasil YouTube (istilah OOTD, format 9:16, trending sound vs review teknis mendalam YouTube) — bukti grounding bekerja nyata, bukan generic. |
| — | Perkaya instruksi videoPrompt di masterPrompt.ts (bahasa DoP) | **SELESAI** | Instruksi videoPrompt diperkaya: WAJIB shot size + angle + movement + lens (mm) + focus + lighting dalam satu kalimat mengalir. Tambah aturan variasi shot size/lens antar scene. Terverifikasi via test langsung ke Gemini — 6 scene hasil output konsisten menyertakan semua elemen sinematografi (5/6 sertakan angle eksplisit, 6/6 sertakan shot size + lens mm + focus + lighting). |
