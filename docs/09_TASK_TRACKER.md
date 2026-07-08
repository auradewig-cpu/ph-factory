# PH Factory — Task/Todo Tracker (Live Status)

Update REAL-TIME selama kerja — beda dari 03_TASKS.md (breakdown awal, statis). Kalau ada task yang di-skip atau berubah dari rencana, catat alasannya di sini.

| Task ID | Deskripsi | Status | Catatan/alasan perubahan |
|---|---|---|---|
| T0.1 | Init Next.js + TS + Tailwind | Selesai | Hasil migrasi dari Figma export, build production sukses |
| T0.2 | Setup Neon Postgres | Belum mulai | Menyusul setelah schema Drizzle siap |
| T0.4 | Setup Cloudinary (storage & delivery, satu-satunya layer storage) | Selesai | lib/cloudinary/client.ts + upload.ts (uploadAsset, deleteAsset). Folder per project: ph-factory/{projectId}/{type}. |
| T0.5 | Setup Vercel AI SDK + provider | Belum mulai | — |
| T0.6 | Setup Jamendo + Freesound client | Belum mulai | — |
| T0.7 | Auth sederhana (demo credential) | Dikerjakan | Baru UI login, belum ada logic verifikasi kredensial sungguhan |
| T0.8 | Struktur folder | Selesai | Sesuai 04_CODING_CONVENTIONS.md, hasil migrasi Figma |
| T1.2 | Halaman login (UI) | Dikerjakan | Visual sudah ada, belum terhubung backend |
| T1.3 | Admin shell/layout | Dikerjakan | Sidebar + layout dasar ada (dashboard + 7 placeholder), konten placeholder belum diisi |
| T1.4 | Project CRUD dasar | Dikerjakan | Server Actions (createProject, listProjects) + Zod validasi + halaman listing & detail. Belum ada edit/delete. |
| T1.5 | Form Persona + upload foto referensi | Dikerjakan | lib/validation/persona.ts (6 field), lib/actions/persona.ts (createPersona dgn kompilasi description + Cloudinary upload), components/PersonaForm.tsx, halaman detail project menampilkan persona cards. |
| T1.6 | Seed format_presets | Selesai | lib/db/seed.ts — 8 baris insert, idempotent (skip kalau already seeded). Sudah dijalankan. |
| T1.7 | Production CRUD minimal | Dikerjakan | lib/validation/production.ts (formatPresetId, hasCharacter, voiceMode), lib/actions/production.ts (createProduction dgn query preset → derive platform, listProductionsByProject dgn join preset), components/ProductionForm.tsx, productions section di halaman detail project. |
| T2.1 | Director Engine v1 — generate scene via AI | Dikerjakan | lib/ai/client.ts (geminiModel), lib/validation/scene.ts (generateObject schema), lib/prompt-engine/masterPrompt.ts, lib/actions/scene.ts (generateScenes + listScenes). UI di /projects/[id]/productions/[productionId]/page.tsx. Production cards jadi clickable. |
| T1.6 | Setup Drizzle ORM + schema | Selesai | Direview 2x oleh Claude Web (circular FK + storage Cloudinary), db:push disetujui |

Status yang valid: `Belum mulai` / `Dikerjakan` / `Selesai` / `Diskip` / `Diubah` (kalau Diskip/Diubah wajib isi kolom catatan).
