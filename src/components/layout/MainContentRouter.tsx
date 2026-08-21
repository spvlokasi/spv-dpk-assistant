import React from 'react';
import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, BranchGraduation, EscalationTicket } from '../../types';
import { UserAccount } from '../../types/auth';
import { DashboardOverview } from '../dashboard/DashboardOverview';
import { BranchList } from '../branch/BranchList';
import { BranchDetailAndRCA } from '../branch/BranchDetailAndRCA';
import { ActionPlanManager } from '../actionplan/ActionPlanManager';
import { FieldVisitLog } from '../fieldvisit/FieldVisitLog';
import { PerformanceTracker } from '../performance/PerformanceTracker';
import { GraduationTracker } from '../graduation/GraduationTracker';
import { ExecutiveReportGenerator } from '../report/ExecutiveReportGenerator';
import { EscalationManager } from '../escalation/EscalationManager';
import { SettingsAndData } from '../settings/SettingsAndData';

interface MainContentRouterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedBranchId: string | null;
  setSelectedBranchId: (id: string | null) => void;
  isAddingBranch: boolean;
  setIsAddingBranch: (val: boolean) => void;
  isAddingVisit: boolean;
  setIsAddingVisit: (val: boolean) => void;
  currentUser: UserAccount;
  data: {
    branches: Branch[];
    milestones: ActionPlanMilestone[];
    visits: FieldVisit[];
    performance: DailyPerformance[];
    graduations: BranchGraduation[];
    escalations: EscalationTicket[];
  };
  handlers: any;
}

export const MainContentRouter: React.FC<MainContentRouterProps> = ({
  activeTab,
  setActiveTab,
  selectedBranchId,
  setSelectedBranchId,
  isAddingBranch,
  setIsAddingBranch,
  isAddingVisit,
  setIsAddingVisit,
  currentUser,
  data,
  handlers
}) => {
  const currentSelectedBranch = selectedBranchId ? data.branches.find((b) => b.id === selectedBranchId) : null;
  const handleSelectBranch = (branchId: string) => {
    setSelectedBranchId(branchId);
    setActiveTab('branch_detail');
  };

  switch (activeTab) {
    case 'dashboard':
      return <DashboardOverview branches={data.branches} visits={data.visits} milestones={data.milestones} performance={data.performance} escalations={data.escalations} onSelectBranch={handleSelectBranch} setActiveTab={setActiveTab} onNewVisit={() => { setIsAddingVisit(true); setActiveTab('fieldvisit'); }} onNewBranch={() => { setIsAddingBranch(true); setActiveTab('branches'); }} />;
    case 'branches':
      return <BranchList branches={data.branches} onSelectBranch={handleSelectBranch} onSaveBranch={handlers.handleSaveBranch} onDeleteBranch={async (id) => { await handlers.handleDeleteBranch(id); if (selectedBranchId === id) setSelectedBranchId(null); }} isAddingNew={isAddingBranch} onCloseNewModal={() => setIsAddingBranch(false)} />;
    case 'branch_detail':
      return currentSelectedBranch ? <BranchDetailAndRCA branch={currentSelectedBranch} onBack={() => setActiveTab('branches')} onSaveBranch={handlers.handleSaveBranch} onNavigateToTab={setActiveTab} /> : null;
    case 'actionplan':
      return <ActionPlanManager branches={data.branches} milestones={data.milestones} performance={data.performance} selectedBranchId={selectedBranchId || undefined} onSaveMilestone={handlers.handleSaveMilestone} onDeleteMilestone={handlers.handleDeleteMilestone} />;
    case 'fieldvisit':
      return <FieldVisitLog branches={data.branches} visits={data.visits} selectedBranchId={selectedBranchId || undefined} onSaveVisit={handlers.handleSaveVisit} onDeleteVisit={handlers.handleDeleteVisit} isOpenNewModal={isAddingVisit} onCloseNewModal={() => setIsAddingVisit(false)} />;
    case 'performance':
      return <PerformanceTracker branches={data.branches} performance={data.performance} selectedBranchId={selectedBranchId || undefined} onAddPerformance={handlers.handleAddPerformance} onDeletePerformance={handlers.handleDeletePerformance} />;
    case 'graduation':
      return <GraduationTracker branches={data.branches} graduations={data.graduations} onSaveGraduation={handlers.handleSaveGraduation} onUpdateBranchStatus={handlers.handleUpdateBranchStatus} />;
    case 'reports':
      return <ExecutiveReportGenerator branches={data.branches} visits={data.visits} milestones={data.milestones} performance={data.performance} graduations={data.graduations} escalations={data.escalations} currentUser={currentUser} />;
    case 'escalations':
      return <EscalationManager branches={data.branches} escalations={data.escalations} onSaveEscalation={handlers.handleSaveEscalation} onDeleteEscalation={handlers.handleDeleteEscalation} />;
    case 'settings':
      return <SettingsAndData currentUser={currentUser} onDataChange={handlers.loadData} onOpenProfileModal={handlers.onOpenProfileModal} />;
    default:
      return null;
  }
};
