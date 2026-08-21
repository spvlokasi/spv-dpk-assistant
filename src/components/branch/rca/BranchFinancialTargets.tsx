import React from 'react';
import { Target } from 'lucide-react';

interface BranchFinancialTargetsProps {
  targetSalesPerDay: number;
  targetMarginPct: number;
  targetMaxOpexPerMonth: number;
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export const BranchFinancialTargets: React.FC<BranchFinancialTargetsProps> = ({
  targetSalesPerDay,
  targetMarginPct,
  targetMaxOpexPerMonth
}) => {
  return (
    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 sm:gap-3 flex-wrap text-xs bg-slate-850/40 p-2.5 rounded-xl border border-slate-800/60">
      <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px]">
        <Target className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        <span>Target Finansial:</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px]">
        <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/70">
          <span className="text-slate-400">Laba Harian:</span>
          <strong className="text-emerald-400 font-mono font-bold">{formatRupiah(targetSalesPerDay)}</strong>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/70">
          <span className="text-slate-400">Margin:</span>
          <strong className="text-blue-400 font-mono font-bold">{targetMarginPct}%</strong>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/70">
          <span className="text-slate-400">Batas Biaya:</span>
          <strong className="text-rose-400 font-mono font-bold">{formatRupiah(targetMaxOpexPerMonth)}/bln</strong>
        </div>
      </div>
    </div>
  );
};
