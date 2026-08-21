import React, { useState } from 'react';
import { Branch, EscalationTicket } from '../../types';
import { EscalationHeader } from './EscalationHeader';
import { EscalationTicketCard } from './EscalationTicketCard';
import { EscalationModalForm } from './EscalationModalForm';

interface EscalationManagerProps {
  branches: Branch[];
  escalations: EscalationTicket[];
  onSaveEscalation: (ticket: EscalationTicket) => void;
  onDeleteEscalation: (id: string) => void;
}

export const EscalationManager: React.FC<EscalationManagerProps> = ({
  branches,
  escalations,
  onSaveEscalation,
  onDeleteEscalation
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<EscalationTicket | null>(null);

  const pendingCount = escalations.filter((e) => e.status === 'diajukan' || e.status === 'ditinjau').length;

  const handleOpenAdd = () => {
    setEditingTicket(null);
    setShowModal(true);
  };

  const handleOpenEdit = (ticket: EscalationTicket) => {
    setEditingTicket(ticket);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <EscalationHeader
        totalTickets={escalations.length}
        pendingCount={pendingCount}
        onOpenAddModal={handleOpenAdd}
      />

      <div className="space-y-4">
        {escalations.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl mx-auto">
              🛡️
            </div>
            <h4 className="text-sm font-bold text-slate-300">Belum Ada Eskalasi Kendala</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Gunakan menu ini jika ada kendala toko yang di luar wewenang SPV (misal: rotasi SDM, perbaikan fisik besar, sengketa sewa).
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              + Ajukan Eskalasi Pertama
            </button>
          </div>
        ) : (
          escalations.map((ticket) => (
            <EscalationTicketCard
              key={ticket.id}
              ticket={ticket}
              onEdit={handleOpenEdit}
              onDelete={onDeleteEscalation}
            />
          ))
        )}
      </div>

      {showModal && (
        <EscalationModalForm
          branches={branches}
          editingTicket={editingTicket}
          onSave={onSaveEscalation}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
