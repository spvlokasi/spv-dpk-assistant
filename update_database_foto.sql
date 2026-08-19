-- QUERY UNTUK MENAMBAHKAN KOLOM FOTO TOKO KE DATABASE SUPABASE
-- Jalankan query 1 baris ini di SQL Editor Supabase Dashboard Anda:

ALTER TABLE branches ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Keterangan:
-- Query di atas akan memastikan kolom `image_url` resmi ada di tabel `branches`
-- sehingga setiap kali Anda upload foto toko, datanya langsung tersimpan 100% permanen di Database Server Cloud Supabase.
