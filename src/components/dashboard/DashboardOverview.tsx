import React from 'react';
import { Store } from 'lucide-react';
import { Branch, FieldVisit, ActionPlanMilestone, DailyPerformance, EscalationTicket } from '../../types';
import { DashboardKpiGrid } from './DashboardKpiGrid';
import { DashboardBranchCard } from './DashboardBranchCard';

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
  return (
    <div className="space-y-6">
      {/* 4 KPI Stats Grid */}
      <DashboardKpiGrid branches={branches} visits={visits} />

      {/* Main Full-Width: Branch Turnaround Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            Status Cabang
          </h3>
          <span className="text-xs text-slate-400">Klik toko untuk detail</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((branch) => (
            <DashboardBranchCard
              key={branch.id}
              branch={branch}
              performance={performance}
              milestones={milestones}
              onSelect={() => onSelectBranch(branch.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
