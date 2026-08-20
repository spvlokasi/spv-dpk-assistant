import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, BranchGraduation, EscalationTicket } from '../types';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'br-01',
    code: 'T-102',
    name: 'Cabang Basmalah Veteran Raya',
    address: 'Jl. Veteran No. 45, Sentra Kota',
    phone: '0812-3456-7890',
    kepalaToko: 'Ahmad Fauzi',
    spvArea: 'Budi Santoso',
    manajerBisnis: 'H. Bambang Irawan',
    entryDate: '2026-06-01',
    targetGraduationDate: '2026-09-01',
    category: 'sales_drop',
    status: 'dalam_progres',
    urgencyLevel: 'tinggi',
    targetSalesPerDay: 13500000,
    targetMarginPct: 15.5,
    targetMaxOpexPerMonth: 22000000,
    rootCauses: [],
    diagnosisSummary: '',
    recommendedStrategy: ''
  },
  {
    id: 'br-02',
    code: 'T-208',
    name: 'Cabang Basmalah Diponegoro',
    address: 'Jl. Diponegoro No. 88, Kawasan Pasar',
    phone: '0813-9876-5432',
    kepalaToko: 'Siti Rahmawati',
    spvArea: 'Hendra Setiawan',
    manajerBisnis: 'H. Bambang Irawan',
    entryDate: '2026-05-15',
    targetGraduationDate: '2026-08-30',
    category: 'margin_minus',
    status: 'siap_lulus',
    urgencyLevel: 'sedang',
    targetSalesPerDay: 16000000,
    targetMarginPct: 16.0,
    targetMaxOpexPerMonth: 24000000,
    rootCauses: [],
    diagnosisSummary: '',
    recommendedStrategy: ''
  },
  {
    id: 'br-03',
    code: 'T-315',
    name: 'Cabang Basmalah Merdeka Barat',
    address: 'Jl. Merdeka Barat No. 12, Area Perumahan',
    phone: '0857-1122-3344',
    kepalaToko: 'Rian Pratama',
    spvArea: 'Budi Santoso',
    manajerBisnis: 'H. Bambang Irawan',
    entryDate: '2026-07-10',
    targetGraduationDate: '2026-10-10',
    category: 'opex_bengkak',
    status: 'kritis',
    urgencyLevel: 'tinggi',
    targetSalesPerDay: 11000000,
    targetMarginPct: 15.0,
    targetMaxOpexPerMonth: 19000000,
    rootCauses: [],
    diagnosisSummary: '',
    recommendedStrategy: ''
  }
];

export const INITIAL_MILESTONES: ActionPlanMilestone[] = [
  {
    id: 'ms-01',
    branchId: 'br-01',
    weekNumber: 1,
    title: 'Fondasi 5R, Re-Planogram & Refresh Training Kasir',
    targetMetric: 'Penetapan SOP Kasir & Display 100% Selesai',
    status: 'achieved',
    tasks: [
      { id: 't-1', title: 'Briefing pagi & roleplay penawaran promo kasir', assignedTo: 'Kepala Toko', frequency: 'harian', completed: true, verifiedBySpv: true },
      { id: 't-2', title: 'Re-display rak depan untuk produk snack promo & minuman dingin', assignedTo: 'Pramuniaga', frequency: 'sekali', completed: true, verifiedBySpv: true },
      { id: 't-3', title: 'Pembersihan mika rak dan lampu sorot plang toko', assignedTo: 'Kru Toko', frequency: 'sekali', completed: true, verifiedBySpv: true }
    ]
  },
  {
    id: 'ms-02',
    branchId: 'br-01',
    weekNumber: 2,
    title: 'Aktivasi Traffic: Program Direct Selling & Brosur Warga',
    targetMetric: 'Sales Harian naik mencapai Rp 11.5 Jt/hari',
    status: 'in_progress',
    tasks: [
      { id: 't-4', title: 'Sebar 300 lembar leaflet promo ke perumahan radius 500m', assignedTo: 'Pramuniaga', frequency: 'mingguan', completed: true, verifiedBySpv: true },
      { id: 't-5', title: 'Penawaran paket bundling sembako untuk arisan RT', assignedTo: 'Kepala Toko', frequency: 'mingguan', completed: false, verifiedBySpv: false },
      { id: 't-6', title: 'Cek ketersediaan stok produk katalog promo di gudang & rak', assignedTo: 'Kepala Toko', frequency: 'harian', completed: true, verifiedBySpv: true }
    ]
  },
  {
    id: 'ms-03',
    branchId: 'br-01',
    weekNumber: 3,
    title: 'Stabilisasi Sales & Target Up-selling Kasir',
    targetMetric: 'Rata-rata Basket Size naik dari 35rb ke 50rb',
    status: 'pending',
    tasks: [
      { id: 't-7', title: 'Evaluasi harian struk transaksi kasir per individu', assignedTo: 'Kepala Toko', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: 't-8', title: 'Ganti produk display kasir dengan margin > 25%', assignedTo: 'SPV DPK', frequency: 'sekali', completed: false, verifiedBySpv: false }
    ]
  }
];

export const INITIAL_FIELD_VISITS: FieldVisit[] = [
  {
    id: 'fv-01',
    branchId: 'br-01',
    date: '2026-08-18',
    time: '10:30',
    spvName: 'Supervisor DPK (Saya)',
    agenda: 'Pendampingan Program Kasir & Audit Display Facing Out',
    katokCoachingTopic: 'Strategi pembagian tugas shift pagi-siang dan monitoring target harian',
    katokCommitment: 'KaTok berkomitmen menempel papan KPI harian dan mengecek struk kasir jam 14:00 dan jam 21:00',
    crewCoachingTopic: 'Kerapian seragam, senyum salam sapa, dan teknik menawarkan tebus murah',
    spvAreaCoordinationNote: 'SPV Area Budi Santoso setuju fokus pengawasan cabang ini difokuskan pada ketersediaan stok DC',
    generalRating: 4,
    summaryConclusion: 'Sudah ada perubahan antusiasme kru toko. Penawaran promo kasir meningkat dari 15% menjadi 38% struk.',
    issues: [
      {
        id: 'iss-1',
        description: 'Chiller minuman baris ke-2 mati lampu LED sehingga produk gelap',
        category: 'fasilitas_alat',
        severity: 'sedang',
        immediateSolution: 'Sudah diganti lampu cadangan bersama kru toko',
        resolved: true
      },
      {
        id: 'iss-2',
        description: 'Minyak goreng 2 Liter stok di gudang belum dipajang ke rak',
        category: 'kekosongan_oos',
        severity: 'kritis',
        immediateSolution: 'Langsung instruksikan pajang 5 karton saat itu juga',
        resolved: true
      }
    ]
  },
  {
    id: 'fv-02',
    branchId: 'br-03',
    date: '2026-08-17',
    time: '14:00',
    spvName: 'Supervisor DPK (Saya)',
    agenda: 'Investigasi Lonjakan Biaya Listrik & NKL Audit',
    katokCoachingTopic: 'Audit disiplin pemakaian listrik AC dan penyusunan roster shift anti-lembur',
    katokCommitment: 'Mematikan lampu kanopi pukul 06:00 tepat dan membatasi lembur maks. 1 jam saat bongkar DC',
    crewCoachingTopic: 'Kepekaan terhadap gerak-gerik mencurigakan di lorong belakang',
    spvAreaCoordinationNote: 'Perlu pengajuan ke Manajer Bisnis untuk perbaikan kompresor chiller yang aus',
    generalRating: 2,
    summaryConclusion: 'Perlu intervensi teknis segera dari departemen pemeliharaan aset pusat.',
    issues: [
      {
        id: 'iss-3',
        description: 'Kompresor chiller bersuara dengung keras dan menyedot daya tinggi',
        category: 'fasilitas_alat',
        severity: 'kritis',
        immediateSolution: 'Dibuatkan tiket eskalasi ke Manajer Bisnis untuk teknisi DC',
        resolved: false
      }
    ]
  }
];

export const INITIAL_PERFORMANCE: DailyPerformance[] = [
  { id: 'dp-1', branchId: 'br-01', date: '2026-08-13', salesActual: 9800000, salesTarget: 13500000, marginPct: 14.1, opex: 720000, trafficCount: 280, basketSize: 35000, notes: 'Awal program' },
  { id: 'dp-2', branchId: 'br-01', date: '2026-08-14', salesActual: 10400000, salesTarget: 13500000, marginPct: 14.5, opex: 710000, trafficCount: 295, basketSize: 35250, notes: 'Mulai sebar brosur' },
  { id: 'dp-3', branchId: 'br-01', date: '2026-08-15', salesActual: 11200000, salesTarget: 13500000, marginPct: 14.8, opex: 700000, trafficCount: 310, basketSize: 36120, notes: 'Weekend promo' },
  { id: 'dp-4', branchId: 'br-01', date: '2026-08-16', salesActual: 12500000, salesTarget: 13500000, marginPct: 15.2, opex: 730000, trafficCount: 330, basketSize: 37870, notes: 'Minggu puncak belanja' },
  { id: 'dp-5', branchId: 'br-01', date: '2026-08-17', salesActual: 11800000, salesTarget: 13500000, marginPct: 15.0, opex: 690000, trafficCount: 305, basketSize: 38680, notes: 'Hari Kemerdekaan' },
  { id: 'dp-6', branchId: 'br-01', date: '2026-08-18', salesActual: 12900000, salesTarget: 13500000, marginPct: 15.4, opex: 680000, trafficCount: 325, basketSize: 39690, notes: 'Up-selling kasir efektif' },
  { id: 'dp-7', branchId: 'br-01', date: '2026-08-19', salesActual: 13650000, salesTarget: 13500000, marginPct: 15.6, opex: 680000, trafficCount: 340, basketSize: 40140, notes: 'Tembus target pertama kali!' },

  // br-02
  { id: 'dp-21', branchId: 'br-02', date: '2026-08-17', salesActual: 16800000, salesTarget: 16000000, marginPct: 16.4, opex: 750000, trafficCount: 420, basketSize: 40000 },
  { id: 'dp-22', branchId: 'br-02', date: '2026-08-18', salesActual: 16500000, salesTarget: 16000000, marginPct: 16.2, opex: 740000, trafficCount: 410, basketSize: 40240 },
  { id: 'dp-23', branchId: 'br-02', date: '2026-08-19', salesActual: 17200000, salesTarget: 16000000, marginPct: 16.5, opex: 730000, trafficCount: 430, basketSize: 40000 },

  // br-03
  { id: 'dp-31', branchId: 'br-03', date: '2026-08-17', salesActual: 8900000, salesTarget: 11000000, marginPct: 13.8, opex: 950000, trafficCount: 240, basketSize: 37080 },
  { id: 'dp-32', branchId: 'br-03', date: '2026-08-18', salesActual: 9100000, salesTarget: 11000000, marginPct: 14.0, opex: 940000, trafficCount: 245, basketSize: 37140 },
  { id: 'dp-33', branchId: 'br-03', date: '2026-08-19', salesActual: 8800000, salesTarget: 11000000, marginPct: 13.9, opex: 960000, trafficCount: 235, basketSize: 37440 }
];

export const INITIAL_GRADUATIONS: BranchGraduation[] = [
  {
    branchId: 'br-01',
    consecutiveMonthsHit: 1,
    targetMonthsRequired: 3,
    approvedByManager: false,
    bestPracticeLearnings: 'Kombinasi leaflet door-to-door dan kompetisi kasir terbukti mengangkat basket size dan sales harian.',
    checklists: [
      { id: 'gc-1', title: 'Target Sales Harian', targetDescription: 'Rata-rata sales >= Rp 13.500.000 selama 3 bulan berturut-turut', isMet: false },
      { id: 'gc-2', title: 'Target Margin Profit', targetDescription: 'Gross Margin >= 15.5%', isMet: true },
      { id: 'gc-3', title: 'Efisiensi Biaya Opex', targetDescription: 'Opex <= Rp 22.000.000 / bulan', isMet: true },
      { id: 'gc-4', title: 'Audit Kepatuhan 5R & SOP', targetDescription: 'Skor audit toko min. 85 poin', isMet: false },
      { id: 'gc-5', title: 'Kemandirian KTB & Tim', targetDescription: 'KTB mampu memimpin briefing dan analisis harian tanpa pendampingan intensif', isMet: false }
    ]
  },
  {
    branchId: 'br-02',
    consecutiveMonthsHit: 3,
    targetMonthsRequired: 3,
    approvedByManager: true,
    graduationDate: '2026-06-30',
    bestPracticeLearnings: 'Disiplin audit display 5R harian, penataan lorong promo kasir, dan penegakan target omzet harian shift pagi.',
    checklists: [
      { id: 'gc-21', title: 'Pencapaian Sales Target >= 100%', targetDescription: 'Sales stabil di atas target harian 3 bulan berturut-turut', isMet: true },
      { id: 'gc-22', title: 'Target Margin Profit Tercapai', targetDescription: 'Gross Margin tercapai 16.2%', isMet: true },
      { id: 'gc-23', title: 'Efisiensi Biaya Operasional (Opex)', targetDescription: 'Opex terkendali sesuai budget', isMet: true },
      { id: 'gc-24', title: 'Skor Audit Kepatuhan SOP & 5R', targetDescription: 'Nilai audit 92 poin', isMet: true },
      { id: 'gc-25', title: 'Kemandirian KTB & Tim', targetDescription: 'KTB mandiri menjalankan rutinitas', isMet: true }
    ]
  },
  {
    branchId: 'br-03',
    consecutiveMonthsHit: 0,
    targetMonthsRequired: 3,
    approvedByManager: false,
    bestPracticeLearnings: 'Fokus pembenahan pencatatan retur DC dan optimalisasi stok barang fast moving.',
    checklists: [
      { id: 'gc-31', title: 'Pencapaian Sales Target >= 100%', targetDescription: 'Sales stabil', isMet: false },
      { id: 'gc-32', title: 'Target Margin Profit Tercapai', targetDescription: 'Margin >= 14.5%', isMet: false },
      { id: 'gc-33', title: 'Efisiensi Biaya Operasional (Opex)', targetDescription: 'Opex terkontrol', isMet: false },
      { id: 'gc-34', title: 'Skor Audit Kepatuhan SOP & 5R', targetDescription: 'Nilai audit min 85', isMet: false },
      { id: 'gc-35', title: 'Kemandirian KTB & Tim', targetDescription: 'KTB mampu memimpin pembagian shift', isMet: false }
    ]
  }
];

export const INITIAL_ESCALATIONS: EscalationTicket[] = [
  {
    id: 'esc-01',
    branchId: 'br-03',
    branchName: 'Cabang Basmalah Merdeka Barat',
    date: '2026-08-17',
    title: 'Usulan Penggantian / Servis Total Kompresor Chiller 3 Pintu',
    category: 'renovasi_aset',
    urgency: 'kritis',
    description: 'Chiller display minuman utama toko mengalami kebocoran freon dan kompresor aus, memicu lonjakan tagihan listrik hingga Rp 4.5 Jt/bulan dan risiko minuman tidak dingin.',
    proposedSolution: 'Kirimkan tim teknisi pemeliharaan aset pusat untuk penggantian kompresor hemat energi atau penggantian unit chiller cadangan.',
    status: 'ditinjau',
    managerFeedback: 'Sudah diteruskan ke Dept. GA/Maintenance untuk dijadwalkan inspeksi hari Jumat ini.'
  },
  {
    id: 'esc-02',
    branchId: 'br-01',
    branchName: 'Cabang Basmalah Veteran Raya',
    date: '2026-08-14',
    title: 'Permohonan Alokasi Promo Khusus Tebus Murah Minyak Goreng',
    category: 'diskon_khusus',
    urgency: 'tinggi',
    description: 'Untuk merebut kembali traffic pelanggan dari kompetitor baru di seberang, toko memerlukan dukungan program PWP (Purchase with Purchase) Minyak 1L.',
    proposedSolution: 'Alokasikan 100 karton promo tebus murah Rp 12.000 per struk belanja min. Rp 60.000 produk non-sembako.',
    status: 'disetujui',
    managerFeedback: 'Disetujui untuk kuota 80 karton mulai periode weekend ini.'
  }
];
