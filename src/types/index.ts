export type DpkStatus = 'kritis' | 'dalam_progres' | 'siap_lulus' | 'lulus_dpk';

export type DpkCategory = 
  | 'sales_drop'
  | 'margin_minus'
  | 'opex_bengkak'
  | 'shrinkage_tinggi'
  | 'traffic_rendah'
  | 'disiplin_sdm';

export interface RootCauseFactor {
  id: string;
  category: 'internal' | 'eksternal';
  title: string;
  score: number; // 1 (sangat buruk) - 5 (baik)
  note: string;
}

export interface Branch {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  kepalaToko: string;
  spvArea: string;
  manajerBisnis: string;
  entryDate: string; // YYYY-MM-DD
  targetGraduationDate: string; // YYYY-MM-DD
  category: DpkCategory;
  status: DpkStatus;
  urgencyLevel: 'tinggi' | 'sedang' | 'rendah';
  targetSalesPerDay: number;
  targetMarginPct: number;
  targetMaxOpexPerMonth: number;
  rootCauses: RootCauseFactor[];
  diagnosisSummary: string;
  recommendedStrategy: string;
}

export interface ActionPlanTask {
  id: string;
  title: string;
  assignedTo: string; // misal: 'Kepala Toko', 'Kasir', 'Pramuniaga', 'SPV DPK'
  frequency: 'harian' | 'mingguan' | 'sekali';
  dueDate?: string;
  completed: boolean;
  verifiedBySpv: boolean;
  notes?: string;
}

export interface ActionPlanMilestone {
  id: string;
  branchId: string;
  title: string;
  weekNumber: number; // Minggu 1, 2, 3, dst.
  targetMetric: string; // e.g. "Sales naik ke Rp 10.5 Jt/hari"
  status: 'pending' | 'in_progress' | 'achieved' | 'failed';
  tasks: ActionPlanTask[];
}

export interface OperationalIssue {
  id: string;
  description: string;
  category: 'display_planogram' | 'kebersihan_5r' | 'fasilitas_alat' | 'kekosongan_oos' | 'kasir_layanan' | 'keamanan_nkl';
  severity: 'ringan' | 'sedang' | 'kritis';
  immediateSolution: string;
  photoUrl?: string;
  resolved: boolean;
}

export interface FieldVisit {
  id: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  time: string;
  spvName: string;
  agenda: string;
  katokCoachingTopic: string;
  katokCommitment: string;
  crewCoachingTopic: string;
  spvAreaCoordinationNote: string;
  issues: OperationalIssue[];
  generalRating: number; // 1-5 bintang
  summaryConclusion: string;
}

export interface DailyPerformance {
  id: string;
  branchId: string;
  date: string; // YYYY-MM-DD
  salesActual: number;
  salesTarget: number;
  marginPct: number; // e.g. 14.5%
  opex: number; // Biaya harian / porsi
  trafficCount: number; // jumlah struk
  basketSize: number; // rata-rata nilai belanja per struk
  nklShrinkage?: number; // perkiraan shrinkage
  notes?: string;
}

export interface GraduationChecklistItem {
  id: string;
  title: string;
  targetDescription: string;
  isMet: boolean;
}

export interface BranchGraduation {
  branchId: string;
  consecutiveMonthsHit: number; // minimal 3 bulan
  targetMonthsRequired: number; // default 3
  checklists: GraduationChecklistItem[];
  bestPracticeLearnings: string;
  graduationDate?: string;
  approvedByManager: boolean;
}

export interface EscalationTicket {
  id: string;
  branchId: string;
  branchName: string;
  date: string;
  title: string;
  category: 'sdm_rotasi' | 'renovasi_aset' | 'diskon_khusus' | 'revisi_program' | 'keamanan_nkl' | 'lainnya';
  urgency: 'kritis' | 'tinggi' | 'sedang';
  description: string;
  proposedSolution: string;
  status: 'diajukan' | 'ditinjau' | 'disetujui' | 'ditolak';
  managerFeedback?: string;
}
