import React from 'react';
import { GraduationCap, Award } from 'lucide-react';
import { Branch, BranchGraduation } from '../../types';
import { StatusBadge } from '../common/Badge';

interface GraduationHeaderProps {
  branches: Branch[];
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
  currentBranch?: Branch;
  currentGraduation: BranchGraduation;
}

export const GraduationHeader: React.FC<GraduationHeaderProps> = ({
  branches,
  selectedBranchId,
  onSelectBranch,
  currentBranch,
  currentGraduation
}) => {
  const isGraduated = currentBranch?.status === 'lulus_mandiri' || currentGraduation.approvedByManager;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Status Sidang & Kelulusan Cabang DPK
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Standar verifikasi 5 kriteria kelulusan menuju status Toko Basmalah Mandiri.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={selectedBranchId}
          onChange={(e) => onSelectBranch(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[220px] truncate"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              [{b.code}] {b.name}
            </option>
          ))}
        </select>

        {currentBranch && <StatusBadge status={currentBranch.status} />}
      </div>
    </div>
  );
};
