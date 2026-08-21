import React from 'react';
import { Calendar, Clock, User, Star, Trash2, Edit, AlertTriangle, CheckCircle2, ShieldCheck, MessageSquare } from 'lucide-react';
import { Branch, FieldVisit, OperationalIssue } from '../../types';
import { formatDateIndo } from '../../utils/formatters';

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
      {/* Top Card Bar: Branch, Date/Time, Rating & Actions */}
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

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Star Rating */}
          <div className="flex items-center gap-1 bg-slate-850 px-2.5 py-1 rounded-xl border border-slate-800">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= visit.generalRating
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

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
      {visit.issues && visit.issues.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Temuan Kendala Lapangan ({visit.issues.length}):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {visit.issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between gap-2 transition-all ${
                  issue.resolved
                    ? 'bg-slate-850/40 border-slate-800 text-slate-400'
                    : 'bg-amber-950/20 border-amber-800/50 text-slate-200'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                      {issue.category.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        issue.severity === 'kritis'
                          ? 'text-rose-400'
                          : issue.severity === 'sedang'
                          ? 'text-amber-400'
                          : 'text-blue-400'
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>
                  <p className={`font-medium ${issue.resolved ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {issue.description}
                  </p>
                  {issue.immediateSolution && (
                    <p className="text-[11px] text-emerald-400">
                      💡 Solusi: {issue.immediateSolution}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => onToggleIssueResolved(visit, issue.id)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                      issue.resolved
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {issue.resolved ? 'Terselesaikan' : 'Tandai Selesai'}
                  </button>
                  {issue.photoUrl && (
                    <a
                      href={issue.photoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-blue-400 hover:underline"
                    >
                      Lihat Foto
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
