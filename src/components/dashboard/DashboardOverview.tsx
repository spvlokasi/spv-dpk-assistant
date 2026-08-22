import React from 'react';
import { Store } from 'lucide-react';
import { Branch, FieldVisit, ActionPlanMilestone, DailyPerformance, EscalationTicket } from '../../types';
import { sortBranchesByStatus } from '../../utils/formatters';
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
  const sortedBranches = sortBranchesByStatus(branches);

  return (
    <div className="space-y-6">
      <DashboardKpiGrid branches={branches} visits={visits} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Store className="w-5 h-5 text-emerald-400" />
            Status Cabang (Prioritas Penanganan)
          </h3>
          <span className="text-xs text-slate-400">Diurutkan berdasarkan urgensi status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedBranches.map((branch) => (
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
