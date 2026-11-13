-- Migration: Menambahkan dukungan Multi-Zone Location ke tabel Profiles
-- Tambahkan kolom location dan gmt_offset jika belum ada
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS gmt_offset NUMERIC;

-- Set nilai default untuk user yang sudah ada agar tidak kosong
-- Malang (WIB = GMT+7) sebagai default
UPDATE public.profiles
SET location = 'Malang', gmt_offset = 7
WHERE location IS NULL;

-- Opsional: Anda dapat menjalankan query ini untuk mencoba memberikan lokasi berbeda
-- ke beberapa user secara spesifik agar simulasi berjalan:
/*
UPDATE public.profiles SET location = 'Bali', gmt_offset = 8 WHERE username = 'wayan';
UPDATE public.profiles SET location = 'Papua', gmt_offset = 9 WHERE username = 'markus';
UPDATE public.profiles SET location = 'Amerika', gmt_offset = -5 WHERE username = 'johndoe';
*/
