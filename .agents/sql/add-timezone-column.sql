-- Migration: Menambahkan kolom timezone ke tabel profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS timezone VARCHAR(255);

-- Set default timezone untuk user yang sudah ada (WIB)
UPDATE public.profiles
SET timezone = 'Asia/Bangkok'
WHERE timezone IS NULL AND gmt_offset = 7;

UPDATE public.profiles
SET timezone = 'Asia/Shanghai'
WHERE timezone IS NULL AND gmt_offset = 8;

UPDATE public.profiles
SET timezone = 'Asia/Tokyo'
WHERE timezone IS NULL AND gmt_offset = 9;
