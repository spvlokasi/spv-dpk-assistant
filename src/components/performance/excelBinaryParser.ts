import * as XLSX from 'xlsx';
import { Branch, DailyPerformance } from '../../types';
import { parseAnyDateToIso } from '../../utils/formatters';

export function parseBinaryXlsx(
  fileContent: string | ArrayBuffer,
  branches: Branch[],
  activeBranch?: Branch
): DailyPerformance[] {
  const entries: DailyPerformance[] = [];
  const wb = XLSX.read(fileContent, { type: typeof fileContent === 'string' ? 'string' : 'array', cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

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
        date: parseAnyDateToIso(cells[1]),
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
  return entries;
}
