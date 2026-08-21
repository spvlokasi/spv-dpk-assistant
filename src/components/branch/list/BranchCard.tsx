import React from 'react';
import { User, MapPin, Calendar, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Branch } from '../../../types';
import { StatusBadge } from '../../common/Badge';
import { formatRupiah, formatDateIndo } from '../../../utils/formatters';

interface BranchCardProps {
  branch: Branch;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const BranchCard: React.FC<BranchCardProps> = ({
  branch,
  onSelect,
  onEdit,
  onDelete
}) => {
  // Dynamic Root Cause issue detection from actual RCA audit data
  const hasDiagnosed = branch.rootCauses && branch.rootCauses.length > 0;
  const criticalFactors = hasDiagnosed ? branch.rootCauses.filter(f => f.score <= 2) : [];
  const moderateFactors = hasDiagnosed ? branch.rootCauses.filter(f => f.score === 3) : [];

  const issueKeywords = criticalFactors.length > 0
    ? criticalFactors.map(f => f.title.split('(')[0].replace(/^(Efisiensi|Penertiban|Kedisiplinan|Kemandirian|Ketersediaan)\s+/i, '').trim()).slice(0, 2).join(' & ')
    : moderateFactors.length > 0
    ? moderateFactors.map(f => f.title.split('(')[0].replace(/^(Efisiensi|Penertiban|Kedisiplinan|Kemandirian|Ketersediaan)\s+/i, '').trim()).slice(0, 2).join(' & ')
    : 'Kondisi Menuju Stabil';

  return (
    <div
      onClick={onSelect}
      className="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-5 rounded-2xl transition-all cursor-pointer hover:shadow-2xl flex flex-col justify-between"
    >
      {/* Background Store Photo */}
      {branch.imageUrl && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none rounded-2xl"
            style={{ backgroundImage: `url(${branch.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 pointer-events-none rounded-2xl" />
        </>
      )}

      <div className="relative z-10">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-1.5 mb-3">
          <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/80 text-[11px] font-mono font-bold text-emerald-400 shadow-sm">
            {branch.code}
          </span>
          <StatusBadge status={branch.status} />
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-1 drop-shadow-sm">
          {branch.name}
        </h3>

        <div className="text-xs text-slate-300 space-y-1 mb-4">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>KTB: <strong className="text-white font-semibold">{branch.kepalaToko}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="line-clamp-1 text-slate-400">{branch.address || 'Alamat cabang'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300">Masuk DPK: <strong className="text-white">{formatDateIndo(branch.entryDate)}</strong></span>
          </div>
        </div>

        {/* Dynamic Root Cause Diagnosis Box */}
        {hasDiagnosed ? (
          <div className="p-3 rounded-xl bg-slate-850/85 border border-slate-800/90 backdrop-blur-sm space-y-1.5 mb-4">
            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
              <span className="truncate">Akar Masalah: {issueKeywords}</span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
              {branch.diagnosisSummary || 'Faktor telah dinilai, siap susun strategi perbaikan.'}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-850/50 border border-dashed border-slate-800 backdrop-blur-sm space-y-1 mb-4 text-center">
            <div className="text-[11px] font-semibold text-slate-400">Belum ada diagnosa RCA</div>
            <p className="text-[10px] text-slate-500">Klik kartu untuk mulai audit lapangan</p>
          </div>
        )}
      </div>

      {/* Target & Action Footer */}
      <div className="relative z-10">
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs mb-3">
          <span className="text-slate-400">Target Laba:</span>
          <span className="font-bold text-emerald-400">{formatRupiah(branch.targetSalesPerDay)}/hari</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={onEdit}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Edit Data Toko"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
              title="Hapus Toko"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Detail →
          </span>
        </div>
      </div>
    </div>
  );
};
