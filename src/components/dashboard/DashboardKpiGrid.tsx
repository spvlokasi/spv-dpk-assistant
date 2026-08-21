import React from 'react';
import { Store, AlertOctagon, Award, Calendar } from 'lucide-react';
import { Branch, FieldVisit } from '../../types';

interface DashboardKpiGridProps {
  branches: Branch[];
  visits: FieldVisit[];
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({ branches, visits }) => {
  const totalBranches = branches.length;
  const criticalBranches = branches.filter((b) => b.status === 'kritis');
  const inProgressBranches = branches.filter((b) => b.status === 'dalam_progres');
  const readyToGraduate = branches.filter((b) => b.status === 'siap_lulus');
  const graduatedBranches = branches.filter((b) => b.status === 'lulus_dpk');
  const openIssues = visits.flatMap((v) => v.issues).filter((i) => !i.resolved);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium">Total Cabang DPK</span>
          <Store className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalBranches}</div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="text-amber-400 font-semibold">{inProgressBranches.length} Toko</span> dalam pendampingan
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center justify-between text-rose-400 mb-2">
          <span className="text-xs font-medium">Cabang Kritis</span>
          <AlertOctagon className="w-4 h-4 text-rose-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{criticalBranches.length}</div>
        <div className="text-[11px] text-slate-400 mt-1">Butuh intervensi intensif & eskalasi</div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center justify-between text-emerald-400 mb-2">
          <span className="text-xs font-medium">Siap Lulus / Lulus</span>
          <Award className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
          {readyToGraduate.length + graduatedBranches.length}
        </div>
        <div className="text-[11px] text-emerald-400/80 mt-1">
          {readyToGraduate.length} toko siap sidang evaluasi
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center justify-between text-amber-400 mb-2">
          <span className="text-xs font-medium">Log Kunjungan</span>
          <Calendar className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white">{visits.length}</div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="text-rose-400 font-semibold">{openIssues.length}</span> temuan fisik terbuka
        </div>
      </div>
    </div>
  );
};
