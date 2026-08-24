import React, { useState, useEffect } from 'react';
import { useAuthSession } from './hooks/useAuthSession';
import { useAppData } from './hooks/useAppData';
import { LoginPage } from './components/auth/LoginPage';
import { ProfileSettingsModal } from './components/auth/ProfileSettingsModal';
import { LogoutModal } from './components/auth/LogoutModal';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MainContentRouter } from './components/layout/MainContentRouter';
import { PublicStoreView } from './components/catalog/public/PublicStoreView';

export const App: React.FC = () => {
  const auth = useAuthSession();
  const data = useAppData(true);
  const isKtb = Boolean(auth.currentUser?.username.startsWith('ktb.') || auth.currentUser?.roleTitle === 'Kepala Toko');

  const [activeTab, setActiveTab] = useState<string>(() => {
    const isKtbStored = auth.currentUser?.username.startsWith('ktb.') || auth.currentUser?.roleTitle === 'Kepala Toko';
    return isKtbStored ? 'catalog' : 'dashboard';
  });
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [isAddingVisit, setIsAddingVisit] = useState(false);

  useEffect(() => {
    if (isKtb && auth.currentUser) {
      const code = auth.currentUser.username.replace('ktb.', '').toUpperCase();
      const userBranch = data.branches.find((b) => b.code.toUpperCase() === code);
      if (userBranch) setSelectedBranchId(userBranch.id);
      setActiveTab((prev) => (prev === 'dashboard' || prev === 'branches' || prev === 'map' || prev === 'reports' || prev === 'settings' ? 'catalog' : prev));
    }
  }, [auth.currentUser?.username, data.branches.length, isKtb]);

  const params = new URLSearchParams(window.location.search);
  const publicCode = params.get('katalog') || params.get('promo');
  if (publicCode) {
    const publicBranch = data.branches.find((b) => b.code.toLowerCase() === publicCode.toLowerCase()) || data.branches[0];
    if (publicBranch) return <PublicStoreView branch={publicBranch} onBackToApp={() => { window.location.href = window.location.pathname; }} />;
  }

  if (!auth.currentUser) return <LoginPage onLoginSuccess={auth.handleLoginSuccess} />;

  const openIssuesCount = data.visits.flatMap((v) => v.issues).filter((i) => !i.resolved).length;
  const pendingEscalationsCount = data.escalations.filter((e) => e.status === 'diajukan' || e.status === 'ditinjau').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar currentUser={auth.currentUser} onOpenProfileModal={() => auth.setShowProfileModal(true)} onLogout={() => auth.setShowLogoutConfirm(true)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => setActiveTab(tab)} branchCount={data.branches.length} openIssuesCount={openIssuesCount} pendingEscalationCount={pendingEscalationsCount} currentUser={auth.currentUser} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <MainContentRouter activeTab={activeTab} setActiveTab={setActiveTab} selectedBranchId={selectedBranchId} setSelectedBranchId={setSelectedBranchId} isAddingBranch={isAddingBranch} setIsAddingBranch={setIsAddingBranch} isAddingVisit={isAddingVisit} setIsAddingVisit={setIsAddingVisit} currentUser={auth.currentUser} data={data} handlers={{ ...data, onOpenProfileModal: () => auth.setShowProfileModal(true) }} />
        </main>
      </div>
      {auth.showProfileModal && <ProfileSettingsModal currentUser={auth.currentUser} onClose={() => auth.setShowProfileModal(false)} onProfileUpdated={auth.handleProfileUpdated} />}
      {auth.showLogoutConfirm && <LogoutModal onClose={() => auth.setShowLogoutConfirm(false)} onConfirmLogout={auth.handleLogout} />}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} currentUser={auth.currentUser} />
    </div>
  );
};

export default App;
