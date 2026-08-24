import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Branch } from '../../types';

interface FieldVisitHeaderProps {
  branches: Branch[];
  filterBranchId: string;
  onFilterChange: (branchId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalVisits: number;
  openIssuesCount: number;
  onOpenAddModal: () => void;
}

export const FieldVisitHeader: React.FC<FieldVisitHeaderProps> = ({
  branches, filterBranchId, onFilterChange, searchQuery, onSearchChange,
  totalVisits, openIssuesCount, onOpenAddModal
}) => {
  const currentBranch = branches.find((b) => b.id === filterBranchId) || branches[0];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
      <div className="flex items-center gap-2.5 flex-wrap">
        {branches.length > 1 ? (
          <select value={filterBranchId} onChange={(e) => onFilterChange(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[200px] truncate">
            <option value="all">Semua Cabang</option>
            {branches.map((b) => (<option key={b.id} value={b.id}>[{b.code}] {b.name}</option>))}
          </select>
        ) : (
          <span className="px-3 py-2 rounded-xl bg-slate-800 border border-emerald-700/60 text-emerald-400 font-bold text-xs shadow-sm">
            [{currentBranch?.code}] {currentBranch?.name}
          </span>
        )}

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Cari agenda / KTB..." className="pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-44 sm:w-56" />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 pl-1 hidden md:flex">
          <span>Total: <strong className="text-slate-200">{totalVisits}</strong></span>
          <span>•</span>
          <span>Temuan Belum Selesai: <strong className="text-amber-400">{openIssuesCount}</strong></span>
        </div>
      </div>

      <button type="button" onClick={onOpenAddModal} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-95 transition-all flex-shrink-0">
        <Plus className="w-4 h-4" />
        <span>Catat Kunjungan Baru</span>
      </button>
    </div>
  );
};
