# MASTER PROMPT --- REBUILD WEBSITE SIMMAS UKK RPL 2026

## 1. ROLE DAN TUJUAN PROJECT

Bertindaklah sebagai Senior Full-Stack Developer, UI/UX Designer,
Software Architect, Database Engineer, dan QA Engineer profesional.

Saya sedang mengerjakan proyek UKK (Uji Kompetensi Keahlian) /
Sertifikasi Kompetensi RPL 2026 dengan judul:

**SISTEM INFORMASI MANAJEMEN MAGANG SISWA (SIMMAS)**

Website referensi utama: https://simmas.bagus-hidayat.my.id/

Dokumen spesifikasi: `UBIG - SERKOM RPL 2026.pdf` --- Paket 1.

Website referensi adalah acuan utama untuk tampilan, desain, layout,
navigasi, pengalaman pengguna, dan interaksi. Dokumen PDF adalah acuan
utama untuk kebutuhan fungsional, struktur database, pembagian role, dan
ketentuan UKK.

Tujuan: 1. Mereplikasi desain website referensi dengan kemiripan visual
setinggi mungkin. 2. Mengimplementasikan seluruh halaman yang tersedia
dan dapat diamati. 3. Mereplikasi navigasi, sidebar, header, tabel,
kartu statistik, modal, dropdown, formulir, dan alert. 4.
Mengimplementasikan fitur sesuai spesifikasi PDF UKK. 5. Menghubungkan
fitur ke Supabase. 6. Menerapkan autentikasi dan hak akses tiga role. 7.
Membuat aplikasi responsif dan siap didemonstrasikan.

**Jangan hanya membuat mockup atau tampilan statis. Bangun aplikasi
full-stack yang benar-benar berfungsi.**

------------------------------------------------------------------------

## 2. TEKNOLOGI

Gunakan: - Next.js App Router - TypeScript - Tailwind CSS - shadcn/ui -
Lucide React - Supabase PostgreSQL - Supabase Auth - Supabase Storage -
`@supabase/ssr` - React Hook Form - Zod - Recharts - Sonner - date-fns

Gunakan versi dependensi yang kompatibel dengan project saat ini. Jangan
mengganti framework.

### Sebelum coding

Periksa: - Struktur folder project - `package.json` - Versi Next.js -
Konfigurasi TypeScript dan Tailwind - Komponen yang tersedia -
Konfigurasi Supabase - Environment variables - File konfigurasi lainnya

Pertahankan kode dan dependensi yang masih relevan. Jangan menghapus
konfigurasi tanpa alasan teknis yang jelas.

------------------------------------------------------------------------

## 3. ANALISIS WEBSITE REFERENSI

Pelajari website: https://simmas.bagus-hidayat.my.id/

Jangan hanya mengamati landing page. Pelajari setiap halaman dan
interaksi yang dapat diakses.

Amati:

### Visual design

-   Warna utama dan pendukung
-   Background
-   Typography, font size, dan font weight
-   Spacing, padding, dan margin
-   Border radius, shadow, dan border
-   Icon, button, card, dan layout

### Landing page

-   Header dan logo
-   Hero section
-   Bagian fitur
-   Statistik
-   Panduan
-   CTA
-   Footer

### Login

-   Split-screen layout
-   Panel branding dan autentikasi
-   Form input
-   Tombol login
-   Akun demo

### Dashboard

-   Sidebar dan header
-   Breadcrumb dan judul halaman
-   Stat cards dan chart
-   Tabel dan badge
-   Dropdown, modal, alert, dan toast

Klik dan pelajari komponen interaktif: sidebar, navigasi, modal, form,
dropdown, tabel, status, konfirmasi penghapusan, dan responsivitas.

Gunakan akun demo pada website referensi jika tersedia dan memungkinkan.
Jika halaman atau fitur tidak dapat diamati, jangan mengarang hasil
observasi. Gunakan PDF UKK untuk kebutuhan fungsional dan dokumentasikan
bagian yang belum dapat diamati.

**Jangan mengubah desain menjadi dashboard template generik. Pertahankan
identitas visual dan karakter website referensi.**

------------------------------------------------------------------------

## 4. ROLE DAN PERMISSION

Aplikasi memiliki tiga role:

1.  Administrator
2.  Guru Pembimbing
3.  Siswa Magang

Setiap role mempunyai dashboard, navigasi, dan hak akses berbeda.

### A. Administrator

Akses: - Dashboard statistik - Monitoring global - Mengelola data guru -
Mengelola data siswa - Mengelola data DUDI - Mengelola penempatan
magang - Pengaturan sistem - Log aktivitas dan audit

### B. Guru Pembimbing

Akses: - Dashboard guru - Melihat siswa bimbingan - Melihat detail
siswa - Memvalidasi jurnal - Memvalidasi absensi - Memberikan nilai
akhir - Mencatat kunjungan lapangan

Guru hanya boleh mengakses siswa yang menjadi tanggung jawabnya.

### C. Siswa Magang

Akses: - Dashboard siswa - Melihat informasi penempatan - Mengajukan
magang - Mengisi absensi - Mengunggah foto presensi - Mengisi jurnal
kegiatan - Melihat status validasi - Melihat catatan revisi guru

Siswa hanya boleh mengakses data miliknya sendiri.

### Keamanan akses

Terapkan Role-Based Access Control (RBAC) melalui: - Proteksi route -
Server-side authorization - Supabase Row Level Security (RLS)

Jangan hanya menyembunyikan menu berdasarkan role. Jangan mempercayai
role dari frontend tanpa verifikasi server/database.

------------------------------------------------------------------------

## 5. LANDING PAGE PUBLIK

Route: `/`

Bangun landing page dengan struktur sesuai website referensi.

### Header

-   Logo SIMMAS
-   Navigasi Fitur
-   Navigasi Panduan
-   Tombol Masuk

### Hero

Headline: **"Magang lebih teratur."**

Deskripsi: Platform manajemen magang siswa yang menghubungkan sekolah,
guru pembimbing, siswa, dan dunia industri dalam satu sistem terpadu.

Tombol: - Mulai Sekarang - Lihat Fitur

### Fitur berdasarkan role

Buat tiga kartu: 1. Siswa Magang 2. Guru Pembimbing 3. Administrator
Sekolah

### Statistik

-   Jurnal Disetujui
-   Presensi Tercatat
-   Siswa Aktif
-   Total Mitra DUDI

### Panduan

Empat langkah: 1. Registrasi DUDI 2. Pengajuan Magang 3. Persetujuan 4.
Monitoring Real-time

### Footer

Informasi aplikasi, navigasi, informasi sekolah, kontak, dan copyright.

Semua tombol dan navigasi harus berfungsi.

------------------------------------------------------------------------

## 6. HALAMAN LOGIN

Route: `/login`

Gunakan split-screen layout seperti referensi.

### Panel kiri

-   Logo SIMMAS
-   Headline "Magang lebih teratur."
-   Deskripsi
-   Tiga poin keunggulan
-   Statistik 50+ SMK, 10k+ Siswa, 200+ Mitra DUDI

### Panel kanan

-   Judul login
-   Input Email Sekolah
-   Input Password
-   Toggle password
-   Tombol Lupa Password
-   Tombol Masuk Dashboard
-   Seksi Akun Demo

### Akun demo

Sediakan tiga tombol: - Admin - Guru - Siswa

Tombol harus mengisi kredensial akun demo yang benar-benar telah
disiapkan. Jangan membuat tombol demo dengan kredensial fiktif.

### Authentication

Gunakan Supabase Auth.

Validasi: - Email wajib diisi dan formatnya valid - Password wajib
diisi - Tampilkan error login dengan jelas - Tampilkan loading state
saat autentikasi

Redirect setelah berhasil: - Admin → `/admin/dashboard` - Guru →
`/guru/dashboard` - Siswa → `/siswa/dashboard`

Implementasikan login, logout, session management, password reset,
protected routes, session refresh, dan unauthorized handling.

Jangan menggunakan localStorage sebagai pengganti autentikasi Supabase.

------------------------------------------------------------------------

## 7. PORTAL ADMINISTRATOR

Gunakan sidebar sesuai referensi.

### Struktur menu

**OVERVIEW** - Dashboard - Monitoring Global

**MASTER DATA** - Data Guru - Data Siswa - Data DUDI

**MANAJEMEN** - Penempatan Magang

**SISTEM** - Pengaturan Sistem - Log Aktivitas

### A. Dashboard Admin

Route: `/admin/dashboard`

Tampilkan: - Sapaan administrator - Tanggal hari ini - Notifikasi
pengajuan baru - Total siswa - Guru pembimbing aktif - Mitra DUDI
terverifikasi - Pengajuan menunggu validasi - Grafik tren pengajuan enam
bulan terakhir - Tabel distribusi DUDI - Lima aktivitas terbaru

Gunakan data Supabase, bukan angka statis.

### B. Monitoring Global

Route: `/admin/monitoring`

Kolom tabel: - Nama siswa - NIS - Kelas - DUDI - Guru pembimbing -
Hadir - Sakit - Izin - Alfa - Jumlah jurnal - Status - Terakhir aktif -
Tombol Detail

Fitur: - Search nama/NIS - Filter kelas - Filter status - Pagination -
Empty state

Modal detail: - Profil siswa - Informasi penempatan - Guru pembimbing -
Statistik kehadiran - Jurnal terakhir

### C. Data Guru

Route: `/admin/guru`

Fitur: - Tambah, edit, dan hapus guru - Ubah status - Search dan
filter - Pagination

Kolom: - NIP - Nama lengkap - Email - Kompetensi keahlian - Jumlah siswa
bimbingan - Status akun - Aksi

Form: - Nama lengkap beserta gelar - NIP 18 digit - Kompetensi keahlian

Setelah membuat akun, tampilkan informasi kredensial sementara secara
aman. Jangan menghapus guru yang masih mempunyai siswa bimbingan aktif.

### D. Data Siswa

Route: `/admin/siswa`

Fitur: - Tambah, edit, dan hapus siswa - Plotting pembimbing - Ubah
status - Search - Filter kelas dan status - Pagination

Kolom: - NIS - Nama siswa - Email - Kelas - Status magang - Perusahaan
DUDI - Guru pembimbing - Aksi

Form siswa: - Nama lengkap - NIS - Kelas

Modal plotting: - Pilih siswa - Pilih guru - Pilih perusahaan DUDI -
Periksa kuota

### E. Data DUDI

Route: `/admin/dudi`

Fitur: - Tambah, edit, dan hapus DUDI - Ubah status verifikasi - Search
dan filter

Kolom: - Nama perusahaan - Bidang usaha - Nama PIC - Kontak PIC - Kuota
magang - Siswa aktif - Status verifikasi - Aksi

Form: - Nama perusahaan - Bidang usaha - Nama PIC - Nomor
telepon/WhatsApp - Kuota penerimaan - Status verifikasi - Alamat lengkap

DUDI yang masih memiliki siswa aktif tidak boleh dihapus.

### F. Penempatan Magang

Route: `/admin/penempatan`

Fitur: - Tambah dan edit penempatan - Sahkan penempatan - Batalkan
penempatan - Search dan filter

Kolom: - Nama siswa - NIS - Kelas - DUDI - Guru pembimbing - Tanggal
mulai - Tanggal selesai - Nilai akhir - Status

Form: - Pilih siswa - Pilih DUDI - Pilih guru pembimbing - Tanggal
mulai - Tanggal selesai

Validasi: - DUDI harus terverifikasi - Kuota tidak boleh penuh - Siswa
tidak boleh memiliki penempatan aktif ganda - Tanggal selesai harus
setelah tanggal mulai

Gunakan transaksi database atau fungsi database yang aman untuk mencegah
race condition saat memeriksa kuota.

### G. Pengaturan Sistem

Route: `/admin/settings`

Buat tiga tab.

**Tab 1 --- Identitas Aplikasi** - Nama aplikasi - Kepanjangan -
Deskripsi

**Tab 2 --- Halaman Depan** - Judul hero - Deskripsi hero

**Tab 3 --- Data Sekolah** - Nama sekolah - Website - Kepala sekolah -
NIP - Alamat - Nomor telepon

Semua perubahan harus tersimpan di database.

### H. Log Aktivitas

Route: `/admin/logs`

Kolom: - Timestamp - Level INFO/WARN/ERROR - Action Type - Email aktor -
Role - IP address jika tersedia - Metadata

Catat aktivitas penting secara otomatis. Data audit bersifat append-only
bagi pengguna aplikasi.

------------------------------------------------------------------------

## 8. PORTAL GURU PEMBIMBING

Sidebar: - Dashboard - Siswa Bimbingan - Validasi Jurnal & Absensi -
Kunjungan Lapangan

### A. Dashboard Guru

Route: `/guru/dashboard`

Tampilkan: - Sapaan personal - Jumlah jurnal menunggu evaluasi - Tombol
Lihat Jurnal - Total siswa bimbingan - Jurnal belum dinilai - Rasio
kehadiran hari ini - Daftar jurnal terbaru - Daftar siswa bimbingan -
Status kehadiran

### B. Siswa Bimbingan

Route: `/guru/siswa`

Tabel: - Nama siswa - NIS - Kelas - Tempat magang - Alamat DUDI - Status
magang - Nilai akhir - Aksi

Fitur: - Detail siswa - Beri nilai - Revisi nilai

Modal penilaian: - Identitas siswa - Nilai akhir 0--100 - Catatan
penilaian - Tombol Simpan

Guru hanya boleh memberikan nilai kepada siswa bimbingannya sendiri.

### C. Validasi Jurnal & Absensi

Route: `/guru/jurnal`

Buat dua tab.

**Tab 1 --- Jurnal Kegiatan**

Statistik: - Menunggu Validasi - Disetujui - Perlu Revisi

Tabel: - Tanggal - Nama siswa - Kegiatan - Foto bukti - Status - Aksi

Modal validasi: - Detail kegiatan - Kendala - Solusi - Foto bukti -
Pilihan Setujui Jurnal / Minta Revisi - Catatan evaluasi - Tombol Simpan

**Tab 2 --- Absensi Siswa**

Statistik: - Menunggu Validasi - Disetujui - Ditolak

Tabel: - Tanggal - Nama siswa - Status kehadiran - Foto bukti - Status
validasi - Aksi

Modal: - Detail absensi - Foto bukti - Status Sakit/Izin - Pilihan
Setujui/Tolak - Catatan guru - Simpan keputusan

### D. Kunjungan Lapangan

Route: `/guru/kunjungan`

Tampilkan: - Total kunjungan - Kunjungan bulan ini - Total DUDI
dikunjungi - Timeline kronologis

Setiap kunjungan: - Nama DUDI - Tanggal - Catatan evaluasi - Foto -
Detail - Edit - Hapus

Form: - Pilih DUDI - Tanggal - Catatan evaluasi - Upload foto

Hapus menggunakan alert konfirmasi.

------------------------------------------------------------------------

## 9. PORTAL SISWA MAGANG

Sidebar: - Dashboard - Pengajuan Magang - Absensi Harian - Jurnal
Kegiatan

### A. Dashboard Siswa

Route: `/siswa/dashboard`

Tampilkan: - Sapaan nama siswa - Informasi penempatan - Nama
perusahaan - Nama guru pembimbing - Periode magang - Total hari hadir -
Total jurnal terverifikasi - Pintasan absensi - Pintasan jurnal

Jika belum mendapatkan penempatan, tampilkan empty state dengan tombol
menuju Pengajuan Magang.

### B. Pengajuan Magang

Route: `/siswa/pengajuan`

Fitur: - Daftar DUDI terverifikasi - Informasi kuota - Form pengajuan -
Posisi yang diminati - Tanggal mulai - Tanggal selesai - Riwayat
pengajuan

Status: - Menunggu Validasi Admin - Disetujui - Ditolak

Tampilkan alasan penolakan jika ada.

### C. Absensi Harian

Route: `/siswa/absensi`

Tabel: - Tanggal - Status kehadiran - Jam masuk - Jam pulang - Foto
presensi - Status validasi guru

Form: - Tanggal - Hadir/Sakit/Izin - Jam masuk - Jam pulang - Upload
foto selfie - Upload surat keterangan jika diperlukan

Gunakan Supabase Storage.

Validasi: - Siswa hanya dapat membuat presensi sendiri - Hindari
duplikasi presensi per tanggal - Bukti foto harus benar-benar diunggah -
Guru harus dapat memvalidasi presensi

### D. Jurnal Kegiatan Harian

Route: `/siswa/jurnal`

Tabel: - Tanggal - Rincian kegiatan - Kendala - Solusi - Foto bukti -
Status verifikasi - Catatan guru - Edit/Hapus

Form: - Tanggal - Uraian kegiatan minimal 15 karakter - Kendala -
Solusi - Foto bukti

Status: - Menunggu - Disetujui - Perlu Revisi

Siswa dapat memperbaiki jurnal yang dikembalikan. Jurnal yang telah
disetujui tidak boleh diedit sembarangan. Hapus jurnal draft/pending
menggunakan alert konfirmasi.

------------------------------------------------------------------------

## 10. DATABASE SUPABASE

Database wajib mengikuti 10 entitas utama dalam PDF UKK:

1.  `profiles`
2.  `guru`
3.  `siswa`
4.  `tempat_magang`
5.  `penempatan_magang`
6.  `pengajuan_magang`
7.  `absensi`
8.  `jurnal_harian`
9.  `kunjungan`
10. `activity_logs`

Pelajari ERD pada halaman 4 PDF dan ikuti relasi yang ditampilkan.
Jangan mengarang atau mengubah relasi yang ditentukan dokumen.

Ketentuan: - Primary Key - Foreign Key - Unique constraint - Not Null -
Check constraint - created_at - updated_at - Index - Relasi antartabel -
Referential integrity

Gunakan UUID dan relasi ke `auth.users` jika sesuai dengan spesifikasi.

Buat migration SQL yang dapat dijalankan di Supabase.

Jika memerlukan tabel pendukung seperti konfigurasi sistem,
dokumentasikan alasan dan relasinya. Jangan menghilangkan sepuluh
entitas utama.

### RLS --- Row Level Security

Aktifkan RLS untuk seluruh tabel aplikasi dan buat policy berdasarkan
role serta kepemilikan data.

**ADMIN** - Mengelola seluruh data sesuai kewenangan.

**GURU** - Mengakses siswa bimbingannya. - Mengakses jurnal siswa
bimbingannya. - Memvalidasi absensi. - Mengelola kunjungan sesuai
kewenangannya. - Memberikan nilai akhir.

**SISWA** - Mengakses data miliknya. - Membuat absensi sendiri. -
Membuat jurnal sendiri. - Melihat hasil validasi. - Mengajukan magang.

Jangan izinkan: - Siswa mengubah role. - Siswa mengubah hasil
validasi. - Guru mengakses siswa di luar bimbingannya. - Pengguna
mengakses data pengguna lain.

Uji setiap policy menggunakan akun dari masing-masing role.

------------------------------------------------------------------------

## 11. SUPABASE API KEYS DAN ENVIRONMENT CONFIGURATION

Project Supabase:

`https://rqdoeuuzschrwzmwslcq.supabase.co`

Saya menggunakan dua jenis API Key: 1. Publishable Key 2. Secret Key

Keduanya memiliki fungsi berbeda dan wajib digunakan dengan aturan
keamanan yang benar.

### A. File `.env.local`

Buat atau periksa file `.env.local` pada root project.

Format:

``` env
NEXT_PUBLIC_SUPABASE_URL=https://rqdoeuuzschrwzmwslcq.supabase.co

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=ISI_PUBLISHABLE_KEY_KAMU

SUPABASE_SECRET_KEY=ISI_SECRET_KEY_KAMU
```

PENTING: - Publishable Key sudah saya siapkan. - Secret Key akan saya
masukkan sendiri ke `.env.local`. - Jangan meminta saya mengirim Secret
Key melalui chat. - Jangan menampilkan isi Secret Key dalam terminal,
log, browser, atau laporan. - Jangan menulis key secara hardcoded di
source code. - Jangan menghapus atau menimpa environment variables yang
sudah tersedia.

### B. Publishable Key

Gunakan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Key ini boleh digunakan pada browser untuk: - Supabase browser client -
Autentikasi pengguna - Query database sesuai hak akses - Operasi normal
aplikasi yang tunduk pada RLS

### C. Secret Key

Gunakan `SUPABASE_SECRET_KEY`.

Key ini hanya boleh digunakan di server untuk operasi administratif yang
membutuhkan hak istimewa, misalnya: - Membuat akun guru - Membuat akun
siswa - Mengelola akun melalui Supabase Admin API - Operasi backend
administratif tertentu

Secret Key memiliki akses istimewa dan dapat melewati RLS.

Karena itu: - Jangan gunakan pada Client Component. - Jangan gunakan
dalam browser. - Jangan gunakan variabel `NEXT_PUBLIC_`. - Jangan kirim
key ke frontend. - Jangan kembalikan key melalui API response. - Jangan
cetak key pada console. - Jangan masukkan key ke GitHub. - Jangan
gunakan key ini untuk query normal pengguna.

### D. Supabase Client Architecture

Gunakan `@supabase/ssr`.

Pisahkan:

1.  **Browser client:** menggunakan URL dan Publishable Key.
2.  **Server client:** menggunakan URL dan Publishable Key serta
    mekanisme cookie/session.
3.  **Admin client:** menggunakan URL dan Secret Key, hanya dapat
    diimpor pada server-only modules.

Pastikan admin client tidak pernah masuk ke bundle browser. Gunakan
`server-only` untuk modul yang mengakses Secret Key. Jangan mencampurkan
admin client dengan browser client.

### E. Penggunaan Admin API

Ketika administrator membuat akun guru atau siswa:

1.  Form dikirim ke server.
2.  Server memverifikasi session pengguna.
3.  Server memeriksa role admin dari sumber tepercaya.
4.  Server memvalidasi seluruh input.
5.  Server menggunakan Supabase Admin API untuk membuat akun Auth jika
    diperlukan.
6.  Server membuat atau memperbarui profil pengguna.
7.  Server menghubungkan data guru/siswa dengan akun Auth.
8.  Server mencatat aktivitas.
9.  Server mengembalikan hasil operasi tanpa mengekspos Secret Key.

Tangani kegagalan agar tidak meninggalkan data yang tidak konsisten.
Jangan memberikan hak istimewa admin kepada pengguna hanya karena
permintaan berasal dari frontend.

------------------------------------------------------------------------

## 12. SUPABASE STORAGE

Buat bucket untuk: - Foto absensi - Foto jurnal - Foto kunjungan

Terapkan: - Upload - Preview - Delete sesuai hak akses - Validasi tipe
file - Validasi ukuran file - Penamaan file yang aman - Private bucket
jika sesuai kebutuhan - Signed URL untuk akses file privat

Jangan menyimpan foto sebagai Base64 di database. Simpan path file dan
metadata yang diperlukan.

------------------------------------------------------------------------

## 13. AKUN DEMO DAN DATA SEEDING

Siapkan data realistis untuk pengujian. Minimal: - 1 Administrator - 3
Guru - 10 Siswa - 5 Mitra DUDI - Beberapa penempatan - Beberapa
pengajuan - Data absensi - Data jurnal - Data kunjungan - Activity logs

Setiap data harus saling terhubung dengan benar.

Siapkan akun demo untuk ketiga role. Pastikan akun demo dapat digunakan
untuk menguji seluruh fitur.

Gunakan mekanisme pembuatan akun demo yang aman melalui server atau
Supabase Dashboard. Jangan menyimpan password akun production di source
code.

Buat dokumentasi akun demo dan langkah setup.

------------------------------------------------------------------------

## 14. STANDAR UI/UX

Semua halaman harus mempunyai desain konsisten dan mengikuti referensi.

### Sidebar

-   Logo
-   Navigasi berdasarkan role
-   Active menu
-   Icon
-   Collapsible jika sesuai referensi
-   Mobile navigation

### Header

-   Breadcrumb
-   Judul halaman
-   Profil pengguna
-   Dropdown akun
-   Logout

### Card

-   Stat cards
-   Informasi
-   Status
-   Ringkasan

### Tabel

-   Search
-   Filter
-   Pagination
-   Sorting jika diperlukan
-   Badge status
-   Tombol aksi
-   Empty state
-   Loading state

### Modal

-   Judul dan deskripsi
-   Form
-   Validasi
-   Tombol Batal
-   Tombol Simpan
-   Loading
-   Error state

### Alert dialog

Gunakan konfirmasi sebelum: - Hapus guru - Hapus siswa - Hapus DUDI -
Batalkan penempatan - Hapus kunjungan - Hapus jurnal

### Toast

Tampilkan notifikasi untuk: - Berhasil menyimpan - Berhasil mengubah -
Berhasil menghapus - Berhasil memvalidasi - Gagal melakukan operasi

### Responsive

Pastikan: - Desktop optimal - Tablet adaptif - Mobile nyaman - Modal
tidak terpotong - Form mudah digunakan - Sidebar menyesuaikan ukuran
layar - Tabel dapat di-scroll atau menggunakan tampilan alternatif

Jangan membuat halaman yang hanya terlihat bagus di desktop.

------------------------------------------------------------------------

## 15. STRUKTUR PROJECT

Gunakan struktur modular dan sesuaikan dengan project yang sudah ada.

Contoh:

``` text
src/
  app/
    (public)/
      page.tsx
      login/
        page.tsx

    admin/
      dashboard/
      monitoring/
      guru/
      siswa/
      dudi/
      penempatan/
      settings/
      logs/

    guru/
      dashboard/
      siswa/
      jurnal/
      kunjungan/

    siswa/
      dashboard/
      pengajuan/
      absensi/
      jurnal/

  components/
    ui/
    layout/
    dashboard/
    forms/
    tables/
    dialogs/

  lib/
    supabase/
      client.ts
      server.ts
      admin.ts
    validations/
    utils/

  hooks/
  types/
```

Buat reusable components: - DashboardSidebar - DashboardHeader -
Breadcrumb - StatCard - DataTable - SearchInput - FilterDropdown -
StatusBadge - FormDialog - ConfirmDialog - EmptyState -
LoadingSkeleton - PageHeader

Jangan menempatkan seluruh logika dalam satu file.

------------------------------------------------------------------------

## 16. TESTING DAN QUALITY ASSURANCE

Lakukan pengujian menyeluruh.

### Public

-   [ ] Landing page
-   [ ] Navigasi
-   [ ] Login
-   [ ] Password reset

### Authentication

-   [ ] Admin login
-   [ ] Guru login
-   [ ] Siswa login
-   [ ] Redirect role
-   [ ] Logout
-   [ ] Session refresh
-   [ ] Protected route

### Admin

-   [ ] Dashboard
-   [ ] Monitoring
-   [ ] CRUD guru
-   [ ] CRUD siswa
-   [ ] CRUD DUDI
-   [ ] Plotting
-   [ ] Penempatan
-   [ ] Settings
-   [ ] Activity logs

### Guru

-   [ ] Dashboard
-   [ ] Siswa bimbingan
-   [ ] Detail siswa
-   [ ] Penilaian akhir
-   [ ] Validasi jurnal
-   [ ] Validasi absensi
-   [ ] Kunjungan lapangan

### Siswa

-   [ ] Dashboard
-   [ ] Pengajuan
-   [ ] Absensi
-   [ ] Upload foto
-   [ ] Jurnal
-   [ ] Edit jurnal
-   [ ] Status validasi

### Database dan Security

-   [ ] Relasi database
-   [ ] Foreign keys
-   [ ] Unique constraints
-   [ ] RLS
-   [ ] Role permissions
-   [ ] Storage policies
-   [ ] Secret Key hanya di server
-   [ ] Tidak ada kebocoran environment variables
-   [ ] Tidak ada akses lintas pengguna

### UI/UX

-   [ ] Semua tombol berfungsi
-   [ ] Semua modal berfungsi
-   [ ] Semua form berfungsi
-   [ ] Semua dropdown berfungsi
-   [ ] Toast berfungsi
-   [ ] Responsive desktop
-   [ ] Responsive tablet
-   [ ] Responsive mobile

Periksa TypeScript errors, build errors, console errors, runtime errors,
database errors, dan network errors.

Jangan menyatakan fitur selesai jika belum diuji.

------------------------------------------------------------------------

## 17. TAHAP PENGERJAAN

Jangan mengerjakan semuanya secara acak. Ikuti urutan berikut.

### PHASE 1 --- RESEARCH

-   Pelajari website referensi
-   Pelajari PDF UKK
-   Identifikasi seluruh halaman
-   Identifikasi seluruh komponen
-   Identifikasi seluruh interaksi
-   Periksa project
-   Buat daftar pekerjaan

### PHASE 2 --- DESIGN SYSTEM

-   Identifikasi warna
-   Identifikasi typography
-   Buat spacing system
-   Buat komponen reusable
-   Buat public layout
-   Buat dashboard layout

### PHASE 3 --- DATABASE

-   Buat 10 entitas utama
-   Buat relasi sesuai ERD
-   Buat migration SQL
-   Buat RLS
-   Buat Storage
-   Buat seed data

### PHASE 4 --- AUTHENTICATION

-   Integrasi Supabase
-   Browser client
-   Server client
-   Admin client
-   Login
-   Logout
-   Session
-   Role-based routing
-   Akun demo

### PHASE 5 --- PUBLIC

-   Landing page
-   Login
-   Password reset

### PHASE 6 --- ADMIN

-   Dashboard
-   Monitoring
-   Guru
-   Siswa
-   DUDI
-   Penempatan
-   Settings
-   Logs

### PHASE 7 --- GURU

-   Dashboard
-   Siswa bimbingan
-   Validasi jurnal dan absensi
-   Kunjungan lapangan

### PHASE 8 --- SISWA

-   Dashboard
-   Pengajuan magang
-   Absensi harian
-   Jurnal kegiatan

### PHASE 9 --- INTEGRATION

-   Hubungkan seluruh form
-   Hubungkan seluruh CRUD
-   Hubungkan Storage
-   Hubungkan validasi
-   Hubungkan notifikasi
-   Hubungkan dashboard dengan database

### PHASE 10 --- FINAL TESTING

-   Uji semua role
-   Uji semua route
-   Uji semua tombol
-   Uji semua modal
-   Uji seluruh database
-   Uji keamanan
-   Perbaiki error
-   Pastikan aplikasi dapat dijalankan dan di-build

------------------------------------------------------------------------

## 18. ATURAN WAJIB SELAMA PENGERJAAN

1.  Jangan hanya membuat tampilan frontend.
2.  Jangan membuat tombol dummy.
3.  Jangan membuat halaman kosong.
4.  Jangan menggunakan data statis untuk menggantikan database.
5.  Jangan menggunakan localStorage sebagai autentikasi.
6.  Jangan menghilangkan fitur dari PDF.
7.  Jangan mengubah tiga role utama.
8.  Jangan mengubah desain referensi menjadi template generik.
9.  Jangan membuat komponen berbeda-beda tanpa konsistensi.
10. Jangan mengabaikan RLS.
11. Jangan mengekspos Secret Key.
12. Jangan menghapus konfigurasi project tanpa alasan.
13. Jangan mengklaim fitur berhasil jika belum diuji.
14. Jangan berhenti setelah membuat landing page.
15. Jangan membuat implementasi yang hanya bekerja dengan satu akun
    admin.

Jika ada masalah, periksa penyebabnya dan perbaiki sebelum melanjutkan.
Jika ada fitur yang belum dapat diselesaikan, laporkan secara
transparan.

------------------------------------------------------------------------

## 19. OUTPUT AKHIR

Saya menginginkan website SIMMAS yang: - Memiliki tampilan sangat mirip
dengan referensi - Memiliki semua halaman sesuai spesifikasi - Memiliki
navigasi yang benar - Memiliki tiga portal pengguna - Memiliki database
relasional - Memiliki autentikasi Supabase - Memiliki proteksi role -
Memiliki RLS - Memiliki CRUD lengkap - Memiliki upload file - Memiliki
modal dan alert - Memiliki dashboard dinamis - Memiliki desain
responsif - Tidak memiliki tombol mati - Siap digunakan untuk
demonstrasi UKK

**Prioritas utama:** 1. Visual fidelity terhadap website referensi 2.
Kelengkapan fitur berdasarkan PDF UKK 3. Fungsionalitas seluruh
interaksi 4. Integrasi Supabase 5. Keamanan autentikasi dan database 6.
Kualitas kode

### INSTRUKSI TERAKHIR

Mulailah dengan PHASE 1.

Jangan langsung melakukan coding sebelum menganalisis website referensi
dan struktur project.

Setelah analisis selesai, buat daftar route, komponen, database, dan
fitur yang akan diimplementasikan.

Lanjutkan pengerjaan secara bertahap sampai semua fase selesai.

Saya ingin kamu benar-benar membangun aplikasi SIMMAS, bukan sekadar
mendesain ulang tampilannya.

Pastikan setiap fitur yang sudah selesai diuji dan dicatat dalam
checklist.

**JANGAN BERHENTI DI TENGAH JALAN. SELESAIKAN SELURUH MODUL SAMPAI
APLIKASI SIAP DIDEMONSTRASIKAN.**
