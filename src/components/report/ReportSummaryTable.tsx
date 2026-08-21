import React from 'react';
import { Branch, DailyPerformance, RootCauseFactor } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface ReportSummaryTableProps {
  branches: Branch[];
  performance: DailyPerformance[];
  calculateHealthScore: (factors?: RootCauseFactor[]) => number;
}

export const ReportSummaryTable: React.FC<ReportSummaryTableProps> = ({
  branches,
  performance,
  calculateHealthScore
}) => {
  return (
    <div>
      <h3 className="text-sm font-black uppercase text-slate-950 mb-2 border-l-4 border-emerald-600 pl-2">
        I. Ringkasan Status Cabang Dalam Pengawasan Khusus (DPK)
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border border-slate-300">
          <thead className="bg-slate-100 font-bold text-slate-800 uppercase text-[10px] border-b border-slate-300">
            <tr>
              <th className="p-2 border-r border-slate-300">Kode</th>
              <th className="p-2 border-r border-slate-300">Nama Cabang</th>
              <th className="p-2 border-r border-slate-300">KTB</th>
              <th className="p-2 border-r border-slate-300">Skor RCA</th>
              <th className="p-2 border-r border-slate-300">Status</th>
              <th className="p-2 border-r border-slate-300 text-right">Target Laba</th>
              <th className="p-2 border-r border-slate-300 text-right">Laba Terakhir</th>
              <th className="p-2 text-center">Pencapaian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {branches.map((b) => {
              const bPerf = performance.filter((p) => p.branchId === b.id);
              const latest = bPerf.length > 0 ? bPerf[bPerf.length - 1] : null;
              const hitPct =
                latest && b.targetSalesPerDay > 0
                  ? Math.round((latest.salesActual / b.targetSalesPerDay) * 100)
                  : 0;
              const healthScore = calculateHealthScore(b.rootCauses);

              return (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="p-2 font-mono font-bold border-r border-slate-300">{b.code}</td>
                  <td className="p-2 font-semibold border-r border-slate-300">{b.name}</td>
                  <td className="p-2 border-r border-slate-300">{b.kepalaToko}</td>
                  <td className="p-2 border-r border-slate-300 font-mono font-bold text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        healthScore >= 3.5
                          ? 'bg-emerald-100 text-emerald-800'
                          : healthScore >= 2.5
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {healthScore > 0 ? `${healthScore} / 5.0` : '-'}
                    </span>
                  </td>
                  <td className="p-2 border-r border-slate-300 font-bold uppercase text-[10px]">
                    {b.status.replace('_', ' ')}
                  </td>
                  <td className="p-2 text-right border-r border-slate-300 font-mono">
                    {formatRupiah(b.targetSalesPerDay)}
                  </td>
                  <td className="p-2 text-right border-r border-slate-300 font-mono">
                    {latest ? formatRupiah(latest.salesActual) : '-'}
                  </td>
                  <td className="p-2 text-center font-bold font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        hitPct >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {hitPct}%
                    </span>
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
