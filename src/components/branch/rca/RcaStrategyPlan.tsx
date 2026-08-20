import React from 'react';
import { Lightbulb, AlertTriangle } from 'lucide-react';

interface RcaStrategyPlanProps {
  diagnosisSummary: string;
  recommendedStrategy: string;
  onChangeSummary: (val: string) => void;
  onChangeStrategy: (val: string) => void;
}

export const RcaStrategyPlan: React.FC<RcaStrategyPlanProps> = ({
  diagnosisSummary,
  recommendedStrategy,
  onChangeSummary,
  onChangeStrategy
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Rencana Strategi & Eksekusi
        </h4>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Ringkasan Diagnosa Utama SPV
          </label>
          <textarea
            rows={3}
            placeholder="Tuliskan kesimpulan akar masalah terbesar toko ini..."
            value={diagnosisSummary}
            onChange={(e) => onChangeSummary(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Rekomendasi Strategi Turnaround (180 Hari)
          </label>
          <textarea
            rows={4}
            placeholder="Tuliskan instruksi prioritas perbaikan yang wajib dijalankan KTB & kru..."
            value={recommendedStrategy}
            onChange={(e) => onChangeStrategy(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
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
