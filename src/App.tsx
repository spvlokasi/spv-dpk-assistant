import React, { useState } from 'react';
import { useAuthSession } from './hooks/useAuthSession';
import { useAppData } from './hooks/useAppData';
import { LoginPage } from './components/auth/LoginPage';
import { ProfileSettingsModal } from './components/auth/ProfileSettingsModal';
import { LogoutModal } from './components/auth/LogoutModal';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MainContentRouter } from './components/layout/MainContentRouter';

export const App: React.FC = () => {
  const auth = useAuthSession();
  const data = useAppData(Boolean(auth.currentUser));

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isAddingVisit, setIsAddingVisit] = useState(false);

  if (!auth.currentUser) {
    return <LoginPage onLoginSuccess={auth.handleLoginSuccess} />;
  }

  const openIssuesCount = data.visits.flatMap((v) => v.issues).filter((i) => !i.resolved).length;
  const pendingEscalationsCount = data.escalations.filter((e) => e.status === 'diajukan' || e.status === 'ditinjau').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar currentUser={auth.currentUser} onOpenProfileModal={() => auth.setShowProfileModal(true)} onLogout={() => auth.setShowLogoutConfirm(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setSelectedBranchId(null); setActiveTab(tab); }} branchCount={data.branches.length} openIssuesCount={openIssuesCount} pendingEscalationCount={pendingEscalationsCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <MainContentRouter activeTab={activeTab} setActiveTab={setActiveTab} selectedBranchId={selectedBranchId} setSelectedBranchId={setSelectedBranchId} isAddingBranch={isAddingBranch} setIsAddingBranch={setIsAddingBranch} isAddingVisit={isAddingVisit} setIsAddingVisit={setIsAddingVisit} currentUser={auth.currentUser} data={data} handlers={{ ...data, onOpenProfileModal: () => auth.setShowProfileModal(true) }} />
        </main>
      </div>

      {auth.showProfileModal && <ProfileSettingsModal currentUser={auth.currentUser} onClose={() => auth.setShowProfileModal(false)} onProfileUpdated={auth.handleProfileUpdated} />}
      {auth.showLogoutConfirm && <LogoutModal onClose={() => auth.setShowLogoutConfirm(false)} onConfirmLogout={auth.handleLogout} />}

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
