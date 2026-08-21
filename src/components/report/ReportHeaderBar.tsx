import React from 'react';
import { FileText, Printer } from 'lucide-react';
import { Branch } from '../../types';

interface ReportHeaderBarProps {
  reportType: 'all' | 'single';
  onReportTypeChange: (type: 'all' | 'single') => void;
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
  reportPeriod: string;
  onPeriodChange: (period: string) => void;
  branches: Branch[];
  onPrint: () => void;
}

export const ReportHeaderBar: React.FC<ReportHeaderBarProps> = ({
  reportType,
  onReportTypeChange,
  selectedBranchId,
  onSelectBranch,
  reportPeriod,
  onPeriodChange,
  branches,
  onPrint
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 no-print shadow-xl">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-emerald-400" />
          Laporan Eksekutif Manajer Bisnis
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Rekapitulasi lengkap diagnosa RCA detail, rencana aksi turnaround, dan evaluasi progres siap cetak / PDF.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <select
          value={reportType}
          onChange={(e) => onReportTypeChange(e.target.value as any)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
        >
          <option value="all">Rekap Seluruh Cabang DPK</option>
          <option value="single">Laporan Khusus 1 Cabang</option>
        </select>

        {reportType === 'single' && (
          <select
            value={selectedBranchId}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b.code})
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          value={reportPeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
          placeholder="Periode Laporan..."
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
        />

        <button
          type="button"
          onClick={onPrint}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
        >
          <Printer className="w-4 h-4" />
          Cetak / Ekspor PDF
        </button>
      </div>
    </div>
  );
};
