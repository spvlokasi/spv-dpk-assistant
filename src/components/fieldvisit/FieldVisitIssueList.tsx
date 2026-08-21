import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FieldVisit, OperationalIssue } from '../../types';

interface FieldVisitIssueListProps {
  visit: FieldVisit;
  onToggleIssueResolved: (visit: FieldVisit, issueId: string) => void;
}

export const FieldVisitIssueList: React.FC<FieldVisitIssueListProps> = ({
  visit,
  onToggleIssueResolved
}) => {
  if (visit.issues.length === 0) return null;

  return (
    <div className="space-y-2 pt-2 border-t border-slate-800">
      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
        ⚠️ Temuan Kendala / Deviasi Toko ({visit.issues.length} Temuan):
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {visit.issues.map((issue) => (
          <div
            key={issue.id}
            className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 transition-all ${
              issue.resolved
                ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                : 'bg-amber-950/20 border-amber-800/40 text-slate-200'
            }`}
          >
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                    issue.severity === 'kritis'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800'
                      : issue.severity === 'sedang'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-blue-950 text-blue-400 border border-blue-800'
                  }`}
                >
                  {issue.severity}
                </span>
                <span className="font-semibold text-slate-200">{issue.description}</span>
              </div>

              {issue.immediateSolution && (
                <p className="text-[11px] text-emerald-400">
                  💡 Solusi: {issue.immediateSolution}
                </p>
              )}

              {issue.photoUrl && (
                <div className="pt-1">
                  <img
                    src={issue.photoUrl}
                    alt="Temuan"
                    className="w-16 h-12 object-cover rounded-lg border border-slate-700 hover:scale-105 transition-transform"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => onToggleIssueResolved(visit, issue.id)}
              className={`p-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1 flex-shrink-0 transition-all ${
                issue.resolved
                  ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title={issue.resolved ? 'Tandai belum selesai' : 'Tandai sudah selesai'}
            >
              {issue.resolved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Beres</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Selesaikan</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
