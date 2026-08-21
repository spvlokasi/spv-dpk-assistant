import React from 'react';
import { Target } from 'lucide-react';
import { Branch } from '../../types';

interface ActionPlanHeaderProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
}

export const ActionPlanHeader: React.FC<ActionPlanHeaderProps> = ({
  branches,
  activeBranchId,
  onSelectBranch
}) => {
  return (
    <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800 flex-wrap sm:flex-nowrap">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
          Program Aksi Perbaikan (180 Hari)
        </h2>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-slate-400 hidden sm:inline font-medium">Pilih Cabang:</span>
        <select
          value={activeBranchId}
          onChange={(e) => onSelectBranch(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[220px] truncate shadow-sm"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              [{b.code}] {b.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
