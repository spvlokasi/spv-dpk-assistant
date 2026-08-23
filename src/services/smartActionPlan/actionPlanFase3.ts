import { ActionPlanMilestone, ActionPlanTask } from '../../types';

export const buildSmartFase3 = (branchId: string, timestamp: number): ActionPlanMilestone[] => {
  const phase3Tasks: ActionPlanTask[] = [
    { id: `t-${timestamp}-301`, title: 'Ubah rutinitas turnaround 180 hari menjadi SOP baku harian toko', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-302`, title: 'Aktivasi database Member TokoBASMALAH & program loyalitas pelanggan', assignedTo: 'Kasir', frequency: 'harian', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-303`, title: 'Kajian re-investasi display Ready to Drink (RTD) / Kopi kekinian', assignedTo: 'SPV DPK', frequency: 'sekali', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-304`, title: 'Sidang Evaluasi Kelulusan DPK & penetapan cabang mandiri berprestasi', assignedTo: 'SPV DPK', frequency: 'sekali', completed: false, verifiedBySpv: false }
  ];

  return [
    {
      id: `ms-smart-${branchId}-w5`, branchId, phase: 'fase_3', monthNumber: 7, weekNumber: 5,
      title: 'M5: Standardisasi Sistem Autopilot & Sidang Kelulusan DPK',
      targetMetric: 'Kemandirian KTB 100% & Siap Wisuda Kelulusan DPK', status: 'pending', tasks: phase3Tasks
    }
  ];
};
