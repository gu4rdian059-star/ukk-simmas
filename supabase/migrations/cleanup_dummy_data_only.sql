-- ==============================================================================
-- SIMMAS UKK RPL 2026 - HANYA HAPUS DATA DUMMY DENGAN ID POLA (SAFE CLEANUP)
-- Script ini HANYA menghapus baris data dengan ID dummy tertentu.
-- TIDAK MENGHAPUS TABEL dan TIDAK MENGHAPUS DATA LAIN yang sudah Anda buat!
-- ==============================================================================

-- 1. Hapus data dummy di tabel ABSENSI (yang memiliki ID pola 'a0000000...' atau siswa dummy)
DELETE FROM public.absensi
WHERE id::text LIKE 'a0000000%'
   OR siswa_id::text LIKE '10000000%';

-- 2. Hapus data dummy di tabel JURNAL HARIAN (yang berelasi dengan siswa dummy)
DELETE FROM public.jurnal_harian
WHERE siswa_id::text LIKE '10000000%';

-- 3. Hapus data dummy di tabel KUNJUNGAN (ID pola 'c0000000...' atau 'k0000000...' atau guru dummy)
DELETE FROM public.kunjungan
WHERE id::text LIKE 'c0000000%'
   OR id::text LIKE 'k0000000%'
   OR guru_id::text IN (
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      'cccccccc-cccc-cccc-cccc-cccccccccccc'
   );

-- 4. Hapus data dummy di tabel PENEMPATAN MAGANG (ID pola 'p0000000...' atau siswa dummy)
DELETE FROM public.penempatan_magang
WHERE id::text LIKE 'p0000000%'
   OR siswa_id::text LIKE '10000000%';

-- 5. Hapus data dummy di tabel PENGAJUAN MAGANG (ID pola 'q0000000...' atau siswa dummy)
DELETE FROM public.pengajuan_magang
WHERE id::text LIKE 'q0000000%'
   OR siswa_id::text LIKE '10000000%';

-- 6. Hapus data dummy di tabel SISWA (ID pola '10000000-0000-0000-0000-000000000001' s/d 10)
DELETE FROM public.siswa
WHERE id::text LIKE '10000000%'
   OR nis IN ('21001', '21002', '21003', '21004', '21005', '21006', '21007', '21008', '21009', '21010');

-- 7. Hapus data dummy di tabel GURU (ID pola 'aaaaaaaa...', 'bbbbbbbb...', 'cccccccc...')
DELETE FROM public.guru
WHERE id::text IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc'
);

-- 8. Hapus data dummy di tabel TEMPAT MAGANG (ID pola '11111111...', '22222222...', dst)
DELETE FROM public.tempat_magang
WHERE id::text IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555'
);

