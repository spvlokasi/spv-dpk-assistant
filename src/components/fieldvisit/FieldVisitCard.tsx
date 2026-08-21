import React from 'react';
import { Calendar, Clock, User, Trash2, Edit } from 'lucide-react';
import { Branch, FieldVisit } from '../../types';
import { formatDateIndo } from '../../utils/formatters';
import { FieldVisitIssueList } from './FieldVisitIssueList';

interface FieldVisitCardProps {
  visit: FieldVisit;
  branch?: Branch;
  onEdit: (visit: FieldVisit) => void;
  onDelete: (id: string) => void;
  onToggleIssueResolved: (visit: FieldVisit, issueId: string) => void;
}

export const FieldVisitCard: React.FC<FieldVisitCardProps> = ({
  visit,
  branch,
  onEdit,
  onDelete,
  onToggleIssueResolved
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl hover:border-slate-700/80 transition-all">
      {/* Top Card Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-emerald-400">
              {branch?.code || 'CABANG'}
            </span>
            <h3 className="text-sm font-bold text-white tracking-tight">
              {branch?.name || 'Cabang Tidak Dikenal'}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {formatDateIndo(visit.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {visit.time} WIB
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-500" />
              {visit.spvName}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(visit)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Edit Log Kunjungan"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(visit.id)}
              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition-colors"
              title="Hapus Log"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Agenda & Coaching Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            🎯 Agenda & Coaching KTB:
          </span>
          <div className="font-semibold text-slate-200">{visit.agenda}</div>
          <p className="text-slate-400">{visit.katokCoachingTopic}</p>
          {visit.katokCommitment && (
            <div className="text-emerald-400 font-medium pt-1 border-t border-slate-800/80">
              🤝 Komitmen: "{visit.katokCommitment}"
            </div>
          )}
        </div>

        <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            👥 Kru & Kesimpulan Lapangan:
          </span>
          <p className="text-slate-300">{visit.crewCoachingTopic || 'Tidak ada catatan kru'}</p>
          <div className="text-slate-400 pt-1 border-t border-slate-800/80">
            📝 Kesimpulan: <span className="text-slate-200">{visit.summaryConclusion}</span>
          </div>
        </div>
      </div>

      {/* Issues / Temuan Kendala Section */}
      <FieldVisitIssueList visit={visit} onToggleIssueResolved={onToggleIssueResolved} />
    </div>
  );
};
