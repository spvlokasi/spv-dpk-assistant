import React from 'react';
import { Clock, CheckCircle2, XCircle, Trash2, Edit, MessageSquare } from 'lucide-react';
import { EscalationTicket } from '../../types';
import { formatDateIndo } from '../../utils/formatters';

interface EscalationTicketCardProps {
  ticket: EscalationTicket;
  onEdit: (ticket: EscalationTicket) => void;
  onDelete: (id: string) => void;
}

export const EscalationTicketCard: React.FC<EscalationTicketCardProps> = ({
  ticket,
  onEdit,
  onDelete
}) => {
  const getStatusBadge = (status: EscalationTicket['status']) => {
    switch (status) {
      case 'disetujui':
        return (
          <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Disetujui Manajer
          </span>
        );
      case 'ditolak':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-800 text-rose-400 text-[10px] font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Ditolak
          </span>
        );
      case 'ditinjau':
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800 text-blue-400 text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Sedang Ditinjau
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800 text-amber-400 text-[10px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Menunggu Persetujuan
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl hover:border-slate-700/80 transition-all">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-slate-300">
              {ticket.branchName}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                ticket.urgency === 'kritis'
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                  : ticket.urgency === 'tinggi'
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                  : 'bg-blue-950/80 text-blue-400 border border-blue-800'
              }`}
            >
              Urgensi: {ticket.urgency}
            </span>
            {getStatusBadge(ticket.status)}
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">{ticket.title}</h3>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-400">
          <span>{formatDateIndo(ticket.date)}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(ticket)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(ticket.id)}
              className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 border border-rose-800/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Description & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            📝 Deskripsi Kendala:
          </span>
          <p className="text-slate-300 leading-relaxed">{ticket.description}</p>
        </div>

        <div className="bg-slate-850/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
            💡 Usulan Solusi SPV:
          </span>
          <p className="text-slate-300 leading-relaxed">{ticket.proposedSolution}</p>
        </div>
      </div>

      {/* Feedback / Tanggapan Manajer Bisnis */}
      {ticket.managerFeedback && (
        <div className="bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl text-xs space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            Disposisi / Tanggapan Manajer Bisnis:
          </span>
          <p className="text-slate-200 font-medium italic">"{ticket.managerFeedback}"</p>
        </div>
      )}
    </div>
  );
};
