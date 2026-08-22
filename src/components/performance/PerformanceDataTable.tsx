import React, { useState, useMemo } from 'react';
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { DailyPerformance } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { PerformanceTablePagination } from './PerformanceTablePagination';

interface PerformanceDataTableProps {
  branchPerf: DailyPerformance[];
  targetSalesPerDay: number;
  onDeletePerformance: (id: string) => void;
}

type SortKey = 'date' | 'salesActual' | 'salesTarget' | 'trafficCount' | 'basketSize';

export const PerformanceDataTable: React.FC<PerformanceDataTableProps> = ({
  branchPerf,
  targetSalesPerDay,
  onDeletePerformance
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortAsc, setSortAsc] = useState(false); // default latest date first
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    return [...branchPerf].sort((a, b) => {
      const vA = a[sortKey] || 0;
      const vB = b[sortKey] || 0;
      if (typeof vA === 'string') return sortAsc ? vA.localeCompare(vB as string) : (vB as string).localeCompare(vA);
      return sortAsc ? (vA as number) - (vB as number) : (vB as number) - (vA as number);
    });
  }, [branchPerf, sortKey, sortAsc]);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 text-slate-600 inline ml-1" />;
    return sortAsc ? <ArrowUp className="w-3 h-3 text-emerald-400 inline ml-1" /> : <ArrowDown className="w-3 h-3 text-emerald-400 inline ml-1" />;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-850 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 select-none">
            <tr>
              <th className="p-3 cursor-pointer hover:text-slate-200" onClick={() => handleSort('date')}>Tanggal {renderSortIcon('date')}</th>
              <th className="p-3 text-right cursor-pointer hover:text-slate-200" onClick={() => handleSort('salesActual')}>Laba Aktual {renderSortIcon('salesActual')}</th>
              <th className="p-3 text-right cursor-pointer hover:text-slate-200" onClick={() => handleSort('salesTarget')}>Target Laba {renderSortIcon('salesTarget')}</th>
              <th className="p-3 text-right cursor-pointer hover:text-slate-200" onClick={() => handleSort('trafficCount')}>STD {renderSortIcon('trafficCount')}</th>
              <th className="p-3 text-right cursor-pointer hover:text-slate-200" onClick={() => handleSort('basketSize')}>APC {renderSortIcon('basketSize')}</th>
              <th className="p-3">Catatan</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pagedData.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-slate-500">Belum ada data kinerja tercatat.</td></tr>
            ) : (
              pagedData.map((p) => {
                const isHit = p.salesActual >= (p.salesTarget || targetSalesPerDay);
                return (
                  <tr key={p.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="p-3 font-semibold text-slate-200 whitespace-nowrap">{formatDateIndo(p.date)}</td>
                    <td className={`p-3 text-right font-mono font-bold ${isHit ? 'text-emerald-400' : 'text-rose-400'}`}>{formatRupiah(p.salesActual)}</td>
                    <td className="p-3 text-right font-mono text-slate-400">{formatRupiah(p.salesTarget || targetSalesPerDay)}</td>
                    <td className="p-3 text-right font-mono text-slate-200">{p.trafficCount} Struk</td>
                    <td className="p-3 text-right font-mono text-purple-400 font-bold">{formatRupiah(p.basketSize)}</td>
                    <td className="p-3 text-slate-400 max-w-[200px] truncate">{p.notes || '-'}</td>
                    <td className="p-3 text-center">
                      <button type="button" onClick={() => onDeletePerformance(p.id)} className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/40" title="Hapus Data"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <PerformanceTablePagination currentPage={currentPage} pageSize={pageSize} totalItems={branchPerf.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
};
