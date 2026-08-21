import React from 'react';
import { ClipboardCheck, Plus, Search } from 'lucide-react';
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
  branches,
  filterBranchId,
  onFilterChange,
  searchQuery,
  onSearchChange,
  totalVisits,
  openIssuesCount,
  onOpenAddModal
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <ClipboardCheck className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            Log Kunjungan & Coaching Lapangan
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Total: <strong className="text-slate-200">{totalVisits} Kunjungan</strong></span>
          <span>•</span>
          <span>Temuan Belum Selesai: <strong className="text-amber-400">{openIssuesCount} Isu</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari agenda / KTB..."
            className="pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
          />
        </div>

        {/* Branch Filter Dropdown */}
        <select
          value={filterBranchId}
          onChange={(e) => onFilterChange(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none cursor-pointer max-w-[200px] truncate"
        >
          <option value="all">Semua Cabang Binaan</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              [{b.code}] {b.name}
            </option>
          ))}
        </select>

        {/* Add Visit Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Catat Kunjungan</span>
        </button>
      </div>
    </div>
  );
};
