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
  date: string;
  time: string;
  spvName: string;
  agenda: string;
  katokCoachingTopic: string;
  katokCommitment: string;
  crewCoachingTopic: string;
  spvAreaCoordinationNote: string;
  issues: OperationalIssue[];
  generalRating: number;
  summaryConclusion: string;
}
