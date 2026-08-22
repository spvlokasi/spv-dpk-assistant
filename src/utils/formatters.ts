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

export function formatDateIndo(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
  } catch {
    return String(dateStr);
  }
}

export function formatMonthYearIndo(ymStr: string): string {
  if (!ymStr || ymStr === 'all') return 'Semua Periode';
  try {
    const [year, month] = ymStr.split('-');
    const d = new Date(Number(year), Number(month) - 1, 1);
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(d);
  } catch {
    return ymStr;
  }
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
