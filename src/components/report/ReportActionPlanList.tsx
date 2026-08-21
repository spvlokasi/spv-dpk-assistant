import React from 'react';
import { ActionPlanMilestone } from '../../types';

interface ReportActionPlanListProps {
  milestones: ActionPlanMilestone[];
}

export const ReportActionPlanList: React.FC<ReportActionPlanListProps> = ({ milestones }) => {
  if (milestones.length === 0) return null;

  return (
    <div className="space-y-1.5 pt-1">
      <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
        🎯 Rencana Program Aksi & Progres Tugas Lapangan:
      </span>
      <div className="space-y-2">
        {milestones.map((ms) => {
          const completed = ms.tasks.filter((t) => t.completed).length;
          const total = ms.tasks.length;
          return (
            <div key={ms.id} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <strong className="text-slate-900">{ms.title}</strong>
                <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Progres: {completed}/{total} Tugas Selesai
                </span>
              </div>
              <div className="text-[11px] text-slate-500 italic">Target: {ms.targetMetric}</div>
              <ul className="divide-y divide-slate-100 text-[11px]">
                {ms.tasks.map((task) => (
                  <li key={task.id} className="py-1 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={task.completed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                        {task.completed ? '☑' : '☐'}
                      </span>
                      <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-800 font-medium'}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 flex-shrink-0">
                      PIC: {task.assignedTo} ({task.frequency})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
