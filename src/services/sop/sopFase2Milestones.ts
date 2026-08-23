import { ActionPlanMilestone } from '../../types';

export const getFase2Milestones = (branchId: string, timestamp: number): ActionPlanMilestone[] => [
  {
    id: `ms-sop-${branchId}-w4`,
    branchId,
    phase: 'fase_2',
    monthNumber: 4,
    weekNumber: 4,
    title: 'M4: Bedah Cabang W1-W2 & Inventory Balancing',
    targetMetric: 'Laporan Bedah Cabang Lengkap & Penyelarasan Stok Lokal',
    status: 'pending',
    tasks: [
      { id: `t-${timestamp}-201`, title: 'Bedah Cabang: Analisis struktur biaya (margin vs opex) dan kesesuaian warga lokal', assignedTo: 'SPV DPK', frequency: 'sekali', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-202`, title: 'Ukur rasio Traffic vs Conversion rate pengunjung toko', assignedTo: 'SPV DPK', frequency: 'mingguan', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-203`, title: 'Evaluasi jadwal kerja personil & cegah lembur yang tidak perlu', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false }
    ]
  },
  {
    id: `ms-sop-${branchId}-w5`,
    branchId,
    phase: 'fase_2',
    monthNumber: 5,
    weekNumber: 5,
    title: 'M5: Zero OOS Top 50 SKU & SO Parsial Barang Rawan',
    targetMetric: 'Zero Out-of-Stock Top 50 SKU Omzet & Susut < 0.2%',
    status: 'pending',
    tasks: [
      { id: `t-${timestamp}-204`, title: 'Zero Out-of-Stock: Top 50 SKU penyumbang omzet tidak boleh kosong', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-205`, title: 'Stock Opname (SO) parsial harian untuk kategori rawan (Rokok, Susu, Kosmetik)', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-206`, title: 'Audit penerimaan barang kiriman DC/suplier dengan checklist ketat', assignedTo: 'Kru Toko', frequency: 'harian', completed: false, verifiedBySpv: false }
    ]
  },
  {
    id: `ms-sop-${branchId}-w6`,
    branchId,
    phase: 'fase_2',
    monthNumber: 6,
    weekNumber: 6,
    title: 'M6: Canvassing Komunitas/UMKM & Aktivasi Penjualan Lokal',
    targetMetric: 'Pertumbuhan Omzet Laba Bersih & Kerjasama Warung Sekitar',
    status: 'pending',
    tasks: [
      { id: `t-${timestamp}-207`, title: 'Canvassing jemput bola ke warung/komunitas/UMKM sekitar untuk suplai sembako', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-208`, title: 'Program promo khusus warga RT/RW sekitar dan bundling sembako', assignedTo: 'KTB', frequency: 'mingguan', completed: false, verifiedBySpv: false },
      { id: `t-${timestamp}-209`, title: 'Targeting Basket Size: Kasir konsisten tawarkan promo kasir', assignedTo: 'Kasir', frequency: 'harian', completed: false, verifiedBySpv: false }
    ]
  }
];
