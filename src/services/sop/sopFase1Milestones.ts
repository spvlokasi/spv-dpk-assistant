import { ActionPlanMilestone } from '../../types';

export const getFase1Milestones = (branchId: string, timestamp: number): ActionPlanMilestone[] => [
  {
    id: `ms-sop-${branchId}-w1`,
    branchId,
    phase: 'fase_1',
    monthNumber: 1,
    weekNumber: 1,
    title: 'M1: Audit Efisiensi Total Energi & Opex Toko',
    targetMetric: 'Turunkan Biaya Listrik & Opex Minimal 15%',
    status: 'in_progress',
    tasks: [
      { id: `t-${timestamp}-101`, title: 'Pengaturan suhu AC ideal 24-25°C & matikan 1 unit AC saat jam sepi (08.00 - 11.00)', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-102`, title: 'Disiplin jadwal nyala-padam lampu teras, neon box toko, dan area gudang', assignedTo: 'Kru Toko', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-103`, title: 'Pembersihan rutin bunga es dan cek kerapatan karet pintu freezer/chiller', assignedTo: 'Pramuniaga', frequency: 'mingguan', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-104`, title: 'Kontrol ketat pemakaian kantong plastik, struk kasir, deterjen & alat kebersihan', assignedTo: 'Kasir', frequency: 'harian', completed: false, verifiedBySpv: false }
    ]
  },
  {
    id: `ms-sop-${branchId}-w2`,
    branchId,
    phase: 'fase_1',
    monthNumber: 1,
    weekNumber: 2,
    title: 'M2: Penertiban Stok Mati (Slow Moving) & Zero Expired',
    targetMetric: 'Bebaskan Modal Mati Gudang & Nol Kerugian Expired',
    status: 'pending',
    tasks: [
      { id: `t-${timestamp}-105`, title: 'Identifikasi barang slow moving/dead stock dan ajukan mutasi ke cabang ramai', assignedTo: 'KTB', frequency: 'sekali', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-106`, title: 'Pengetatan buffer stock gudang; fokus stok fast moving dan kontinuitas rak', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-107`, title: 'Disiplin FEFO (First Expired First Out) display rak di seluruh lorong toko', assignedTo: 'Pramuniaga', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-108`, title: 'Mark-down diskon 10-20% untuk barang sisa kedaluwarsa 1-2 bulan', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false }
    ]
  },
  {
    id: `ms-sop-${branchId}-w3`,
    branchId,
    phase: 'fase_1',
    monthNumber: 2,
    weekNumber: 3,
    title: 'M3: Mix Margin Strategy & Up-Selling Kasir',
    targetMetric: 'Kenaikan Margin Profit Toko ke Standar Sehat (>15%)',
    status: 'pending',
    tasks: [
      { id: `t-${timestamp}-109`, title: 'Re-display rak: tempatkan produk margin tinggi di jalur kasir setelah sembako', assignedTo: 'Pramuniaga', frequency: 'sekali', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-110`, title: 'Kasir wajib Add-on sales & Suggestive selling promo margin tinggi', assignedTo: 'Kasir', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-111`, title: 'Penyesuaian update sistem kasir dengan harga beli HPP terbaru dari suplier/DC', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-112`, title: 'Audit & eksekusi retur suplier untuk semua barang rusak yang menumpuk di gudang', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false }
    ]
  }
];
