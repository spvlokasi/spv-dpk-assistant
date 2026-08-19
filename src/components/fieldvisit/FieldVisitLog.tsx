import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Camera, 
  Calendar, 
  Clock, 
  User, 
  Star, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Trash2, 
  X, 
  Image as ImageIcon,
  MessageSquare,
  Search
} from 'lucide-react';
import { Branch, FieldVisit, OperationalIssue } from '../../types';
import { formatDateIndo } from '../../utils/formatters';

interface FieldVisitLogProps {
  branches: Branch[];
  visits: FieldVisit[];
  selectedBranchId?: string;
  onSaveVisit: (visit: FieldVisit) => void;
  onDeleteVisit: (id: string) => void;
  isOpenNewModal?: boolean;
  onCloseNewModal?: () => void;
}

export const FieldVisitLog: React.FC<FieldVisitLogProps> = ({
  branches,
  visits,
  selectedBranchId,
  onSaveVisit,
  onDeleteVisit,
  isOpenNewModal = false,
  onCloseNewModal
}) => {
  const [filterBranchId, setFilterBranchId] = useState<string>(selectedBranchId || 'all');
  const [showModal, setShowModal] = useState(isOpenNewModal);
  const [editingVisit, setEditingVisit] = useState<FieldVisit | null>(null);

  // Form State for new/edit visit
  const [formData, setFormData] = useState<Partial<FieldVisit>>({
    branchId: branches[0]?.id || '',
    date: new Date().toISOString().slice(0, 10),
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    spvName: 'Supervisor DPK (Saya)',
    agenda: 'Audit Display, Refresh SOP Kasir & Pendampingan Target',
    katokCoachingTopic: 'Strategi pembagian shift dan evaluasi pencapaian sales harian',
    katokCommitment: 'Memantau struk transaksi kasir tiap jam 14:00 dan jam 21:00',
    crewCoachingTopic: 'Pelayanan senyum salam sapa dan penawaran promo tebus murah',
    spvAreaCoordinationNote: 'Koordinasi terkait pemenuhan pasokan barang dari DC',
    generalRating: 4,
    summaryConclusion: 'Kondisi toko menunjukkan perbaikan, antusiasme kru meningkat.',
    issues: []
  });

  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [newIssueCategory, setNewIssueCategory] = useState<OperationalIssue['category']>('display_planogram');
  const [newIssueSeverity, setNewIssueSeverity] = useState<OperationalIssue['severity']>('sedang');
  const [newIssueSolution, setNewIssueSolution] = useState('');
  const [newIssuePhoto, setNewIssuePhoto] = useState<string | undefined>(undefined);

  const handleOpenAdd = () => {
    setEditingVisit(null);
    setFormData({
      branchId: filterBranchId !== 'all' ? filterBranchId : (branches[0]?.id || ''),
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      spvName: 'Supervisor DPK (Saya)',
      agenda: 'Audit Kerapian Display & Coaching Penjualan',
      katokCoachingTopic: '',
      katokCommitment: '',
      crewCoachingTopic: '',
      spvAreaCoordinationNote: '',
      generalRating: 3,
      summaryConclusion: '',
      issues: []
    });
    setShowModal(true);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewIssuePhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddIssue = () => {
    if (!newIssueDesc) {
      alert('Tuliskan deskripsi temuan kendala');
      return;
    }
    const issue: OperationalIssue = {
      id: `iss-${Date.now()}`,
      description: newIssueDesc,
      category: newIssueCategory,
      severity: newIssueSeverity,
      immediateSolution: newIssueSolution || 'Diinstruksikan segera diselesaikan saat kunjungan',
      photoUrl: newIssuePhoto,
      resolved: false
    };
    setFormData({
      ...formData,
      issues: [...(formData.issues || []), issue]
    });
    // Reset issue form
    setNewIssueDesc('');
    setNewIssueSolution('');
    setNewIssuePhoto(undefined);
  };

  const handleToggleIssueResolved = (issueId: string) => {
    setFormData({
      ...formData,
      issues: formData.issues?.map(i => i.id === issueId ? { ...i, resolved: !i.resolved } : i)
    });
  };

  const handleDeleteIssue = (issueId: string) => {
    setFormData({
      ...formData,
      issues: formData.issues?.filter(i => i.id !== issueId)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branchId) {
      alert('Pilih cabang yang dikunjungi');
      return;
    }

    const visitToSave: FieldVisit = {
      id: editingVisit ? editingVisit.id : `fv-${Date.now()}`,
      branchId: formData.branchId,
      date: formData.date || new Date().toISOString().slice(0, 10),
      time: formData.time || '10:00',
      spvName: formData.spvName || 'Supervisor DPK',
      agenda: formData.agenda || 'Kunjungan Supervisi',
      katokCoachingTopic: formData.katokCoachingTopic || '-',
      katokCommitment: formData.katokCommitment || '-',
      crewCoachingTopic: formData.crewCoachingTopic || '-',
      spvAreaCoordinationNote: formData.spvAreaCoordinationNote || '-',
      generalRating: formData.generalRating || 3,
      summaryConclusion: formData.summaryConclusion || '-',
      issues: formData.issues || []
    };

    onSaveVisit(visitToSave);
    setShowModal(false);
    if (onCloseNewModal) onCloseNewModal();
  };

  const filteredVisits = visits.filter(v => {
    return filterBranchId === 'all' || v.branchId === filterBranchId;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-amber-400" />
            Log Kunjungan & Pembinaan Lapangan
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Catat hasil coaching Kepala Toko, evaluasi kru, temuan kendala fisik, dan sinkronisasi SPV Area.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-950 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          + Input Log Kunjungan Toko
        </button>
      </div>

      {/* Filter by Branch */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-400 flex-shrink-0">Filter Cabang:</span>
          <select
            value={filterBranchId}
            onChange={(e) => setFilterBranchId(e.target.value)}
            className="w-full sm:w-64 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Cabang Binaan</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                [{b.code}] {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Menampilkan <strong className="text-white">{filteredVisits.length}</strong> catatan kunjungan
        </div>
      </div>

      {/* Visit Logs Cards */}
      <div className="space-y-4">
        {filteredVisits.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <ClipboardCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-300">Belum Ada Log Kunjungan</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Tekan tombol di bawah untuk mencatat hasil kunjungan dan pembinaan pertama Anda.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl"
            >
              + Buat Log Kunjungan
            </button>
          </div>
        ) : (
          filteredVisits.map((visit) => {
            const branch = branches.find(b => b.id === visit.branchId);
            return (
              <div
                key={visit.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 hover:border-slate-700 transition-all"
              >
                {/* Header Visit */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-400">
                      {branch?.code || 'TOKO'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{branch?.name || 'Cabang DPK'}</h3>
                      <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 font-mono text-emerald-400">
                          <Calendar className="w-3.5 h-3.5" /> {formatDateIndo(visit.date)}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" /> {visit.time} WIB
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Stars Rating */}
                    <div className="flex items-center gap-1 bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-800">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= visit.generalRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => onDeleteVisit(visit.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                      title="Hapus Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Agenda */}
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[11px] font-semibold text-amber-400 mb-0.5 uppercase tracking-wider">
                    Agenda Kunjungan:
                  </div>
                  <div className="text-xs font-semibold text-slate-200">{visit.agenda}</div>
                </div>

                {/* Coaching Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="bg-slate-850/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      Pembinaan Kepala Toko ({branch?.kepalaToko})
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{visit.katokCoachingTopic}</p>
                    <div className="text-[11px] text-emerald-400/90 font-medium pt-1 border-t border-slate-800">
                      <strong>Komitmen KaTok:</strong> {visit.katokCommitment}
                    </div>
                  </div>

                  <div className="bg-slate-850/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                      Pembinaan Kru & Kasir Toko
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{visit.crewCoachingTopic}</p>
                    <div className="text-[11px] text-blue-400/90 font-medium pt-1 border-t border-slate-800">
                      <strong>Koordinasi SPV Area:</strong> {visit.spvAreaCoordinationNote}
                    </div>
                  </div>
                </div>

                {/* Issues Found */}
                {visit.issues.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Temuan Kendala Fisik Lapangan ({visit.issues.length}):
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {visit.issues.map((iss) => (
                        <div
                          key={iss.id}
                          className={`p-3 rounded-xl border flex flex-col justify-between gap-2 ${
                            iss.resolved ? 'bg-slate-850/50 border-slate-800 opacity-75' : 'bg-rose-950/20 border-rose-800/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span className="text-xs font-bold text-slate-200">{iss.description}</span>
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-rose-400 border border-rose-800/40">
                                {iss.severity}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              <strong className="text-slate-300">Solusi Langsung:</strong> {iss.immediateSolution}
                            </p>
                          </div>

                          {iss.photoUrl && (
                            <div className="mt-1">
                              <img
                                src={iss.photoUrl}
                                alt="Foto Temuan"
                                className="w-full h-32 object-cover rounded-lg border border-slate-700"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                            <span className={iss.resolved ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                              {iss.resolved ? '✓ Terselesaikan' : '⏳ Dalam Penanganan'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conclusion */}
                <div className="text-xs text-slate-400 italic pt-1">
                  <strong>Kesimpulan SPV:</strong> "{visit.summaryConclusion}"
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add/Edit Field Visit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-amber-400" />
                Catat Log Kunjungan & Coaching Lapangan
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (onCloseNewModal) onCloseNewModal();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pilih Cabang DPK *</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-semibold"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>
                        [{b.code}] {b.name} (KaTok: {b.kepalaToko})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tanggal Kunjungan</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Waktu (Jam)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 10:30"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Rating Kondisi Toko</label>
                  <select
                    value={formData.generalRating}
                    onChange={(e) => setFormData({ ...formData, generalRating: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-amber-400 font-bold text-xs rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value={1}>⭐ (1 Bintang - Sangat Buruk)</option>
                    <option value={2}>⭐⭐ (2 Bintang - Buruk)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang - Cukup)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang - Baik)</option>
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang - Sangat Baik)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Agenda Utama Kunjungan</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Audit Display, Refresh SOP Kasir & Pendampingan Target"
                    value={formData.agenda}
                    onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Topik Coaching Kepala Toko (Leadership, Stock Control, Sales)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Poin-poin evaluasi dan bimbingan kepada Kepala Toko..."
                    value={formData.katokCoachingTopic}
                    onChange={(e) => setFormData({ ...formData, katokCoachingTopic: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-emerald-400 mb-1">
                    Komitmen Tindak Lanjut Kepala Toko
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: KaTok berkomitmen mengecek struk kasir tiap 2 jam..."
                    value={formData.katokCommitment}
                    onChange={(e) => setFormData({ ...formData, katokCommitment: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-emerald-300 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Coaching Kru & Kasir Toko (Pelayanan, Kebersihan, Up-selling)
                  </label>
                  <input
                    type="text"
                    placeholder="Arahan langsung kepada kasir & pramuniaga..."
                    value={formData.crewCoachingTopic}
                    onChange={(e) => setFormData({ ...formData, crewCoachingTopic: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Catatan Koordinasi dengan SPV Area
                  </label>
                  <input
                    type="text"
                    placeholder="Catatan keselarasan instruksi dengan SPV Area setempat..."
                    value={formData.spvAreaCoordinationNote}
                    onChange={(e) => setFormData({ ...formData, spvAreaCoordinationNote: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sub-Section: Temuan Kendala Fisik & Upload Foto */}
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Camera className="w-4 h-4" /> Input Temuan Kendala Fisik (Opsional)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Deskripsi temuan (contoh: Lampu rak lorong 2 mati, stok minyak menumpuk di gudang)..."
                      value={newIssueDesc}
                      onChange={(e) => setNewIssueDesc(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <select
                      value={newIssueCategory}
                      onChange={(e) => setNewIssueCategory(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none"
                    >
                      <option value="display_planogram">Display / Planogram</option>
                      <option value="kebersihan_5r">Kebersihan 5R</option>
                      <option value="fasilitas_alat">Fasilitas / Aset Alat</option>
                      <option value="kekosongan_oos">Kekosongan Stok (OOS)</option>
                      <option value="kasir_layanan">Pelayanan Kasir</option>
                      <option value="keamanan_nkl">Keamanan / Susut NKL</option>
                    </select>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Solusi langsung di tempat..."
                      value={newIssueSolution}
                      onChange={(e) => setNewIssueSolution(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center gap-3">
                    <label className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 rounded-lg text-xs text-slate-300 cursor-pointer">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      {newIssuePhoto ? 'Ganti Foto' : 'Ambil/Unggah Foto'}
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>

                    {newIssuePhoto && (
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Foto Terpilih
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleAddIssue}
                      className="ml-auto px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg"
                    >
                      + Tambah ke Temuan
                    </button>
                  </div>
                </div>

                {/* List Issues Added */}
                {formData.issues && formData.issues.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400">Temuan Tercatat ({formData.issues.length}):</div>
                    {formData.issues.map((iss) => (
                      <div key={iss.id} className="bg-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-medium">{iss.description}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteIssue(iss.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kesimpulan & Rekomendasi Umum Kunjungan
                </label>
                <textarea
                  rows={2}
                  placeholder="Rangkum hasil kunjungan dan catatan untuk laporan ke Manajer Bisnis..."
                  value={formData.summaryConclusion}
                  onChange={(e) => setFormData({ ...formData, summaryConclusion: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    if (onCloseNewModal) onCloseNewModal();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-950"
                >
                  Simpan Log Kunjungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
