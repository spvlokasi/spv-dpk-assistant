import React from 'react';
import { 
  Store, 
  AlertOctagon, 
  CheckCircle2, 
  TrendingUp, 
  ClipboardList, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Branch, FieldVisit, ActionPlanMilestone, DailyPerformance, EscalationTicket } from '../../types';
import { StatusBadge, UrgencyBadge } from '../common/Badge';
import { formatRupiah, formatShortRupiah, formatDateIndo, formatCategoryName } from '../../utils/formatters';

interface DashboardOverviewProps {
  branches: Branch[];
  visits: FieldVisit[];
  milestones: ActionPlanMilestone[];
  performance: DailyPerformance[];
  escalations: EscalationTicket[];
  onSelectBranch: (branchId: string) => void;
  setActiveTab: (tab: string) => void;
  onNewVisit: () => void;
  onNewBranch: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  branches,
  visits,
  milestones,
  performance,
  escalations,
  onSelectBranch,
  setActiveTab,
  onNewVisit,
  onNewBranch
}) => {
  const totalBranches = branches.length;
  const criticalBranches = branches.filter(b => b.status === 'kritis');
  const inProgressBranches = branches.filter(b => b.status === 'dalam_progres');
  const readyToGraduate = branches.filter(b => b.status === 'siap_lulus');
  const graduatedBranches = branches.filter(b => b.status === 'lulus_dpk');

  const pendingEscalations = escalations.filter(e => e.status === 'diajukan' || e.status === 'ditinjau');
  const openIssues = visits.flatMap(v => v.issues).filter(i => !i.resolved);

  // Calculate today's aggregate or recent aggregate sales
  const recentPerformances = branches.map(branch => {
    const branchPerf = performance.filter(p => p.branchId === branch.id);
    const latest = branchPerf.length > 0 ? branchPerf[branchPerf.length - 1] : null;
    return { branch, latest };
  });

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-850 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Cabang DPK</span>
            <Store className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalBranches}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-amber-400 font-semibold">{inProgressBranches.length} Toko</span> dalam pendampingan
          </div>
        </div>

        <div className="bg-slate-850 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-medium">Cabang Kritis</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{criticalBranches.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            Butuh intervensi intensif & eskalasi
          </div>
        </div>

        <div className="bg-slate-850 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
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

        <div className="bg-slate-850 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
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

      {/* Main Grid: Branches Status & Recent Field Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Branch Turnaround Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-400" />
              Status Perbaikan Cabang Binaan
            </h3>
            <button
              onClick={() => setActiveTab('branches')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              Semua Cabang <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {branches.map((branch) => {
              const latestPerf = recentPerformances.find(r => r.branch.id === branch.id)?.latest;
              const salesPct = latestPerf ? Math.round((latestPerf.salesActual / branch.targetSalesPerDay) * 100) : 0;
              const branchMilestones = milestones.filter(m => m.branchId === branch.id);
              const completedTasks = branchMilestones.flatMap(m => m.tasks).filter(t => t.completed).length;
              const totalTasks = branchMilestones.flatMap(m => m.tasks).length;
              const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={branch.id}
                  onClick={() => onSelectBranch(branch.id)}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 sm:p-5 rounded-2xl transition-all cursor-pointer hover:shadow-lg group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono">
                        {branch.code}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {branch.name}
                        </h4>
                        <div className="text-[11px] text-slate-400">
                          KaTok: <span className="text-slate-300 font-medium">{branch.kepalaToko}</span> | SPV Area: {branch.spvArea}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <StatusBadge status={branch.status} />
                      <UrgencyBadge urgency={branch.urgencyLevel} />
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 bg-slate-850 p-2.5 rounded-xl border border-slate-800/80 mb-3">
                    <span className="font-semibold text-slate-300">Kategori Masalah:</span> {formatCategoryName(branch.category)}
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{branch.diagnosisSummary}</div>
                  </div>

                  {/* Progress Bars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Target Sales Harian</span>
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

        {/* Right Col: Recent Field Visits & Quick Log */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              Kunjungan Lapangan Terakhir
            </h3>
            <button
              onClick={() => setActiveTab('fieldvisit')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              Semua Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {visits.slice(0, 3).map((visit) => {
              const branch = branches.find(b => b.id === visit.branchId);
              return (
                <div key={visit.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-200">{branch?.name || 'Cabang'}</div>
                    <span className="text-[11px] text-slate-400 font-mono">{formatDateIndo(visit.date)}</span>
                  </div>

                  <div className="text-xs text-slate-300 font-medium bg-slate-800/60 p-2 rounded-lg">
                    🎯 {visit.agenda}
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>
                      <strong className="text-slate-300">Coaching KaTok:</strong> {visit.katokCoachingTopic}
                    </div>
                    {visit.issues.length > 0 && (
                      <div className="flex items-center gap-1.5 text-amber-400 font-medium mt-1">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>{visit.issues.length} temuan kendala fisik tercatat</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40 text-center">
              <h5 className="text-xs font-bold text-emerald-300 mb-1">Siap Berangkat ke Toko?</h5>
              <p className="text-[11px] text-slate-400 mb-3">
                Gunakan smartphone Anda untuk langsung input coaching dan foto temuan display.
              </p>
              <button
                onClick={onNewVisit}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950"
              >
                + Buka Form Kunjungan Toko
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
