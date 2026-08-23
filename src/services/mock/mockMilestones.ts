import { ActionPlanMilestone, DailyPerformance, FieldVisit, EscalationTicket } from '../../types';

export const INITIAL_MILESTONES: ActionPlanMilestone[] = [
  {
    id: 'ms-01', branchId: 'br-01', weekNumber: 1,
    title: 'Fondasi 5R, Re-Planogram & Refresh Training Kasir', targetMetric: 'Penetapan SOP Kasir & Display 100% Selesai',
    status: 'achieved',
    tasks: [
      { id: 't-1', title: 'Briefing pagi & roleplay penawaran promo kasir', assignedTo: 'Kepala Toko', frequency: 'harian', completed: true, verifiedBySpv: true },
      { id: 't-2', title: 'Re-display rak depan untuk produk snack promo & minuman dingin', assignedTo: 'Pramuniaga', frequency: 'sekali', completed: true, verifiedBySpv: true },
      { id: 't-3', title: 'Pembersihan mika rak dan lampu sorot plang toko', assignedTo: 'Kru Toko', frequency: 'sekali', completed: true, verifiedBySpv: true }
    ]
  },
  {
    id: 'ms-02', branchId: 'br-01', weekNumber: 2,
    title: 'Aktivasi Traffic: Program Direct Selling & Brosur Warga', targetMetric: 'Sales Harian naik mencapai Rp 11.5 Jt/hari',
    status: 'in_progress',
    tasks: [
      { id: 't-4', title: 'Sebar 300 lembar leaflet promo ke perumahan radius 500m', assignedTo: 'Pramuniaga', frequency: 'mingguan', completed: true, verifiedBySpv: true },
      { id: 't-5', title: 'Penawaran paket bundling sembako untuk arisan RT', assignedTo: 'Kepala Toko', frequency: 'mingguan', completed: false, verifiedBySpv: false },
      { id: 't-6', title: 'Cek ketersediaan stok produk katalog promo di gudang & rak', assignedTo: 'Kepala Toko', frequency: 'harian', completed: true, verifiedBySpv: true }
    ]
  },
  {
    id: 'ms-03', branchId: 'br-01', weekNumber: 3,
    title: 'Stabilisasi Sales & Target Up-selling Kasir', targetMetric: 'Rata-rata Basket Size naik dari 35rb ke 50rb',
    status: 'pending',
    tasks: [
      { id: 't-7', title: 'Evaluasi harian struk transaksi kasir per individu', assignedTo: 'Kepala Toko', frequency: 'harian', completed: false, verifiedBySpv: false },
      { id: 't-8', title: 'Ganti produk display kasir dengan margin > 25%', assignedTo: 'SPV DPK', frequency: 'sekali', completed: false, verifiedBySpv: false }
    ]
  }
];

export const INITIAL_FIELD_VISITS: FieldVisit[] = [];

export const INITIAL_PERFORMANCE: DailyPerformance[] = [
  { id: 'dp-1', branchId: 'br-01', date: '2026-08-13', salesActual: 9800000, salesTarget: 13500000, marginPct: 14.1, opex: 720000, trafficCount: 280, basketSize: 35000, notes: 'Awal program' },
  { id: 'dp-2', branchId: 'br-01', date: '2026-08-14', salesActual: 10400000, salesTarget: 13500000, marginPct: 14.5, opex: 710000, trafficCount: 295, basketSize: 35250, notes: 'Mulai sebar brosur' },
  { id: 'dp-3', branchId: 'br-01', date: '2026-08-15', salesActual: 11200000, salesTarget: 13500000, marginPct: 14.8, opex: 700000, trafficCount: 310, basketSize: 36120, notes: 'Weekend promo' },
  { id: 'dp-4', branchId: 'br-01', date: '2026-08-16', salesActual: 12500000, salesTarget: 13500000, marginPct: 15.2, opex: 730000, trafficCount: 330, basketSize: 37870, notes: 'Minggu puncak belanja' },
  { id: 'dp-5', branchId: 'br-01', date: '2026-08-17', salesActual: 11800000, salesTarget: 13500000, marginPct: 15.0, opex: 690000, trafficCount: 305, basketSize: 38680, notes: 'Hari Kemerdekaan' },
  { id: 'dp-6', branchId: 'br-01', date: '2026-08-18', salesActual: 12900000, salesTarget: 13500000, marginPct: 15.4, opex: 680000, trafficCount: 325, basketSize: 39690, notes: 'Up-selling kasir efektif' },
  { id: 'dp-7', branchId: 'br-01', date: '2026-08-19', salesActual: 13650000, salesTarget: 13500000, marginPct: 15.6, opex: 680000, trafficCount: 340, basketSize: 40140, notes: 'Tembus target pertama kali!' }
];

export const INITIAL_ESCALATIONS: EscalationTicket[] = [];
