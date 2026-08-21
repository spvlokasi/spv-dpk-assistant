import React, { useState } from 'react';
import { Eye, EyeOff, Save } from 'lucide-react';
import { AuthService } from '../../services/auth';
import { UserAccount } from '../../types/auth';
import { useToast } from '../../context/ToastContext';

interface ProfileSecurityTabProps {
  currentUser: UserAccount;
  onProfileUpdated: (user: UserAccount) => void;
}

export const ProfileSecurityTab: React.FC<ProfileSecurityTabProps> = ({
  currentUser,
  onProfileUpdated
}) => {
  const { showToast } = useToast();
  const [username, setUsername] = useState(currentUser.username);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      showToast('Konfirmasi kata sandi baru tidak cocok!', 'error');
      return;
    }

    setIsLoading(true);
    const res = await AuthService.updateAccount({
      username: username !== currentUser.username ? username : undefined,
      password: newPassword || undefined
    });
    setIsLoading(false);

    if (res.success && res.user) {
      showToast('Kredensial keamanan akun berhasil diperbarui!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onProfileUpdated(res.user);
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      <div>
        <label className="block text-slate-400 mb-1 font-semibold">Username Login:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono" />
      </div>

      <div className="pt-2 border-t border-slate-800 space-y-2.5">
        <span className="text-slate-400 font-semibold block">Ganti Kata Sandi (Opsional):</span>
        <div className="grid grid-cols-2 gap-2">
          <input type={showPass ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Kata sandi baru" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
          <input type={showPass ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Ulangi kata sandi" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
        </div>
        <button type="button" onClick={() => setShowPass(!showPass)} className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1">
          {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showPass ? 'Sembunyikan' : 'Tampilkan'} Kata Sandi</span>
        </button>
      </div>

      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-blue-950 active:scale-95">
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Menyimpan...' : 'Simpan Keamanan'}</span>
        </button>
      </div>
    </form>
  );
};
