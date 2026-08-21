import React from 'react';
import { SOP_PHASES } from '../../services/sopTemplates';
import { ActionPlanMilestone, TurnaroundPhase, Branch } from '../../types';

interface ActionPlanPhaseTabsProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  allMilestones: ActionPlanMilestone[];
  selectedPhase: 'all' | TurnaroundPhase;
  onSelectPhase: (phase: 'all' | TurnaroundPhase) => void;
}

export const ActionPlanPhaseTabs: React.FC<ActionPlanPhaseTabsProps> = ({
  branches,
  activeBranchId,
  onSelectBranch,
  allMilestones,
  selectedPhase,
  onSelectPhase
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-1">
      {/* Phase Filter Tabs (Pills) */}
      <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-nowrap sm:flex-wrap">
        <button
          type="button"
          onClick={() => onSelectPhase('all')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedPhase === 'all'
              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-sm'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <span>Semua Fase</span>
          <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] font-mono">
            {allMilestones.length}
          </span>
        </button>

        {SOP_PHASES.map((phase) => {
          const count = allMilestones.filter((m) => m.phase === phase.id).length;
          const isSelected = selectedPhase === phase.id;

          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelectPhase(phase.id)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{phase.title}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-slate-800 text-[10px] font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Branch Selector aligned on the right of the same bar */}
      <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
        <select
          value={activeBranchId}
          onChange={(e) => onSelectBranch(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[240px] truncate shadow-sm"
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
