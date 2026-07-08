# PH Factory — Error Log

Update LANGSUNG begitu error solved — jangan ditunda. Ini bahan konteks paling krusial untuk sesi berikutnya (hindari mengulang kesalahan yang sama).

Format tiap entri:

```
### [tanggal] — [judul singkat error]
**Konteks:** task/file terkait
**Error:** pesan error persis (copy-paste)
**Penyebab:** akar masalah
**Solusi:** apa yang memperbaiki
**Pencegahan:** apa yang perlu diperhatikan supaya tidak terulang
```

---

### [Sesi Project CRUD] — Dropdown niche & platform menyimpang dari spec PRD
**Konteks:** Task Project CRUD (form niche & target platform)
**Error:** Bukan error runtime — opencode membuat daftar niche & platform sendiri
(generik, Title Case) alih-alih memakai 14 niche dan 6 platform persis dari
docs/01_PRD.md §3.1 dan §3.5. Termasuk menambahkan platform di luar scope
("Twitter/X", "LinkedIn") yang tidak pernah direncanakan di arsitektur manapun.
**Penyebab:** Prompt task dari Claude Web cuma bilang "niche dropdown" dan "target
platform checkbox" tanpa menyebutkan eksplisit bahwa value-nya harus persis dari
PRD (snake_case key + jumlah value tertentu). opencode tidak otomatis membuka
docs/01_PRD.md untuk detail granular seperti ini kalau tidak diminta eksplisit.
**Solusi:** Ganti ke value+label persis dari PRD, tambahkan validasi Zod z.enum()
supaya value di luar daftar resmi ditolak di level schema, bukan cuma UI.
**Pencegahan:** Untuk task berikutnya yang melibatkan dropdown/enum dari PRD (hook
type, CTA type, camera technique, dll), SELALU tulis daftar value+label PERSIS di
dalam prompt task, jangan cuma menunjuk ke nomor section PRD dan berharap opencode
membuka & menyalinnya sendiri.
