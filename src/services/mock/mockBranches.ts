import { Branch } from '../../types';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'br-01', code: 'T-102', name: 'Cabang Basmalah Veteran Raya',
    address: 'Jl. Veteran No. 45, Sentra Kota', phone: '0812-3456-7890',
    kepalaToko: 'Ahmad Fauzi', spvArea: 'Budi Santoso', manajerBisnis: 'H. Bambang Irawan',
    entryDate: '2026-06-01', targetGraduationDate: '2026-09-01',
    category: 'sales_drop', status: 'dalam_progres', urgencyLevel: 'tinggi',
    targetSalesPerDay: 13500000, targetMarginPct: 15.5, targetMaxOpexPerMonth: 22000000,
    rootCauses: [], diagnosisSummary: '', recommendedStrategy: ''
  },
  {
    id: 'br-02', code: 'T-208', name: 'Cabang Basmalah Diponegoro',
    address: 'Jl. Diponegoro No. 88, Kawasan Pasar', phone: '0813-9876-5432',
    kepalaToko: 'Siti Rahmawati', spvArea: 'Hendra Setiawan', manajerBisnis: 'H. Bambang Irawan',
    entryDate: '2026-05-15', targetGraduationDate: '2026-08-30',
    category: 'margin_minus', status: 'siap_lulus', urgencyLevel: 'sedang',
    targetSalesPerDay: 16000000, targetMarginPct: 16.0, targetMaxOpexPerMonth: 24000000,
    rootCauses: [], diagnosisSummary: '', recommendedStrategy: ''
  },
  {
    id: 'br-03', code: 'T-315', name: 'Cabang Basmalah Merdeka Barat',
    address: 'Jl. Merdeka Barat No. 12, Area Perumahan', phone: '0857-1122-3344',
    kepalaToko: 'Rian Pratama', spvArea: 'Budi Santoso', manajerBisnis: 'H. Bambang Irawan',
    entryDate: '2026-07-10', targetGraduationDate: '2026-10-10',
    category: 'opex_bengkak', status: 'kritis', urgencyLevel: 'tinggi',
    targetSalesPerDay: 11000000, targetMarginPct: 15.0, targetMaxOpexPerMonth: 19000000,
    rootCauses: [], diagnosisSummary: '', recommendedStrategy: ''
  }
];
