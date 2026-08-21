import React from 'react';
import { formatShortRupiah } from '../../utils/formatters';

interface LineChartProps {
  data: { label: string; actual: number; target: number }[];
  title?: string;
  height?: number;
}

export const SimpleLineChart: React.FC<LineChartProps> = ({ data, title, height = 220 }) => {
  if (!data || data.length === 0) {
    return <div className="text-sm text-slate-500 py-8 text-center">Belum ada data metrik</div>;
  }

  const padding = 40;
  const chartWidth = 600;
  const chartHeight = height;
  const maxVal = Math.max(...data.flatMap((d) => [d.actual, d.target])) * 1.15 || 100;
  const minVal = 0;

  const getX = (index: number) => padding + (index / (data.length - 1 || 1)) * (chartWidth - padding * 2);
  const getY = (val: number) => chartHeight - padding - ((val - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2);

  const actualPoints = data.map((d, i) => `${getX(i)},${getY(d.actual)}`).join(' ');
  const targetPoints = data.map((d, i) => `${getX(i)},${getY(d.target)}`).join(' ');

  return (
    <div className="w-full">
      {title && <h4 className="text-sm font-semibold text-slate-300 mb-3">{title}</h4>}
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[420px] h-auto overflow-visible">
          {[0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const val = minVal + (maxVal - minVal) * ratio;
            const y = getY(val);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#334155" strokeDasharray="3 3" />
                <text x={padding - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#94a3b8">{formatShortRupiah(val)}</text>
              </g>
            );
          })}

          <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 4" points={targetPoints} />
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <polygon points={`${getX(0)},${chartHeight - padding} ${actualPoints} ${getX(data.length - 1)},${chartHeight - padding}`} fill="url(#actualGradient)" />
          <polyline fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={actualPoints} />

          {data.map((d, i) => (
            <g key={i}>
              <text x={getX(i)} y={chartHeight - 12} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.label}</text>
              <circle cx={getX(i)} cy={getY(d.actual)} r="5" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
              <circle cx={getX(i)} cy={getY(d.target)} r="3.5" fill="#f59e0b" />
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-2"><span className="w-3.5 h-1 bg-emerald-500 rounded-full" /><span>Sales Aktual (Rp)</span></div>
        <div className="flex items-center gap-2"><span className="w-3.5 h-1 bg-amber-500 border-b-2 border-dashed border-amber-500" /><span>Target DPK (Rp)</span></div>
      </div>
    </div>
  );
};
