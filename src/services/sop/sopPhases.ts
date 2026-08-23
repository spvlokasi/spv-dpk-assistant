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
