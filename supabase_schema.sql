-- ========================================================
-- SKEMA DATABASE SUPABASE: SISTEM SPV DPK TURNAROUND
-- Salin dan jalankan seluruh script ini di "SQL Editor" Supabase
-- ========================================================

-- 1. Tabel Profil Supervisor / Pengguna
CREATE TABLE IF NOT EXISTS public.spv_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Supervisor DPK',
    department TEXT NOT NULL DEFAULT 'Departemen Bisnis',
    business_manager TEXT NOT NULL DEFAULT 'H. Bambang Irawan',
    role_title TEXT NOT NULL DEFAULT 'Supervisor DPK',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabel Cabang DPK (Branches)
CREATE TABLE IF NOT EXISTS public.branches (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    kepala_toko TEXT NOT NULL,
    spv_area TEXT,
    manajer_bisnis TEXT DEFAULT 'H. Bambang Irawan',
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_graduation_date DATE,
    category TEXT NOT NULL DEFAULT 'sales_drop',
    status TEXT NOT NULL DEFAULT 'kritis',
    urgency_level TEXT NOT NULL DEFAULT 'tinggi',
    target_sales_per_day NUMERIC NOT NULL DEFAULT 12000000,
    target_margin_pct NUMERIC NOT NULL DEFAULT 15.0,
    target_max_opex_per_month NUMERIC NOT NULL DEFAULT 20000000,
    root_causes JSONB DEFAULT '[]'::jsonb,
    diagnosis_summary TEXT,
    recommended_strategy TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabel Program Aksi Perbaikan (Action Plan Milestones & Tasks)
CREATE TABLE IF NOT EXISTS public.action_milestones (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    week_number INT NOT NULL,
    title TEXT NOT NULL,
    target_metric TEXT,
    status TEXT NOT NULL DEFAULT 'in_progress',
    tasks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabel Log Kunjungan & Pembinaan Lapangan (Field Visits)
CREATE TABLE IF NOT EXISTS public.field_visits (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    visit_time TEXT DEFAULT '10:00',
    spv_name TEXT NOT NULL,
    agenda TEXT NOT NULL,
    katok_coaching_topic TEXT,
    katok_commitment TEXT,
    crew_coaching_topic TEXT,
    spv_area_coordination_note TEXT,
    general_rating INT DEFAULT 3,
    summary_conclusion TEXT,
    issues JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabel Pencapaian Sales & Metrik Harian (Daily Performance)
CREATE TABLE IF NOT EXISTS public.daily_performance (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sales_actual NUMERIC NOT NULL DEFAULT 0,
    sales_target NUMERIC NOT NULL DEFAULT 0,
    margin_pct NUMERIC DEFAULT 0,
    opex NUMERIC DEFAULT 0,
    traffic_count INT DEFAULT 0,
    basket_size NUMERIC DEFAULT 0,
    nkl_shrinkage NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(branch_id, record_date)
);

-- 6. Tabel Status Kelulusan Cabang DPK (Graduations)
CREATE TABLE IF NOT EXISTS public.branch_graduations (
    branch_id TEXT PRIMARY KEY REFERENCES public.branches(id) ON DELETE CASCADE,
    consecutive_months_hit INT DEFAULT 0,
    target_months_required INT DEFAULT 3,
    checklists JSONB DEFAULT '[]'::jsonb,
    best_practice_learnings TEXT,
    graduation_date DATE,
    approved_by_manager BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabel Tiket Eskalasi ke Manajer Bisnis (Escalations)
CREATE TABLE IF NOT EXISTS public.escalation_tickets (
    id TEXT PRIMARY KEY,
    branch_id TEXT NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    branch_name TEXT NOT NULL,
    ticket_date DATE NOT NULL DEFAULT CURRENT_DATE,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'sdm_rotasi',
    urgency TEXT NOT NULL DEFAULT 'tinggi',
    description TEXT NOT NULL,
    proposed_solution TEXT,
    status TEXT NOT NULL DEFAULT 'diajukan',
    manager_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================================
-- ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- ========================================================
ALTER TABLE public.spv_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branch_graduations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escalation_tickets ENABLE ROW LEVEL SECURITY;

-- Allow anonymous / public access for app usage with anon key
CREATE POLICY "Allow public full access to spv_profiles" ON public.spv_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to branches" ON public.branches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to action_milestones" ON public.action_milestones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to field_visits" ON public.field_visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to daily_performance" ON public.daily_performance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to branch_graduations" ON public.branch_graduations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public full access to escalation_tickets" ON public.escalation_tickets FOR ALL USING (true) WITH CHECK (true);

-- ========================================================
-- SEED INITIAL MOCK DATA
-- ========================================================
INSERT INTO public.branches (id, code, name, address, phone, kepala_toko, spv_area, category, status, urgency_level, target_sales_per_day, target_margin_pct, target_max_opex_per_month, diagnosis_summary, recommended_strategy)
VALUES 
('br-01', 'T-102', 'Cabang Basmalah Veteran Raya', 'Jl. Veteran No. 45, Sentra Kota', '0812-3456-7890', 'Ahmad Fauzi', 'Budi Santoso', 'sales_drop', 'dalam_progres', 'tinggi', 13500000, 15.5, 22000000, 'Sales anjlok 30% akibat persaingan kompetitor baru.', 'Implementasi direct selling & target struk up-selling kasir.'),
('br-02', 'T-208', 'Cabang Basmalah Diponegoro', 'Jl. Diponegoro No. 88, Kawasan Pasar', '0813-9876-5432', 'Siti Rahmawati', 'Hendra Setiawan', 'margin_minus', 'siap_lulus', 'sedang', 16000000, 16.0, 24000000, 'Margin sebelumnya tipis karena dominasi grosir.', 'Tingkatkan display Private Label & produk margin tinggi.'),
('br-03', 'T-315', 'Cabang Basmalah Merdeka Barat', 'Jl. Merdeka Barat No. 12, Area Perumahan', '0857-1122-3344', 'Rian Pratama', 'Budi Santoso', 'opex_bengkak', 'kritis', 'tinggi', 11000000, 15.0, 19000000, 'Beban listrik membengkak & NKL tinggi.', 'Eskalasi perbaikan chiller & pembenahan jadwal shift.')
ON CONFLICT (id) DO NOTHING;
