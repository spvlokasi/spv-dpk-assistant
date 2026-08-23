import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Branch, FieldVisit } from '../../types';
import { useToast } from '../../context/ToastContext';
import { FieldVisitGeneralSection } from './FieldVisitGeneralSection';
import { FieldVisitIssueInputSection } from './FieldVisitIssueInputSection';

interface FieldVisitFormModalProps {
  branches: Branch[];
  editingVisit: FieldVisit | null;
  initialBranchId?: string;
  onSave: (visit: FieldVisit) => void;
  onClose: () => void;
}

export const FieldVisitFormModal: React.FC<FieldVisitFormModalProps> = ({
  branches, editingVisit, initialBranchId, onSave, onClose
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FieldVisit>({
    id: editingVisit?.id || `visit-${Date.now()}`,
    branchId: editingVisit?.branchId || initialBranchId || branches[0]?.id || '',
    date: editingVisit?.date || new Date().toISOString().slice(0, 10),
    time: editingVisit?.time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    spvName: editingVisit?.spvName || 'Supervisor DPK', agenda: editingVisit?.agenda || 'Audit Kerapian Display & Pendampingan Target',
    katokCoachingTopic: editingVisit?.katokCoachingTopic || '', katokCommitment: editingVisit?.katokCommitment || '',
    crewCoachingTopic: editingVisit?.crewCoachingTopic || '', spvAreaCoordinationNote: editingVisit?.spvAreaCoordinationNote || '',
    generalRating: 4, summaryConclusion: editingVisit?.summaryConclusion || '', issues: editingVisit?.issues || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branchId || !formData.agenda) {
      showToast('Pilih cabang dan isi agenda kunjungan!', 'warning'); return;
    }
    onSave(formData);
    showToast(editingVisit ? 'Log kunjungan diperbarui!' : 'Log kunjungan disimpan!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl my-6 relative">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-5 h-5" /></button>
        <div>
          <h3 className="text-base font-bold text-white">{editingVisit ? 'Edit Log Kunjungan Toko' : 'Catat Kunjungan & Coaching Lapangan'}</h3>
          <p className="text-xs text-slate-400">Pencatatan agenda, materi pembinaan KTB, dan temuan deviasi toko</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldVisitGeneralSection branches={branches} formData={formData} onFormChange={(u) => setFormData((p) => ({ ...p, ...u }))} />
          <FieldVisitIssueInputSection issues={formData.issues} onAddIssue={(issue) => setFormData((p) => ({ ...p, issues: [...p.issues, issue] }))} onRemoveIssue={(id) => setFormData((p) => ({ ...p, issues: p.issues.filter((i) => i.id !== id) }))} />
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 active:scale-95"><CheckCircle2 className="w-4 h-4" /><span>Simpan Log Kunjungan</span></button>
          </div>
        </form>
      </div>
    </div>
  );
};
