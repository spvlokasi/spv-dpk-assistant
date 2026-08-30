import React, { useState } from 'react';
import { User, Lock, X } from 'lucide-react';
import { UserAccount } from '../../types/auth';
import { ProfileInfoTab } from './ProfileInfoTab';
import { ProfileSecurityTab } from './ProfileSecurityTab';

interface ProfileSettingsModalProps {
  currentUser: UserAccount;
  onClose: () => void;
  onProfileUpdated: (updatedUser: UserAccount) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  currentUser,
  onClose,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const isKtb = Boolean(
    currentUser?.username.toLowerCase().startsWith('ktb.') ||
    currentUser?.roleTitle?.toLowerCase().includes('kepala toko') ||
    currentUser?.roleTitle?.toLowerCase().includes('ktb')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-base font-bold text-white">Pengaturan Akun & Profil</h3>
          <p className="text-xs text-slate-400">Kelola identitas penugasan dan kredensial login</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isKtb ? 'Profil KTB' : 'Profil SPV'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Keamanan & Password</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' ? (
          <ProfileInfoTab currentUser={currentUser} onProfileUpdated={onProfileUpdated} />
        ) : (
          <ProfileSecurityTab currentUser={currentUser} onProfileUpdated={onProfileUpdated} />
        )}
      </div>
    </div>
  );
};
