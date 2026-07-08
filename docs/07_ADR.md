# PH Factory — Architecture Decision Records

Setiap keputusan teknis besar dicatat di sini SEBELUM coding, dengan alasan — bukan sesudah.

---

### ADR-001 — Stack hosting & database
**Keputusan:** Vercel (hosting) + Neon Postgres (DB) + Cloudflare R2 (storage asset asli) + Cloudinary (transform/delivery gambar).
**Alasan:** Data relasional cukup kompleks (Project→Persona→Research→Production→Scene→Asset) sehingga Postgres (Neon) lebih cocok dari D1. R2 murah tanpa biaya egress untuk master file; Cloudinary dipakai khusus untuk on-the-fly crop ke rasio platform berbeda dari satu master image — bukan pengganti R2, melainkan pelengkap.

### ADR-002 — LLM layer
**Keputusan:** Pakai `vercel/ai` (Vercel AI SDK) dengan adapter resmi Gemini + community provider Groq/OpenRouter, bukan bikin `apiClient.ts` custom seperti pola ViralFrame.
**Alasan:** Native untuk ekosistem Vercel/Next.js, format output seragam lintas provider, mengurangi kode boilerplate retry/parsing manual.

### ADR-003 — Sumber musik & SFX
**Keputusan:** Jamendo API (musik utama) + Freesound API (SFX). Pixabay, TheAudioDB, Spotify/YouTube API ditolak untuk kebutuhan ini.
**Alasan:** Pixabay API resmi tidak punya endpoint musik (terverifikasi langsung dari dokumentasi resminya — hanya images & videos). TheAudioDB API cuma metadata, bukan file audio. Spotify/YouTube API melarang ekstraksi file mentah (melanggar ToS). Jamendo & Freesound punya endpoint download resmi + field lisensi eksplisit per track.
**Syarat wajib:** Setiap track WAJIB difilter berdasarkan `license_ccurl` sebelum ditawarkan ke user — tolak otomatis lisensi CC-BY-NC/ND untuk konten yang berpotensi komersial (channel affiliate/monetized).

### ADR-004 — Strategi kontinuitas visual antar scene
**Keputusan:** Hybrid per-scene, bukan satu strategi global. Tiga tipe: `continuous` (chain frame terakhir), `match_cut` (regenerate + reference image), `hard_cut` (regenerate murni teks + character_sheet).
**Alasan:** Memaksa semua scene chaining membuat hasil kaku (seolah satu take panjang); memaksa semua regenerate bebas berisiko drift karakter antar scene (kelemahan yang diakui riset akademis seperti StoryDiffusion/ConsiStory). Direktur film sungguhan memutuskan kontinuitas per transisi, bukan global.

### ADR-005 — Pemisahan prompt gambar & video
**Keputusan:** Schema Scene punya `image_prompt` dan `video_prompt` sebagai field terpisah (bukan satu `ai_ready_prompt` gabungan seperti ViralFrame).
**Alasan:** User men-generate gambar dan video di tool eksternal secara berurutan (gambar dulu di satu tool, lalu jadi reference untuk video di tool lain) — PH Factory berperan sebagai penulis skenario untuk kedua tahap, bukan cuma satu.

### ADR-006 — ORM
**Keputusan:** Drizzle ORM (bukan Prisma).
**Alasan:** Drizzle punya driver HTTP resmi untuk Neon yang didesain untuk lingkungan serverless/edge — menghindari masalah cold-start dan binary engine yang sering muncul dengan Prisma di Vercel serverless functions. Lebih ringan dan lebih dekat ke SQL untuk query relasional kompleks (Project→Persona→Research→Production→Scene→Asset).

### ADR-007 — Storage final: Cloudinary saja (bukan R2, bukan R2+Cloudinary)
**Keputusan:** Cloudinary sendirian untuk seluruh kebutuhan storage & delivery asset. R2 dicoret dari arsitektur.
**Konteks penting yang mengubah keputusan sebelumnya:** Sempat dipertimbangkan R2 (storage) + Cloudinary (transform), lalu D1+R2 (ditolak — lihat diskusi ORM di ADR-006), lalu sempat R2-saja. Keputusan berubah setelah diklarifikasi bahwa **video hasil generate TIDAK PERNAH disimpan di sistem ini** — user selalu memproses & menyimpan video sendiri di PC. Yang tersimpan di cloud hanya: foto referensi karakter, frame tunggal untuk chaining (gambar diam, bukan video), dan audio musik/SFX — semuanya bervolume kecil.
**Alasan:** Cloudinary free tier (25 kredit/bulan, 1 kredit = 1GB storage/bandwidth/1000 transformasi, semua dari kolam yang sama) berisiko tinggi kalau video ikut tersimpan (video menguras kredit jauh lebih cepat: 1 kredit cuma = 500 detik SD atau 250 detik HD). Setelah video dipastikan tidak ikut tersimpan, volume realistis (gambar kecil + audio) aman berada di free tier, sehingga tidak perlu R2 sebagai lapisan tambahan.
**Konsekuensi teknis:** Tabel `assets` pakai `cloudinary_url` + `cloudinary_public_id` sebagai field utama (bukan `storage_url` R2). Field `type: video_frame` di tabel `assets` berarti *screenshot satu frame* (gambar diam) untuk keperluan chaining kontinuitas, bukan file video.
**Catatan monitoring:** Cek dashboard kredit Cloudinary (`cloudinary.api.usage()`) secara berkala. Kalau ternyata pemakaian lebih boros dari perkiraan, R2 bisa ditambahkan kembali sebagai lapisan storage tambahan di fase berikutnya.

### ADR-008 — Circular foreign key (assets.scene_id ↔ scenes.chain_asset_id)
**Keputusan:** Gunakan anotasi tipe eksplisit `AnyPgColumn` di callback `.references()` (pola resmi yang direkomendasikan dokumentasi Drizzle), BUKAN menghapus FK dari `schema.ts` dan menambahkannya manual di file migration SQL.
**Alasan:** `schema.ts` harus tetap jadi satu-satunya sumber kebenaran struktur database. FK yang ditambahkan manual di file migration tidak akan diketahui Drizzle saat `db:generate` dijalankan lagi di masa depan — berisiko hilang/tidak konsisten pada migration berikutnya. Solusi `AnyPgColumn` menjaga kedua FK tetap terdeklarasi penuh di TypeScript dengan constraint aktif normal.

---

<!-- Tambahkan ADR baru di bawah ini, nomor urut menaik -->
