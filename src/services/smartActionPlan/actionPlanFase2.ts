import { ActionPlanMilestone, ActionPlanTask } from '../../types';
import { formatShortRupiah } from '../../utils/formatters';

export const buildSmartFase2 = (branchId: string, timestamp: number, ctx: any): ActionPlanMilestone[] => {
  const phase2TasksWeek3: ActionPlanTask[] = [
    { id: `t-${timestamp}-201`, title: 'Bedah Cabang: Evaluasi struktur biaya (margin vs opex) dan karakter konsumen lokal', assignedTo: 'SPV DPK', frequency: 'sekali', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-202`, title: 'Zero Out-of-Stock: Pastikan Top 50 SKU penyumbang omzet tidak pernah kosong', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-203`, title: 'Stock Opname (SO) parsial harian untuk kategori rawan (Rokok, Susu, Kosmetik)', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false }
  ];

  if (ctx.hasShrinkageIssue) {
    phase2TasksWeek3.push({ id: `t-${timestamp}-204`, title: '🚨 Pemasangan cermin cembung & pengetatan SOP blind-spot lorong rawan susut', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false });
  }

  const phase2TasksWeek4: ActionPlanTask[] = [
    { id: `t-${timestamp}-205`, title: 'Canvassing jemput bola ke warung/komunitas/UMKM sekitar untuk pesanan sembako', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-206`, title: `Program Bundling promo sembako guna capai sales harian ${formatShortRupiah(ctx.targetSales)}/hari`, assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-207`, title: 'Kasir konsisten tawarkan promo tebus murah kasir untuk dongkrak basket size', assignedTo: 'Kasir', frequency: 'harian', completed: false, verifiedBySpv: false }
  ];

  return [
    {
      id: `ms-smart-${branchId}-w3`, branchId, phase: 'fase_2', monthNumber: 4, weekNumber: 3,
      title: 'M3: Zero OOS Top 50 SKU & Ketertiban Pengendalian Stok Toko',
      targetMetric: 'Zero Out-of-Stock Top 50 SKU & Susut < 0.2%', status: 'pending', tasks: phase2TasksWeek3
    },
    {
      id: `ms-smart-${branchId}-w4`, branchId, phase: 'fase_2', monthNumber: 5, weekNumber: 4,
      title: 'M4: Canvassing Komunitas & Ekspansi Omzet Laba Bersih',
      targetMetric: `Sales Harian Tembus >= ${formatShortRupiah(ctx.targetSales)}/hari`, status: 'pending', tasks: phase2TasksWeek4
    }
  ];
};
