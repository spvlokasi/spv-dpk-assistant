import React, { useState } from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { SupabaseService } from '../../services/supabase';
import { UserAccount } from '../../types/auth';
import { useToast } from '../../context/ToastContext';
import { SettingsSyncStatus } from './SettingsSyncStatus';
import { SettingsBackupRestore } from './SettingsBackupRestore';

interface SettingsAndDataProps {
  currentUser: UserAccount;
  onDataChange: () => void;
  onOpenProfileModal: () => void;
}

export const SettingsAndData: React.FC<SettingsAndDataProps> = ({
  currentUser,
  onDataChange,
  onOpenProfileModal
}) => {
  const { showToast } = useToast();
  const [isCloudConnected, setIsCloudConnected] = useState(SupabaseService.isConfigured());
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    const payload = {
      branches: StorageService.getBranches(),
      milestones: StorageService.getMilestones(),
      visits: StorageService.getVisits(),
      performance: StorageService.getPerformance(),
      graduations: StorageService.getGraduations(),
      escalations: StorageService.getEscalations()
    };
    const res = await SupabaseService.syncLocalToCloud(payload);
    setIsSyncing(false);
    showToast(res.message, res.success ? 'success' : 'error');
    onDataChange();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* User Profile Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 font-bold text-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{currentUser.fullName}</h3>
            <p className="text-xs text-slate-400 font-mono">@{currentUser.username} • {currentUser.roleTitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenProfileModal}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Pengaturan Akun & SPV</span>
        </button>
      </div>

      {/* Cloud Supabase Sync */}
      <SettingsSyncStatus
        isCloudConnected={isCloudConnected}
        onSync={handleSyncToCloud}
        isSyncing={isSyncing}
      />

      {/* Backup & Restore JSON */}
      <SettingsBackupRestore
        onDataChange={onDataChange}
      />
    </div>
  );
};
