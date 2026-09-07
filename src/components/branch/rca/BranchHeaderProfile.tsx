import React from 'react';
import { CheckCircle2, User, Shield, MapPin, Save, Loader2 } from 'lucide-react';
import { Branch } from '../../../types';
import { StatusBadge } from '../../common/Badge';

interface BranchHeaderProfileProps {
  data: Branch;
  isSaved: boolean;
  isSaving?: boolean;
  isDirty?: boolean;
  onSave?: () => void;
  startDate: string;
  endDate: string;
  onChangeStartDate: (val: string) => void;
  onChangeEndDate: (val: string) => void;
  onResetDates: () => void;
}

export const BranchHeaderProfile: React.FC<BranchHeaderProfileProps> = ({
  data, isSaved, isSaving, isDirty, onSave, startDate, endDate, onChangeStartDate, onChangeEndDate, onResetDates
}) => {
  const prefixMatch = data.name.match(/^(TokoBASMALAH|Cabang Basmalah|Basmalah)\s+(.+)$/i);
  const prefix = prefixMatch ? prefixMatch[1] : '';
  const branchName = prefixMatch ? prefixMatch[2] : data.name;

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap overflow-x-auto py-0.5 max-w-full">
          <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 flex-shrink-0">{data.code}</span>
          <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight whitespace-nowrap flex-shrink-0">
            {prefix && <span className="hidden sm:inline">{prefix} </span>}{branchName}
          </h2>
          <StatusBadge status={data.status} />
          {isSaved && !isSaving && (
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-semibold animate-pulse ml-1 flex-shrink-0 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan di Database!
            </span>
          )}
          {isDirty && !isSaving && (
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-medium ml-1 flex-shrink-0 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/30">
              Belum disimpan
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap text-xs flex-shrink-0">
          <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
            <input type="date" value={startDate || ''} onChange={(e) => onChangeStartDate(e.target.value)} className="bg-transparent text-emerald-400 font-semibold focus:outline-none text-xs cursor-pointer" />
          </div>
          <span className="text-slate-500 font-bold text-xs">s/d</span>
          <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 shadow-sm">
            <input type="date" min={startDate || undefined} value={endDate || ''} onChange={(e) => onChangeEndDate(e.target.value)} className="bg-transparent text-emerald-400 font-semibold focus:outline-none text-xs cursor-pointer" />
          </div>
          {(startDate || endDate) && (<button type="button" onClick={onResetDates} className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-[11px] border border-slate-700" title="Reset Tanggal">✕</button>)}
          
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 whitespace-nowrap ml-1 ${
                isSaving
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                  : isDirty
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950 border border-emerald-400 ring-2 ring-emerald-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Menyimpan ke Cloud...</span>
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Diagnosa</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 flex-nowrap overflow-hidden">
        <span className="flex items-center gap-1.5 flex-shrink-0"><User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /><span className="text-slate-500">KTB:</span><strong className="text-slate-200">{data.kepalaToko || '-'}</strong></span>
        <span className="text-slate-700 flex-shrink-0">•</span>
        <span className="flex items-center gap-1.5 flex-shrink-0"><Shield className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /><span className="text-slate-500">SPV Area:</span><strong className="text-slate-200">{data.spvArea || '-'}</strong></span>
        <span className="text-slate-700 flex-shrink-0">•</span>
        <span className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden" title={data.address || 'Alamat cabang'}><MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" /><span className="truncate text-slate-300">{data.address || 'Alamat cabang belum diatur'}</span></span>
      </div>
    </div>
  );
};
