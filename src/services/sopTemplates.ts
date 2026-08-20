import { ActionPlanMilestone } from '../types';

export interface SopPhaseInfo {
  id: 'fase_1' | 'fase_2' | 'fase_3';
  title: string;
  subtitle: string;
  duration: string;
  targetGoal: string;
  badgeColor: string;
  description: string;
}

export const SOP_PHASES: SopPhaseInfo[] = [
  {
    id: 'fase_1',
    title: 'Fase 1: Penyelamatan',
    subtitle: 'Target BEP (Break Even Point)',
    duration: 'Bulan 1 - 3 (Hari 1 - 90)',
    targetGoal: 'Hentikan Minus (<0), Audit Efisiensi Energi & Penyelamatan Margin',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Fokus 90 hari pertama: Tidak mentoleransi kerugian di bawah nol. Penghematan biaya operasional (listrik, AC, chiller) dan perbaikan struktur margin (FEFO, mark-down, up-selling kasir).'
  },
  {
    id: 'fase_2',
    title: 'Fase 2: Pertumbuhan',
    subtitle: 'Target Profitabilitas',
    duration: 'Bulan 4 - 6 (Hari 91 - 180)',
    targetGoal: 'Agresivitas Penjualan, Zero OOS Top 50 SKU, & Canvassing UMKM',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Fokus hari 91-180: Momentum cari uang dan laba bersih. Zero Out-of-Stock Top 50 SKU omzet, SO parsial harian barang rawan, jemput bola komunitas/warung sekitar, dan suggestive selling kasir.'
  },
  {
    id: 'fase_3',
    title: 'Fase 3: Keberlanjutan & Ekspansi',
    subtitle: 'Target Autopilot & Profit Stabil',
    duration: 'Bulan 7+ (Hari 181+)',
    targetGoal: 'Standardisasi SOP Baku, Loyalitas Member, & Re-Investasi RTD',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Fokus jangka panjang: Penguatan dominasi pasar dan profitabilitas konsisten. Kemandirian KTB (sistem autopilot), manajemen member setia TokoBASMALAH, serta inovasi minuman/kopi kekinian (Ready to Drink).'
  }
];

export const generateSidogiriSopMilestones = (branchId: string): ActionPlanMilestone[] => {
  const timestamp = Date.now();
  return [
    // ==========================================
    // FASE 1: BULAN 1 - 3 (TARGET BEP)
    // ==========================================
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
        {
          id: `t-${timestamp}-101`,
          title: 'Pengaturan suhu AC ideal 24-25°C & matikan 1 unit AC saat jam sepi (08.00 - 11.00)',
          assignedTo: 'KTB',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-102`,
          title: 'Disiplin jadwal nyala-padam lampu teras, neon box toko, dan area gudang',
          assignedTo: 'Kru Toko',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-103`,
          title: 'Pembersihan rutin bunga es dan cek kerapatan karet pintu freezer/chiller',
          assignedTo: 'Pramuniaga',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-104`,
          title: 'Kontrol ketat pemakaian kantong plastik, struk kasir, deterjen & alat kebersihan',
          assignedTo: 'Kasir',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        }
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
        {
          id: `t-${timestamp}-105`,
          title: 'Identifikasi barang slow moving/dead stock dan ajukan mutasi ke cabang ramai',
          assignedTo: 'KTB',
          frequency: 'sekali',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-106`,
          title: 'Pengetatan buffer stock gudang; fokus stok fast moving dan kontinuitas rak',
          assignedTo: 'KTB',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-107`,
          title: 'Disiplin FEFO (First Expired First Out) display rak di seluruh lorong toko',
          assignedTo: 'Pramuniaga',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-108`,
          title: 'Mark-down diskon 10-20% untuk barang sisa kedaluwarsa 1-2 bulan (cegah rugi total write-off)',
          assignedTo: 'KTB',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        }
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
        {
          id: `t-${timestamp}-109`,
          title: 'Re-display rak: tempatkan produk non-food/margin tinggi di jalur kasir setelah sembako',
          assignedTo: 'Pramuniaga',
          frequency: 'sekali',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-110`,
          title: 'Kasir wajib Add-on sales (cth: beli kopi tawarkan gula/krimer) & Suggestive selling promo margin tinggi',
          assignedTo: 'Kasir',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-111`,
          title: 'Penyesuaian update sistem kasir dengan harga beli HPP terbaru dari suplier/DC',
          assignedTo: 'KTB',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-112`,
          title: 'Audit & eksekusi retur suplier untuk semua barang rusak yang menumpuk di gudang',
          assignedTo: 'KTB',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        }
      ]
    },

    // ==========================================
    // FASE 2: BULAN 4 - 6 (TARGET PROFIT)
    // ==========================================
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
        {
          id: `t-${timestamp}-201`,
          title: 'Bedah Cabang: Analisis struktur biaya (margin vs opex) dan kesesuaian kebutuhan warga lokal',
          assignedTo: 'SPV DPK',
          frequency: 'sekali',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-202`,
          title: 'Ukur rasio Traffic vs Conversion rate (kenapa pengunjung masuk tapi tidak belanja)',
          assignedTo: 'SPV DPK',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-203`,
          title: 'Evaluasi jadwal kerja personil & cegah lembur yang tidak perlu tanpa kurangi kenyamanan pembeli',
          assignedTo: 'KTB',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        }
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
        {
          id: `t-${timestamp}-204`,
          title: 'Zero Out-of-Stock: Top 50 SKU penyumbang omzet tidak boleh kosong satu hari pun',
          assignedTo: 'KTB',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-205`,
          title: 'Stock Opname (SO) parsial harian untuk kategori rawan (Rokok, Susu Formula, Kosmetik)',
          assignedTo: 'KTB',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-206`,
          title: 'Audit penerimaan barang kiriman DC/suplier dengan checklist verifikasi ketat',
          assignedTo: 'Kru Toko',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        }
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
        {
          id: `t-${timestamp}-207`,
          title: 'Canvassing jemput bola ke warung/komunitas/UMKM sekitar untuk suplai sembako & layanan antar',
          assignedTo: 'KTB',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-208`,
          title: 'Program promo khusus warga RT/RW sekitar dan bundling sembako + barang margin tebal',
          assignedTo: 'KTB',
          frequency: 'mingguan',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-209`,
          title: 'Targeting Basket Size: Kasir konsisten tawarkan promo kasir guna naikkan rata-rata belanja',
          assignedTo: 'Kasir',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        }
      ]
    },

    // ==========================================
    // FASE 3: BULAN 7+ (AUTOPILOT & DOMINASI)
    // ==========================================
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
        {
          id: `t-${timestamp}-301`,
          title: 'Standardisasi Operasional: Ubah taktik penyelamatan 180 hari menjadi SOP baku harian',
          assignedTo: 'KTB',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-302`,
          title: 'Optimalisasi data Member TokoBASMALAH untuk program apresiasi pelanggan setia',
          assignedTo: 'Kasir',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-303`,
          title: 'Kajian re-investasi produk baru (Ready to Drink / Kopi / Minuman kekinian / Layanan ATM)',
          assignedTo: 'SPV DPK',
          frequency: 'sekali',
          completed: false,
          verifiedBySpv: false
        },
        {
          id: `t-${timestamp}-304`,
          title: 'Pemberian Reward Performa & penetapan cabang sebagai Role Model Percontohan DPK',
          assignedTo: 'SPV DPK',
          frequency: 'sekali',
          completed: false,
          verifiedBySpv: false
        }
      ]
    }
  ];
};
