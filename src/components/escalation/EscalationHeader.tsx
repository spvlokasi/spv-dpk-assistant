import React from 'react';
import { ShieldAlert, Plus } from 'lucide-react';

interface EscalationHeaderProps {
  totalTickets: number;
  pendingCount: number;
  onOpenAddModal: () => void;
}

export const EscalationHeader: React.FC<EscalationHeaderProps> = ({
  totalTickets,
  pendingCount,
  onOpenAddModal
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-6 h-6 text-rose-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Eskalasi Kendala Berat ke Manajer Bisnis
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Total: <strong className="text-slate-200">{totalTickets} Tiket</strong></span>
          <span>•</span>
          <span>Menunggu Persetujuan: <strong className="text-amber-400">{pendingCount} Pengajuan</strong></span>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenAddModal}
        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-950 transition-all active:scale-95 flex-shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>+ Ajukan Eskalasi Baru</span>
      </button>
    </div>
  );
};
