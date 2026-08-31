-- ==============================================================================
-- SCRIPT SQL DATABASE UNTUK KATALOG PRODUK PROMO & VOUCHER (SUPABASE)
-- Jalankan script ini di menu "SQL Editor" pada Supabase Dashboard Anda.
-- ==============================================================================

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

-- Tambahkan kolom applicable_product_ids jika tabel promo_vouchers sudah ada sebelumnya
ALTER TABLE promo_vouchers ADD COLUMN IF NOT EXISTS applicable_product_ids JSONB DEFAULT '[]'::jsonb;

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
