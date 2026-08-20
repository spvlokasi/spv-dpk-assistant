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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Akun Default jika belum ada
INSERT INTO user_accounts (id, username, password, full_name, role_title, department, business_manager)
VALUES ('usr-admin-01', 'spvdpk', 'spvdpk1745', 'Supervisor DPK (Turnaround)', 'Supervisor DPK', 'Departemen Bisnis', 'H. Bambang Irawan')
ON CONFLICT (id) DO NOTHING;


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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pastikan kolom image_url ada jika tabel sudah terlanjur dibuat sebelumnya
ALTER TABLE branches ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
ALTER TABLE branches ADD COLUMN IF NOT EXISTS target_sales_per_day NUMERIC DEFAULT 12000000;


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


-- ====================================================================
-- HAK AKSES DAN POLICIES (ENABLE RLS AGAR APLIKASI BISA AKSES PENUH)
-- ====================================================================
ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
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
