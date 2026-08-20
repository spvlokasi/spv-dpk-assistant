import React, { useState } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';

interface BranchSearchBarProps {
  search: string;
  filterStatus: string;
  filterCategory: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onOpenAdd: () => void;
}

export const BranchSearchBar: React.FC<BranchSearchBarProps> = ({
  search,
  filterStatus,
  filterCategory,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onOpenAdd
}) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const isFiltered = filterStatus !== 'all' || filterCategory !== 'all';

  return (
    <div className="bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-2xl shadow-lg space-y-3">
      {/* 1 Single Horizontal Row on Mobile & Desktop */}
      <div className="flex items-center gap-2 sm:gap-2.5 w-full">
        {/* Search Input (Takes remaining width) */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode, toko, KTB..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        {/* Desktop Filter Selects (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Status DPK</option>
            <option value="akut">🔴 Akut</option>
            <option value="kritis">🔴 Kritis</option>
            <option value="dalam_progres">🟡 Dalam Progres</option>
            <option value="existing">🏢 Existing</option>
            <option value="cabang_baru">🆕 Cabang Baru</option>
            <option value="siap_lulus">🟢 Siap Lulus</option>
            <option value="lulus_dpk">🎓 Lulus DPK</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="sales_drop">Sales Drop</option>
            <option value="margin_minus">Margin Rendah</option>
            <option value="opex_bengkak">Opex Bengkak</option>
            <option value="shrinkage_tinggi">Susut NKL</option>
          </select>
        </div>

        {/* Mobile Filter Toggle Button (Visible only on Mobile) */}
        <button
          type="button"
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className={`md:hidden px-2.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0 active:scale-95 ${
            isFiltered || showMobileFilter
              ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Filter Cabang"
        >
          <Filter className="w-3.5 h-3.5" />
          <span className="text-[11px]">Filter</span>
          {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
        </button>

        {/* Add Branch Button (1 Row Aligned) */}
        <button
          onClick={onOpenAdd}
          className="px-3 sm:px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all flex-shrink-0 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="hidden sm:inline">Tambah DPK</span>
          <span className="sm:hidden">DPK</span>
        </button>
      </div>

      {/* Expandable Mobile Filter Drawer (Smooth Dropdown on Mobile) */}
      {showMobileFilter && (
        <div className="md:hidden pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Status</option>
            <option value="akut">🔴 Akut</option>
            <option value="kritis">🔴 Kritis</option>
            <option value="dalam_progres">🟡 Progres</option>
            <option value="existing">🏢 Existing</option>
            <option value="cabang_baru">🆕 Baru</option>
            <option value="siap_lulus">🟢 Siap Lulus</option>
            <option value="lulus_dpk">🎓 Lulus DPK</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Semua Kategori</option>
            <option value="sales_drop">Sales Drop</option>
            <option value="margin_minus">Margin Rendah</option>
            <option value="opex_bengkak">Opex Bengkak</option>
            <option value="shrinkage_tinggi">Susut NKL</option>
          </select>

          {isFiltered && (
            <div className="col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onStatusChange('all');
                  onCategoryChange('all');
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 py-1"
              >
                <X className="w-3 h-3" /> Reset Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
