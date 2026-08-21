import React from 'react';

interface ScoreBarChartProps {
  factors: { title: string; score: number; category: string; note: string }[];
}

export const ScoreBarChart: React.FC<ScoreBarChartProps> = ({ factors }) => {
  return (
    <div className="space-y-3">
      {factors.map((f, i) => {
        const pct = (f.score / 5) * 100;
        const color = f.score <= 2 ? 'bg-rose-500' : f.score === 3 ? 'bg-amber-500' : 'bg-emerald-500';
        return (
          <div key={i} className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-200">{f.title}</span>
              <span className="font-mono font-bold text-slate-300">{f.score}/5 Poin</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-1.5">
              <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 italic">{f.note}</p>
          </div>
        );
      })}
    </div>
  );
};
