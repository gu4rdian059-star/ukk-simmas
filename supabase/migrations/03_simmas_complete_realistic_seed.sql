-- ==============================================================================
-- SIMMAS UKK RPL 2026 - COMPLETE & REALISTIC PRODUCTION SEED DATA
-- Menghilangkan dummy UUID (aaaa..., 1000..., dll) menjadi standard gen_random_uuid()
-- Mengisi 7 DUDI, 20 Guru, 33 Siswa, Penempatan, Absensi, Jurnal, dan Kunjungan
-- Cocok dengan schema Supabase (termasuk kolom is_active & tempat_magang_id)
-- ==============================================================================

-- 1. Bersihkan data dummy lama (Opsional / Bersihkan child tables terlebih dahulu)
TRUNCATE TABLE public.activity_logs, public.jurnal_harian, public.absensi, public.kunjungan, public.penempatan_magang, public.pengajuan_magang CASCADE;
DELETE FROM public.siswa;
DELETE FROM public.guru;
DELETE FROM public.tempat_magang;

-- 2. INSERT 7 MITRA DUDI (Tempat Magang)
INSERT INTO public.tempat_magang (id, nama_perusahaan, bidang_usaha, penanggung_jawab, kontak, alamat, kuota, status)
VALUES
  (gen_random_uuid(), 'PT. Universal Big Data', 'Teknologi Informasi & Data Analytics', 'Budi Santoso, S.Kom.', '081234567890', 'Jl. Tasikmadu No. 88, Malang', 10, 'terverifikasi'),
  (gen_random_uuid(), 'PT. Telkom Indonesia', 'Telekomunikasi & Jaringan', 'Siti Rahmawati, M.T.', '082198765432', 'Jl. Ketintang No. 15, Surabaya', 8, 'terverifikasi'),
  (gen_random_uuid(), 'PT CEO Batu Giok Shangsai', 'E-Commerce & Digital Marketing', 'David Wijaya', '085711223344', 'Komp. Ruko Graha Family Blok B-12, Surabaya', 5, 'terverifikasi'),
  (gen_random_uuid(), 'PT. Solusi Digital Nusantara', 'Software House & App Dev', 'Ahmad Fauzi', '081344556677', 'Jl. Manyar Kertoarjo No. 24, Surabaya', 6, 'terverifikasi'),
  (gen_random_uuid(), 'CV. Media Grafika Kreatif', 'Desain Grafis & Multimedia', 'Nurul Hidayati', '089877665544', 'Jl. Margorejo Indah No. 5, Surabaya', 4, 'terverifikasi'),
  (gen_random_uuid(), 'fhjk', 'Web Development & UI/UX Design', 'Kevin Pratama', '081299887766', 'Jl. Dharmahusada Indah No. 12, Surabaya', 5, 'terverifikasi'),
  (gen_random_uuid(), 'PT kikuk', 'IT Infrastructure & Cloud Service', 'Rian Sanjaya', '085612345678', 'Jl. Mayjen Sungkono No. 101, Surabaya', 5, 'terverifikasi');

-- 3. INSERT 20 GURU PEMBIMBING (Memastikan kompatibel dengan kolom is_active maupun status)
DO $$
DECLARE
  v_has_is_active BOOLEAN;
BEGIN
  -- Cek apakah kolom is_active ada di tabel guru
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'guru' AND column_name = 'is_active'
  ) INTO v_has_is_active;

  IF v_has_is_active THEN
    INSERT INTO public.guru (id, nip, nama, email, jurusan, no_telepon, is_active)
    VALUES
      (gen_random_uuid(), '198501152010011012', 'guruhuhu', 'guru@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081211112222', true),
      (gen_random_uuid(), '198703202012022005', 'Guru Test', 'gurutest@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081233334444', true),
      (gen_random_uuid(), '199008122015031008', 'Dra. Endang Wahyuni, M.Pd.', 'endang.wahyuni@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081255556666', true),
      (gen_random_uuid(), '198304142008011003', 'Rian Pratama, S.Kom., M.Cs.', 'rian.pratama@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081277778888', true),
      (gen_random_uuid(), '198602112009022004', 'Siti Aminah, S.Pd.', 'siti.aminah@simmas.sch.id', 'Multimedia', '081299990000', true),
      (gen_random_uuid(), '198905252014031007', 'Bambang Suryono, S.Kom.', 'bambang.suryono@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081311112222', true),
      (gen_random_uuid(), '198412302008011005', 'Nurul Huda, M.Kom.', 'nurul.huda@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081333334444', true),
      (gen_random_uuid(), '199107182016041002', 'Agus Setiawan, S.Pd.', 'agus.setiawan@simmas.sch.id', 'Multimedia', '081355556666', true),
      (gen_random_uuid(), '198209092006041009', 'Tri Wahyudi, S.Kom.', 'tri.wahyudi@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081377778888', true),
      (gen_random_uuid(), '199201012017052001', 'Fitri Handayani, S.Pd.', 'fitri.handayani@simmas.sch.id', 'Desain Komunikasi Visual', '081399990000', true),
      (gen_random_uuid(), '198806142011011006', 'Hendro Kusumo, S.Kom.', 'hendro.kusumo@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081411112222', true),
      (gen_random_uuid(), '198103232005012002', 'Sri Rahayu, M.Pd.', 'sri.rahayu@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081433334444', true),
      (gen_random_uuid(), '199308192018061003', 'Budi Utomo, S.Kom.', 'budi.utomo@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081455556666', true),
      (gen_random_uuid(), '198605172010012008', 'Lestari Dewi, S.Pd.', 'lestari.dewi@simmas.sch.id', 'Multimedia', '081477778888', true),
      (gen_random_uuid(), '199011212015031005', 'Rahmat Hidayat, S.Kom.', 'rahmat.hidayat@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081499990000', true),
      (gen_random_uuid(), '198710102012022007', 'Wulandari, S.Pd.', 'wulandari@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081511112222', true),
      (gen_random_uuid(), '199404042019071004', 'Doni Kusuma, S.Kom.', 'doni.kusuma@simmas.sch.id', 'Desain Komunikasi Visual', '081533334444', true),
      (gen_random_uuid(), '198912122014032006', 'Mega Pertiwi, S.Pd.', 'mega.pertiwi@simmas.sch.id', 'Multimedia', '081555556666', true),
      (gen_random_uuid(), '198507272009021005', 'Arief Rahman, S.Kom.', 'arief.rahman@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081577778888', true),
      (gen_random_uuid(), '199209152016042003', 'Dewi Kartika, S.Pd.', 'dewi.kartika@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081599990000', true);
  ELSE
    INSERT INTO public.guru (id, nip, nama, email, jurusan, no_telepon, status)
    VALUES
      (gen_random_uuid(), '198501152010011012', 'guruhuhu', 'guru@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081211112222', 'aktif'),
      (gen_random_uuid(), '198703202012022005', 'Guru Test', 'gurutest@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081233334444', 'aktif'),
      (gen_random_uuid(), '199008122015031008', 'Dra. Endang Wahyuni, M.Pd.', 'endang.wahyuni@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081255556666', 'aktif'),
      (gen_random_uuid(), '198304142008011003', 'Rian Pratama, S.Kom., M.Cs.', 'rian.pratama@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081277778888', 'aktif'),
      (gen_random_uuid(), '198602112009022004', 'Siti Aminah, S.Pd.', 'siti.aminah@simmas.sch.id', 'Multimedia', '081299990000', 'aktif'),
      (gen_random_uuid(), '198905252014031007', 'Bambang Suryono, S.Kom.', 'bambang.suryono@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081311112222', 'aktif'),
      (gen_random_uuid(), '198412302008011005', 'Nurul Huda, M.Kom.', 'nurul.huda@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081333334444', 'aktif'),
      (gen_random_uuid(), '199107182016041002', 'Agus Setiawan, S.Pd.', 'agus.setiawan@simmas.sch.id', 'Multimedia', '081355556666', 'aktif'),
      (gen_random_uuid(), '198209092006041009', 'Tri Wahyudi, S.Kom.', 'tri.wahyudi@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081377778888', 'aktif'),
      (gen_random_uuid(), '199201012017052001', 'Fitri Handayani, S.Pd.', 'fitri.handayani@simmas.sch.id', 'Desain Komunikasi Visual', '081399990000', 'aktif'),
      (gen_random_uuid(), '198806142011011006', 'Hendro Kusumo, S.Kom.', 'hendro.kusumo@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081411112222', 'aktif'),
      (gen_random_uuid(), '198103232005012002', 'Sri Rahayu, M.Pd.', 'sri.rahayu@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081433334444', 'aktif'),
      (gen_random_uuid(), '199308192018061003', 'Budi Utomo, S.Kom.', 'budi.utomo@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081455556666', 'aktif'),
      (gen_random_uuid(), '198605172010012008', 'Lestari Dewi, S.Pd.', 'lestari.dewi@simmas.sch.id', 'Multimedia', '081477778888', 'aktif'),
      (gen_random_uuid(), '199011212015031005', 'Rahmat Hidayat, S.Kom.', 'rahmat.hidayat@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081499990000', 'aktif'),
      (gen_random_uuid(), '198710102012022007', 'Wulandari, S.Pd.', 'wulandari@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081511112222', 'aktif'),
      (gen_random_uuid(), '199404042019071004', 'Doni Kusuma, S.Kom.', 'doni.kusuma@simmas.sch.id', 'Desain Komunikasi Visual', '081533334444', 'aktif'),
      (gen_random_uuid(), '198912122014032006', 'Mega Pertiwi, S.Pd.', 'mega.pertiwi@simmas.sch.id', 'Multimedia', '081555556666', 'aktif'),
      (gen_random_uuid(), '198507272009021005', 'Arief Rahman, S.Kom.', 'arief.rahman@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081577778888', 'aktif'),
      (gen_random_uuid(), '199209152016042003', 'Dewi Kartika, S.Pd.', 'dewi.kartika@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081599990000', 'aktif');
  END IF;
END $$;

-- 4. INSERT 33 SISWA LENGKAP (Termasuk data dari live website)
-- Kita ambil ID dari Guru & DUDI pertama untuk relasi
DO $$
DECLARE
  v_guru_huhu UUID;
  v_guru_test UUID;
  v_dudi_fhjk UUID;
  v_dudi_batugiok UUID;
  v_dudi_kikuk UUID;
  v_dudi_bigdata UUID;
BEGIN
  SELECT id INTO v_guru_huhu FROM public.guru WHERE nama = 'guruhuhu' LIMIT 1;
  SELECT id INTO v_guru_test FROM public.guru WHERE nama = 'Guru Test' LIMIT 1;
  SELECT id INTO v_dudi_fhjk FROM public.tempat_magang WHERE nama_perusahaan = 'fhjk' LIMIT 1;
  SELECT id INTO v_dudi_batugiok FROM public.tempat_magang WHERE nama_perusahaan = 'PT CEO Batu Giok Shangsai' LIMIT 1;
  SELECT id INTO v_dudi_kikuk FROM public.tempat_magang WHERE nama_perusahaan = 'PT kikuk' LIMIT 1;
  SELECT id INTO v_dudi_bigdata FROM public.tempat_magang WHERE nama_perusahaan = 'PT. Universal Big Data' LIMIT 1;

  INSERT INTO public.siswa (id, nis, nama, email, kelas, jurusan, no_telepon, status_magang, guru_id, dudi_id)
  VALUES
    -- 4 Siswa teratas persis dari screenshot live
    (gen_random_uuid(), '23123123', 'hihuahmad', 'hihuahmad@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '08123123123', 'magang', v_guru_huhu, v_dudi_fhjk),
    (gen_random_uuid(), '45678', 'penceng siswa', 'penceng.siswa@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '08123456781', 'magang', v_guru_huhu, v_dudi_batugiok),
    (gen_random_uuid(), '1678', 'bagas mahen', 'bagas.mahen.4678@simmas.sch.id', 'hgvgbhinvgj', 'Rekayasa Perangkat Lunak', '08123456782', 'magang', v_guru_huhu, v_dudi_batugiok),
    (gen_random_uuid(), '425364767534231', 'bagas mahen', 'bagas.mahen@simmas.sch.id', 'XII RPL 4', 'Rekayasa Perangkat Lunak', '08123456783', 'selesai', v_guru_test, v_dudi_kikuk),
    
    -- Siswa demo login
    (gen_random_uuid(), '21001', 'Siswa Magang', 'siswa@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000001', 'magang', v_guru_huhu, v_dudi_bigdata),
    
    -- 28 Siswa lainnya melengkapi total 33 siswa
    (gen_random_uuid(), '21002', 'Aditya Pratama', 'aditya.pratama@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000002', 'magang', v_guru_huhu, v_dudi_bigdata),
    (gen_random_uuid(), '21003', 'Bella Safitri', 'bella.safitri@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000003', 'magang', v_guru_test, v_dudi_batugiok),
    (gen_random_uuid(), '21004', 'Chandra Wijaya', 'chandra.wijaya@simmas.sch.id', 'XII RPL 2', 'Rekayasa Perangkat Lunak', '081900000004', 'magang', v_guru_test, v_dudi_fhjk),
    (gen_random_uuid(), '21005', 'Dewi Lestari', 'dewi.lestari@simmas.sch.id', 'XII RPL 2', 'Rekayasa Perangkat Lunak', '081900000005', 'belum_mengajukan', NULL, NULL),
    (gen_random_uuid(), '21006', 'Eko Prasetyo', 'eko.prasetyo@simmas.sch.id', 'XII TKJ 1', 'Teknik Komputer dan Jaringan', '081900000006', 'belum_mengajukan', NULL, NULL),
    (gen_random_uuid(), '21007', 'Fany Anggraini', 'fany.anggraini@simmas.sch.id', 'XII TKJ 1', 'Teknik Komputer dan Jaringan', '081900000007', 'menunggu', NULL, NULL),
    (gen_random_uuid(), '21008', 'Gilang Ramadhan', 'gilang.ramadhan@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000008', 'menunggu', NULL, NULL),
    (gen_random_uuid(), '21009', 'Hana Maharani', 'hana.maharani@simmas.sch.id', 'XII RPL 2', 'Rekayasa Perangkat Lunak', '081900000009', 'magang', v_guru_huhu, v_dudi_bigdata),
    (gen_random_uuid(), '21010', 'Ilham Nugraha', 'ilham.nugraha@simmas.sch.id', 'XII TKJ 2', 'Teknik Komputer dan Jaringan', '081900000010', 'magang', v_guru_test, v_dudi_kikuk),
    (gen_random_uuid(), '21011', 'Joko Susilo', 'joko.susilo@simmas.sch.id', 'XII RPL 3', 'Rekayasa Perangkat Lunak', '081900000011', 'magang', v_guru_huhu, v_dudi_fhjk),
    (gen_random_uuid(), '21012', 'Kartika Sari', 'kartika.sari@simmas.sch.id', 'XII RPL 3', 'Rekayasa Perangkat Lunak', '081900000012', 'magang', v_guru_huhu, v_dudi_batugiok),
    (gen_random_uuid(), '21013', 'Lukman Hakim', 'lukman.hakim@simmas.sch.id', 'XII TKJ 1', 'Teknik Komputer dan Jaringan', '081900000013', 'magang', v_guru_test, v_dudi_bigdata),
    (gen_random_uuid(), '21014', 'Maya Indah', 'maya.indah@simmas.sch.id', 'XII MM 1', 'Multimedia', '081900000014', 'magang', v_guru_test, v_dudi_batugiok),
    (gen_random_uuid(), '21015', 'Naufal Rizky', 'naufal.rizky@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000015', 'magang', v_guru_huhu, v_dudi_fhjk),
    (gen_random_uuid(), '21016', 'Olivia Putri', 'olivia.putri@simmas.sch.id', 'XII MM 2', 'Multimedia', '081900000016', 'magang', v_guru_test, v_dudi_bigdata),
    (gen_random_uuid(), '21017', 'Panji Pratama', 'panji.pratama@simmas.sch.id', 'XII TKJ 2', 'Teknik Komputer dan Jaringan', '081900000017', 'magang', v_guru_huhu, v_dudi_kikuk),
    (gen_random_uuid(), '21018', 'Qonita Zahra', 'qonita.zahra@simmas.sch.id', 'XII RPL 2', 'Rekayasa Perangkat Lunak', '081900000018', 'magang', v_guru_huhu, v_dudi_batugiok),
    (gen_random_uuid(), '21019', 'Raditya Putra', 'raditya.putra@simmas.sch.id', 'XII RPL 3', 'Rekayasa Perangkat Lunak', '081900000019', 'magang', v_guru_test, v_dudi_bigdata),
    (gen_random_uuid(), '21020', 'Salsa Bila', 'salsa.bila@simmas.sch.id', 'XII MM 1', 'Multimedia', '081900000020', 'magang', v_guru_huhu, v_dudi_fhjk),
    (gen_random_uuid(), '21021', 'Taufik Hidayat', 'taufik.hidayat@simmas.sch.id', 'XII TKJ 1', 'Teknik Komputer dan Jaringan', '081900000021', 'magang', v_guru_test, v_dudi_kikuk),
    (gen_random_uuid(), '21022', 'Ulfa Hasanah', 'ulfa.hasanah@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000022', 'magang', v_guru_huhu, v_dudi_bigdata),
    (gen_random_uuid(), '21023', 'Vina Panduwinata', 'vina.panduwinata@simmas.sch.id', 'XII MM 2', 'Multimedia', '081900000023', 'magang', v_guru_test, v_dudi_batugiok),
    (gen_random_uuid(), '21024', 'Wahyu Setiawan', 'wahyu.setiawan@simmas.sch.id', 'XII TKJ 2', 'Teknik Komputer dan Jaringan', '081900000024', 'magang', v_guru_huhu, v_dudi_fhjk),
    (gen_random_uuid(), '21025', 'Xander Tan', 'xander.tan@simmas.sch.id', 'XII RPL 2', 'Rekayasa Perangkat Lunak', '081900000025', 'magang', v_guru_test, v_dudi_bigdata),
    (gen_random_uuid(), '21026', 'Yoga Pratama', 'yoga.pratama@simmas.sch.id', 'XII RPL 3', 'Rekayasa Perangkat Lunak', '081900000026', 'magang', v_guru_huhu, v_dudi_kikuk),
    (gen_random_uuid(), '21027', 'Zahra Amelia', 'zahra.amelia@simmas.sch.id', 'XII MM 1', 'Multimedia', '081900000027', 'magang', v_guru_test, v_dudi_batugiok),
    (gen_random_uuid(), '21028', 'Ahmad Fauzan', 'ahmad.fauzan@simmas.sch.id', 'XII TKJ 1', 'Teknik Komputer dan Jaringan', '081900000028', 'magang', v_guru_huhu, v_dudi_fhjk),
    (gen_random_uuid(), '21029', 'Bunga Citra', 'bunga.citra@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000029', 'magang', v_guru_test, v_dudi_bigdata);
END $$;

-- 5. INSERT PENEMPATAN MAGANG
INSERT INTO public.penempatan_magang (id, siswa_id, dudi_id, guru_id, tanggal_mulai, tanggal_selesai, status)
SELECT 
  gen_random_uuid(),
  s.id,
  s.dudi_id,
  s.guru_id,
  '2026-07-15'::DATE,
  '2026-12-15'::DATE,
  CASE WHEN s.status_magang = 'selesai' THEN 'selesai' ELSE 'aktif' END
FROM public.siswa s
WHERE s.dudi_id IS NOT NULL AND s.guru_id IS NOT NULL;

-- 6. INSERT DATA ABSENSI KEHADIRAN (Hari ini dan beberapa hari lalu)
INSERT INTO public.absensi (id, siswa_id, tanggal, status, waktu_masuk, waktu_pulang, validasi_status)
SELECT 
  gen_random_uuid(),
  s.id,
  CURRENT_DATE,
  'hadir',
  '07:45:00'::TIME,
  '16:30:00'::TIME,
  'approved'
FROM public.siswa s
WHERE s.status_magang = 'magang'
LIMIT 15;

INSERT INTO public.absensi (id, siswa_id, tanggal, status, waktu_masuk, waktu_pulang, validasi_status)
SELECT 
  gen_random_uuid(),
  s.id,
  CURRENT_DATE - INTERVAL '1 day',
  'hadir',
  '07:50:00'::TIME,
  '16:25:00'::TIME,
  'approved'
FROM public.siswa s
WHERE s.status_magang = 'magang'
LIMIT 15;

-- 7. INSERT DATA JURNAL HARIAN
INSERT INTO public.jurnal_harian (id, siswa_id, tanggal, kegiatan, kendala, solusi, status)
SELECT 
  gen_random_uuid(),
  s.id,
  CURRENT_DATE,
  'Mengembangkan antarmuka modul monitoring magang dan integrasi API Supabase.',
  'Sedikit kendala pada sinkronisasi state realtime.',
  'Menggunakan Supabase channel listener untuk broadcast updates.',
  'disetujui'
FROM public.siswa s
WHERE s.status_magang = 'magang'
LIMIT 10;

-- 8. INSERT DATA KUNJUNGAN GURU (Mendukung nama kolom tempat_magang_id atau dudi_id)
DO $$
DECLARE
  v_has_tm_col BOOLEAN;
  v_guru UUID;
  v_dudi UUID;
BEGIN
  SELECT id INTO v_guru FROM public.guru LIMIT 1;
  SELECT id INTO v_dudi FROM public.tempat_magang LIMIT 1;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'kunjungan' AND column_name = 'tempat_magang_id'
  ) INTO v_has_tm_col;

  IF v_has_tm_col THEN
    INSERT INTO public.kunjungan (id, guru_id, tempat_magang_id, tanggal, catatan)
    VALUES
      (gen_random_uuid(), v_guru, v_dudi, '2026-08-20'::DATE, 'Monitoring tahap pertama, siswa beradaptasi sangat baik dengan tim IT industri.'),
      (gen_random_uuid(), v_guru, v_dudi, '2026-09-15'::DATE, 'Evaluasi tengah semester bersama PIC DUDI, laporan kehadiran dan kedisiplinan 100%.'),
      (gen_random_uuid(), v_guru, v_dudi, '2026-10-10'::DATE, 'Kunjungan rutin, koordinasi proyek portofolio akhir siswa.');
  ELSE
    INSERT INTO public.kunjungan (id, guru_id, dudi_id, tanggal, catatan)
    VALUES
      (gen_random_uuid(), v_guru, v_dudi, '2026-08-20'::DATE, 'Monitoring tahap pertama, siswa beradaptasi sangat baik dengan tim IT industri.'),
      (gen_random_uuid(), v_guru, v_dudi, '2026-09-15'::DATE, 'Evaluasi tengah semester bersama PIC DUDI, laporan kehadiran dan kedisiplinan 100%.'),
      (gen_random_uuid(), v_guru, v_dudi, '2026-10-10'::DATE, 'Kunjungan rutin, koordinasi proyek portofolio akhir siswa.');
  END IF;
END $$;

-- 9. INSERT LOG AKTIVITAS SISTEM REALISTIS
INSERT INTO public.activity_logs (id, actor_email, actor_role, action_type, entity_type, entity_id, level, metadata, ip_address, created_at)
VALUES
  (gen_random_uuid(), 'admin@simmas.sch.id', 'admin', 'UPDATE_STATUS_PENEMPATAN', 'PENEMPATAN', 'p01', 'INFO', '{"status": "magang"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '12 minutes'),
  (gen_random_uuid(), 'guru@simmas.sch.id', 'guru', 'VALIDATE_ABSENSI', 'ABSENSI', 'a01', 'INFO', '{"status": "approved"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '45 minutes'),
  (gen_random_uuid(), 'admin@simmas.sch.id', 'admin', 'TAMBAH_SISWA', 'SISWA', 's01', 'INFO', '{"nama": "hihuahmad"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), 'admin@simmas.sch.id', 'admin', 'LOGIN_SUCCESS', 'AUTH', NULL, 'INFO', '{"ip": "127.0.0.1"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '3 hours'),
  (gen_random_uuid(), 'siswa@simmas.sch.id', 'siswa', 'SUBMIT_JURNAL', 'JURNAL', 'j01', 'INFO', '{"topik": "Integrasi Supabase"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '4 hours');

