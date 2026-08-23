import React from 'react';
import { Printer, Calendar } from 'lucide-react';
import { Branch } from '../../types';
import { formatMonthYearIndo } from '../../utils/formatters';

interface ReportHeaderBarProps {
  reportType: 'all' | 'single';
  onReportTypeChange: (type: 'all' | 'single') => void;
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  availableMonths: string[];
  branches: Branch[];
  onPrint: () => void;
}

export const ReportHeaderBar: React.FC<ReportHeaderBarProps> = ({
  reportType, onReportTypeChange, selectedBranchId, onSelectBranch,
  selectedMonth, onMonthChange, availableMonths, branches, onPrint
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
              <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 text-slate-200">
          <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-1.5"
          >
            {availableMonths.map((ym) => (
              <option key={ym} value={ym} className="bg-slate-800 text-slate-100">{formatMonthYearIndo(ym)}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={onPrint}
        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all active:scale-95 flex-shrink-0 flex items-center justify-center"
        title="Cetak / Ekspor PDF"
      >
        <Printer className="w-5 h-5" />
      </button>
    </div>
  );
};
