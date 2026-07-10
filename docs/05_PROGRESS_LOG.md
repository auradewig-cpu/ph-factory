# PH Factory — Progress Log

Update di akhir tiap sesi kerja. Format: tanggal, siapa (Claude Web / opencode-DeepSeek), apa yang dikerjakan, apa yang selesai, apa yang pending.

---

## Sesi 1 — [ISI TANGGAL]
**Oleh:** Claude Web
**Dikerjakan:** Diskusi arsitektur penuh (Research Engine + Director Engine), riset source gratis (Vercel AI SDK, Jamendo, Freesound, YouTube Data API), keputusan continuity strategy hybrid, penyusunan 9 dokumen workflow awal.
**Selesai:** PRD v0.1, Tech Spec v0.1, Task breakdown skeleton, Coding conventions v0.1.
**Pending:** Keputusan prioritas MVP (Research vs Director Engine dulu), skema JSON Scene final, mulai coding Fase 0.

---

## Sesi 2 — [ISI TANGGAL]
**Oleh:** opencode + DeepSeek (eksekusi), Claude Web (review)
**Dikerjakan:** Migrasi hasil desain Figma (Vite+React) ke Next.js App Router. Bersihkan dependency Figma-specific (vite.config figmaAssetResolver, index.html), hapus MUI + ~13 dependency tidak terpakai, konversi Google Fonts @import ke pendekatan Next.js, setup shadcn/ui + Tailwind theme.
**Selesai:** Struktur `app/` (9 route: login, dashboard, 7 placeholder), `components/` (6 custom + 8 shadcn/ui), `styles/globals.css`, `lib/utils.ts`. Build production sukses.
**Pending:** Login & dashboard masih shell visual, belum ada logic/koneksi backend. Perlu cek isi `guidelines/` dan `ATTRIBUTIONS.md` (kemungkinan sisa metadata Figma, pindahkan ke `docs/` atau hapus). Lanjut ke setup schema database (Drizzle + Neon).

## Sesi 3 — 10 Juli 2026
**Oleh:** opencode-DeepSeek
**Dikerjakan:** Perkaya instruksi videoPrompt di masterPrompt.ts dengan bahasa sinematografi Director of Photography — instruksi lama cuma bilang "gerakan kamera, durasi action, transisi", diganti dengan kombinasi 6 elemen sinematografi (shot size, angle, movement spesifik, lens mm, focus technique, lighting & mood) dalam satu kalimat mengalir, plus aturan tambahan variasi shot size/lens antar scene.
**Selesai:** masterPrompt.ts diupdate, terverifikasi via test generate 6 scene langsung ke Gemini — semua scene menyertakan shot size + lens mm + focus + lighting, 5/6 sertakan angle eksplisit. Commit + push ke main.
**Pending:** Tidak ada untuk task ini.

<!-- Tambahkan sesi baru di bawah ini, urutan kronologis menaik -->
