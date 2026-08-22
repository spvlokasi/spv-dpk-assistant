import React from 'react';
import { Trash2 } from 'lucide-react';
import { DailyPerformance } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

interface PerformanceDataTableProps {
  branchPerf: DailyPerformance[];
  targetSalesPerDay: number;
  onDeletePerformance: (id: string) => void;
}

export const PerformanceDataTable: React.FC<PerformanceDataTableProps> = ({
  branchPerf,
  targetSalesPerDay,
  onDeletePerformance
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Riwayat Data Kinerja Harian</h3>
        <span className="text-xs text-slate-400 font-mono">{branchPerf.length} Data Tercatat</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-850 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
            <tr>
              <th className="p-3">Tanggal</th>
              <th className="p-3 text-right">Laba Aktual</th>
              <th className="p-3 text-right">Target Laba</th>
              <th className="p-3 text-right">STD</th>
              <th className="p-3 text-right">APC</th>
              <th className="p-3">Catatan</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {branchPerf.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Belum ada data kinerja tercatat untuk periode / cabang yang dipilih.
                </td>
              </tr>
            ) : (
              branchPerf.map((p) => {
                const isHit = p.salesActual >= (p.salesTarget || targetSalesPerDay);
                return (
                  <tr key={p.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="p-3 font-semibold text-slate-200 whitespace-nowrap">{formatDateIndo(p.date)}</td>
                    <td className={`p-3 text-right font-mono font-bold ${isHit ? 'text-emerald-400' : 'text-rose-400'}`}>{formatRupiah(p.salesActual)}</td>
                    <td className="p-3 text-right font-mono text-slate-400">{formatRupiah(p.salesTarget || targetSalesPerDay)}</td>
                    <td className="p-3 text-right font-mono text-slate-200">{p.trafficCount} Struk</td>
                    <td className="p-3 text-right font-mono text-purple-400 font-bold">{formatRupiah(p.basketSize)}</td>
                    <td className="p-3 text-slate-400 max-w-[220px] truncate">{p.notes || '-'}</td>
                    <td className="p-3 text-center">
                      <button type="button" onClick={() => onDeletePerformance(p.id)} className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors" title="Hapus Data">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
