import { Branch, DailyPerformance, ActionPlanMilestone, ActionPlanTask } from '../types';
import { formatShortRupiah } from '../utils/formatters';

export const generateSmartActionPlan = (
  branch: Branch,
  performanceHistory: DailyPerformance[] = []
): ActionPlanMilestone[] => {
  const timestamp = Date.now();
  const branchPerf = performanceHistory.filter(p => p.branchId === branch.id);
  const latestPerf = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;

  // Actual numbers or fallback to target baseline
  const targetSales = branch.targetSalesPerDay || 1500000;
  const targetMargin = branch.targetMarginPct || 15;
  const targetOpex = branch.targetMaxOpexPerMonth || 54000000;

  const actualSales = latestPerf ? latestPerf.salesActual : targetSales * 0.7;
  const actualMargin = latestPerf ? latestPerf.marginActualPct : Math.max(targetMargin - 4, 8);

  const weakRootCauses = branch.rootCauses ? branch.rootCauses.filter(f => f.score <= 2) : [];
  const moderateRootCauses = branch.rootCauses ? branch.rootCauses.filter(f => f.score === 3) : [];

  const hasElectricityIssue = weakRootCauses.some(f => f.title.toLowerCase().includes('listrik') || f.title.toLowerCase().includes('energi')) ||
    branch.diagnosisSummary?.toLowerCase().includes('listrik') || branch.diagnosisSummary?.toLowerCase().includes('ac');

  const hasStockIssue = weakRootCauses.some(f => f.title.toLowerCase().includes('stok') || f.title.toLowerCase().includes('barang') || f.title.toLowerCase().includes('sku')) ||
    branch.diagnosisSummary?.toLowerCase().includes('stok') || branch.diagnosisSummary?.toLowerCase().includes('oos');

  const hasMarginIssue = actualMargin < targetMargin || weakRootCauses.some(f => f.title.toLowerCase().includes('margin') || f.title.toLowerCase().includes('laba'));

  const hasShrinkageIssue = weakRootCauses.some(f => f.title.toLowerCase().includes('susut') || f.title.toLowerCase().includes('nkl') || f.title.toLowerCase().includes('hilang'));

  const hasTrafficIssue = weakRootCauses.some(f => f.title.toLowerCase().includes('traffic') || f.title.toLowerCase().includes('pengunjung') || f.title.toLowerCase().includes('pelanggan'));

  // ========================================================
  // FASE 1: BULAN 1 (HARI 1 - 30): STOP THE BLEEDING & BEP
  // ========================================================
  const phase1TasksWeek1: ActionPlanTask[] = [];

  if (hasElectricityIssue) {
    phase1TasksWeek1.push({
      id: `t-${timestamp}-101`,
      title: `⚡ Pengaturan suhu AC 24-25°C & matikan 1 unit saat sepi (08.00 - 11.00) guna pangkas opex ke batas ${formatShortRupiah(targetOpex)}/bln`,
      assignedTo: 'KTB',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    });
    phase1TasksWeek1.push({
      id: `t-${timestamp}-102`,
      title: 'Pembersihan rutin bunga es freezer & cek kerapatan karet pintu chiller agar watt listrik stabil',
      assignedTo: 'Pramuniaga',
      frequency: 'mingguan',
      completed: false,
      verifiedBySpv: false
    });
  } else {
    phase1TasksWeek1.push({
      id: `t-${timestamp}-101`,
      title: `Audit efisiensi biaya toko & matikan penerangan luar di jam siang untuk jaga batas biaya ${formatShortRupiah(targetOpex)}/bln`,
      assignedTo: 'KTB',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    });
  }

  if (hasStockIssue) {
    phase1TasksWeek1.push({
      id: `t-${timestamp}-103`,
      title: `📦 Zero Out-of-Stock: Kontrol fisik Top 50 SKU omzet tiap jam 08.00 pagi untuk kejar target laba ${formatShortRupiah(targetSales)}/hari`,
      assignedTo: 'KTB',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    });
    phase1TasksWeek1.push({
      id: `t-${timestamp}-104`,
      title: 'Disiplin FEFO rak display & ajukan retur suplier/DC untuk barang mendekati expired (1-2 bulan)',
      assignedTo: 'Pramuniaga',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    });
  } else {
    phase1TasksWeek1.push({
      id: `t-${timestamp}-103`,
      title: 'Penataan ulang display lorong utama & pastikan label harga (price tag) terpasang 100% update',
      assignedTo: 'Pramuniaga',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    });
  }

  if (hasMarginIssue) {
    phase1TasksWeek1.push({
      id: `t-${timestamp}-105`,
      title: `💳 Kasir wajib Add-on sales (cth: kopi+gula) & suggestive selling produk promo untuk naikkan margin ke ${targetMargin}%`,
      assignedTo: 'Kasir',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    });
  }

  if (hasShrinkageIssue) {
    phase1TasksWeek1.push({
      id: `t-${timestamp}-106`,
      title: 'Stock Opname (SO) parsial harian untuk kategori rawan (Rokok, Susu Bayi, Kosmetik)',
      assignedTo: 'KTB',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    });
  }

  // ========================================================
  // FASE 2: BULAN 2 - 3 (HARI 31 - 90): STABILISASI & SALES
  // ========================================================
  const phase2TasksWeek4: ActionPlanTask[] = [
    {
      id: `t-${timestamp}-201`,
      title: `Evaluasi pencapaian laba harian menuju target ${formatShortRupiah(targetSales)}/hari & margin ${targetMargin}%`,
      assignedTo: 'SPV Area',
      frequency: 'mingguan',
      completed: false,
      verifiedBySpv: false
    },
    {
      id: `t-${timestamp}-202`,
      title: 'Aktivasi promo bundling sembako + non-food di gondola kasir untuk mendongkrak rata-rata struk (Basket Size)',
      assignedTo: 'KTB',
      frequency: 'mingguan',
      completed: false,
      verifiedBySpv: false
    },
    {
      id: `t-${timestamp}-203`,
      title: 'Canvassing jemput bola ke warung, pesantren, & UMKM sekitar untuk suplai sembako rutin',
      assignedTo: 'KTB',
      frequency: 'mingguan',
      completed: false,
      verifiedBySpv: false
    },
    {
      id: `t-${timestamp}-204`,
      title: 'Briefing pagi 10 menit: review target harian, kebersihan kasir, dan senyum salam sapa ke konsumen',
      assignedTo: 'KTB',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    }
  ];

  // ========================================================
  // FASE 3: BULAN 4 - 6 (HARI 91 - 180): SCALE & LULUS DPK
  // ========================================================
  const phase3TasksWeek7: ActionPlanTask[] = [
    {
      id: `t-${timestamp}-301`,
      title: 'Standardisasi SOP Turnaround menjadi kebiasaan harian toko tanpa perlu diawasi intensif (Sistem Autopilot)',
      assignedTo: 'KTB',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    },
    {
      id: `t-${timestamp}-302`,
      title: 'Optimalisasi data Member TokoBASMALAH & program poin pelanggan setia',
      assignedTo: 'Kasir',
      frequency: 'harian',
      completed: false,
      verifiedBySpv: false
    },
    {
      id: `t-${timestamp}-303`,
      title: `Verifikasi stabilitas laba konsisten > ${formatShortRupiah(targetSales)}/hari selama 3 bulan berturut-turut`,
      assignedTo: 'SPV DPK',
      frequency: 'bulanan',
      completed: false,
      verifiedBySpv: false
    },
    {
      id: `t-${timestamp}-304`,
      title: 'Penyusunan berkas sidang evaluasi kelulusan program DPK menuju Toko Mandiri Sehat',
      assignedTo: 'SPV Area',
      frequency: 'sekali',
      completed: false,
      verifiedBySpv: false
    }
  ];

  return [
    {
      id: `ms-smart-${branch.id}-w1`,
      branchId: branch.id,
      phase: 'fase_1',
      monthNumber: 1,
      weekNumber: 1,
      title: 'M1: Stop Kebocoran & Efisiensi Energi',
      targetMetric: `Pangkas Opex < ${formatShortRupiah(targetOpex)} & Kejar Laba ${formatShortRupiah(targetSales)}/hari`,
      status: 'in_progress',
      tasks: phase1TasksWeek1
    },
    {
      id: `ms-smart-${branch.id}-w4`,
      branchId: branch.id,
      phase: 'fase_2',
      monthNumber: 2,
      weekNumber: 4,
      title: 'M4: Stabilisasi Margin & Ekspansi Penjualan Lokal',
      targetMetric: `Target Margin Stabil ${targetMargin}% & Basket Size Naik`,
      status: 'pending',
      tasks: phase2TasksWeek4
    },
    {
      id: `ms-smart-${branch.id}-w7`,
      branchId: branch.id,
      phase: 'fase_3',
      monthNumber: 4,
      weekNumber: 7,
      title: 'M7: Kemandirian KTB & Sidang Kelulusan DPK',
      targetMetric: `Laba Konsisten > ${formatShortRupiah(targetSales)}/hari & Lulus DPK`,
      status: 'pending',
      tasks: phase3TasksWeek7
    }
  ];
};
