import React from 'react';
import { Search, Plus } from 'lucide-react';

interface BranchSearchBarProps {
  search: string;
  filterStatus: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onOpenAdd: () => void;
}

export const BranchSearchBar: React.FC<BranchSearchBarProps> = ({
  search,
  filterStatus,
  onSearchChange,
  onStatusChange,
  onOpenAdd
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-lg">
      <div className="flex items-center gap-2 sm:gap-2.5 w-full">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode cabang, nama toko, KTB..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 font-medium"
          />
        </div>

        {/* Filter Status Dropdown */}
        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer font-semibold max-w-[160px] sm:max-w-none"
        >
          <option value="all">Semua Status DPK</option>
          <option value="akut">🔴 Akut</option>
          <option value="kritis">🔴 Kritis</option>
          <option value="dalam_progres">🟡 Progres</option>
          <option value="existing">🏢 Existing</option>
          <option value="cabang_baru">🆕 Baru</option>
          <option value="siap_lulus">🟢 Siap Lulus</option>
          <option value="lulus_dpk">🎓 Lulus DPK</option>
        </select>

        {/* Add Branch Button */}
        <button
          type="button"
          onClick={onOpenAdd}
          className="px-3 sm:px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 active:scale-95 flex-shrink-0 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tambah DPK</span>
          <span className="sm:hidden">Tambah</span>
        </button>
      </div>
    </div>
  );
};
