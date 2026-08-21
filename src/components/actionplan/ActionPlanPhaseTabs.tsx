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
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
      <button
        type="button"
        onClick={() => onSelectPhase('all')}
        className={`p-3 rounded-2xl border text-left transition-all ${
          selectedPhase === 'all'
            ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="text-[11px] font-bold text-slate-200">Semua Roadmap</div>
        <div className="text-[10px] text-slate-400 mt-0.5">Total {allMilestones.length} Milestone Aksi</div>
      </button>

      {SOP_PHASES.map((phase) => {
        const count = allMilestones.filter((m) => m.phase === phase.id).length;
        const isSelected = selectedPhase === phase.id;

        return (
          <button
            key={phase.id}
            type="button"
            onClick={() => onSelectPhase(phase.id)}
            className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
              isSelected
                ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${phase.badgeColor}`}>
                {phase.title.split(':')[0]}
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">{count} Aksi</span>
            </div>
            <div className="text-xs font-bold text-slate-200 mt-1 truncate">{phase.subtitle}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 truncate">{phase.duration}</div>
          </button>
        );
      })}
    </div>
  );
};
