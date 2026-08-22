import { Branch, DailyPerformance } from '../../types';

export function generatePerformanceCsvTemplate(defaultCode: string): string {
  return (
    'Tanggal (YYYY-MM-DD),Kode Cabang,Laba Harian (Rp),STD (Struk),APC (Rp),Catatan\n' +
    `2026-08-01,${defaultCode},1500000,120,12500,Promo awal bulan\n` +
    `2026-08-02,${defaultCode},1450000,115,12600,Weekend display rapi\n` +
    `2026-08-03,${defaultCode},1600000,130,12300,Kunjungan rutin SPV`
  );
}

export function parsePerformanceCsv(
  text: string,
  branches: Branch[],
  activeBranch?: Branch
): DailyPerformance[] {
  const lines = text.split(/\r\n|\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];

  const entries: DailyPerformance[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.replace(/["']/g, '').trim());
    if (cols.length < 3) continue;

    const [date, branchCodeOrName, labaStr, stdStr, apcStr, ...notesArr] = cols;
    const targetBranch =
      branches.find(
        (b) =>
          b.code.toLowerCase() === branchCodeOrName?.toLowerCase() ||
          b.name.toLowerCase().includes(branchCodeOrName?.toLowerCase())
      ) || activeBranch || branches[0];

    if (!targetBranch) continue;

    const sales = Number(labaStr.replace(/[^0-9.-]+/g, '')) || 0;
    const std = Number(stdStr?.replace(/[^0-9.-]+/g, '')) || 0;
    const apc = Number(apcStr?.replace(/[^0-9.-]+/g, '')) || (std > 0 ? Math.round(sales / std) : 0);
    const notes = notesArr.join(', ') || '';

    entries.push({
      id: `dp-imp-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      branchId: targetBranch.id,
      date: date || new Date().toISOString().slice(0, 10),
      salesActual: sales,
      salesTarget: targetBranch.targetSalesPerDay || 1500000,
      marginPct: 0,
      opex: 0,
      trafficCount: std,
      basketSize: apc,
      notes
    });
  }
  return entries;
}
