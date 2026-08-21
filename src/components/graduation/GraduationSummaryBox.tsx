import React from 'react';
import { Award, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';
import { Branch, BranchGraduation } from '../../types';

interface GraduationSummaryBoxProps {
  branch?: Branch;
  currentGraduation: BranchGraduation;
  onUpdateLearnings: (notes: string) => void;
  onGraduationApproval: () => void;
}

export const GraduationSummaryBox: React.FC<GraduationSummaryBoxProps> = ({
  branch,
  currentGraduation,
  onUpdateLearnings,
  onGraduationApproval
}) => {
  const metCount = currentGraduation.checklists.filter((c) => c.isMet).length;
  const totalCount = currentGraduation.checklists.length;
  const isReady = metCount === totalCount && currentGraduation.consecutiveMonthsHit >= 3;
  const isGraduated = branch?.status === 'lulus_mandiri' || currentGraduation.approvedByManager;

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Dokumentasi Best Practice & Catatan Turnaround
        </h3>
        <p className="text-xs text-slate-400">
          Tuliskan pola keberhasilan kunci yang berhasil membalikkan kondisi toko ini untuk pembelajaran toko lain.
        </p>
      </div>

      <textarea
        rows={3}
        value={currentGraduation.bestPracticeLearnings}
        onChange={(e) => onUpdateLearnings(e.target.value)}
        placeholder="Contoh: Kunci turnaround toko ini adalah disiplin pembatasan AC di pagi hari, SO harian rokok & penawaran paket sembako..."
        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
      />

      <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs space-y-0.5">
          <div className="font-semibold text-slate-300">
            Kesiapan Kelulusan: <strong className="text-emerald-400">{metCount}/{totalCount} Kriteria</strong>
          </div>
          <p className="text-[11px] text-slate-500">
            {isReady ? 'Semua kriteria terpenuhi & siap diajukan kelulusan.' : 'Lengkapi seluruh kriteria di atas.'}
          </p>
        </div>

        {isGraduated ? (
          <div className="px-4 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Toko Resmi Lulus Mandiri 🎓
          </div>
        ) : (
          <button
            type="button"
            onClick={onGraduationApproval}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-95 ${
              isReady
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Proses Kelulusan DPK
          </button>
        )}
      </div>
    </div>
  );
};
