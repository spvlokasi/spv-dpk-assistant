-- ====================================================================
-- SCHEMA LENGKAP DATABASE SUPABASE UNTUK APLIKASI SPV DPK TURNAROUND
-- ====================================================================
-- Salin semua kode SQL ini dan jalankan di SQL Editor Supabase Dashboard Anda.
-- (Buka Supabase -> SQL Editor -> + New Query -> Paste -> Run)

-- 1. TABEL AKUN & PROFIL PENGGUNA (USER ACCOUNTS)
CREATE TABLE IF NOT EXISTS user_accounts (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  department TEXT NOT NULL,
  business_manager TEXT NOT NULL,
  branch_code TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_accounts ADD COLUMN IF NOT EXISTS branch_code TEXT DEFAULT '';

-- Insert Akun Default SPV & Kepala Toko (KTB)
INSERT INTO user_accounts (id, username, password, full_name, role_title, department, business_manager, branch_code)
VALUES 
  ('usr-spv', 'spvdpk', 'spvdpk1745', 'M.Maskur', 'Supervisor DPK', 'Departemen Bisnis', 'Rusli Hitami', ''),
  ('usr-m3017', 'ktb.m3017', 'basmalah3017', 'Baida''i (KTB Bugih)', 'Kepala Toko', 'Operasional Toko', 'Rusli Hitami', 'M3017'),
  ('usr-m3019', 'ktb.m3019', 'basmalah3019', 'Surur (KTB Pademawu)', 'Kepala Toko', 'Operasional Toko', 'Rusli Hitami', 'M3019'),
  ('usr-m3021', 'ktb.m3021', 'basmalah3021', 'Khoirul (KTB Sotabar)', 'Kepala Toko', 'Operasional Toko', 'Rusli Hitami', 'M3021'),
  ('usr-m4016', 'ktb.m4016', 'basmalah4016', 'Herman (KTB Kalianget)', 'Kepala Toko', 'Operasional Toko', 'Rusli Hitami', 'M4016'),
  ('usr-m1025', 'ktb.m1025', 'basmalah1025', 'Somad (KTB Tengket)', 'Kepala Toko', 'Operasional Toko', 'Rusli Hitami', 'M1025'),
  ('usr-m1026', 'ktb.m1026', 'basmalah1026', 'KTB TokoBASMALAH Tlangoh', 'Kepala Toko', 'Operasional Toko', 'Rusli Hitami', 'M1026'),
  ('usr-w1001', 'ktb.w1001', 'basmalah1001', 'Mughni (KTB Sidayu)', 'Kepala Toko', 'Operasional Toko', 'Rusli Hitami', 'W1001')
ON CONFLICT (id) DO UPDATE SET 
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role_title = EXCLUDED.role_title,
  business_manager = EXCLUDED.business_manager,
  branch_code = EXCLUDED.branch_code;



-- 2. TABEL CABANG TOKO DPK (BRANCHES)
CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  kepala_toko TEXT DEFAULT '',
  spv_area TEXT DEFAULT '',
  manajer_bisnis TEXT DEFAULT 'H. Bambang Irawan',
  entry_date TEXT NOT NULL,
  target_graduation_date TEXT DEFAULT '',
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  urgency_level TEXT NOT NULL,
  target_sales_per_day NUMERIC DEFAULT 12000000,
  target_margin_pct NUMERIC DEFAULT 15,
  target_max_opex_per_month NUMERIC DEFAULT 20000000,
  root_causes JSONB DEFAULT '[]'::jsonb,
  diagnosis_summary TEXT DEFAULT '',
  recommended_strategy TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  diagnosis_start_date TEXT DEFAULT '',
  diagnosis_end_date TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pastikan kolom baru ada jika tabel sudah terlanjur dibuat sebelumnya
ALTER TABLE branches ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS target_sales_per_day NUMERIC DEFAULT 12000000;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS diagnosis_start_date TEXT DEFAULT '';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS diagnosis_end_date TEXT DEFAULT '';


-- 3. TABEL PROGRAM AKSI & MILESTONE (ACTION MILESTONES)
CREATE TABLE IF NOT EXISTS action_milestones (
  id TEXT PRIMARY KEY,
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  phase TEXT DEFAULT 'fase_1',
  month_number INTEGER DEFAULT 1,
  week_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  target_metric TEXT DEFAULT '',
  status TEXT NOT NULL,
  tasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE action_milestones ADD COLUMN IF NOT EXISTS phase TEXT DEFAULT 'fase_1';
ALTER TABLE action_milestones ADD COLUMN IF NOT EXISTS month_number INTEGER DEFAULT 1;


-- 4. TABEL LOG KUNJUNGAN & COACHING (FIELD VISITS)
CREATE TABLE IF NOT EXISTS field_visits (
  id TEXT PRIMARY KEY,
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  visit_date TEXT NOT NULL,
  visit_time TEXT NOT NULL,
  spv_name TEXT NOT NULL,
  agenda TEXT NOT NULL,
  katok_coaching_topic TEXT DEFAULT '',
  katok_commitment TEXT DEFAULT '',
  crew_coaching_topic TEXT DEFAULT '',
  spv_area_coordination_note TEXT DEFAULT '',
  general_rating NUMERIC DEFAULT 3,
  summary_conclusion TEXT DEFAULT '',
  issues JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 5. TABEL MONITORING KINERJA HARIAN (DAILY PERFORMANCE)
CREATE TABLE IF NOT EXISTS daily_performance (
  id TEXT PRIMARY KEY,
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  record_date TEXT NOT NULL,
  sales_actual NUMERIC DEFAULT 0,
  sales_target NUMERIC DEFAULT 0,
  margin_pct NUMERIC DEFAULT 0,
  opex NUMERIC DEFAULT 0,
  traffic_count INTEGER DEFAULT 0,
  basket_size NUMERIC DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 6. TABEL TRACKER KELULUSAN CABANG (BRANCH GRADUATIONS)
CREATE TABLE IF NOT EXISTS branch_graduations (
  branch_id TEXT PRIMARY KEY REFERENCES branches(id) ON DELETE CASCADE,
  consecutive_months_hit INTEGER DEFAULT 0,
  target_months_required INTEGER DEFAULT 3,
  checklists JSONB DEFAULT '[]'::jsonb,
  best_practice_learnings TEXT DEFAULT '',
  graduation_date TEXT,
  approved_by_manager BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 7. TABEL TIKET ESKALASI KE MANAJER BISNIS (ESCALATION TICKETS)
CREATE TABLE IF NOT EXISTS escalation_tickets (
  id TEXT PRIMARY KEY,
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  branch_name TEXT NOT NULL,
  ticket_date TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL,
  description TEXT NOT NULL,
  proposed_solution TEXT DEFAULT '',
  status TEXT NOT NULL,
  manager_feedback TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 8. TABEL RIWAYAT / LOG DIAGNOSA PER PERIODE (DIAGNOSIS LOGS)
CREATE TABLE IF NOT EXISTS diagnosis_logs (
  id TEXT PRIMARY KEY,
  branch_id TEXT REFERENCES branches(id) ON DELETE CASCADE,
  period_start_date TEXT NOT NULL,
  period_end_date TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL,
  urgency_level TEXT NOT NULL,
  target_sales_per_day NUMERIC DEFAULT 12000000,
  target_margin_pct NUMERIC DEFAULT 15,
  target_max_opex_per_month NUMERIC DEFAULT 20000000,
  root_causes JSONB DEFAULT '[]'::jsonb,
  diagnosis_summary TEXT DEFAULT '',
  recommended_strategy TEXT DEFAULT '',
  diagnosed_by TEXT DEFAULT 'Supervisor DPK',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==============================================================================
-- KEAMANAN / ROW LEVEL SECURITY (RLS) POLICIES (FULL OPEN ACCESS FOR ANON ROLE)
-- ==============================================================================
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnosis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_graduations ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_tickets ENABLE ROW LEVEL SECURITY;

-- Buat Policy Akses Publik/Anon (Bisa SELECT, INSERT, UPDATE, DELETE)
DO $$
BEGIN
  -- user_accounts
  DROP POLICY IF EXISTS "Public access user_accounts" ON user_accounts;
  CREATE POLICY "Public access user_accounts" ON user_accounts FOR ALL USING (true) WITH CHECK (true);

  -- branches
  DROP POLICY IF EXISTS "Public access branches" ON branches;
  CREATE POLICY "Public access branches" ON branches FOR ALL USING (true) WITH CHECK (true);

  -- diagnosis_logs
  DROP POLICY IF EXISTS "Public access diagnosis_logs" ON diagnosis_logs;
  CREATE POLICY "Public access diagnosis_logs" ON diagnosis_logs FOR ALL USING (true) WITH CHECK (true);

  -- action_milestones
  DROP POLICY IF EXISTS "Public access action_milestones" ON action_milestones;
  CREATE POLICY "Public access action_milestones" ON action_milestones FOR ALL USING (true) WITH CHECK (true);

  -- field_visits
  DROP POLICY IF EXISTS "Public access field_visits" ON field_visits;
  CREATE POLICY "Public access field_visits" ON field_visits FOR ALL USING (true) WITH CHECK (true);

  -- daily_performance
  DROP POLICY IF EXISTS "Public access daily_performance" ON daily_performance;
  CREATE POLICY "Public access daily_performance" ON daily_performance FOR ALL USING (true) WITH CHECK (true);

  -- branch_graduations
  DROP POLICY IF EXISTS "Public access branch_graduations" ON branch_graduations;
  CREATE POLICY "Public access branch_graduations" ON branch_graduations FOR ALL USING (true) WITH CHECK (true);

  -- escalation_tickets
  DROP POLICY IF EXISTS "Public access escalation_tickets" ON escalation_tickets;
  CREATE POLICY "Public access escalation_tickets" ON escalation_tickets FOR ALL USING (true) WITH CHECK (true);
END $$;


-- ==============================================================================
-- 9. TABEL TAMBAHAN MODUL E-KATALOG & TRANSAKSI ONLINE TOKOBASMALAH
-- ==============================================================================

-- A. Tambah Kolom GPS & Phone pada Tabel Branches
ALTER TABLE branches ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '081234567890';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Jawa Timur';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS lat NUMERIC DEFAULT -7.1595;
ALTER TABLE branches ADD COLUMN IF NOT EXISTS lng NUMERIC DEFAULT 113.4735;

-- B. Tabel Produk Promo (promo_products)
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

-- C. Tabel E-Voucher Diskon (promo_vouchers)
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- D. Tabel Riwayat Pesanan Masuk Online (online_orders)
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

-- E. Enable Row Level Security (RLS) & Policies
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

