import React from 'react';
import { Lightbulb, Sparkles, Trash2 } from 'lucide-react';

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
    <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-4 shadow-lg">
      <div className="flex items-center justify-between gap-2 flex-nowrap pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5 min-w-0">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 truncate">
            Rencana Strategi & Eksekusi
          </h4>
        </div>

        {/* Action Buttons: Auto Generate & Clear (Strictly 1 Row) */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onGenerateAnalysis}
            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm whitespace-nowrap"
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
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Ringkasan Diagnosa
          </label>
          <textarea
            rows={3}
            placeholder="Tuliskan kesimpulan akar masalah terbesar toko ini (atau klik 'Otomatis ✨')..."
            value={diagnosisSummary}
            onChange={(e) => onChangeSummary(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">
            Rekomendasi Strategi
          </label>
          <textarea
            rows={4}
            placeholder="Tuliskan instruksi prioritas perbaikan yang wajib dijalankan KTB & kru..."
            value={recommendedStrategy}
            onChange={(e) => onChangeStrategy(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed placeholder:text-slate-500"
          />
        </div>
      </div>
    </div>
  );
};
