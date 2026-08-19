import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Key, 
  ShieldCheck, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { AuthService } from '../../services/auth';
import { UserAccount } from '../../types/auth';

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

  // Profile Form State
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle);
  const [department, setDepartment] = useState(currentUser.department);
  const [businessManager, setBusinessManager] = useState(currentUser.businessManager);

  // Security Form State
  const [username, setUsername] = useState(currentUser.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    const res = await AuthService.updateAccount({
      fullName,
      roleTitle,
      department,
      businessManager
    });

    setIsLoading(false);
    if (res.success && res.user) {
      setStatusMsg({ type: 'success', text: 'Data profil identitas berhasil diperbarui!' });
      onProfileUpdated(res.user);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    // Verify current password
    if (currentPassword !== currentUser.password) {
      setIsLoading(false);
      setStatusMsg({ type: 'error', text: 'Password lama Anda tidak sesuai!' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setIsLoading(false);
      setStatusMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok!' });
      return;
    }

    const payload: Partial<UserAccount> = {
      username: username.trim()
    };
    if (newPassword) {
      payload.password = newPassword.trim();
    }

    const res = await AuthService.updateAccount(payload);
    setIsLoading(false);

    if (res.success && res.user) {
      setStatusMsg({ type: 'success', text: 'Username / Password baru berhasil disimpan!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onProfileUpdated(res.user);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pengaturan Akun & Keamanan</h3>
              <p className="text-[11px] text-slate-400">Kelola identitas, ganti username & kata sandi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-850 p-1 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setStatusMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Identitas Profil
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('security');
              setStatusMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === 'security'
                ? 'bg-slate-800 text-emerald-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Ganti User & Password
          </button>
        </div>

        {/* Status Notification */}
        {statusMsg && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 mb-4 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/40 border-rose-800 text-rose-300'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Tab 1: Identitas Profil */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Nama Lengkap Supervisor</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Jabatan Resmi</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Departemen</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">Nama Manajer Bisnis (Atasan)</label>
              <input
                type="text"
                required
                value={businessManager}
                onChange={(e) => setBusinessManager(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Username Login</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-rose-300 mb-1">Kata Sandi Saat Ini (Lama) *</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Masukkan password lama untuk konfirmasi..."
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <div>
                <label className="block font-medium text-emerald-400 mb-1">Kata Sandi Baru (Opsional)</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Kosongkan jika hanya ingin ubah username..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-emerald-400 mb-1">Ulangi Kata Sandi Baru</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Ketik ulang password baru..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showPasswordToggle"
                  checked={showPass}
                  onChange={(e) => setShowPass(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="showPasswordToggle" className="text-[11px] text-slate-400 cursor-pointer">
                  Tampilkan Kata Sandi
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-950 flex items-center gap-1.5"
              >
                <Key className="w-4 h-4" />
                {isLoading ? 'Memperbarui...' : 'Simpan Akun Baru'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
