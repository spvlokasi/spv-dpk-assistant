import React from 'react';
import { Branch, TurnaroundPhase, ActionPlanMilestone } from '../../types';

interface ActionPlanPhaseTabsProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  allMilestones: ActionPlanMilestone[];
  selectedPhase: TurnaroundPhase | 'all';
  onSelectPhase: (phase: TurnaroundPhase | 'all') => void;
}

export const ActionPlanPhaseTabs: React.FC<ActionPlanPhaseTabsProps> = ({
  branches, activeBranchId, onSelectBranch, allMilestones, selectedPhase, onSelectPhase
}) => {
  const phases: { id: TurnaroundPhase | 'all'; title: string }[] = [
    { id: 'all', title: 'Semua Fase' },
    { id: 'fase_1', title: 'Fase 1: Penyelamatan' },
    { id: 'fase_2', title: 'Fase 2: Pertumbuhan' },
    { id: 'fase_3', title: 'Fase 3: Keberlanjutan & Ekspansi' }
  ];

  const getPhaseCount = (phaseId: TurnaroundPhase | 'all') => {
    if (phaseId === 'all') return allMilestones.length;
    return allMilestones.filter((m) => m.phase === phaseId).length;
  };

  const formatShortBranchName = (b: Branch) => {
    const cleanName = b.name.replace(/^(Toko\s*BASMALAH|Toko\s*Basmalah)\s*/i, '').trim();
    return `[${b.code}] ${cleanName}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-1.5 bg-slate-950/60 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar flex-1">
        {phases.map((phase) => {
          const isSelected = selectedPhase === phase.id;
          const count = getPhaseCount(phase.id);
          return (
            <button
              key={phase.id}
              onClick={() => onSelectPhase(phase.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{phase.title}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] font-mono">{count}</span>
            </button>
          );
        })}
      </div>

      {branches.length > 1 && (
        <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-auto">
          <label htmlFor="branch-phase-select" className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Cabang:
          </label>
          <select
            id="branch-phase-select"
            value={activeBranchId}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[170px] sm:max-w-[210px] truncate shadow-sm"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {formatShortBranchName(b)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
