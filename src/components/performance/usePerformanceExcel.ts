import * as XLSX from 'xlsx';
import { Branch, DailyPerformance } from '../../types';

export function downloadPerformanceExcelTemplate(branch?: Branch) {
  const code = branch?.code || 'M3019';
  const name = branch?.name || 'TokoBASMALAH Pademawu';
  const data = [
    { NO: 1, Tanggal: '16/08/2026', 'KD Cabang': code, 'Nama Cabang': name, 'R/L': 1204321, STD: 212, APC: 111124, CATATAN: 'Promo Awal Pekan' },
    { NO: 2, Tanggal: '15/08/2026', 'KD Cabang': code, 'Nama Cabang': name, 'R/L': 1307988, STD: 227, APC: 154852, CATATAN: 'Weekend Display Rapi' },
    { NO: 3, Tanggal: '14/08/2026', 'KD Cabang': code, 'Nama Cabang': name, 'R/L': 986601, STD: 178, APC: 119834, CATATAN: 'Kunjungan Rutin' }
  ];

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'RekapCabangByDate');
  XLSX.writeFile(wb, `Template_Rekap_Kinerja_${code}.xlsx`);
}

function parseDateString(raw: string): string {
  if (!raw) return new Date().toISOString().slice(0, 10);
  if (raw.includes('/')) {
    const parts = raw.split('/');
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2].length === 2 ? '20' + parts[2] : parts[2];
      return `${y}-${m}-${d}`;
    }
  }
  return raw;
}

export function parsePerformanceExcelOrCsv(
  fileContent: string | ArrayBuffer,
  branches: Branch[],
  activeBranch?: Branch
): DailyPerformance[] {
  const entries: DailyPerformance[] = [];
  try {
    const text = typeof fileContent === 'string' ? fileContent : new TextDecoder().decode(fileContent);

    // 1. Support HTML-based .xls export from Toko Basmalah Web POS
    if (text.includes('<table') || text.includes('<tr')) {
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
            date: parseDateString(rawDate),
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
    }

    // 2. Fallback to standard binary .xlsx / .xls using XLSX library
    if (entries.length === 0) {
      const wb = XLSX.read(fileContent, { type: typeof fileContent === 'string' ? 'string' : 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (json && json.length > 1) {
        for (let i = 1; i < json.length; i++) {
          const cells = json[i];
          if (!cells || cells.length < 3) continue;
          const targetBranch = branches.find((b) => String(cells[2] || '').toLowerCase() === b.code.toLowerCase()) || activeBranch || branches[0];
          if (!targetBranch) continue;
          const sales = Number(String(cells[4] || '0').replace(/[^0-9.-]+/g, '')) || 0;
          const std = Number(String(cells[5] || '0').replace(/[^0-9.-]+/g, '')) || 0;
          const apc = Number(String(cells[6] || '0').replace(/[^0-9.-]+/g, '')) || (std > 0 ? Math.round(sales / std) : 0);
          entries.push({
            id: `dp-imp-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
            branchId: targetBranch.id,
            date: parseDateString(String(cells[1] || '')),
            salesActual: sales,
            salesTarget: targetBranch.targetSalesPerDay || 1500000,
            marginPct: 0,
            opex: 0,
            trafficCount: std,
            basketSize: apc,
            notes: String(cells[7] || '') === '-' ? '' : String(cells[7] || '')
          });
        }
      }
    }
  } catch (err) {
    console.error('Parse Excel error:', err);
  }
  return entries;
}
