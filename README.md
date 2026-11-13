# SIMMAS - Sistem Informasi Manajemen Magang Siswa (UKK RPL 2026)

> Sistem Informasi Manajemen Magang Siswa (SIMMAS) berbasis web modern untuk Uji Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak (RPL) 2026.
> 
> **Live Reference Website:** [https://simmas.bagus-hidayat.my.id/](https://simmas.bagus-hidayat.my.id/)

---

## 🚀 Fitur Utama & Arsitektur

Aplikasi ini dibangun menggunakan arsitektur modern Next.js 16 App Router dengan integrasi penuh Supabase untuk otentikasi berbasis peran (RBAC) dan database relasional.

### 👥 3 Role Pengguna & Kredensial Demo

| Peran (Role) | Email Demo | Password Demo | Hak Akses Utama |
|---|---|---|---|
| **Administrator** | `admin@simmas.sch.id` | `password123` | Manajemen Master Guru, Siswa, DUDI, Penempatan, Pengaturan Sistem, Monitoring & Audit Log |
| **Guru Pembimbing** | `guru@simmas.sch.id` | `password123` | Monitoring Siswa Bimbingan, Verifikasi Jurnal Harian, Pencatatan & Dokumentasi Kunjungan DUDI |
| **Siswa Magang** | `siswa@simmas.sch.id` | `password123` | Pengajuan Tempat Magang, Presensi Harian (Clock In/Out), Pengisian Jurnal Kegiatan Harian |

> 💡 *Pada halaman `/login`, tersedia tombol Quick Auto-Fill untuk setiap peran agar mempermudah pengujian instan.*

---

## 🗄️ Struktur Database (10 Entitas Relasional UKK)

Skema database dirancang sesuai dengan standar UKK RPL 2026 dan didokumentasikan di folder `supabase/migrations/`:

1. **`profiles`** - Metadata profil pengguna & role (`admin`, `guru`, `siswa`)
2. **`guru`** - Data induk guru pembimbing (NIP, Nama, Kontak, Bidang)
3. **`tempat_magang`** - Data mitra Dunia Usaha / Dunia Industri (DUDI), kuota, kontak, & alamat
4. **`siswa`** - Data induk siswa peserta magang (NIS, Nama, Kelas, Status)
5. **`penempatan_magang`** - Relasi penempatan siswa di DUDI dengan pembimbing
6. **`pengajuan_magang`** - Formulir dan riwayat usulan tempat magang oleh siswa
7. **`absensi`** - Pencatatan presensi harian (hadir, sakit, izin, alpha) beserta koordinat/metode
8. **`jurnal_harian`** - Buku jurnal kegiatan harian siswa beserta status verifikasi guru
9. **`kunjungan`** - Rekam monitoring dan catatan supervisi guru ke lokasi DUDI
10. **`activity_logs`** - Jejak audit otomatis untuk setiap aksi CRUD dan perubahan status
11. **`app_settings`** - Konfigurasi global sekolah, tahun ajaran, dan periode magang

---

## 💻 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19, Server Actions, Turbopack)
- **Backend & Auth:** [Supabase](https://supabase.com/) (`@supabase/ssr`, `@supabase/supabase-js`)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Type Safety:** TypeScript (Strict Mode)

---

## 📂 Struktur Direktori Proyek

```
ukk-simmas/
├── app/
│   ├── actions/               # Server Actions (Auth & CRUD)
│   ├── admin/                 # Portal Administrator
│   │   ├── dashboard/
│   │   ├── dudi/
│   │   ├── guru/
│   │   ├── logs/
│   │   ├── monitoring/
│   │   ├── penempatan/
│   │   ├── settings/
│   │   └── siswa/
│   ├── guru/                  # Portal Guru Pembimbing
│   │   ├── dashboard/
│   │   ├── jurnal/
│   │   ├── kunjungan/
│   │   └── siswa/
│   ├── siswa/                 # Portal Siswa Magang
│   │   ├── absensi/
│   │   ├── dashboard/
│   │   ├── jurnal/
│   │   └── pengajuan/
│   ├── login/                 # Halaman Login Multi-Role dengan Auto-Fill
│   ├── globals.css            # Style global & token warna tema
│   ├── layout.tsx             # Root layout & Toaster
│   └── page.tsx               # Landing Page Resmi SIMMAS
├── components/
│   ├── dashboard/             # Sidebar, Header, StatCard, Chart
│   ├── shared/                # Logo, ConfirmDialog
│   └── ui/                    # Atomic UI (Button, Badge, Card, Dialog, Table, Tabs)
├── lib/
│   ├── services/              # Layanan data (Admin, Guru, Siswa Service)
│   ├── supabase/              # Inisialisasi Supabase (Client, Server, Admin)
│   └── utils.ts               # Formatter tanggal & helper classnames
├── supabase/
│   └── migrations/
│       ├── 01_simmas_schema.sql # DDL skema tabel & RLS Policies
│       └── 02_simmas_seed.sql   # Data awal realistis untuk pengujian
├── types/
│   └── database.ts            # Definisi tipe TypeScript seluruh entitas
├── middleware.ts              # Proteksi route berbasis peran (RBAC)
└── package.json
```

---

## 🛠️ Panduan Menjalankan Proyek

### 1. Prasyarat
- Node.js 20+
- npm atau pnpm

### 2. Kloning dan Instalasi Dependensi
```bash
# Masuk ke direktori proyek
cd ukk-simmas

# Install dependencies
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` ke `.env.local` dan sesuaikan kredensial Supabase Anda:
```bash
cp .env.example .env.local
```

Isi variabel berikut di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SECRET_KEY=your-supabase-service-role-key
```

### 4. Menjalankan Database Migrations (Supabase)
Jalankan file SQL berikut secara berurutan di Supabase SQL Editor:
1. `supabase/migrations/01_simmas_schema.sql` (Membuat tabel, index, trigger, dan RLS)
2. `supabase/migrations/02_simmas_seed.sql` (Mengisi data dummy guru, siswa, DUDI, penempatan, dan presensi)

### 5. Menjalankan Server Development
```bash
npm run dev
```
Buka browser pada [http://localhost:3000](http://localhost:3000).

### 6. Membangun Versi Produksi
```bash
npm run build
npm run start
```

---

## 🛡️ Keamanan & Validasi (Best Practices)
- **Role-Based Access Control (RBAC):** `middleware.ts` memverifikasi token dan memastikan pengguna hanya dapat membuka portal yang sesuai dengan hak aksesnya.
- **Strict Typing:** Seluruh input dan payload divalidasi dengan Zod schema dan TypeScript interfaces.
- **Audit Logging:** Setiap perubahan data dan aksi penting dicatat secara terpusat pada tabel `activity_logs`.
- **Zero Dummy Actions:** Seluruh tombol aksi, modal formulir, filter pencarian, dan tabs dirancang interaktif dan fungsional.

---

Dibuat dengan ❤️ untuk Uji Kompetensi Keahlian (UKK) Rekayasa Perangkat Lunak 2026.
