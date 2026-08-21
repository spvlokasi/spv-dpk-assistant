import React from 'react';
import { Printer } from 'lucide-react';
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
    <div className="bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 no-print shadow-lg">
      <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
        <select
          value={reportType}
          onChange={(e) => onReportTypeChange(e.target.value as any)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none cursor-pointer"
        >
          <option value="all">Rekap Seluruh Cabang DPK</option>
          <option value="single">Laporan Khusus 1 Cabang</option>
        </select>

        {reportType === 'single' && (
          <select
            value={selectedBranchId}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none cursor-pointer"
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
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none min-w-[200px]"
        />
      </div>

      <button
        type="button"
        onClick={onPrint}
        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-950 transition-all active:scale-95 flex-shrink-0"
      >
        <Printer className="w-4 h-4" />
        <span>Cetak / Ekspor PDF</span>
      </button>
    </div>
  );
};
