import React from 'react';
import { RootCauseFactor } from '../../types';

interface ReportRcaAuditTableProps {
  rootCauses?: RootCauseFactor[];
}

export const ReportRcaAuditTable: React.FC<ReportRcaAuditTableProps> = ({ rootCauses }) => {
  if (!rootCauses || rootCauses.length === 0) {
    return (
      <p className="text-xs text-slate-500 italic bg-white p-2 border border-slate-200 rounded">
        Belum ada faktor diagnosa detail yang diaudit untuk cabang ini.
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
        📋 Hasil Audit Rincian Faktor Diagnosa RCA:
      </span>

      <table className="w-full text-xs text-left border border-slate-300 bg-white">
        <thead className="bg-slate-100 font-bold text-slate-700 text-[10px] border-b border-slate-300 uppercase">
          <tr>
            <th className="p-1.5 border-r border-slate-300 w-1/4">Kelompok Faktor</th>
            <th className="p-1.5 border-r border-slate-300">Faktor Evaluasi</th>
            <th className="p-1.5 border-r border-slate-300 text-center w-24">Skor (1-5)</th>
            <th className="p-1.5 text-center w-28">Kondisi / Keterangan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rootCauses.map((factor, idx) => {
            const isCritical = factor.score <= 2;
            const isModerate = factor.score === 3;
            return (
              <tr key={factor.id || idx} className={isCritical ? 'bg-rose-50/40' : ''}>
                <td className="p-1.5 border-r border-slate-300 font-semibold text-slate-600 capitalize">
                  {factor.category === 'internal' ? 'Internal Operasional' : 'Eksternal / Pasar'}
                </td>
                <td className="p-1.5 border-r border-slate-300 text-slate-800 font-medium">
                  {factor.title}
                </td>
                <td className="p-1.5 border-r border-slate-300 text-center font-mono font-bold">
                  {factor.score} / 5
                </td>
                <td className="p-1.5 text-center">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : isModerate
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    {isCritical ? '⚠️ KRITIS / BOCOR' : isModerate ? '⚡ SEDANG' : '✅ BAIK / STABIL'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
