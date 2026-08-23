import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { EscalationTicket, Branch } from '../../types';
import { useToast } from '../../context/ToastContext';

interface EscalationModalFormProps {
  branches: Branch[];
  editingTicket: EscalationTicket | null;
  onSave: (ticket: EscalationTicket) => void;
  onClose: () => void;
}

export const EscalationModalForm: React.FC<EscalationModalFormProps> = ({
  branches, editingTicket, onSave, onClose
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Partial<EscalationTicket>>({
    branchId: editingTicket?.branchId || branches[0]?.id || '',
    title: editingTicket?.title || '', urgency: editingTicket?.urgency || 'tinggi',
    description: editingTicket?.description || '', proposedSolution: editingTicket?.proposedSolution || '',
    status: editingTicket?.status || 'diajukan', date: editingTicket?.date || new Date().toISOString().slice(0, 10),
    managerFeedback: editingTicket?.managerFeedback || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.description?.trim()) {
      showToast('Lengkapi judul dan deskripsi kendala', 'warning');
      return;
    }
    const branch = branches.find((b) => b.id === formData.branchId);
    onSave({
      id: editingTicket?.id || `esc-${Date.now()}`, branchId: formData.branchId || branches[0]?.id || '',
      branchName: branch?.name || 'Cabang Basmalah', title: formData.title.trim(),
      category: (editingTicket?.category || 'sdm_rotasi') as any, urgency: formData.urgency as any,
      description: formData.description.trim(), proposedSolution: formData.proposedSolution?.trim() || '',
      status: formData.status as any, date: formData.date || new Date().toISOString().slice(0, 10),
      managerFeedback: formData.managerFeedback?.trim()
    });
    showToast(editingTicket ? 'Tiket berhasil diperbarui!' : 'Tiket berhasil diajukan ke Manajer!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-5 h-5" /></button>
        <div>
          <h3 className="text-base font-bold text-white">{editingTicket ? 'Update Tiket Eskalasi' : 'Ajukan Eskalasi Kendala Berat'}</h3>
          <p className="text-xs text-slate-400">Untuk isu yang memerlukan wewenang Manajer Bisnis / Kantor Pusat.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Cabang Terkait:</label>
              <select value={formData.branchId} onChange={(e) => setFormData({ ...formData, branchId: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold">
                {branches.map((b) => (<option key={b.id} value={b.id}>[{b.code}] {b.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Tingkat Urgensi:</label>
              <select value={formData.urgency} onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold">
                <option value="sedang">Sedang (Perlu Arahan)</option><option value="tinggi">Tinggi (Mendesak)</option><option value="kritis">Kritis (Risiko Kerugian)</option>
              </select>
            </div>
          </div>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Judul pokok kendala..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
          <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Rincian kronologi & fakta lapangan..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
          <textarea rows={2} value={formData.proposedSolution} onChange={(e) => setFormData({ ...formData, proposedSolution: e.target.value })} placeholder="Usulan rekomendasi solusi SPV..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
          {editingTicket && (<textarea rows={2} value={formData.managerFeedback} onChange={(e) => setFormData({ ...formData, managerFeedback: e.target.value })} placeholder="Tanggapan / disposisi manajer..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 focus:outline-none focus:border-emerald-500" />)}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-rose-950"><CheckCircle2 className="w-4 h-4" />Simpan Tiket</button>
          </div>
        </form>
      </div>
    </div>
  );
};
