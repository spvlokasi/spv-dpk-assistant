import React from 'react';
import { 
  Store, 
  AlertOctagon, 
  Award, 
  Calendar
} from 'lucide-react';
import { Branch, FieldVisit, ActionPlanMilestone, DailyPerformance, EscalationTicket } from '../../types';
import { StatusBadge, UrgencyBadge } from '../common/Badge';
import { formatShortRupiah, formatCategoryName } from '../../utils/formatters';

interface DashboardOverviewProps {
  branches: Branch[];
  visits: FieldVisit[];
  milestones: ActionPlanMilestone[];
  performance: DailyPerformance[];
  escalations: EscalationTicket[];
  onSelectBranch: (branchId: string) => void;
  setActiveTab: (tab: string) => void;
  onNewVisit?: () => void;
  onNewBranch?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  branches,
  visits,
  milestones,
  performance,
  onSelectBranch
}) => {
  const totalBranches = branches.length;
  const criticalBranches = branches.filter(b => b.status === 'kritis');
  const inProgressBranches = branches.filter(b => b.status === 'dalam_progres');
  const readyToGraduate = branches.filter(b => b.status === 'siap_lulus');
  const graduatedBranches = branches.filter(b => b.status === 'lulus_dpk');

  const openIssues = visits.flatMap(v => v.issues).filter(i => !i.resolved);

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
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
          <div className="text-[11px] text-slate-400 mt-1">
            Butuh intervensi intensif & eskalasi
          </div>
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
            <span className="text-xs font-medium">Log Kunjungan Bulan Ini</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{visits.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-rose-400 font-semibold">{openIssues.length}</span> temuan fisik terbuka
          </div>
        </div>
      </div>

      {/* Main Full-Width: Branch Turnaround Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            Status Perbaikan Cabang Binaan
          </h3>
          <span className="text-xs text-slate-400">Klik toko untuk detail</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((branch) => {
            const branchPerf = performance.filter(p => p.branchId === branch.id);
            const latestPerf = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;
            const salesPct = latestPerf ? Math.round((latestPerf.salesActual / branch.targetSalesPerDay) * 100) : 0;
            const branchMilestones = milestones.filter(m => m.branchId === branch.id);
            const completedTasks = branchMilestones.flatMap(m => m.tasks).filter(t => t.completed).length;
            const totalTasks = branchMilestones.flatMap(m => m.tasks).length;
            const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            const imgUrl = branch.imageUrl || (branch.code === 'M3017' || branch.name.toLowerCase().includes('bugih') ? '/stores/bugih.jpg' : '');

            return (
              <div
                key={branch.id}
                onClick={() => onSelectBranch(branch.id)}
                className="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-5 rounded-2xl transition-all cursor-pointer hover:shadow-xl hover:shadow-emerald-950/20 space-y-3"
              >
                {/* Translucent Store Photo (Opacity 65% - 85%) */}
                {imgUrl && (
                  <>
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none rounded-2xl"
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 pointer-events-none rounded-2xl" />
                  </>
                )}

                <div className="relative z-10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono shadow-sm">
                      {branch.code}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {branch.name}
                      </h4>
                      <div className="text-[11px] text-slate-400">
                        KTB: <span className="text-slate-300 font-medium">{branch.kepalaToko}</span> | SPV Area: {branch.spvArea}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={branch.status} />
                </div>

                <div className="relative z-10 text-xs text-slate-300 bg-slate-850/85 p-3 rounded-xl border border-slate-800/90 backdrop-blur-sm">
                  <span className="font-semibold text-slate-200">Kategori Masalah:</span> {formatCategoryName(branch.category)}
                  <div className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{branch.diagnosisSummary}</div>
                </div>

                {/* Progress Bars */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Target Laba Harian</span>
                      <span className="font-bold text-slate-200">
                        {latestPerf ? formatShortRupiah(latestPerf.salesActual) : '-'} / {formatShortRupiah(branch.targetSalesPerDay)} ({salesPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          salesPct >= 100 ? 'bg-emerald-500' : salesPct >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(salesPct, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Eksekusi Action Plan</span>
                      <span className="font-bold text-slate-200">
                        {completedTasks}/{totalTasks} Tugas ({taskPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${taskPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
