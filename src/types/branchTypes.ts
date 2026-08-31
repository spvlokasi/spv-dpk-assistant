export type DpkStatus = 'akut' | 'kritis' | 'dalam_progres' | 'existing' | 'cabang_baru' | 'siap_lulus' | 'lulus_dpk';

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
  score: number;
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
  entryDate: string;
  targetGraduationDate: string;
  category: DpkCategory;
  status: DpkStatus;
  urgencyLevel: 'tinggi' | 'sedang' | 'rendah';
  targetSalesPerDay: number;
  targetMarginPct: number;
  targetMaxOpexPerMonth: number;
  rootCauses: RootCauseFactor[];
  diagnosisSummary: string;
  recommendedStrategy: string;
  imageUrl?: string;
  diagnosisStartDate?: string;
  diagnosisEndDate?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  areaCluster?: string;
  deliveryHours?: string;
}

export interface DiagnosisLog {
  id: string;
  branchId: string;
  periodStartDate: string;
  periodEndDate: string;
  category: DpkCategory;
  status: DpkStatus;
  urgencyLevel: 'tinggi' | 'sedang' | 'rendah';
  targetSalesPerDay: number;
  targetMarginPct: number;
  targetMaxOpexPerMonth: number;
  rootCauses: RootCauseFactor[];
  diagnosisSummary: string;
  recommendedStrategy: string;
  diagnosedBy?: string;
  createdAt: string;
}
