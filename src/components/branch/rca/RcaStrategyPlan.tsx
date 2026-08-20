import React from 'react';
import { Lightbulb, Sparkles, Trash2, AlertTriangle } from 'lucide-react';

interface RcaStrategyPlanProps {
  diagnosisSummary: string;
  recommendedStrategy: string;
  onChangeSummary: (val: string) => void;
  onChangeStrategy: (val: string) => void;
  onGenerateAnalysis: () => void;
  onClearAnalysis: () => void;
}

export const RcaStrategyPlan: React.FC<RcaStrategyPlanProps> = ({
  diagnosisSummary,
  recommendedStrategy,
  onChangeSummary,
  onChangeStrategy,
  onGenerateAnalysis,
  onClearAnalysis
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
      <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Rencana Strategi & Eksekusi
          </h4>
        </div>

        {/* Action Buttons: Auto Generate & Clear */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onGenerateAnalysis}
            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="Analisis Otomatis Berdasarkan Faktor Diagnosa"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Otomatis ✨</span>
          </button>
          {(diagnosisSummary || recommendedStrategy) && (
            <button
              type="button"
              onClick={onClearAnalysis}
              className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
              title="Kosongkan Teks"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-slate-400">
              Ringkasan Diagnosa Utama SPV
            </label>
            <span className="text-[10px] text-slate-500 font-mono">Bisa Diedit Manual</span>
          </div>
          <textarea
            rows={3}
            placeholder="Tuliskan kesimpulan akar masalah terbesar toko ini (atau klik 'Otomatis ✨')..."
            value={diagnosisSummary}
            onChange={(e) => onChangeSummary(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed placeholder:text-slate-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium text-slate-400">
              Rekomendasi Strategi Turnaround (180 Hari)
            </label>
            <span className="text-[10px] text-slate-500 font-mono">Bisa Diedit Manual</span>
          </div>
          <textarea
            rows={4}
            placeholder="Tuliskan instruksi prioritas perbaikan yang wajib dijalankan KTB & kru..."
            value={recommendedStrategy}
            onChange={(e) => onChangeStrategy(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-emerald-300 leading-relaxed">
          Setelah diagnosa disimpan, buka tab <strong>🎯 Aksi</strong> untuk menyusun jadwal roadmap perbaikan 180 hari bersama Kepala Toko.
        </p>
      </div>
    </div>
  );
};
