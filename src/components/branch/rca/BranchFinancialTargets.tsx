import React from 'react';

interface BranchFinancialTargetsProps {
  targetSalesPerDay: number;
  targetMarginPct: number;
  targetMaxOpexPerMonth: number;
  onChangeTargetSales: (val: number) => void;
  onChangeTargetMargin: (val: number) => void;
  onChangeTargetOpex: (val: number) => void;
}

const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
};

export const BranchFinancialTargets: React.FC<BranchFinancialTargetsProps> = ({
  targetSalesPerDay,
  targetMarginPct,
  targetMaxOpexPerMonth,
  onChangeTargetSales,
  onChangeTargetMargin,
  onChangeTargetOpex
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
      <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <label className="text-[11px] font-medium text-slate-400">Target Laba Harian</label>
          <span className="text-[11px] font-semibold text-emerald-400">{formatRupiah(targetSalesPerDay)}/hari</span>
        </div>
        <input
          type="number"
          value={targetSalesPerDay}
          onChange={(e) => onChangeTargetSales(Number(e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <label className="text-[11px] font-medium text-slate-400">Target Margin Profit (%)</label>
          <span className="text-[11px] font-semibold text-blue-400">Standar Target</span>
        </div>
        <input
          type="number"
          step="0.1"
          value={targetMarginPct}
          onChange={(e) => onChangeTargetMargin(Number(e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 text-blue-400 font-mono font-bold text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <label className="text-[11px] font-medium text-slate-400">Target Biaya Bulanan</label>
          <span className="text-[11px] font-semibold text-rose-400">{formatRupiah(targetMaxOpexPerMonth)}/bulan</span>
        </div>
        <input
          type="number"
          value={targetMaxOpexPerMonth}
          onChange={(e) => onChangeTargetOpex(Number(e.target.value))}
          className="w-full bg-slate-800 border border-slate-700 text-rose-400 font-mono font-bold text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
};
