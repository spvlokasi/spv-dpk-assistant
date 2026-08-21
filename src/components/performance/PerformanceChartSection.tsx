import React from 'react';
import { DailyPerformance } from '../../types';
import { SimpleLineChart } from '../common/SimpleChart';
import { formatShortRupiah } from '../../utils/formatters';

interface PerformanceChartSectionProps {
  branchPerf: DailyPerformance[];
  targetSalesPerDay: number;
}

export const PerformanceChartSection: React.FC<PerformanceChartSectionProps> = ({
  branchPerf,
  targetSalesPerDay
}) => {
  const chartData = branchPerf.map((p) => ({
    label: p.date.slice(5),
    salesActual: p.salesActual,
    salesTarget: p.salesTarget || targetSalesPerDay,
    marginPct: p.marginPct
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Sales Trend Chart */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Tren Laba Harian vs Target</h3>
            <p className="text-xs text-slate-400">Pencapaian laba harian per tanggal</p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Aktual
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
              Target
            </span>
          </div>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64">
            <SimpleLineChart
              data={chartData}
              lines={[
                { key: 'salesActual', color: '#10b981', label: 'Laba Aktual' },
                { key: 'salesTarget', color: '#475569', label: 'Target Laba' }
              ]}
              formatY={(val) => formatShortRupiah(val)}
            />
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-500 italic">
            Belum ada data input kinerja untuk cabang ini.
          </div>
        )}
      </div>

      {/* Margin Trend Chart */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
        <div>
          <h3 className="text-sm font-bold text-white">Tren Margin Profit (%)</h3>
          <p className="text-xs text-slate-400">Fluktuasi margin keuntungan</p>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64">
            <SimpleLineChart
              data={chartData}
              lines={[{ key: 'marginPct', color: '#3b82f6', label: 'Margin %' }]}
              formatY={(val) => `${val}%`}
            />
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-500 italic">
            Belum ada data margin.
          </div>
        )}
      </div>
    </div>
  );
};
