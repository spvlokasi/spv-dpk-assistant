export interface DailyPerformance {
  id: string;
  branchId: string;
  date: string;
  salesActual: number;
  salesTarget: number;
  marginPct: number;
  opex: number;
  trafficCount: number;
  basketSize: number;
  nklShrinkage?: number;
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
  consecutiveMonthsHit: number;
  targetMonthsRequired: number;
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
