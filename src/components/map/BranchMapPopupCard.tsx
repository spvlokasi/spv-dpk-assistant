import React from 'react';
import { ExternalLink, Navigation, User, Shield, MapPin, Target } from 'lucide-react';
import { Branch } from '../../types';
import { StatusBadge } from '../common/Badge';
import { formatRupiah } from '../../utils/formatters';
import { getBranchCoordinates } from '../../services/map';

interface BranchMapPopupCardProps {
  branch: Branch;
  onNavigateToDetail?: (branchId: string) => void;
  onAddToRoute?: (branchId: string) => void;
  isInRoute?: boolean;
}

export const BranchMapPopupCard: React.FC<BranchMapPopupCardProps> = ({
  branch, onNavigateToDetail, onAddToRoute, isInRoute
}) => {
  const coords = getBranchCoordinates(branch);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl space-y-3.5 animate-in fade-in">
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400">{branch.code}</span>
          <StatusBadge status={branch.status} />
        </div>
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-400" />{coords.city}</span>
      </div>

      <div>
        <h4 className="text-base font-bold text-white tracking-tight">{branch.name}</h4>
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-500" /> KTB: <strong className="text-slate-200">{branch.kepalaToko || '-'}</strong></span>
          <span className="text-slate-700">•</span>
          <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-slate-500" /> SPV: <strong className="text-slate-200">{branch.spvArea || '-'}</strong></span>
        </div>
      </div>

      <div className="bg-slate-850/70 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1"><Target className="w-3.5 h-3.5 text-blue-400" />Target Laba Harian:</span>
        <strong className="text-emerald-400 font-mono font-bold">{formatRupiah(branch.targetSalesPerDay)}</strong>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors">
          <Navigation className="w-3.5 h-3.5 text-emerald-400" /><span>Google Maps</span>
        </a>
        {onAddToRoute && (
          <button type="button" onClick={() => onAddToRoute(branch.id)} className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${isInRoute ? 'bg-rose-950/60 border border-rose-800 text-rose-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
            {isInRoute ? 'Hapus Rute' : '+ Ke Rute'}
          </button>
        )}
      </div>
    </div>
  );
};
