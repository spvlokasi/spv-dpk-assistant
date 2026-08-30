import React from 'react';
import { Search } from 'lucide-react';

interface OrderFilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: 'all' | 'pending' | 'completed';
  setStatusFilter: (s: 'all' | 'pending' | 'completed') => void;
  totalOrders: number;
  pendingCount: number;
  completedCount: number;
}

export const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  searchQuery, setSearchQuery, statusFilter, setStatusFilter,
  totalOrders, pendingCount, completedCount
}) => {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-900 border border-slate-800 p-3 rounded-2xl">
      <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
        <Search className="w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama pembeli, no order, alamat..."
          className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
          Semua ({totalOrders})
        </button>
        <button onClick={() => setStatusFilter('pending')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
          Menunggu ({pendingCount})
        </button>
        <button onClick={() => setStatusFilter('completed')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusFilter === 'completed' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
          Selesai ({completedCount})
        </button>
      </div>
    </div>
  );
};
