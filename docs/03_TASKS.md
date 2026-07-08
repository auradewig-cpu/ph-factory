# PH Factory — Task Breakdown

Status: skeleton awal. Prioritas fase (Research Engine dulu vs Director Engine dulu) BELUM diputuskan user — task di bawah disusun generik dan perlu diurutkan ulang begitu keputusan itu ada. Setiap task siap dieksekusi step-by-step oleh opencode/DeepSeek; laporkan hasil ke Claude Web untuk review sebelum lanjut task berikutnya.

## Fase 0 — Setup proyek

- [ ] T0.1 Init Next.js (App Router) + TypeScript + Tailwind
- [ ] T0.2 Setup Neon Postgres + koneksi (drizzle/prisma — putuskan ORM)
- [ ] T0.4 Setup Cloudinary account (free tier) + kredensial — satu-satunya layer storage (lihat ADR-007, R2 dicoret)
- [ ] T0.5 Setup Vercel AI SDK + provider Gemini/Groq/OpenRouter (env keys)
- [ ] T0.6 Setup Jamendo + Freesound API client + kredensial
- [ ] T0.7 Setup auth sederhana (single-user, demo credential dulu untuk prototype)
- [ ] T0.8 Buat struktur folder sesuai 04_CODING_CONVENTIONS.md

## Fase 1 — Skeleton data & admin shell

- [ ] T1.1 Migrasi schema DB sesuai 02_TECH_SPEC.md §3
- [ ] T1.2 Halaman login (UI dulu — lihat brief prototype terpisah)
- [ ] T1.3 Admin shell/layout (sidebar nav, top bar, area konten)
- [ ] T1.4 CRUD Project (list, create, detail)
- [ ] T1.5 CRUD Persona/Character Sheet

## Fase 2 — (isi setelah keputusan prioritas MVP)

- [ ] T2.x Research Engine v1 — TBD
- [ ] T2.x Director Engine v1 — TBD

## Fase 3 — Musik & asset

- [ ] T3.1 Endpoint search Jamendo dengan filter lisensi wajib (`commercial_safe` derived field)
- [ ] T3.2 Endpoint search Freesound dengan filter serupa
- [ ] T3.3 Bundling ZIP: scene JSON + prompt.txt + audio (kondisional jika voice_mode ≠ none)

## Fase 4 — Job & quota

- [ ] T4.1 Tabel `jobs` + status tracking
- [ ] T4.2 Tabel `api_usage_log` + dashboard sederhana

Catatan: tandai task yang di-skip/berubah dari rencana, alasan singkat, lalu update di 09_TASK_TRACKER.md — jangan ubah file ini secara real-time (ini breakdown awal, bukan tracker live).
