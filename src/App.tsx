import React, { useState } from 'react';
import { useAuthSession } from './hooks/useAuthSession';
import { useAppData } from './hooks/useAppData';
import { LoginPage } from './components/auth/LoginPage';
import { ProfileSettingsModal } from './components/auth/ProfileSettingsModal';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { MainContentRouter } from './components/layout/MainContentRouter';
import { LogOut, AlertCircle, X } from 'lucide-react';

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

  const openIssuesCount = data.visits.flatMap(v => v.issues).filter(i => !i.resolved).length;
  const pendingEscalationsCount = data.escalations.filter(e => e.status === 'diajukan' || e.status === 'ditinjau').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentUser={auth.currentUser}
        onOpenProfileModal={() => auth.setShowProfileModal(true)}
        onLogout={() => auth.setShowLogoutConfirm(true)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setSelectedBranchId(null);
            setActiveTab(tab);
          }}
          branchCount={data.branches.length}
          openIssuesCount={openIssuesCount}
          pendingEscalationCount={pendingEscalationsCount}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          <MainContentRouter
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedBranchId={selectedBranchId}
            setSelectedBranchId={setSelectedBranchId}
            isAddingBranch={isAddingBranch}
            setIsAddingBranch={setIsAddingBranch}
            isAddingVisit={isAddingVisit}
            setIsAddingVisit={setIsAddingVisit}
            currentUser={auth.currentUser}
            data={data}
            handlers={{ ...data, onOpenProfileModal: () => auth.setShowProfileModal(true) }}
          />
        </main>
      </div>

      {/* Profile & Security Modal */}
      {auth.showProfileModal && (
        <ProfileSettingsModal
          currentUser={auth.currentUser}
          onClose={() => auth.setShowProfileModal(false)}
          onProfileUpdated={auth.handleProfileUpdated}
        />
      )}

      {/* In-App Logout Confirmation Modal */}
      {auth.showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 text-rose-400 font-bold text-sm">
                <div className="w-8 h-8 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-rose-400" />
                </div>
                <span>Konfirmasi Keluar</span>
              </div>
              <button
                onClick={() => auth.setShowLogoutConfirm(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sistem <strong>SPV DPK</strong>? Sesi login Anda akan diakhiri.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => auth.setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={auth.handleLogout}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/60 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
