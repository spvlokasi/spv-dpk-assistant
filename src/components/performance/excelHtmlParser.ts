import { Branch, DailyPerformance } from '../../types';
import { parseAnyDateToIso } from '../../utils/formatters';

export function parseHtmlTableXls(
  text: string,
  branches: Branch[],
  activeBranch?: Branch
): DailyPerformance[] {
  const entries: DailyPerformance[] = [];
  const rows = text.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  let headerIdx = -1;
  let colMap: Record<string, number> = {};

  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    const cells = (rows[i].match(/<t[dh][\s\S]*?<\/t[dh]>/gi) || []).map((td) => td.replace(/<[^>]+>/g, '').trim().toUpperCase());
    if (cells.some((c) => c.includes('TANGGAL') || c.includes('R/L') || c.includes('LABA') || c.includes('CABANG'))) {
      headerIdx = i;
      cells.forEach((c, idx) => {
        if (c.includes('TANGGAL')) colMap.date = idx;
        if (c.includes('KD') || c.includes('KODE')) colMap.code = idx;
        if (c.includes('NAMA')) colMap.name = idx;
        if (c.includes('R/L') || c.includes('LABA') || c.includes('SALES')) colMap.rl = idx;
        if (c.includes('STD') || c.includes('STRUK')) colMap.std = idx;
        if (c.includes('APC') || c.includes('BASKET')) colMap.apc = idx;
        if (c.includes('CATATAN') || c.includes('NOTE')) colMap.notes = idx;
      });
      break;
    }
  }

  if (headerIdx !== -1) {
    for (let i = headerIdx + 1; i < rows.length; i++) {
      const cells = (rows[i].match(/<t[dh][\s\S]*?<\/t[dh]>/gi) || []).map((td) => td.replace(/<[^>]+>/g, '').trim());
      if (cells.length < 3) continue;

      const rawDate = colMap.date !== undefined ? cells[colMap.date] : cells[1];
      const rawCode = colMap.code !== undefined ? cells[colMap.code] : cells[2];
      const rawName = colMap.name !== undefined ? cells[colMap.name] : cells[3];
      const rawRL = colMap.rl !== undefined ? cells[colMap.rl] : cells[4];
      const rawSTD = colMap.std !== undefined ? cells[colMap.std] : cells[5];
      const rawAPC = colMap.apc !== undefined ? cells[colMap.apc] : cells[6];
      const rawNote = colMap.notes !== undefined ? cells[colMap.notes] : (cells[7] || '');

      const targetBranch = branches.find((b) => (rawCode && b.code.toLowerCase() === rawCode.toLowerCase()) || (rawName && b.name.toLowerCase().includes(rawName.toLowerCase()))) || activeBranch || branches[0];
      if (!targetBranch) continue;

      const sales = Number(String(rawRL || '0').replace(/[^0-9.-]+/g, '')) || 0;
      const std = Number(String(rawSTD || '0').replace(/[^0-9.-]+/g, '')) || 0;
      const apc = Number(String(rawAPC || '0').replace(/[^0-9.-]+/g, '')) || (std > 0 ? Math.round(sales / std) : 0);

      entries.push({
        id: `dp-imp-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        branchId: targetBranch.id,
        date: parseAnyDateToIso(rawDate),
        salesActual: sales,
        salesTarget: targetBranch.targetSalesPerDay || 1500000,
        marginPct: 0,
        opex: 0,
        trafficCount: std,
        basketSize: apc,
        notes: rawNote === '-' ? '' : rawNote
      });
    }
  }
  return entries;
}
