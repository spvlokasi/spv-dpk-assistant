import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Calendar, 
  User, 
  Save, 
  Flame,
  ThumbsUp
} from 'lucide-react';
import { Branch, BranchGraduation, GraduationChecklistItem } from '../../types';
import { StatusBadge } from '../common/Badge';

interface GraduationTrackerProps {
  branches: Branch[];
  graduations: BranchGraduation[];
  onSaveGraduation: (item: BranchGraduation) => void;
  onUpdateBranchStatus: (branchId: string, status: any) => void;
}

export const GraduationTracker: React.FC<GraduationTrackerProps> = ({
  branches,
  graduations,
  onSaveGraduation,
  onUpdateBranchStatus
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');
  const [celebrateToast, setCelebrateToast] = useState<string | null>(null);

  const currentBranch = branches.find(b => b.id === selectedBranchId);
  const currentGraduation = graduations.find(g => g.branchId === selectedBranchId) || {
    branchId: selectedBranchId,
    consecutiveMonthsHit: 0,
    targetMonthsRequired: 3,
    approvedByManager: false,
    bestPracticeLearnings: '',
    checklists: [
      { id: 'gc-1', title: 'Target Sales Harian Stabil', targetDescription: 'Rata-rata sales >= target selama 3 bulan berturut-turut', isMet: false },
      { id: 'gc-2', title: 'Target Margin Profit Tercapai', targetDescription: 'Gross Margin >= target persentase', isMet: false },
      { id: 'gc-3', title: 'Efisiensi Biaya Operasional (Opex)', targetDescription: 'Opex di bawah batas plafon bulanan', isMet: false },
      { id: 'gc-4', title: 'Skor Audit Kepatuhan SOP & 5R', targetDescription: 'Nilai audit fisik dan kebersihan min. 85 poin', isMet: false },
      { id: 'gc-5', title: 'Kemandirian Kepala Toko & Tim', targetDescription: 'KaTok mampu memimpin evaluasi dan briefing harian mandiri', isMet: false }
    ]
  };

  const handleToggleChecklist = (id: string) => {
    const updated = {
      ...currentGraduation,
      checklists: currentGraduation.checklists.map(item => item.id === id ? { ...item, isMet: !item.isMet } : item)
    };
    onSaveGraduation(updated);
  };

  const handleUpdateConsecutiveMonths = (months: number) => {
    const updated = {
      ...currentGraduation,
      consecutiveMonthsHit: months
    };
    onSaveGraduation(updated);
  };

  const handleUpdateLearnings = (notes: string) => {
    const updated = {
      ...currentGraduation,
      bestPracticeLearnings: notes
    };
    onSaveGraduation(updated);
  };

  const handleGraduationApproval = () => {
    if (!currentBranch) return;
    const isAllChecked = currentGraduation.checklists.every(c => c.isMet);
    if (!isAllChecked) {
      if (!window.confirm('Belum semua kriteria kelulusan dicentang. Tetap proses kelulusan cabang ini?')) {
        return;
      }
    }

    const updatedGrad: BranchGraduation = {
      ...currentGraduation,
      approvedByManager: true,
      graduationDate: new Date().toISOString().slice(0, 10)
    };
    onSaveGraduation(updatedGrad);
    onUpdateBranchStatus(currentBranch.id, 'lulus_dpk');

    setCelebrateToast(`🎉 Selamat! ${currentBranch.name} resmi LULUS DPK dan kembali ke operasional reguler!`);
    setTimeout(() => setCelebrateToast(null), 5000);
  };

  const allMetCount = currentGraduation.checklists.filter(c => c.isMet).length;
  const totalCriteria = currentGraduation.checklists.length;
  const progressPct = Math.round((allMetCount / totalCriteria) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            DPK Graduation Tracker (Status Kelulusan Toko)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Verifikasi standar kelulusan cabang dari status pengawasan khusus dan dokumentasikan formula strategi sukses.
          </p>
        </div>

        <select
          value={selectedBranchId}
          onChange={(e) => setSelectedBranchId(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none self-start sm:self-auto"
        >
          {branches.map(b => (
            <option key={b.id} value={b.id}>
              [{b.code}] {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Graduation Banner Toast */}
      {celebrateToast && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-6 h-6" />
          <div className="text-sm font-bold">{celebrateToast}</div>
        </div>
      )}

      {/* Main Grid: Checklist & Best Practice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Graduation Status & Checklist */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Ribbon Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400 text-base">
                  {currentBranch?.code}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{currentBranch?.name}</h3>
                  <div className="text-xs text-slate-400">
                    Kepala Toko: <strong className="text-slate-200">{currentBranch?.kepalaToko}</strong>
                  </div>
                </div>
              </div>

              <div>
                <StatusBadge status={currentBranch?.status || 'kritis'} />
              </div>
            </div>

            {/* Progress of Criteria */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Kesiapan Kelulusan Toko</span>
                <span className="font-bold text-emerald-400">{allMetCount}/{totalCriteria} Kriteria Terpenuhi ({progressPct}%)</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                ></div>
              </div>
            </div>

            {/* Consecutive Months Counter */}
            <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-200">Stabilitas Kinerja Berturut-turut</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Syarat resmi: minimal 3 bulan berturut-turut stabil mencapai target
                </div>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map((month) => {
                  const isActive = month <= currentGraduation.consecutiveMonthsHit;
                  return (
                    <button
                      key={month}
                      onClick={() => handleUpdateConsecutiveMonths(month === currentGraduation.consecutiveMonthsHit ? month - 1 : month)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      Bulan ke-{month} {isActive && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Daftar Uji Kepatuhan & Kelulusan DPK
            </h4>

            <div className="space-y-3">
              {currentGraduation.checklists.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    item.isMet
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-100'
                      : 'bg-slate-850 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {item.isMet ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{item.targetDescription}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Approval Action */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {currentGraduation.approvedByManager ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Award className="w-4 h-4" /> Telah Lulus Resmi pada {currentGraduation.graduationDate}
                  </span>
                ) : (
                  <span>Status: Dalam tahap pembuktian stabil</span>
                )}
              </div>

              {!currentGraduation.approvedByManager && (
                <button
                  onClick={handleGraduationApproval}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <GraduationCap className="w-4 h-4" />
                  Resmikan Kelulusan Cabang DPK
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Best Practice Knowledge Base */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Bank Strategi Sukses (Best Practices)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Catat resep strategi yang terbukti ampuh menyelamatkan cabang ini untuk diduplikasi ke cabang DPK lainnya.
            </p>

            <textarea
              rows={6}
              value={currentGraduation.bestPracticeLearnings}
              onChange={(e) => handleUpdateLearnings(e.target.value)}
              placeholder="Contoh: Re-display produk Private Label di lorong utama + program kompetisi kasir perolehan struk berhasil mengangkat sales harian 35%..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-amber-500 leading-relaxed"
            />

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Dokumentasi ini akan otomatis dilampirkan dalam <strong>Laporan Eksekutif ke Manajer Bisnis</strong>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
