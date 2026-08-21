import React, { useState } from 'react';
import { X, Camera, Trash2, CheckCircle2 } from 'lucide-react';
import { Branch, FieldVisit, OperationalIssue } from '../../types';
import { useToast } from '../../context/ToastContext';

interface FieldVisitFormModalProps {
  branches: Branch[];
  editingVisit: FieldVisit | null;
  initialBranchId?: string;
  onSave: (visit: FieldVisit) => void;
  onClose: () => void;
}

export const FieldVisitFormModal: React.FC<FieldVisitFormModalProps> = ({
  branches,
  editingVisit,
  initialBranchId,
  onSave,
  onClose
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FieldVisit>({
    id: editingVisit?.id || `visit-${Date.now()}`,
    branchId: editingVisit?.branchId || initialBranchId || branches[0]?.id || '',
    date: editingVisit?.date || new Date().toISOString().slice(0, 10),
    time: editingVisit?.time || new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    spvName: editingVisit?.spvName || 'Supervisor DPK (Saya)',
    agenda: editingVisit?.agenda || 'Audit Kerapian Display & Pendampingan Target',
    katokCoachingTopic: editingVisit?.katokCoachingTopic || '',
    katokCommitment: editingVisit?.katokCommitment || '',
    crewCoachingTopic: editingVisit?.crewCoachingTopic || '',
    spvAreaCoordinationNote: editingVisit?.spvAreaCoordinationNote || '',
    generalRating: editingVisit?.generalRating || 4,
    summaryConclusion: editingVisit?.summaryConclusion || '',
    issues: editingVisit?.issues || []
  });

  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<OperationalIssue['category']>('display_planogram');
  const [newSeverity, setNewSeverity] = useState<OperationalIssue['severity']>('sedang');
  const [newSolution, setNewSolution] = useState('');
  const [newPhoto, setNewPhoto] = useState<string | undefined>(undefined);

  const handleAddIssue = () => {
    if (!newDesc.trim()) return;
    const issue: OperationalIssue = {
      id: `issue-${Date.now()}`,
      description: newDesc.trim(),
      category: newCategory,
      severity: newSeverity,
      immediateSolution: newSolution.trim(),
      photoUrl: newPhoto,
      resolved: false
    };
    setFormData((prev) => ({ ...prev, issues: [...prev.issues, issue] }));
    setNewDesc('');
    setNewSolution('');
    setNewPhoto(undefined);
    showToast('Temuan kendala ditambahkan ke daftar', 'info');
  };

  const handleRemoveIssue = (id: string) => {
    setFormData((prev) => ({ ...prev, issues: prev.issues.filter((i) => i.id !== id) }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewPhoto(event.target?.result as string);
        showToast('Foto temuan berhasil dimuat', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branchId) {
      showToast('Pilih cabang binaan terlebih dahulu', 'warning');
      return;
    }
    onSave(formData);
    showToast(editingVisit ? 'Log kunjungan berhasil diperbarui!' : 'Log kunjungan lapangan berhasil disimpan!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
        {/* Header Modal (Fixed at Top) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-white">
              {editingVisit ? 'Edit Log Kunjungan' : 'Catat Kunjungan & Coaching Baru'}
            </h3>
            <p className="text-xs text-slate-400">Jurnal pendampingan fisik & komitmen KTB di toko</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 custom-scrollbar">
            {/* Row 1: Branch, Date, Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Cabang Binaan:</label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      [{b.code}] {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Tanggal Kunjungan:</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Jam Kunjungan:</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="10:30"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Agenda */}
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Agenda / Tujuan Kunjungan:</label>
              <input
                type="text"
                value={formData.agenda}
                onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                placeholder="Contoh: Audit Display, Kerapian 5R & Evaluasi Target Sales"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Coaching KTB & Kru */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Topik Coaching KTB:</label>
                <textarea
                  rows={2}
                  value={formData.katokCoachingTopic}
                  onChange={(e) => setFormData({ ...formData, katokCoachingTopic: e.target.value })}
                  placeholder="Materi arahan ke Kepala Toko..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Komitmen Tindakan KTB:</label>
                <textarea
                  rows={2}
                  value={formData.katokCommitment}
                  onChange={(e) => setFormData({ ...formData, katokCommitment: e.target.value })}
                  placeholder="Target kesanggupan KTB..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Arahan Kru / Kasir & Kesimpulan SPV:</label>
              <textarea
                rows={2}
                value={formData.summaryConclusion}
                onChange={(e) => setFormData({ ...formData, summaryConclusion: e.target.value })}
                placeholder="Rangkuman evaluasi kondisi toko hari ini..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Issue Section Form */}
            <div className="bg-slate-850/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                + Tambah Temuan Kendala / Deviasi Toko:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Deskripsi temuan (misal: AC bocor / rak kosong)..."
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                />
                <input
                  type="text"
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="Instruksi solusi langsung..."
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200"
                />
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 text-[11px]"
                  >
                    <option value="display_planogram">Display & Planogram</option>
                    <option value="kebersihan_5r">Kebersihan & 5R</option>
                    <option value="kekosongan_oos">Kekosongan (OOS)</option>
                    <option value="kasir_layanan">Kasir & Layanan</option>
                    <option value="keamanan_nkl">Keamanan & NKL</option>
                    <option value="fasilitas_alat">Fasilitas & Alat</option>
                  </select>

                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-slate-300 text-[11px]"
                  >
                    <option value="ringan">Ringan</option>
                    <option value="sedang">Sedang</option>
                    <option value="kritis">Kritis</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 border border-slate-700">
                    <Camera className="w-3.5 h-3.5 text-slate-400" />
                    <span>{newPhoto ? 'Foto Dipilih' : 'Upload Foto'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={handleAddIssue}
                    className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold"
                  >
                    + Tambah Temuan
                  </button>
                </div>
              </div>

              {/* Added issues badge preview */}
              {formData.issues.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  {formData.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
                    >
                      <span className="truncate text-slate-200">
                        ⚠️ {issue.description} ({issue.severity})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIssue(issue.id)}
                        className="text-rose-400 hover:text-rose-200 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer Bar (Always in view) */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-800 bg-slate-900 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Log Kunjungan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
