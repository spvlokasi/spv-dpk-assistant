import React from 'react';
import { Plus, Download, Upload, Calendar } from 'lucide-react';
import { Branch } from '../../types';

interface PerformanceFilterBarProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  selectedMonth: string; // 'all' or 'YYYY-MM'
  onSelectMonth: (month: string) => void;
  availableMonths: { value: string; label: string }[];
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
}

export const PerformanceFilterBar: React.FC<PerformanceFilterBarProps> = ({
  branches,
  activeBranchId,
  onSelectBranch,
  selectedMonth,
  onSelectMonth,
  availableMonths,
  onOpenAddModal,
  onOpenImportModal
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-xl">
      {/* Filters: Branch and Month Selector */}
      <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
        <select
          value={activeBranchId}
          onChange={(e) => onSelectBranch(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[200px] truncate"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              [{b.code}] {b.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1">
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={selectedMonth}
            onChange={(e) => onSelectMonth(e.target.value)}
            className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none cursor-pointer py-1.5 pr-2"
          >
            <option value="all" className="bg-slate-800">Semua Periode</option>
            {availableMonths.map((m) => (
              <option key={m.value} value={m.value} className="bg-slate-800">
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions: Import Template, Upload CSV, Add Manual */}
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
        <button
          type="button"
          onClick={onOpenImportModal}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 active:scale-95 shadow-sm"
          title="Unduh template atau upload data Excel/CSV masal"
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span>Excel / CSV</span>
        </button>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Input Kinerja</span>
        </button>
      </div>
    </div>
  );
};
