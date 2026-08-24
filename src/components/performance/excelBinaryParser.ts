import * as XLSX from 'xlsx';
import { Branch, DailyPerformance } from '../../types';
import { parseAnyDateToIso } from '../../utils/formatters';

function parseExcelDate(val: any): string {
  if (typeof val === 'number') {
    const d = new Date(Math.round((val - 25569) * 86400 * 1000));
    return !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
  }
  return parseAnyDateToIso(String(val || ''));
}

export function parseBinaryXlsx(
  fileContent: string | ArrayBuffer,
  branches: Branch[],
  activeBranch?: Branch
): DailyPerformance[] {
  const entries: DailyPerformance[] = [];
  const wb = XLSX.read(fileContent, { type: typeof fileContent === 'string' ? 'string' : 'array' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws);

  rows.forEach((r, i) => {
    const branchCode = String(r['KD Cabang'] || r['Kode Cabang'] || r['kd_cabang'] || r['branchCode'] || '').trim();
    const targetBranch = branches.find((b) => b.code.toLowerCase() === branchCode.toLowerCase()) || activeBranch || branches[0];
    if (!targetBranch) return;

    const rawDate = r['Tanggal'] || r['tanggal'] || r['Tgl'] || r['Date'] || r['date'];
    const dateStr = parseExcelDate(rawDate);
    const sales = Number(String(r['R/L'] || r['Laba'] || r['Sales'] || r['salesActual'] || 0).replace(/[^0-9.-]+/g, '')) || 0;
    const std = Number(String(r['STD'] || r['Struk'] || r['trafficCount'] || 0).replace(/[^0-9.-]+/g, '')) || 0;
    const apc = Number(String(r['APC'] || r['basketSize'] || 0).replace(/[^0-9.-]+/g, '')) || (std > 0 ? Math.round(sales / std) : 0);
    const notes = String(r['CATATAN'] || r['Catatan'] || r['notes'] || '').trim();

    entries.push({
      id: `dp-imp-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      branchId: targetBranch.id,
      date: dateStr,
      salesActual: Math.round(sales),
      salesTarget: targetBranch.targetSalesPerDay || 1500000,
      marginPct: 0,
      opex: 0,
      trafficCount: std,
      basketSize: Math.round(apc),
      notes: notes === '-' ? '' : notes
    });
  });

  return entries;
}
