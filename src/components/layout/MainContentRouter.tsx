import React, { useState } from 'react';
import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, EscalationTicket } from '../../types';
import { UserAccount } from '../../types/auth';
import { DashboardOverview } from '../dashboard/DashboardOverview';
import { BranchList } from '../branch/BranchList';
import { BranchDetailAndRCA } from '../branch/BranchDetailAndRCA';
import { BranchMapManager } from '../map/BranchMapManager';
import { CatalogAdminManager } from '../catalog/admin/CatalogAdminManager';
import { PublicStoreView } from '../catalog/public/PublicStoreView';
import { ActionPlanManager } from '../actionplan/ActionPlanManager';
import { FieldVisitLog } from '../fieldvisit/FieldVisitLog';
import { PerformanceTracker } from '../performance/PerformanceTracker';
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
    graduations: any[];
    escalations: EscalationTicket[];
  };
  handlers: any;
}

export const MainContentRouter: React.FC<MainContentRouterProps> = ({
  activeTab, setActiveTab, selectedBranchId, setSelectedBranchId, isAddingBranch,
  setIsAddingBranch, isAddingVisit, setIsAddingVisit, currentUser, data, handlers
}) => {
  const isKtb = currentUser?.username.startsWith('ktb.') || currentUser?.roleTitle === 'Kepala Toko';
  const ktbCode = currentUser?.username.replace('ktb.', '').toUpperCase();
  const ktbBranch = isKtb ? (data.branches.find((b) => b.code.toUpperCase() === ktbCode) || data.branches.find((b) => b.id === selectedBranchId) || data.branches[0]) : null;
  const filteredBranches = isKtb && ktbBranch ? [ktbBranch] : data.branches;

  const [publicBranchCode, setPublicBranchCode] = useState<string | null>(null);
  const currentSelectedBranch = selectedBranchId ? data.branches.find((b) => b.id === selectedBranchId) : null;
  const handleSelectBranch = (branchId: string) => { setSelectedBranchId(branchId); setActiveTab('branch_detail'); };
  const targetPublicBranch = data.branches.find((b) => b.code === publicBranchCode) || data.branches[0];

  if (activeTab === 'public_catalog' && targetPublicBranch) {
    return <PublicStoreView branch={targetPublicBranch} onBackToApp={() => setActiveTab('catalog')} />;
  }

  switch (activeTab) {
    case 'dashboard':
      return <DashboardOverview branches={filteredBranches} visits={data.visits} milestones={data.milestones} performance={data.performance} escalations={data.escalations} onSelectBranch={handleSelectBranch} setActiveTab={setActiveTab} onNewVisit={() => { setIsAddingVisit(true); setActiveTab('fieldvisit'); }} onNewBranch={() => { setIsAddingBranch(true); setActiveTab('branches'); }} />;
    case 'branches':
      return <BranchList branches={filteredBranches} onSelectBranch={handleSelectBranch} onSaveBranch={handlers.handleSaveBranch} onDeleteBranch={async (id) => { await handlers.handleDeleteBranch(id); if (selectedBranchId === id) setSelectedBranchId(null); }} isAddingNew={isAddingBranch} onCloseNewModal={() => setIsAddingBranch(false)} />;
    case 'branch_detail':
      return currentSelectedBranch ? <BranchDetailAndRCA branch={currentSelectedBranch} onBack={() => setActiveTab('branches')} onSaveBranch={handlers.handleSaveBranch} onNavigateToTab={setActiveTab} /> : null;
    case 'map':
      return <BranchMapManager branches={filteredBranches} onNavigateToDetail={handleSelectBranch} />;
    case 'catalog':
      return <CatalogAdminManager branches={filteredBranches} selectedBranchId={ktbBranch?.id || selectedBranchId} currentUser={currentUser} onRefreshBranch={handlers.loadData} onOpenPublicCatalog={(code) => { setPublicBranchCode(code); setActiveTab('public_catalog'); }} />;
    case 'actionplan':
      return <ActionPlanManager branches={filteredBranches} milestones={data.milestones} performance={data.performance} selectedBranchId={ktbBranch?.id || selectedBranchId || undefined} onSaveMilestone={handlers.handleSaveMilestone} onDeleteMilestone={handlers.handleDeleteMilestone} />;
    case 'fieldvisit':
      return <FieldVisitLog branches={filteredBranches} visits={data.visits} selectedBranchId={ktbBranch?.id || selectedBranchId || undefined} onSaveVisit={handlers.handleSaveVisit} onDeleteVisit={handlers.handleDeleteVisit} isOpenNewModal={isAddingVisit} onCloseNewModal={() => setIsAddingVisit(false)} currentUser={currentUser} />;
    case 'performance':
      return <PerformanceTracker branches={filteredBranches} performance={data.performance} selectedBranchId={ktbBranch?.id || selectedBranchId || undefined} onAddPerformance={handlers.handleAddPerformance} onBulkAddPerformance={handlers.handleBulkAddPerformance} onDeletePerformance={handlers.handleDeletePerformance} />;
    case 'reports':
      return <ExecutiveReportGenerator branches={filteredBranches} visits={data.visits} milestones={data.milestones} performance={data.performance} graduations={data.graduations} escalations={data.escalations} currentUser={currentUser} />;
    case 'escalations':
      return <EscalationManager branches={filteredBranches} escalations={data.escalations} onSaveEscalation={handlers.handleSaveEscalation} onDeleteEscalation={handlers.handleDeleteEscalation} />;
    case 'settings':
      return <SettingsAndData currentUser={currentUser} onDataChange={handlers.loadData} onOpenProfileModal={handlers.onOpenProfileModal} />;
    default:
      return null;
  }
};
