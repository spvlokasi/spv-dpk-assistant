import React from 'react';
import { Download, CheckCircle2, Smartphone } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export const PwaInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, installPwa } = usePwaInstall();

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" /><span>Terpasang di Perangkat</span>
      </div>
    );
  }

  if (!isInstallable) return null;

  return (
    <button
      type="button"
      onClick={installPwa}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-md shadow-emerald-950/50 active:scale-95 transition-all"
      title="Install aplikasi SPV DPK ke Layar Utama HP / Desktop"
    >
      <Smartphone className="w-3.5 h-3.5" />
      <span>Install App</span>
      <Download className="w-3 h-3 ml-0.5 opacity-80" />
    </button>
  );
};
