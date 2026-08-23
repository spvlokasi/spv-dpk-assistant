import React from 'react';
import { Branch, DailyPerformance, RootCauseFactor } from '../../types';
import { formatRupiah, formatMonthYearIndo } from '../../utils/formatters';

interface ReportSummaryTableProps {
  branches: Branch[];
  performance: DailyPerformance[];
  selectedMonth: string;
  calculateHealthScore: (factors?: RootCauseFactor[]) => number;
}

export const ReportSummaryTable: React.FC<ReportSummaryTableProps> = ({
  branches, performance, selectedMonth, calculateHealthScore
}) => {
  const today = new Date();
  const currentYm = today.toISOString().slice(0, 7);
  const [yStr, mStr] = selectedMonth.split('-');
  const daysInMonth = new Date(Number(yStr), Number(mStr), 0).getDate();
  const effectiveDays = selectedMonth === currentYm ? Math.max(1, today.getDate()) : daysInMonth;

  return (
    <div>
      <h3 className="text-sm font-black uppercase text-slate-950 mb-2 border-l-4 border-emerald-600 pl-2">
        I. Ringkasan Status Cabang DPK — {formatMonthYearIndo(selectedMonth)}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border border-slate-300">
          <thead className="bg-slate-100 font-bold text-slate-800 uppercase text-[10px] border-b border-slate-300">
            <tr>
              <th className="p-2 border-r border-slate-300">Kode</th><th className="p-2 border-r border-slate-300">Nama Cabang</th>
              <th className="p-2 border-r border-slate-300">KTB</th><th className="p-2 border-r border-slate-300 text-center">Nilai</th>
              <th className="p-2 border-r border-slate-300">Status</th><th className="p-2 border-r border-slate-300 text-right">Target ({effectiveDays} Hari)</th>
              <th className="p-2 border-r border-slate-300 text-right">Laba Aktual</th><th className="p-2 text-center">Pencapaian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {branches.map((b) => {
              const bPerf = performance.filter((p) => p.branchId === b.id && p.date && p.date.startsWith(selectedMonth));
              const targetLabaKumulatif = (b.targetSalesPerDay || 1500000) * effectiveDays;
              const totalActual = bPerf.reduce((sum, p) => sum + (p.salesActual || 0), 0);
              const actualProfit = bPerf.length > 0 ? totalActual : 0;
              const gapPct = Math.round(targetLabaKumulatif > 0 ? ((actualProfit / targetLabaKumulatif) * 100) - 100 : 0);
              const healthScore = calculateHealthScore(b.rootCauses);

              return (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-2 font-mono font-bold border-r border-slate-300">{b.code}</td>
                  <td className="p-2 font-semibold border-r border-slate-300">{b.name}</td>
                  <td className="p-2 border-r border-slate-300">{b.kepalaToko}</td>
                  <td className="p-2 border-r border-slate-300 font-mono font-bold text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${healthScore >= 3.5 ? 'bg-emerald-100 text-emerald-800' : healthScore >= 2.5 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{healthScore > 0 ? `${healthScore} / 5.0` : '-'}</span>
                  </td>
                  <td className="p-2 border-r border-slate-300 font-bold uppercase text-[10px]">{b.status.replace('_', ' ')}</td>
                  <td className="p-2 text-right border-r border-slate-300 font-mono font-bold text-slate-800">{formatRupiah(targetLabaKumulatif)}</td>
                  <td className={`p-2 text-right border-r border-slate-300 font-mono font-bold ${actualProfit < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>{actualProfit !== 0 ? formatRupiah(actualProfit) : '-'}</td>
                  <td className="p-2 text-center font-bold font-mono">
                    <span className={`px-2 py-0.5 rounded text-xs ${gapPct < 0 ? 'bg-rose-100 text-rose-800 font-black' : 'bg-emerald-100 text-emerald-800 font-black'}`}>{gapPct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
