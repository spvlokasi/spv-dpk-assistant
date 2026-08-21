import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Branch } from '../../types';

interface ActionPlanHeaderProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  onOpenSmartModal: () => void;
  onAddNewMilestone: () => void;
}

export const ActionPlanHeader: React.FC<ActionPlanHeaderProps> = ({
  branches,
  activeBranchId,
  onSelectBranch,
  onOpenSmartModal,
  onAddNewMilestone
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2.5">
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-end">
        <select
          value={activeBranchId}
          onChange={(e) => onSelectBranch(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[200px] truncate"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              [{b.code}] {b.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onOpenSmartModal}
          className="px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all active:scale-95 flex-shrink-0"
          title="Muat Rencana Aksi Cerdas berdasarkan Diagnosa RCA & Target Kinerja"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Aksi Cerdas ✨</span>
        </button>

        <button
          type="button"
          onClick={onAddNewMilestone}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Aksi</span>
        </button>
      </div>
    </div>
  );
};
