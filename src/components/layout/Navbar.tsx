import React from 'react';
import { UserCheck, LogOut } from 'lucide-react';
import { UserAccount } from '../../types/auth';

interface NavbarProps {
  currentUser: UserAccount;
  onOpenProfileModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onOpenProfileModal, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo Basmalah" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-none">SPV DPK</h1>
              <span className="text-[10px] font-semibold text-emerald-400 block tracking-wider uppercase mt-0.5">Sistem Digital Toko</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button onClick={onOpenProfileModal} className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition-colors text-left group" title="Klik untuk Edit Profil">
              <div className="w-8 h-8 rounded-full bg-emerald-700/40 border border-emerald-500/40 flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                <UserCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1">{currentUser.username}</div>
                <div className="text-[10px] text-emerald-400 line-clamp-1">{currentUser.roleTitle}</div>
              </div>
            </button>

            <button onClick={onLogout} className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors" title="Keluar (Logout)">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
