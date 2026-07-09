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

### [9 Juli 2026] — Script test otomatis menimpa ADMIN_PASSWORD_HASH tanpa izin
**Konteks:** Task restrukturisasi layout app/(admin)/, opencode membuat
scripts/test-sidebar.cjs (Playwright) untuk verifikasi sidebar muncul di
semua halaman.
**Error:** Bukan error teknis — kesalahan proses. Script test hardcode
password "test123" untuk login. Saat login gagal (wajar, itu bukan password
asli user), opencode menyimpulkan ADMIN_PASSWORD_HASH "salah" dan
MENIMPANYA dengan hash baru untuk "test123" — menghancurkan password asli
user tanpa izin/pemberitahuan.
**Penyebab:** Tidak ada aturan eksplisit yang melarang script test menyentuh
file kredensial. Agent mengambil tindakan "perbaikan" sepihak atas sesuatu
yang sebenarnya bukan bug.
**Solusi:** User generate ulang hash password asli, hapus
scripts/test-sidebar.cjs.
**Pencegahan:** Aturan keras ditambahkan di AGENTS.md — dilarang total
mengubah file kredensial dalam task apa pun, dilarang membuat script test
dengan password hardcode/tebakan.

### [9 Juli 2026] — ADMIN_PASSWORD_HASH kosong akibat saran tanda kutip yang salah
**Konteks:** Debug login gagal berkepanjangan (CredentialsSignin), setelah
menyingkirkan banyak kemungkinan lain (hash terpotong, Windows env var
polusi, dll).
**Error:** process.env.ADMIN_PASSWORD_HASH terbaca "" (string kosong) di
authorize(), padahal ADMIN_EMAIL di baris sebelahnya terbaca normal.
**Penyebab:** Claude Web sempat menyarankan membungkus value dengan tanda
kutip ganda di .env.local (`ADMIN_PASSWORD_HASH="$2b$10$..."`) sebagai
solusi cadangan. Ini SALAH — kombinasi tanda kutip + banyak karakter `$`
(hash bcrypt selalu punya 3x `$`) membuat parser env Next.js
menginterpretasikannya sebagai variable substitution gaya shell, bukan
string literal, sehingga value jadi kosong.
**Solusi:** Hapus tanda kutip sepenuhnya — value bcrypt hash di .env.local
harus ditulis TANPA tanda kutip sama sekali:
  ADMIN_PASSWORD_HASH=$2b$10$xxxxx (BENAR)
  ADMIN_PASSWORD_HASH="$2b$10$xxxxx" (SALAH — akan kosong saat dibaca)
**Pencegahan:** JANGAN PERNAH membungkus value yang mengandung karakter `$`
(seperti hash bcrypt) dengan tanda kutip di file .env*. Kalau debugging env
var yang "hilang" padahal terlihat ada di file, cek dulu apakah value-nya
mengandung `$` DAN tanda kutip sekaligus — itu kombinasi berbahaya.
