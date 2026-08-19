export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatShortRupiah(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)} M`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)} Rb`;
  }
  return `Rp ${amount}`;
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
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
  return map[category] || category;
}
