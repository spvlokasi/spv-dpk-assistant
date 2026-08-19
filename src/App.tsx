import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import { AuthService } from './services/auth';
import { 
  Branch, 
  ActionPlanMilestone, 
  FieldVisit, 
  DailyPerformance, 
  BranchGraduation, 
  EscalationTicket 
} from './types';
import { UserAccount } from './types/auth';
import { LoginPage } from './components/auth/LoginPage';
import { ProfileSettingsModal } from './components/auth/ProfileSettingsModal';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { BranchList } from './components/branch/BranchList';
import { BranchDetailAndRCA } from './components/branch/BranchDetailAndRCA';
import { ActionPlanManager } from './components/actionplan/ActionPlanManager';
import { FieldVisitLog } from './components/fieldvisit/FieldVisitLog';
import { PerformanceTracker } from './components/performance/PerformanceTracker';
import { GraduationTracker } from './components/graduation/GraduationTracker';
import { ExecutiveReportGenerator } from './components/report/ExecutiveReportGenerator';
import { EscalationManager } from './components/escalation/EscalationManager';
import { SettingsAndData } from './components/settings/SettingsAndData';

export const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const session = AuthService.getSession();
    return session ? session.user : null;
  });
  const [showProfileModal, setShowProfileModal] = useState(false);

  // App Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isAddingVisit, setIsAddingVisit] = useState(false);

  // Main Data States
  const [branches, setBranches] = useState<Branch[]>([]);
  const [milestones, setMilestones] = useState<ActionPlanMilestone[]>([]);
  const [visits, setVisits] = useState<FieldVisit[]>([]);
  const [performance, setPerformance] = useState<DailyPerformance[]>([]);
  const [graduations, setGraduations] = useState<BranchGraduation[]>([]);
  const [escalations, setEscalations] = useState<EscalationTicket[]>([]);

  // Load all data from local storage
  const loadData = () => {
    setBranches(StorageService.getBranches());
    setMilestones(StorageService.getMilestones());
    setVisits(StorageService.getVisits());
    setPerformance(StorageService.getPerformance());
    setGraduations(StorageService.getGraduations());
    setEscalations(StorageService.getEscalations());
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
      // Auto-pull fresh data from cloud on startup
      StorageService.syncFromCloudOnStartup().then((updated) => {
        if (updated) {
          loadData();
        }
      });
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    loadData();
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari sistem?')) {
      AuthService.clearSession();
      setCurrentUser(null);
    }
  };

  const handleProfileUpdated = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
  };

  // Branch Handlers
  const handleSelectBranch = (branchId: string) => {
    setSelectedBranchId(branchId);
    setActiveTab('branch_detail');
  };

  const handleSaveBranch = async (branch: Branch) => {
    await StorageService.saveBranch(branch);
    loadData();
  };

  const handleDeleteBranch = async (branchId: string) => {
    await StorageService.deleteBranch(branchId);
    loadData();
    if (selectedBranchId === branchId) {
      setSelectedBranchId(null);
      setActiveTab('branches');
    }
  };

  // Milestone Handlers
  const handleSaveMilestone = async (milestone: ActionPlanMilestone) => {
    await StorageService.saveMilestone(milestone);
    loadData();
  };

  const handleDeleteMilestone = async (id: string) => {
    await StorageService.deleteMilestone(id);
    loadData();
  };

  // Visit Handlers
  const handleSaveVisit = async (visit: FieldVisit) => {
    await StorageService.saveVisit(visit);
    loadData();
  };

  const handleDeleteVisit = async (id: string) => {
    await StorageService.deleteVisit(id);
    loadData();
  };

  // Performance Handlers
  const handleAddPerformance = async (entry: DailyPerformance) => {
    await StorageService.addPerformanceEntry(entry);
    loadData();
  };

  const handleDeletePerformance = async (id: string) => {
    await StorageService.deletePerformanceEntry(id);
    loadData();
  };

  // Graduation Handlers
  const handleSaveGraduation = async (item: BranchGraduation) => {
    await StorageService.saveGraduation(item);
    loadData();
  };

  const handleUpdateBranchStatus = async (branchId: string, status: any) => {
    const branch = StorageService.getBranchById(branchId);
    if (branch) {
      branch.status = status;
      await StorageService.saveBranch(branch);
      loadData();
    }
  };

  // Escalation Handlers
  const handleSaveEscalation = async (ticket: EscalationTicket) => {
    await StorageService.saveEscalation(ticket);
    loadData();
  };

  const handleDeleteEscalation = async (id: string) => {
    await StorageService.deleteEscalation(id);
    loadData();
  };

  // If not logged in, render Login Screen
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Counts for Badges
  const openIssuesCount = visits.flatMap(v => v.issues).filter(i => !i.resolved).length;
  const pendingEscalationsCount = escalations.filter(e => e.status === 'diajukan' || e.status === 'ditinjau').length;

  const currentSelectedBranch = selectedBranchId ? branches.find(b => b.id === selectedBranchId) : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Clean & Minimalist Navbar Header */}
      <Navbar
        currentUser={currentUser}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
        {/* Desktop Sidebar with Escalation Pending Notification Badge & Settings at Bottom */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setSelectedBranchId(null);
            setActiveTab(tab);
          }}
          branchCount={branches.length}
          openIssuesCount={openIssuesCount}
          pendingEscalationCount={pendingEscalationsCount}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              branches={branches}
              visits={visits}
              milestones={milestones}
              performance={performance}
              escalations={escalations}
              onSelectBranch={handleSelectBranch}
              setActiveTab={setActiveTab}
              onNewVisit={() => {
                setIsAddingVisit(true);
                setActiveTab('fieldvisit');
              }}
              onNewBranch={() => {
                setIsAddingBranch(true);
                setActiveTab('branches');
              }}
            />
          )}

          {activeTab === 'branches' && (
            <BranchList
              branches={branches}
              onSelectBranch={handleSelectBranch}
              onSaveBranch={handleSaveBranch}
              onDeleteBranch={handleDeleteBranch}
              isAddingNew={isAddingBranch}
              onCloseNewModal={() => setIsAddingBranch(false)}
            />
          )}

          {activeTab === 'branch_detail' && currentSelectedBranch && (
            <BranchDetailAndRCA
              branch={currentSelectedBranch}
              onBack={() => setActiveTab('branches')}
              onSaveBranch={handleSaveBranch}
              onNavigateToTab={(tab) => {
                setActiveTab(tab);
              }}
            />
          )}

          {activeTab === 'actionplan' && (
            <ActionPlanManager
              branches={branches}
              milestones={milestones}
              selectedBranchId={selectedBranchId || undefined}
              onSaveMilestone={handleSaveMilestone}
              onDeleteMilestone={handleDeleteMilestone}
            />
          )}

          {activeTab === 'fieldvisit' && (
            <FieldVisitLog
              branches={branches}
              visits={visits}
              selectedBranchId={selectedBranchId || undefined}
              onSaveVisit={handleSaveVisit}
              onDeleteVisit={handleDeleteVisit}
              isOpenNewModal={isAddingVisit}
              onCloseNewModal={() => setIsAddingVisit(false)}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceTracker
              branches={branches}
              performance={performance}
              selectedBranchId={selectedBranchId || undefined}
              onAddPerformance={handleAddPerformance}
              onDeletePerformance={handleDeletePerformance}
            />
          )}

          {activeTab === 'graduation' && (
            <GraduationTracker
              branches={branches}
              graduations={graduations}
              onSaveGraduation={handleSaveGraduation}
              onUpdateBranchStatus={handleUpdateBranchStatus}
            />
          )}

          {activeTab === 'reports' && (
            <ExecutiveReportGenerator
              branches={branches}
              visits={visits}
              milestones={milestones}
              performance={performance}
              graduations={graduations}
              escalations={escalations}
            />
          )}

          {activeTab === 'escalations' && (
            <EscalationManager
              branches={branches}
              escalations={escalations}
              onSaveEscalation={handleSaveEscalation}
              onDeleteEscalation={handleDeleteEscalation}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsAndData
              currentUser={currentUser}
              onDataChange={loadData}
              onOpenProfileModal={() => setShowProfileModal(true)}
            />
          )}
        </main>
      </div>

      {/* Profile & Security Modal */}
      {showProfileModal && (
        <ProfileSettingsModal
          currentUser={currentUser}
          onClose={() => setShowProfileModal(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
export default App;
