import React from 'react';
import { Store, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Branch } from '../../../types';

interface PublicCatalogHeaderProps {
  branch: Branch;
  onBackToApp?: () => void;
}

export const PublicCatalogHeader: React.FC<PublicCatalogHeaderProps> = ({ branch, onBackToApp }) => {
  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="TokoBasmalah" className="h-10 w-auto object-contain bg-white p-1 rounded-xl shadow" />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black text-white leading-tight">{branch.name}</h1>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-800 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" />Resmi</span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3 text-emerald-400" /><span>{branch.address || branch.city || 'Jawa Timur'}</span></p>
          </div>
        </div>

        {onBackToApp && (
          <button onClick={onBackToApp} className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700">
            ← Menu SPV
          </button>
        )}
      </div>
    </header>
  );
};
