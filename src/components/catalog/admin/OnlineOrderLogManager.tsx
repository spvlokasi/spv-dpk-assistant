import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, Search } from 'lucide-react';
import { OnlineOrderLog } from '../../../types/catalogTypes';
import { Branch } from '../../../types';
import { getSupabaseClient } from '../../../services/supabase';
import { OrderStatsSummary } from './orders/OrderStatsSummary';
import { OrderCardItem } from './orders/OrderCardItem';
import { OrderQuickReplyModal } from './orders/OrderQuickReplyModal';

interface OnlineOrderLogManagerProps {
  branch: Branch;
}

const STORAGE_ORDERS_KEY = 'basmalah_customer_orders';

export const OnlineOrderLogManager: React.FC<OnlineOrderLogManagerProps> = ({ branch }) => {
  const [orders, setOrders] = useState<OnlineOrderLog[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForReply, setSelectedOrderForReply] = useState<OnlineOrderLog | null>(null);

  // Ambil data langsung dari Supabase Cloud
  useEffect(() => {
    const client = getSupabaseClient();
    if (client) {
      client
        .from('online_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            setOrders(data as OnlineOrderLog[]);
            localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(data));
          }
        });
    }
  }, [branch.id]);

  const saveOrders = (newOrders: OnlineOrderLog[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(newOrders));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: 'pending_delivery' | 'completed') => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    saveOrders(updated);
    const client = getSupabaseClient();
    if (client) client.from('online_orders').update({ status: newStatus }).eq('id', orderId).then();
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Hapus riwayat pesanan ini?')) {
      const updated = orders.filter((o) => o.id !== orderId);
      saveOrders(updated);
      const client = getSupabaseClient();
      if (client) client.from('online_orders').delete().eq('id', orderId).then();
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'pending' ? o.status === 'pending_delivery' : o.status === 'completed';
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || o.buyer_name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.address.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <OrderStatsSummary orders={orders} />

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
            Semua ({orders.length})
          </button>
          <button onClick={() => setStatusFilter('pending')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            Menunggu ({orders.filter((o) => o.status === 'pending_delivery').length})
          </button>
          <button onClick={() => setStatusFilter('completed')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${statusFilter === 'completed' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
            Selesai ({orders.filter((o) => o.status === 'completed').length})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">Belum ada pesanan online yang sesuai filter.</p>
          </div>
        ) : (
          filteredOrders.map((o) => (
            <React.Fragment key={o.id}>
              <OrderCardItem
                order={o}
                isSelectedForReply={selectedOrderForReply?.id === o.id}
                onToggleReply={() => setSelectedOrderForReply(selectedOrderForReply?.id === o.id ? null : o)}
                onUpdateStatus={(st) => handleUpdateStatus(o.id, st)}
                onDelete={() => handleDeleteOrder(o.id)}
              />
              {selectedOrderForReply?.id === o.id && <OrderQuickReplyModal order={o} />}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};
