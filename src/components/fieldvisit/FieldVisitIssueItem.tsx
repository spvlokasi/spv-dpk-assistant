import React from 'react';
import { Trash2 } from 'lucide-react';
import { OperationalIssue } from '../../types';

interface FieldVisitIssueItemProps {
  issue: OperationalIssue;
  onRemove: (id: string) => void;
}

export const FieldVisitIssueItem: React.FC<FieldVisitIssueItemProps> = ({ issue, onRemove }) => {
  return (
    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-800">
            {issue.severity}
          </span>
          <span className="font-semibold text-slate-200 truncate">{issue.description}</span>
        </div>
        {issue.immediateSolution && (
          <p className="text-[11px] text-emerald-400 truncate">💡 Solusi: {issue.immediateSolution}</p>
        )}
      </div>
      <button type="button" onClick={() => onRemove(issue.id)} className="text-rose-400 hover:text-rose-300 p-1">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
