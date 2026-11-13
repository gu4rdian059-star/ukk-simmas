-- ==============================================================================
-- SIMMAS UKK RPL 2026 - MIGRATION 02: REALISTIC SEED DATA
-- ==============================================================================

-- 1. Insert default Mitra DUDI
INSERT INTO public.tempat_magang (id, nama_perusahaan, bidang_usaha, penanggung_jawab, kontak, alamat, kuota, status)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'PT. Universal Big Data', 'Teknologi Informasi & Big Data', 'Budi Santoso, S.Kom.', '081234567890', 'Jl. Tasikmadu No. 88, Malang', 10, 'terverifikasi'),
  ('22222222-2222-2222-2222-222222222222', 'PT. Telkom Indonesia', 'Telekomunikasi & Jaringan', 'Siti Rahmawati, M.T.', '082198765432', 'Jl. Ketintang No. 15, Surabaya', 8, 'terverifikasi'),
  ('33333333-3333-3333-3333-333333333333', 'PT. CEO Batu Giok Shangsai', 'E-Commerce & Digital Marketing', 'David Wijaya', '085711223344', 'Komp. Ruko Graha Family Blok B-12, Surabaya', 5, 'terverifikasi'),
  ('44444444-4444-4444-4444-444444444444', 'PT. Solusi Digital Nusantara', 'Software House & App Dev', 'Ahmad Fauzi', '081344556677', 'Jl. Manyar Kertoarjo No. 24, Surabaya', 6, 'terverifikasi'),
  ('55555555-5555-5555-5555-555555555555', 'CV. Media Grafika Kreatif', 'Desain Grafis & Multimedia', 'Nurul Hidayati', '089877665544', 'Jl. Margorejo Indah No. 5, Surabaya', 4, 'terverifikasi')
ON CONFLICT (id) DO UPDATE SET
  nama_perusahaan = EXCLUDED.nama_perusahaan,
  bidang_usaha = EXCLUDED.bidang_usaha,
  kuota = EXCLUDED.kuota;

-- 2. Insert Guru Master Data
INSERT INTO public.guru (id, nip, nama, email, jurusan, no_telepon, status)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '198501152010011012', 'Guru Pembimbing, S.Kom.', 'guru@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081211112222', 'aktif'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '198703202012022005', 'Dra. Endang Wahyuni, M.Pd.', 'endang.wahyuni@simmas.sch.id', 'Rekayasa Perangkat Lunak', '081233334444', 'aktif'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '199008122015031008', 'Rian Pratama, S.Kom., M.Cs.', 'rian.pratama@simmas.sch.id', 'Teknik Komputer dan Jaringan', '081255556666', 'aktif')
ON CONFLICT (nip) DO UPDATE SET
  nama = EXCLUDED.nama,
  email = EXCLUDED.email,
  jurusan = EXCLUDED.jurusan;

-- 3. Insert Siswa Master Data
INSERT INTO public.siswa (id, nis, nama, email, kelas, jurusan, no_telepon, status_magang, guru_id, dudi_id)
VALUES
  ('10000000-0000-0000-0000-000000000001', '21001', 'Siswa Magang', 'siswa@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000001', 'magang', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('10000000-0000-0000-0000-000000000002', '21002', 'Aditya Pratama', 'aditya.pratama@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000002', 'magang', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('10000000-0000-0000-0000-000000000003', '21003', 'Bella Safitri', 'bella.safitri@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000003', 'magang', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('10000000-0000-0000-0000-000000000004', '21004', 'Chandra Wijaya', 'chandra.wijaya@simmas.sch.id', 'XII RPL 2', 'Rekayasa Perangkat Lunak', '081900000004', 'magang', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),
  ('10000000-0000-0000-0000-000000000005', '21005', 'Dewi Lestari', 'dewi.lestari@simmas.sch.id', 'XII RPL 2', 'Rekayasa Perangkat Lunak', '081900000005', 'magang', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),
  ('10000000-0000-0000-0000-000000000006', '21006', 'Eko Prasetyo', 'eko.prasetyo@simmas.sch.id', 'XII TKJ 1', 'Teknik Komputer dan Jaringan', '081900000006', 'magang', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'),
  ('10000000-0000-0000-0000-000000000007', '21007', 'Fany Anggraini', 'fany.anggraini@simmas.sch.id', 'XII TKJ 1', 'Teknik Komputer dan Jaringan', '081900000007', 'magang', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444'),
  ('10000000-0000-0000-0000-000000000008', '21008', 'Gilang Ramadhan', 'gilang.ramadhan@simmas.sch.id', 'XII RPL 1', 'Rekayasa Perangkat Lunak', '081900000008', 'menunggu', NULL, NULL),
  ('10000000-0000-0000-0000-000000000009', '21009', 'Hana Maharani', 'hana.maharani@simmas.sch.id', 'XII RPL 2', 'Rekayasa Perangkat Lunak', '081900000009', 'belum_mengajukan', NULL, NULL),
  ('10000000-0000-0000-0000-000000000010', '21010', 'Ilham Nugraha', 'ilham.nugraha@simmas.sch.id', 'XII TKJ 2', 'Teknik Komputer dan Jaringan', '081900000010', 'belum_mengajukan', NULL, NULL)
ON CONFLICT (nis) DO UPDATE SET
  nama = EXCLUDED.nama,
  status_magang = EXCLUDED.status_magang;

-- 4. Insert Penempatan Magang Aktif
INSERT INTO public.penempatan_magang (id, siswa_id, dudi_id, guru_id, tanggal_mulai, tanggal_selesai, status)
VALUES
  ('p0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-07-15', '2026-12-15', 'aktif'),
  ('p0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-07-15', '2026-12-15', 'aktif'),
  ('p0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2026-07-15', '2026-12-15', 'aktif'),
  ('p0000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2026-07-15', '2026-12-15', 'aktif'),
  ('p0000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2026-07-15', '2026-12-15', 'aktif')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Pengajuan Magang Pending
INSERT INTO public.pengajuan_magang (id, siswa_id, dudi_id, posisi, tanggal_mulai, tanggal_selesai, status)
VALUES
  ('q0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000008', '44444444-4444-4444-4444-444444444444', 'Frontend Developer Intern', '2026-08-01', '2027-01-31', 'menunggu')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Kunjungan Guru
INSERT INTO public.kunjungan (id, guru_id, dudi_id, tanggal, catatan)
VALUES
  ('k0000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '2026-08-20', 'Monitoring tahap pertama, siswa beradaptasi sangat baik dengan tim IT.'),
  ('k0000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '2026-09-15', 'Evaluasi tengah semester bersama PIC DUDI, laporan kehadiran 100% disiplin.'),
  ('k0000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '2026-10-10', 'Kunjungan rutin, koordinasi proyek portofolio akhir siswa.')
ON CONFLICT (id) DO NOTHING;

-- 7. Insert Activity Logs
INSERT INTO public.activity_logs (id, actor_email, actor_role, action_type, entity_type, entity_id, level, metadata, ip_address, created_at)
VALUES
  (gen_random_uuid(), 'admin@simmas.sch.id', 'admin', 'LOGIN_SUCCESS', 'AUTH', NULL, 'INFO', '{"method": "password"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '5 minutes'),
  (gen_random_uuid(), 'admin@simmas.sch.id', 'admin', 'UPDATE_SETTINGS', 'SETTINGS', '1', 'INFO', '{"tab": "Identitas Aplikasi"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '30 minutes'),
  (gen_random_uuid(), 'guru@simmas.sch.id', 'guru', 'LOGIN_SUCCESS', 'AUTH', NULL, 'INFO', '{"method": "password"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), 'guru@simmas.sch.id', 'guru', 'VALIDATE_JURNAL', 'JURNAL', 'j001', 'INFO', '{"status": "disetujui"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '2 hours'),
  (gen_random_uuid(), 'siswa@simmas.sch.id', 'siswa', 'SUBMIT_PRESENSI', 'ABSENSI', 'a001', 'INFO', '{"status": "hadir"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '3 hours');

