-- ==============================================================================
-- SCRIPT SQL DATABASE UNTUK KATALOG PRODUK PROMO, VOUCHER & PESANAN (SUPABASE)
-- Jalankan script ini di menu "SQL Editor" pada Supabase Dashboard Anda.
-- ==============================================================================

-- 0. Aktifkan Ekstensi GraphQL Bawaan Supabase
CREATE EXTENSION IF NOT EXISTS pg_graphql;

-- 1. Tabel Produk Promo (promo_products)
CREATE TABLE IF NOT EXISTS promo_products (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL DEFAULT 'all',
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'sembako',
  original_price NUMERIC NOT NULL DEFAULT 0,
  promo_price NUMERIC NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'Pcs',
  image_url TEXT DEFAULT '',
  in_stock BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pastikan semua kolom promo_products ada jika tabel sebelumnya sudah dibuat
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS branch_id TEXT NOT NULL DEFAULT 'all';
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'sembako';
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS original_price NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS promo_price NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'Pcs';
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT TRUE;
ALTER TABLE promo_products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Lepas foreign key constraint jika sebelumnya pernah terpasang agar promo bisa berlaku untuk 'all' (semua toko)
ALTER TABLE promo_products DROP CONSTRAINT IF EXISTS promo_products_branch_id_fkey;
ALTER TABLE promo_vouchers DROP CONSTRAINT IF EXISTS promo_vouchers_branch_id_fkey;
ALTER TABLE online_orders DROP CONSTRAINT IF EXISTS online_orders_branch_id_fkey;

-- 2. Tabel E-Voucher Diskon (promo_vouchers)
CREATE TABLE IF NOT EXISTS promo_vouchers (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL DEFAULT 'all',
  code TEXT NOT NULL UNIQUE,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  min_spend NUMERIC NOT NULL DEFAULT 0,
  quota INTEGER NOT NULL DEFAULT 50,
  claimed_count INTEGER NOT NULL DEFAULT 0,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_until TEXT NOT NULL DEFAULT '2026-12-31',
  is_active BOOLEAN DEFAULT TRUE,
  description TEXT DEFAULT '',
  funding_source TEXT DEFAULT 'store',
  sponsor_name TEXT DEFAULT '',
  applicable_category TEXT DEFAULT 'all',
  applicable_product_ids JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pastikan semua kolom promo_vouchers ada jika tabel sebelumnya sudah dibuat
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS branch_id TEXT NOT NULL DEFAULT 'all';
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS discount_amount NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS min_spend NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS quota INTEGER NOT NULL DEFAULT 50;
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS claimed_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS used_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS valid_until TEXT NOT NULL DEFAULT '2026-12-31';
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS funding_source TEXT DEFAULT 'store';
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS sponsor_name TEXT DEFAULT '';
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS applicable_category TEXT DEFAULT 'all';
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS applicable_product_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Tabel Riwayat Pesanan Masuk Online (online_orders)
CREATE TABLE IF NOT EXISTS online_orders (
  id TEXT PRIMARY KEY,
  branch_id TEXT DEFAULT '',
  branch_code TEXT DEFAULT '',
  branch_name TEXT DEFAULT '',
  buyer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  maps_url TEXT DEFAULT '',
  lat NUMERIC,
  lng NUMERIC,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  voucher_code TEXT DEFAULT '',
  grand_total NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pending_delivery',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Buka Izin Akses Baca & Tulis (Row Level Security / RLS)
ALTER TABLE promo_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Public access promo_products" ON promo_products;
  CREATE POLICY "Public access promo_products" ON promo_products FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access promo_vouchers" ON promo_vouchers;
  CREATE POLICY "Public access promo_vouchers" ON promo_vouchers FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public access online_orders" ON online_orders;
  CREATE POLICY "Public access online_orders" ON online_orders FOR ALL USING (true) WITH CHECK (true);
END $$;

-- 5. Aktifkan Realtime Replication untuk Sinkronisasi Instan Antar-Aplikasi
ALTER PUBLICATION supabase_realtime ADD TABLE promo_products;
ALTER PUBLICATION supabase_realtime ADD TABLE promo_vouchers;
ALTER PUBLICATION supabase_realtime ADD TABLE online_orders;

-- 6. Kolom Jam Operasional Antar Toko (branches)
ALTER TABLE branches ADD COLUMN IF NOT EXISTS delivery_hours TEXT DEFAULT '07:00 - 20:30';


