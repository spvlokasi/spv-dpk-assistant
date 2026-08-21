import React from 'react';
import { ArrowLeft, Target, Calendar, TrendingUp, CheckCircle2, User, Shield, MapPin } from 'lucide-react';
import { Branch } from '../../../types';
import { StatusBadge } from '../../common/Badge';

interface BranchHeaderProfileProps {
  data: Branch;
  isSaved: boolean;
  onBack: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const BranchHeaderProfile: React.FC<BranchHeaderProfileProps> = ({
  data,
  isSaved,
  onBack,
  onNavigateToTab
}) => {
  const getBranchDisplayNames = (fullName: string) => {
    const prefixMatch = fullName.match(/^(TokoBASMALAH|Cabang Basmalah|Basmalah)\s+(.+)$/i);
    if (prefixMatch) {
      return { prefix: prefixMatch[1], branchName: prefixMatch[2] };
    }
    return { prefix: '', branchName: fullName };
  };

  const { prefix, branchName } = getBranchDisplayNames(data.name);

  return (
    <div className="space-y-3">
      {/* Row 1: Title, Badges, and Navigation Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap overflow-x-auto py-0.5 max-w-full">
          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 flex-shrink-0">
            {data.code}
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight whitespace-nowrap flex-shrink-0">
            {prefix && <span className="hidden sm:inline">{prefix} </span>}
            {branchName}
          </h2>
          <StatusBadge status={data.status} />
          {isSaved && (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-semibold animate-pulse ml-1 flex-shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan!
            </span>
          )}
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex items-center gap-1.5 flex-nowrap flex-shrink-0">
          <button
            onClick={onBack}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors whitespace-nowrap active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
            Kembali
          </button>
          <button
            onClick={() => onNavigateToTab('actionplan')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Target className="w-3.5 h-3.5 text-blue-400" />
            Aksi
          </button>
          <button
            onClick={() => onNavigateToTab('fieldvisit')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Kunjungan
          </button>
          <button
            onClick={() => onNavigateToTab('performance')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors whitespace-nowrap"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Monitor
          </button>
        </div>
      </div>

      {/* Row 2: Subtext Info (KTB, SPV Area, Address - 1 Single Horizontal Row) */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 flex-nowrap overflow-hidden">
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="text-slate-500">KTB:</span>
          <strong className="text-slate-200">{data.kepalaToko || '-'}</strong>
        </span>
        <span className="text-slate-700 flex-shrink-0">•</span>
        <span className="flex items-center gap-1.5 flex-shrink-0">
          <Shield className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="text-slate-500">SPV Area:</span>
          <strong className="text-slate-200">{data.spvArea || '-'}</strong>
        </span>
        <span className="text-slate-700 flex-shrink-0">•</span>
        <span className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden" title={data.address || 'Alamat cabang'}>
          <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="truncate text-slate-300">{data.address || 'Alamat cabang belum diatur'}</span>
        </span>
      </div>
    </div>
  );
};
