import { ActionPlanMilestone } from '../../types';

export const getFase3Milestones = (branchId: string, timestamp: number): ActionPlanMilestone[] => [
  {
    id: `ms-sop-${branchId}-w7`,
    branchId,
    phase: 'fase_3',
    monthNumber: 7,
    weekNumber: 7,
    title: 'M7: Standardisasi Sistem Autopilot & Loyalitas Member',
    targetMetric: 'Kemandirian KTB 100% & Pertumbuhan Member Aktif',
    status: 'pending',
    tasks: [
      { id: `t-${timestamp}-301`, title: 'Standardisasi Operasional: Ubah taktik penyelamatan 180 hari menjadi SOP baku harian', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-302`, title: 'Optimalisasi data Member TokoBASMALAH untuk program apresiasi pelanggan setia', assignedTo: 'Kasir', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-303`, title: 'Kajian re-investasi produk baru (Ready to Drink / Kopi / Layanan ATM)', assignedTo: 'SPV DPK', frequency: 'sekali', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-304`, title: 'Pemberian Reward Performa & penetapan cabang sebagai Role Model DPK', assignedTo: 'SPV DPK', frequency: 'sekali', completed: false, verifiedBySpv: false }
    ]
  }
];
