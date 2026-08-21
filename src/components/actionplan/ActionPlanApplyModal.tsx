import React from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { Branch, DailyPerformance } from '../../types';
import { formatRupiah } from '../../utils/formatters';

interface ActionPlanApplyModalProps {
  branch: Branch;
  performance: DailyPerformance[];
  onConfirm: () => void;
  onClose: () => void;
}

export const ActionPlanApplyModal: React.FC<ActionPlanApplyModalProps> = ({
  branch,
  performance,
  onConfirm,
  onClose
}) => {
  const branchPerf = performance.filter((p) => p.branchId === branch.id);
  const latestPerf = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;

  const weakFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score <= 2) : [];
  const moderateFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score === 3) : [];

  const detectedIssues = weakFactors.length > 0
    ? weakFactors.map((f) => f.title.split('(')[0].trim()).slice(0, 3)
    : moderateFactors.length > 0
    ? moderateFactors.map((f) => f.title.split('(')[0].trim()).slice(0, 2)
    : ['Efisiensi Biaya Toko'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Generate Rencana Aksi Cerdas ✨</h3>
            <p className="text-xs text-slate-400">Sinkronisasi Otomatis Diagnosa RCA & Monitor Kinerja</p>
          </div>
        </div>

        {/* Context Summary Box */}
        <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="text-[11px] font-bold text-slate-300">
            📍 Cabang: <span className="text-emerald-400">{branch.name}</span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target Laba Harian:</span>
              <strong className="text-emerald-400 font-mono">{formatRupiah(branch.targetSalesPerDay)}/hari</strong>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Target Margin:</span>
              <strong className="text-blue-400 font-mono">{branch.targetMarginPct}%</strong>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Batas Biaya Maksimal:</span>
              <strong className="text-rose-400 font-mono">{formatRupiah(branch.targetMaxOpexPerMonth)}/bln</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-400 text-[10px] block mb-1">Akar Masalah Terdeteksi dari RCA:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {detectedIssues.map((issue, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[10px] font-semibold"
                >
                  ⚠️ {issue}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Sistem akan menyusun <strong className="text-white">Milestone Roadmap 180 Hari</strong> beserta rincian tugas spesifik untuk KTB, Kasir, dan Pramuniaga yang langsung mengunci akar masalah di atas.
        </p>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            Muat Rencana Aksi Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};
