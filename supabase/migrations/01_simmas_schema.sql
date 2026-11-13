-- ==============================================================================
-- SIMMAS UKK RPL 2026 - MIGRATION 01: DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Helper function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- TABLE 1: PROFILES (User role & metadata)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'guru', 'siswa')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 2: GURU (Data Guru Pembimbing)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.guru (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nip VARCHAR(30) NOT NULL UNIQUE,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  jurusan VARCHAR(100) NOT NULL, -- Kompetensi keahlian (RPL, TKJ, dll)
  no_telepon VARCHAR(30),
  status VARCHAR(20) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 3: TEMPAT_MAGANG (Data Mitra DUDI)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.tempat_magang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_perusahaan VARCHAR(200) NOT NULL,
  bidang_usaha VARCHAR(100) NOT NULL,
  penanggung_jawab VARCHAR(150) NOT NULL,
  kontak VARCHAR(50) NOT NULL,
  alamat TEXT NOT NULL,
  kuota INT NOT NULL DEFAULT 5 CHECK (kuota >= 0),
  status VARCHAR(30) NOT NULL DEFAULT 'terverifikasi' CHECK (status IN ('terverifikasi', 'menunggu', 'ditolak')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 4: SISWA (Data Siswa Magang)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.siswa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nis VARCHAR(30) NOT NULL UNIQUE,
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  kelas VARCHAR(50) NOT NULL,
  jurusan VARCHAR(100),
  no_telepon VARCHAR(30),
  status_magang VARCHAR(30) NOT NULL DEFAULT 'belum_mengajukan' CHECK (status_magang IN ('belum_mengajukan', 'menunggu', 'magang', 'selesai', 'dibatalkan')),
  guru_id UUID REFERENCES public.guru(id) ON DELETE SET NULL,
  dudi_id UUID REFERENCES public.tempat_magang(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 5: PENEMPATAN_MAGANG (Penempatan Resmi Siswa di DUDI)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.penempatan_magang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  dudi_id UUID NOT NULL REFERENCES public.tempat_magang(id) ON DELETE RESTRICT,
  guru_id UUID NOT NULL REFERENCES public.guru(id) ON DELETE RESTRICT,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai', 'dibatalkan')),
  nilai_akhir NUMERIC(5,2) DEFAULT NULL CHECK (nilai_akhir >= 0 AND nilai_akhir <= 100),
  catatan_nilai TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_tanggal_penempatan CHECK (tanggal_selesai >= tanggal_mulai)
);

-- ==============================================================================
-- TABLE 6: PENGAJUAN_MAGANG (Pengajuan Magang Mandiri / Rekomendasi Siswa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pengajuan_magang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  dudi_id UUID REFERENCES public.tempat_magang(id) ON DELETE SET NULL,
  nama_dudi_usulan VARCHAR(200),
  alamat_dudi_usulan TEXT,
  posisi VARCHAR(100) NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'disetujui', 'ditolak')),
  alasan_penolakan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 7: ABSENSI (Presensi Kehadiran Siswa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.absensi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('hadir', 'izin', 'sakit')),
  waktu_masuk TIME,
  waktu_pulang TIME,
  photo_masuk_url TEXT,
  photo_pulang_url TEXT,
  catatan TEXT,
  validasi_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (validasi_status IN ('pending', 'approved', 'rejected')),
  catatan_guru TEXT,
  validated_by UUID REFERENCES public.guru(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(siswa_id, tanggal)
);

-- ==============================================================================
-- TABLE 8: JURNAL_HARIAN (Catatan Kegiatan Harian Siswa)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.jurnal_harian (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id UUID NOT NULL REFERENCES public.siswa(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  kegiatan TEXT NOT NULL,
  kendala TEXT,
  solusi TEXT,
  photo_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'disetujui', 'revisi')),
  catatan_guru TEXT,
  validated_by UUID REFERENCES public.guru(id) ON DELETE SET NULL,
  validated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 9: KUNJUNGAN (Log Monitoring Lapangan oleh Guru)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.kunjungan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guru_id UUID NOT NULL REFERENCES public.guru(id) ON DELETE CASCADE,
  dudi_id UUID NOT NULL REFERENCES public.tempat_magang(id) ON DELETE RESTRICT,
  tanggal DATE NOT NULL,
  catatan TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 10: ACTIVITY_LOGS (Audit Trail Sistem)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email VARCHAR(150) NOT NULL,
  actor_role VARCHAR(30) NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id TEXT,
  level VARCHAR(20) NOT NULL DEFAULT 'INFO' CHECK (level IN ('INFO', 'WARN', 'ERROR')),
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE 11: APP_SETTINGS (Konfigurasi Global & Tampilan)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.app_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  app_name VARCHAR(100) DEFAULT 'jagang company',
  app_description TEXT DEFAULT 'Sistem Informasi Manajemen Magang Siswa',
  contact_email VARCHAR(100) DEFAULT 'info@simmas.sch.id',
  landing_hero_title TEXT DEFAULT 'Magang\nlebih\nteratur.',
  landing_hero_subtitle TEXT DEFAULT 'Sistem Informasi Manajemen Magang Siswa',
  landing_hero_description TEXT DEFAULT 'Platform manajemen magang siswa SMK yang menghubungkan sekolah, guru pembimbing, dan dunia usaha dalam satu sistem terpadu.',
  school_name VARCHAR(150) DEFAULT 'SMK Negeri 1 Surabaya',
  school_address TEXT DEFAULT 'Jl. SMEA No. 4, Wonokromo, Surabaya',
  school_phone VARCHAR(50) DEFAULT '(031) 8292038',
  school_website VARCHAR(100) DEFAULT 'www.smkn1-sby.sch.id',
  principal_name VARCHAR(150) DEFAULT 'Drs. H. Sugiyono, M.Pd.',
  principal_nip VARCHAR(50) DEFAULT '196503151989031008',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default app settings if not exists
INSERT INTO public.app_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- TRIGGERS: updated_at for all tables
-- ==============================================================================
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('profiles', 'guru', 'tempat_magang', 'siswa', 'penempatan_magang', 'pengajuan_magang', 'absensi', 'jurnal_harian', 'kunjungan', 'app_settings')
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_update_updated_at ON public.%I', t);
    EXECUTE format('CREATE TRIGGER trg_update_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t);
  END LOOP;
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guru ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tempat_magang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.penempatan_magang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pengajuan_magang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurnal_harian ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kunjungan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role safely
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. PROFILES RLS
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admin full access profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 2. GURU RLS
CREATE POLICY "Guru viewable by authenticated users"
  ON public.guru FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin full access guru"
  ON public.guru FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 3. TEMPAT_MAGANG RLS
CREATE POLICY "Tempat magang viewable by all"
  ON public.tempat_magang FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admin full access tempat_magang"
  ON public.tempat_magang FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 4. SISWA RLS
CREATE POLICY "Siswa viewable by authenticated users"
  ON public.siswa FOR SELECT
  TO authenticated
  USING (
    public.get_auth_role() = 'admin' 
    OR user_id = auth.uid() 
    OR guru_id IN (SELECT id FROM public.guru WHERE user_id = auth.uid())
  );

CREATE POLICY "Siswa can update own contact"
  ON public.siswa FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin full access siswa"
  ON public.siswa FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 5. PENEMPATAN_MAGANG RLS
CREATE POLICY "Penempatan viewable by involved users"
  ON public.penempatan_magang FOR SELECT
  TO authenticated
  USING (
    public.get_auth_role() = 'admin'
    OR guru_id IN (SELECT id FROM public.guru WHERE user_id = auth.uid())
    OR siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid())
  );

CREATE POLICY "Guru can update nilai on their students"
  ON public.penempatan_magang FOR UPDATE
  TO authenticated
  USING (guru_id IN (SELECT id FROM public.guru WHERE user_id = auth.uid()));

CREATE POLICY "Admin full access penempatan"
  ON public.penempatan_magang FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 6. PENGAJUAN_MAGANG RLS
CREATE POLICY "Pengajuan viewable by admin and student"
  ON public.pengajuan_magang FOR SELECT
  TO authenticated
  USING (
    public.get_auth_role() = 'admin'
    OR siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid())
  );

CREATE POLICY "Siswa can insert own pengajuan"
  ON public.pengajuan_magang FOR INSERT
  TO authenticated
  WITH CHECK (siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid()));

CREATE POLICY "Admin full access pengajuan"
  ON public.pengajuan_magang FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 7. ABSENSI RLS
CREATE POLICY "Absensi viewable by admin, student, and assigned teacher"
  ON public.absensi FOR SELECT
  TO authenticated
  USING (
    public.get_auth_role() = 'admin'
    OR siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid())
    OR siswa_id IN (
      SELECT s.id FROM public.siswa s 
      JOIN public.guru g ON s.guru_id = g.id 
      WHERE g.user_id = auth.uid()
    )
  );

CREATE POLICY "Siswa can insert and update own absensi"
  ON public.absensi FOR INSERT
  TO authenticated
  WITH CHECK (siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid()));

CREATE POLICY "Siswa can update own absensi"
  ON public.absensi FOR UPDATE
  TO authenticated
  USING (siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid()));

CREATE POLICY "Guru can validate absensi of assigned student"
  ON public.absensi FOR UPDATE
  TO authenticated
  USING (
    siswa_id IN (
      SELECT s.id FROM public.siswa s 
      JOIN public.guru g ON s.guru_id = g.id 
      WHERE g.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin full access absensi"
  ON public.absensi FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 8. JURNAL_HARIAN RLS
CREATE POLICY "Jurnal viewable by admin, student, and assigned teacher"
  ON public.jurnal_harian FOR SELECT
  TO authenticated
  USING (
    public.get_auth_role() = 'admin'
    OR siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid())
    OR siswa_id IN (
      SELECT s.id FROM public.siswa s 
      JOIN public.guru g ON s.guru_id = g.id 
      WHERE g.user_id = auth.uid()
    )
  );

CREATE POLICY "Siswa can insert own jurnal"
  ON public.jurnal_harian FOR INSERT
  TO authenticated
  WITH CHECK (siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid()));

CREATE POLICY "Siswa can update own unapproved jurnal"
  ON public.jurnal_harian FOR UPDATE
  TO authenticated
  USING (
    siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid())
    AND status IN ('menunggu', 'revisi')
  );

CREATE POLICY "Guru can validate jurnal of assigned student"
  ON public.jurnal_harian FOR UPDATE
  TO authenticated
  USING (
    siswa_id IN (
      SELECT s.id FROM public.siswa s 
      JOIN public.guru g ON s.guru_id = g.id 
      WHERE g.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin full access jurnal"
  ON public.jurnal_harian FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 9. KUNJUNGAN RLS
CREATE POLICY "Kunjungan viewable by admin and guru"
  ON public.kunjungan FOR SELECT
  TO authenticated
  USING (
    public.get_auth_role() = 'admin'
    OR guru_id IN (SELECT id FROM public.guru WHERE user_id = auth.uid())
  );

CREATE POLICY "Guru can manage own kunjungan"
  ON public.kunjungan FOR ALL
  TO authenticated
  USING (guru_id IN (SELECT id FROM public.guru WHERE user_id = auth.uid()));

CREATE POLICY "Admin full access kunjungan"
  ON public.kunjungan FOR ALL
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- 10. ACTIVITY_LOGS RLS
CREATE POLICY "Admin can view activity logs"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (public.get_auth_role() = 'admin');

CREATE POLICY "Authenticated users can insert activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 11. APP_SETTINGS RLS
CREATE POLICY "App settings viewable by everyone"
  ON public.app_settings FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admin can update app settings"
  ON public.app_settings FOR UPDATE
  TO authenticated
  USING (public.get_auth_role() = 'admin');

-- Service role bypasses all RLS automatically.

