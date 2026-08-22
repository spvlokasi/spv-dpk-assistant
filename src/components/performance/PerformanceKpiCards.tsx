import React from 'react';
import { DollarSign, Users, ShoppingCart } from 'lucide-react';
import { formatRupiah, formatShortRupiah } from '../../utils/formatters';

interface PerformanceKpiCardsProps {
  avgSales: number;
  totalTraffic: number;
  avgTrafficPerDay: number;
  avgBasket: number;
  targetSalesPerDay: number;
  totalDays: number;
}

export const PerformanceKpiCards: React.FC<PerformanceKpiCardsProps> = ({
  avgSales,
  totalTraffic,
  avgTrafficPerDay,
  avgBasket,
  targetSalesPerDay,
  totalDays
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          Rata-rata Laba / Hari:
        </span>
        <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 truncate">
          {formatRupiah(avgSales)}
        </div>
        <span className="text-[10px] text-slate-500 block">
          Target: {formatShortRupiah(targetSalesPerDay)} ({totalDays} hari data)
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          Rata-rata STD (Struk / Hari):
        </span>
        <div className="text-base sm:text-lg font-bold font-mono text-blue-400">
          {avgTrafficPerDay} Struk
        </div>
        <span className="text-[10px] text-slate-500 block">
          Total Akumulasi: {totalTraffic.toLocaleString('id-ID')} Struk
        </span>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
        <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
          <ShoppingCart className="w-3.5 h-3.5 text-purple-400" />
          Rata-rata APC (Rupiah / Struk):
        </span>
        <div className="text-base sm:text-lg font-bold font-mono text-purple-400 truncate">
          {formatRupiah(avgBasket)}
        </div>
        <span className="text-[10px] text-slate-500 block">Rata-rata Belanja Pelanggan</span>
      </div>
    </div>
  );
};
