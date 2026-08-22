export function formatRupiah(amount: number | null | undefined): string {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
}

export function formatShortRupiah(amount: number | null | undefined): string {
  const val = Number(amount) || 0;
  if (val >= 1000000000) return `Rp ${(val / 1000000000).toFixed(1)} M`;
  if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)} Jt`;
  if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)} Rb`;
  return `Rp ${val}`;
}

export function parseAnyDateToIso(dateStr: string | number | null | undefined): string {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  if (typeof dateStr === 'number' || (/^\d{4,6}$/.test(String(dateStr).trim()) && Number(dateStr) > 30000 && Number(dateStr) < 70000)) {
    const num = Number(dateStr);
    return new Date(Math.round((num - 25569) * 86400 * 1000)).toISOString().slice(0, 10);
  }
  const str = String(dateStr).trim();
  if (str.includes('/')) {
    const p = str.split('/');
    if (p.length === 3) return `${p[2].length === 2 ? '20' + p[2] : p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
  }
  if (str.includes('-') && str.split('-')[0].length <= 2) {
    const p = str.split('-');
    if (p.length === 3) return `${p[2].length === 2 ? '20' + p[2] : p[2]}-${p[1].padStart(2, '0')}-${p[0].padStart(2, '0')}`;
  }
  return str;
}

export function formatDateIndo(dateStr: string | number | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const iso = parseAnyDateToIso(dateStr);
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  } catch {
    return String(dateStr);
  }
}

export function formatMonthYearIndo(ymStr: string): string {
  if (!ymStr || ymStr === 'all') return 'Semua Periode';
  try {
    const iso = parseAnyDateToIso(ymStr);
    const [year, month] = iso.slice(0, 7).split('-');
    const d = new Date(Number(year), Number(month) - 1, 1);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(d);
  } catch {
    return ymStr;
  }
}

export const DPK_STATUS_PRIORITY: Record<string, number> = {
  akut: 1,
  kritis: 2,
  dalam_progres: 3,
  existing: 4,
  cabang_baru: 5,
  siap_lulus: 6,
  lulus_dpk: 7
};

export function sortBranchesByStatus<T extends { status?: string; name?: string }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const pA = DPK_STATUS_PRIORITY[a.status || ''] || 99;
    const pB = DPK_STATUS_PRIORITY[b.status || ''] || 99;
    if (pA !== pB) return pA - pB;
    return (a.name || '').localeCompare(b.name || '');
  });
}

export function formatCategoryName(category: string): string {
  const map: Record<string, string> = {
    sales_drop: '📉 Sales Drop / Anjlok',
    margin_minus: '💸 Margin Rendah / Minus',
    opex_bengkak: '⚡ Biaya Opex Bengkak',
    shrinkage_tinggi: '📦 Susut/NKL Tinggi',
    traffic_rendah: '🚶 Traffic Struk Rendah',
    disiplin_sdm: '👥 Kedisiplinan & SDM'
  };
  return map[category] || category || '-';
}
