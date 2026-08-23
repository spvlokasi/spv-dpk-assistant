import * as XLSX from 'xlsx';
import { Branch } from '../../types';

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
