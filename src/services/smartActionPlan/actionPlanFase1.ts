import { ActionPlanMilestone, ActionPlanTask } from '../../types';
import { formatShortRupiah } from '../../utils/formatters';

export const buildSmartFase1 = (branchId: string, timestamp: number, ctx: any): ActionPlanMilestone[] => {
  const phase1TasksWeek1: ActionPlanTask[] = [];

  if (ctx.hasElectricityIssue) {
    phase1TasksWeek1.push({ id: `t-${timestamp}-101`, title: `⚡ Pengaturan suhu AC 24-25°C & matikan 1 unit saat sepi guna pangkas biaya ke batas ${formatShortRupiah(ctx.targetOpex)}/bln`, assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false });
    phase1TasksWeek1.push({ id: `t-${timestamp}-102`, title: 'Pembersihan rutin bunga es freezer & cek kerapatan karet pintu chiller', assignedTo: 'Pramuniaga', frequency: 'mingguan', completed: false, verifiedBySpv: false });
  } else {
    phase1TasksWeek1.push({ id: `t-${timestamp}-101`, title: `Audit efisiensi biaya toko & matikan penerangan luar di jam siang`, assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false });
  }

  if (ctx.hasStockIssue) {
    phase1TasksWeek1.push({ id: `t-${timestamp}-103`, title: 'Identifikasi dead stock / slow moving dan ajukan mutasi barang ke cabang terdekat', assignedTo: 'KTB', frequency: 'sekali', completed: false, verifiedBySpv: false });
  }

  phase1TasksWeek1.push({ id: `t-${timestamp}-104`, title: 'Disiplin FEFO (First Expired First Out) & mark-down barang sisa 1 bulan ED', assignedTo: 'Pramuniaga', frequency: 'harian', completed: false, verifiedBySpv: false });

  const phase1TasksWeek2: ActionPlanTask[] = [
    { id: `t-${timestamp}-105`, title: `Re-display produk margin tinggi (> ${ctx.targetMargin}%) di jalur kasir & lorong utama`, assignedTo: 'Pramuniaga', frequency: 'sekali', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-106`, title: `Program Kasir Wajib Add-On & Suggestive Selling promo margin tinggi`, assignedTo: 'Kasir', frequency: 'harian', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-107`, title: 'Sinkronisasi update harga beli HPP sistem POS kasir dengan master DC', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false },
    { id: `t-${timestamp}-108`, title: 'Audit barang rusak/retur yang menumpuk di gudang dan proses retur suplier', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false }
  ];

  return [
    {
      id: `ms-smart-${branchId}-w1`, branchId, phase: 'fase_1', monthNumber: 1, weekNumber: 1,
      title: 'M1: Penghentian Kerugian (Audit Biaya, Efisiensi Energi & Dead Stock)',
      targetMetric: `Pangkas Biaya <= ${formatShortRupiah(ctx.targetOpex)}/bln & Nol Dead Stock`, status: 'in_progress', tasks: phase1TasksWeek1
    },
    {
      id: `ms-smart-${branchId}-w2`, branchId, phase: 'fase_1', monthNumber: 1, weekNumber: 2,
      title: 'M2: Pemulihan Margin Profit & Up-Selling Kasir',
      targetMetric: `Margin Profit Naik ke Standar >= ${ctx.targetMargin}%`, status: 'pending', tasks: phase1TasksWeek2
    }
  ];
};
