import React from 'react';
import { SOP_PHASES } from '../../services/sopTemplates';
import { ActionPlanMilestone, TurnaroundPhase } from '../../types';

interface ActionPlanPhaseTabsProps {
  allMilestones: ActionPlanMilestone[];
  selectedPhase: 'all' | TurnaroundPhase;
  onSelectPhase: (phase: 'all' | TurnaroundPhase) => void;
}

export const ActionPlanPhaseTabs: React.FC<ActionPlanPhaseTabsProps> = ({
  allMilestones,
  selectedPhase,
  onSelectPhase
}) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs">
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
  );
};
