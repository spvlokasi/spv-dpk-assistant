import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare, 
  Trash2, 
  X,
  UserCheck
} from 'lucide-react';
import { Branch, EscalationTicket } from '../../types';
import { formatDateIndo } from '../../utils/formatters';

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

  // Form State
  const [formData, setFormData] = useState<Partial<EscalationTicket>>({
    branchId: branches[0]?.id || '',
    title: '',
    category: 'sdm_rotasi',
    urgency: 'tinggi',
    description: '',
    proposedSolution: '',
    status: 'diajukan',
    date: new Date().toISOString().slice(0, 10),
    managerFeedback: ''
  });

  const handleOpenAdd = () => {
    setEditingTicket(null);
    setFormData({
      branchId: branches[0]?.id || '',
      title: '',
      category: 'sdm_rotasi',
      urgency: 'tinggi',
      description: '',
      proposedSolution: '',
      status: 'diajukan',
      date: new Date().toISOString().slice(0, 10),
      managerFeedback: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (ticket: EscalationTicket) => {
    setEditingTicket(ticket);
    setFormData({ ...ticket });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find(b => b.id === formData.branchId);
    if (!formData.title || !formData.description) {
      alert('Mohon isi judul kendala dan deskripsi!');
      return;
    }

    const ticket: EscalationTicket = {
      id: editingTicket ? editingTicket.id : `esc-${Date.now()}`,
      branchId: formData.branchId || branches[0]?.id || '',
      branchName: branch?.name || 'Cabang',
      date: formData.date || new Date().toISOString().slice(0, 10),
      title: formData.title,
      category: formData.category || 'sdm_rotasi',
      urgency: formData.urgency || 'tinggi',
      description: formData.description,
      proposedSolution: formData.proposedSolution || '',
      status: formData.status || 'diajukan',
      managerFeedback: formData.managerFeedback || ''
    };

    onSaveEscalation(ticket);
    setShowModal(false);
  };

  const getStatusBadge = (status: EscalationTicket['status']) => {
    switch (status) {
      case 'diajukan':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Diajukan ke BM
          </span>
        );
      case 'ditinjau':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Sedang Ditinjau
          </span>
        );
      case 'disetujui':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui Manajer Bisnis
          </span>
        );
      case 'ditolak':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Ditolak / Disesuaikan
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            Eskalasi Kendala Berat ke Manajer Bisnis
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Ajukan permohonan keputusan strategis (rotasi personil, perbaikan fasilitas berat, kebijakan diskon cuci gudang).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-950 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          + Ajukan Tiket Eskalasi Baru
        </button>
      </div>

      {/* Escalation Cards */}
      <div className="space-y-4">
        {escalations.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-300">Tidak Ada Kendala yang Perlu Dieskalasi</h4>
            <p className="text-xs text-slate-500 mt-1">
              Seluruh kendala operasional cabang DPK saat ini dapat ditangani langsung di lapangan.
            </p>
          </div>
        ) : (
          escalations.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center font-bold text-rose-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{ticket.title}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="text-slate-300 font-semibold">{ticket.branchName}</span>
                      <span>•</span>
                      <span className="font-mono">{formatDateIndo(ticket.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(ticket.status)}
                  <button
                    onClick={() => handleOpenEdit(ticket)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                  >
                    Update / Respon BM
                  </button>
                  <button
                    onClick={() => onDeleteEscalation(ticket.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-rose-300">Deskripsi Kendala di Toko:</div>
                  <p className="text-slate-300 leading-relaxed">{ticket.description}</p>
                </div>

                <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-300">Usulan Solusi dari SPV DPK:</div>
                  <p className="text-slate-300 leading-relaxed">{ticket.proposedSolution}</p>
                </div>
              </div>

              {ticket.managerFeedback && (
                <div className="p-3.5 bg-blue-950/30 border border-blue-800/50 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-blue-300 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Keputusan / Instruksi Manajer Bisnis:
                  </div>
                  <p className="text-slate-200 leading-relaxed">{ticket.managerFeedback}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal Add/Edit Escalation */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                {editingTicket ? 'Update Status / Keputusan Manajer Bisnis' : 'Ajukan Tiket Eskalasi Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Pilih Cabang Terkait</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>
                      [{b.code}] {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kategori Eskalasi</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="sdm_rotasi">👥 Usulan Rotasi / Mutasi KTB & Kru</option>
                    <option value="renovasi_aset">🛠️ Perbaikan / Penggantian Aset Berat (Chiller/AC)</option>
                    <option value="diskon_khusus">🏷️ Usulan Program Promo / Diskon Cuci Gudang</option>
                    <option value="revisi_program">🔄 Usulan Penyesuaian Program Bisnis</option>
                    <option value="keamanan_nkl">🚨 Audit Investigasi Kehilangan (NKL)</option>
                    <option value="lainnya">📌 Lain-lain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tingkat Urgensi</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none font-bold"
                  >
                    <option value="kritis">🔴 Kritis (Harus Segera Diputuskan)</option>
                    <option value="tinggi">⚡ Tinggi (Mempengaruhi Target Bulan Ini)</option>
                    <option value="sedang">🌱 Sedang (Permohonan Standar)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Judul Permohonan Eskalasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Permohonan Penggantian Kompresor Chiller Toko..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Deskripsi Masalah / Latar Belakang *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Jelaskan secara detail fakta di lapangan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-emerald-400 mb-1">Rekomendasi / Usulan Solusi SPV DPK</label>
                <textarea
                  rows={2}
                  placeholder="Usulan konkret yang diharapkan dari Manajer Bisnis..."
                  value={formData.proposedSolution}
                  onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Status Update for Business Manager */}
              <div className="p-4 bg-slate-850 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300">Respon / Keputusan Manajer Bisnis:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Status Keputusan</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                    >
                      <option value="diajukan">Diajukan</option>
                      <option value="ditinjau">Sedang Ditinjau</option>
                      <option value="disetujui">Disetujui</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Catatan / Arahan Atasan</label>
                    <input
                      type="text"
                      placeholder="Catatan dari Manajer Bisnis..."
                      value={formData.managerFeedback}
                      onChange={(e) => setFormData({ ...formData, managerFeedback: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950"
                >
                  Simpan Tiket Eskalasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
