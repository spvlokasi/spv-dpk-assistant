import { BranchGraduation } from '../../types';

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
