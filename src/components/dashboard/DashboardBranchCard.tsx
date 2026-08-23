import React from 'react';
import { Branch, DailyPerformance, ActionPlanMilestone } from '../../types';
import { StatusBadge } from '../common/Badge';
import { formatShortRupiah } from '../../utils/formatters';

interface DashboardBranchCardProps {
  branch: Branch;
  performance: DailyPerformance[];
  milestones: ActionPlanMilestone[];
  onSelect: () => void;
}

export const DashboardBranchCard: React.FC<DashboardBranchCardProps> = ({ branch, performance, milestones, onSelect }) => {
  const branchPerf = performance.filter((p) => p.branchId === branch.id);
  const latestPerf = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;
  const salesPct = latestPerf ? Math.round((latestPerf.salesActual / branch.targetSalesPerDay) * 100) : 0;

  const branchMilestones = milestones.filter((m) => m.branchId === branch.id);
  const completedTasks = branchMilestones.flatMap((m) => m.tasks).filter((t) => t.completed).length;
  const totalTasks = branchMilestones.flatMap((m) => m.tasks).length;
  const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const imgUrl = branch.imageUrl || (branch.code === 'M3017' || branch.name.toLowerCase().includes('bugih') ? '/stores/bugih.jpg' : '');
  const hasDiagnosed = branch.rootCauses && branch.rootCauses.length > 0;
  const critical = hasDiagnosed ? branch.rootCauses.filter((f) => f.score <= 2) : [];
  const moderate = hasDiagnosed ? branch.rootCauses.filter((f) => f.score === 3) : [];
  const issueKeywords = (critical.length > 0 ? critical : moderate).map((f) => f.title.split('(')[0].replace(/^(Efisiensi|Penertiban|Kedisiplinan|Kemandirian|Ketersediaan)\s+/i, '').trim()).slice(0, 2).join(' & ') || 'Kondisi Menuju Stabil';

  return (
    <div onClick={onSelect} className="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-5 rounded-2xl transition-all cursor-pointer hover:shadow-xl space-y-3">
      {imgUrl && (<><div className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:opacity-85 transition-opacity rounded-2xl pointer-events-none" style={{ backgroundImage: `url(${imgUrl})` }} /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 rounded-2xl pointer-events-none" /></>)}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono shadow-sm">{branch.code}</div>
          <div><h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">{branch.name}</h4><div className="text-[11px] text-slate-400">KTB: <span className="text-slate-300 font-medium">{branch.kepalaToko}</span> | SPV: {branch.spvArea}</div></div>
        </div>
        <StatusBadge status={branch.status} />
      </div>

      <div className="min-h-[50px] flex flex-col justify-center">
        {hasDiagnosed ? (
          <div className="relative z-10 text-xs text-slate-300 bg-slate-850/85 p-2.5 rounded-xl border border-slate-800/90 backdrop-blur-sm space-y-1">
            <div className="text-[11px] font-bold text-amber-400 truncate">⚠️ Akar Masalah: {issueKeywords}</div>
            <div className="text-[11px] text-slate-300 line-clamp-1">{branch.diagnosisSummary || 'Faktor dinilai, siap susun strategi.'}</div>
          </div>
        ) : (<div className="relative z-10 text-xs text-slate-400 bg-slate-850/50 p-2.5 rounded-xl border border-dashed border-slate-800 backdrop-blur-sm text-center font-semibold">Belum ada diagnosa</div>)}
      </div>

      <div className="relative z-10 space-y-2.5 pt-2.5 border-t border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]"><span className="text-slate-400 font-medium">Target Laba Harian</span><span className="font-bold text-slate-200 font-mono">{latestPerf ? formatShortRupiah(latestPerf.salesActual) : '-'} / {formatShortRupiah(branch.targetSalesPerDay)} <strong className={salesPct >= 100 ? 'text-emerald-400' : salesPct >= 80 ? 'text-amber-400' : 'text-rose-400'}>({salesPct}%)</strong></span></div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className={`h-full rounded-full ${salesPct >= 100 ? 'bg-emerald-500' : salesPct >= 80 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(salesPct, 100)}%` }} /></div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]"><span className="text-slate-400 font-medium">Eksekusi Action Plan</span><span className="font-bold text-slate-200 font-mono">{completedTasks}/{totalTasks} Tugas <strong className="text-blue-400">({taskPct}%)</strong></span></div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${taskPct}%` }} /></div>
        </div>
      </div>
    </div>
  );
};
