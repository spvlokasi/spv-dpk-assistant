import React from 'react';
import { User, Shield, AlertCircle, Plus } from 'lucide-react';
import { Branch, ActionPlanMilestone } from '../../types';
import { StatusBadge } from '../common/Badge';
import { formatRupiah } from '../../utils/formatters';

interface ActionPlanLeftSidebarProps {
  branch: Branch;
  milestones: ActionPlanMilestone[];
  onOpenSmartModal: () => void;
  onAddNewMilestone: () => void;
}

export const ActionPlanLeftSidebar: React.FC<ActionPlanLeftSidebarProps> = ({
  branch, milestones, onOpenSmartModal, onAddNewMilestone
}) => {
  const completedTasks = milestones.flatMap((m) => m.tasks).filter((t) => t.completed).length;
  const totalTasks = milestones.flatMap((m) => m.tasks).length;
  const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const weakFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score <= 2) : [];
  const moderateFactors = branch.rootCauses ? branch.rootCauses.filter((f) => f.score === 3) : [];
  const issueKeywords = (weakFactors.length > 0 ? weakFactors : moderateFactors)
    .map((f) => f.title.split('(')[0].replace(/^(Efisiensi|Penertiban|Kedisiplinan|Kemandirian|Ketersediaan)\s+/i, '').trim());

  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
        <div className="space-y-1.5 pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-emerald-400">{branch.code}</span>
            <StatusBadge status={branch.status} />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight truncate">{branch.name}</h3>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 truncate"><User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /> KTB: <strong className="text-slate-200">{branch.kepalaToko || '-'}</strong></span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center gap-1 truncate"><Shield className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /> SPV: <strong className="text-slate-200">{branch.spvArea || '-'}</strong></span>
          </div>
        </div>

        <div className="bg-slate-850/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between"><span className="text-slate-400">Target Laba Harian:</span><strong className="text-emerald-400 font-mono font-bold">{formatRupiah(branch.targetSalesPerDay)}</strong></div>
          <div className="flex items-center justify-between"><span className="text-slate-400">Target Margin:</span><strong className="text-blue-400 font-mono font-bold">{branch.targetMarginPct}%</strong></div>
          <div className="flex items-center justify-between"><span className="text-slate-400">Batas Biaya Maksimal:</span><strong className="text-rose-400 font-mono font-bold">{formatRupiah(branch.targetMaxOpexPerMonth)}/bln</strong></div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300"><AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" /><span>Akar Masalah Terdeteksi</span></div>
          {issueKeywords.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              {issueKeywords.map((issue, idx) => (<span key={idx} className="px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[11px] font-semibold">⚠️ {issue}</span>))}
            </div>
          ) : (<p className="text-[11px] text-slate-500 italic">Belum ada penilaian faktor</p>)}
        </div>

        <div className="pt-3 border-t border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs"><span className="font-semibold text-slate-300">Total Eksekusi Aksi:</span><strong className="text-emerald-400 font-mono">{completedTasks}/{totalTasks} Tugas ({progressPct}%)</strong></div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPct}%` }} /></div>
        </div>

        <div className="space-y-2 pt-1">
          <button type="button" onClick={onOpenSmartModal} className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950 active:scale-95">Muat Aksi</button>
          <button type="button" onClick={onAddNewMilestone} className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-95"><Plus className="w-4 h-4" /><span>+ Tambah Milestone Manual</span></button>
        </div>
      </div>
    </div>
  );
};
