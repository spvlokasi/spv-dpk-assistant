import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../../services/auth';
import { UserAccount } from '../../types/auth';
import { useToast } from '../../context/ToastContext';

interface ProfileInfoTabProps {
  currentUser: UserAccount;
  onProfileUpdated: (user: UserAccount) => void;
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  currentUser,
  onProfileUpdated
}) => {
  const { showToast } = useToast();
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [roleTitle, setRoleTitle] = useState(currentUser.roleTitle);
  const [department, setDepartment] = useState(currentUser.department);
  const [businessManager, setBusinessManager] = useState(currentUser.businessManager);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await AuthService.updateAccount({
      fullName,
      roleTitle,
      department,
      businessManager
    });

    setIsLoading(false);
    if (res.success && res.user) {
      showToast('Data profil identitas SPV berhasil diperbarui!', 'success');
      onProfileUpdated(res.user);
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
      <div>
        <label className="block text-slate-400 mb-1 font-semibold">Nama Lengkap Supervisor:</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Jabatan / Role:</label>
          <input
            type="text"
            value={roleTitle}
            onChange={(e) => setRoleTitle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Divisi / Penugasan:</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-400 mb-1 font-semibold">Manajer Bisnis Pembina:</label>
        <input
          type="text"
          value={businessManager}
          onChange={(e) => setBusinessManager(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
        />
      </div>

      <div className="pt-2 border-t border-slate-800 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Menyimpan...' : 'Simpan Profil'}</span>
        </button>
      </div>
    </form>
  );
};
