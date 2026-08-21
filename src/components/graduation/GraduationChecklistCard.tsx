import React from 'react';
import { CheckCircle2, Circle, Flame } from 'lucide-react';
import { BranchGraduation } from '../../types';

interface GraduationChecklistCardProps {
  currentGraduation: BranchGraduation;
  onToggleChecklist: (id: string) => void;
  onUpdateConsecutiveMonths: (months: number) => void;
}

export const GraduationChecklistCard: React.FC<GraduationChecklistCardProps> = ({
  currentGraduation,
  onToggleChecklist,
  onUpdateConsecutiveMonths
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-white">5 Kriteria Utama Kelulusan DPK</h3>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Laba Tercapai:
          </span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map((month) => (
              <button
                type="button"
                key={month}
                onClick={() => onUpdateConsecutiveMonths(month)}
                className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold transition-all ${
                  currentGraduation.consecutiveMonthsHit >= month && month > 0
                    ? 'bg-emerald-600 text-white'
                    : month === 0
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {month} Bln
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {currentGraduation.checklists.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onToggleChecklist(item.id)}
            className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
              item.isMet
                ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-200 shadow-sm'
                : 'bg-slate-850/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {item.isMet ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <div className={`text-xs font-bold ${item.isMet ? 'text-white' : 'text-slate-300'}`}>
                {item.title}
              </div>
              <p className="text-[11px] text-slate-400">{item.targetDescription}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
