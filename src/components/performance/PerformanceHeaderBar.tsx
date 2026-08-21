import React from 'react';
import { Plus, DollarSign, Percent, Users, ShoppingCart } from 'lucide-react';
import { Branch } from '../../types';
import { formatRupiah, formatShortRupiah } from '../../utils/formatters';

interface PerformanceHeaderBarProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  avgSales: number;
  avgMargin: string;
  totalTraffic: number;
  avgBasket: number;
  targetSalesPerDay: number;
  onOpenAddModal: () => void;
}

export const PerformanceHeaderBar: React.FC<PerformanceHeaderBarProps> = ({
  branches,
  activeBranchId,
  onSelectBranch,
  avgSales,
  avgMargin,
  totalTraffic,
  avgBasket,
  targetSalesPerDay,
  onOpenAddModal
}) => {
  return (
    <div className="space-y-4">
      {/* Sleek 1-Row Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2.5">
          <select
            value={activeBranchId}
            onChange={(e) => onSelectBranch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[240px] truncate"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                [{b.code}] {b.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Input Kinerja</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Rata-rata Laba / Hari:
          </span>
          <div className="text-base sm:text-lg font-bold font-mono text-white truncate">
            {formatRupiah(avgSales)}
          </div>
          <span className="text-[10px] text-slate-500 block">
            Target: {formatShortRupiah(targetSalesPerDay)}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-blue-400" />
            Rata-rata Margin:
          </span>
          <div className="text-base sm:text-lg font-bold font-mono text-blue-400">
            {avgMargin}%
          </div>
          <span className="text-[10px] text-slate-500 block">Target Min: 15%</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            Total Pengunjung:
          </span>
          <div className="text-base sm:text-lg font-bold font-mono text-amber-400">
            {totalTraffic.toLocaleString('id-ID')} Struk
          </div>
          <span className="text-[10px] text-slate-500 block">Akumulasi Struk</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5 text-purple-400" />
            Rata-rata Basket Size:
          </span>
          <div className="text-base sm:text-lg font-bold font-mono text-purple-400 truncate">
            {formatRupiah(avgBasket)}
          </div>
          <span className="text-[10px] text-slate-500 block">Nilai per Struk</span>
        </div>
      </div>
    </div>
  );
};
