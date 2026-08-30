import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, Clock, Truck, MessageCircle, Copy, Check, Filter, Trash2, Search, RefreshCw, Send, DollarSign, Tag, ExternalLink, Navigation, MapPin } from 'lucide-react';
import { OnlineOrderLog } from '../../../types/catalogTypes';
import { Branch } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';
import { getSupabaseClient } from '../../../services/supabase';

interface OnlineOrderLogManagerProps {
  branch: Branch;
}

const STORAGE_ORDERS_KEY = 'basmalah_customer_orders';

const DEFAULT_MOCK_ORDERS: OnlineOrderLog[] = [
  {
    id: 'ORD-892101',
    branch_id: 'br-01',
    branch_code: 'M3017',
    branch_name: 'TokoBASMALAH Bugih',
    buyer_name: 'Ibu Hj. Siti Aisyah',
    address: 'Jl. Jokotole No. 45 RT 02/RW 04 (Depan Masjid Al-Ikhlas), Pamekasan',
    maps_url: 'https://maps.google.com/?q=-7.1595,113.4735',
    items: [
      { name: 'Beras Premium Basmalah 5 KG', qty: 1, price: 68500 },
      { name: 'Minyak Goreng Pouch 2 Liter', qty: 2, price: 33500 },
      { name: 'Yakult Minuman Probiotik (5 Botol)', qty: 2, price: 9000 }
    ],
    subtotal: 153500,
    discount: 5000,
    voucher_code: 'BERKAH5K',
    grand_total: 148500,
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: 'pending_delivery'
  },
  {
    id: 'ORD-892102',
    branch_id: 'br-01',
    branch_code: 'M3017',
    branch_name: 'TokoBASMALAH Bugih',
    buyer_name: 'Bpk. Ahmad Fauzi',
    address: 'Perum Bugih Indah Blok C3, Bugih',
    maps_url: 'https://maps.google.com/?q=-7.1650,113.4800',
    items: [
      { name: 'Kanzler Singles Sausage Original', qty: 4, price: 6500 },
      { name: 'Gula Pasir Kristal Putih 1 KG', qty: 2, price: 16900 }
    ],
    subtotal: 59800,
    discount: 3500,
    voucher_code: 'KANZL3K',
    grand_total: 56300,
    created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    status: 'completed'
  }
];

export const OnlineOrderLogManager: React.FC<OnlineOrderLogManagerProps> = ({ branch }) => {
  const [orders, setOrders] = useState<OnlineOrderLog[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
      const list = raw ? JSON.parse(raw) : DEFAULT_MOCK_ORDERS;
      return list;
    } catch {
      return DEFAULT_MOCK_ORDERS;
    }
  });

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [selectedOrderForQuickReply, setSelectedOrderForQuickReply] = useState<OnlineOrderLog | null>(null);

  // Ambil data pesanan langsung dari Supabase Cloud
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

  const handleUpdateStatus = (orderId: string, newStatus: 'pending_delivery' | 'delivering' | 'completed' | 'cancelled') => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    saveOrders(updated);

    const client = getSupabaseClient();
    if (client) {
      client.from('online_orders').update({ status: newStatus }).eq('id', orderId).then();
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Hapus riwayat pesanan ini?')) {
      const updated = orders.filter((o) => o.id !== orderId);
      saveOrders(updated);

      const client = getSupabaseClient();
      if (client) {
        client.from('online_orders').delete().eq('id', orderId).then();
      }
    }
  };

  // Template Balasan Cepat Kasir
  const getQuickReplyText = (order: OnlineOrderLog, type: 'prepared' | 'delivering' | 'done') => {
    if (type === 'prepared') {
      return `Halo Kak *${order.buyer_name}*, pesanan online TokoBasmalah No. *${order.id}* sudah kami terima dan saat ini sedang disiapkan di kasir. Mohon ditunggu ya! 🙏`;
    }
    if (type === 'delivering') {
      return `Halo Kak *${order.buyer_name}*, pesanan Anda senilai *${formatRupiah(order.grand_total)}* sedang dalam perjalanan diantar oleh kurir kami menuju alamat Anda. Mohon siapkan uang pas COD ya. Terima kasih! 🛵`;
    }
    return `Terima kasih banyak Kak *${order.buyer_name}* telah berbelanja di TokoBasmalah! Semoga belanjaan berkah dan sehat selalu sekeluarga. Ditunggu orderan berikutnya ya! ✨`;
  };

  const handleCopyTemplate = (order: OnlineOrderLog, type: 'prepared' | 'delivering' | 'done') => {
    const text = getQuickReplyText(order, type);
    navigator.clipboard.writeText(text);
    setCopiedTemplateId(`${order.id}-${type}`);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  // Filter per cabang, status, dan kata kunci
  const filteredOrders = orders.filter((o) => {
    const matchBranch = !o.branch_code || o.branch_code === branch.code || o.branch_name === branch.name;
    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? o.status === 'pending_delivery' || o.status === 'delivering'
        : o.status === 'completed';
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || o.buyer_name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    return matchBranch && matchStatus && matchSearch;
  });

  const totalOmzetOnline = filteredOrders.reduce((sum, o) => sum + (o.grand_total || 0), 0);
  const pendingCount = filteredOrders.filter((o) => o.status === 'pending_delivery' || o.status === 'delivering').length;
  const completedCount = filteredOrders.filter((o) => o.status === 'completed').length;

  return (
    <div className="space-y-4">
      {/* KPI Cards Ringkas Pesanan Online */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Pesanan Masuk</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-white font-mono mt-1">{filteredOrders.length} Order</div>
          <span className="text-[10px] text-slate-500">Cabang: {branch.name}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Omzet Online COD</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono mt-1">{formatRupiah(totalOmzetOnline)}</div>
          <span className="text-[10px] text-slate-500">Total belanja web</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Perlu Diantar</span>
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-black text-amber-400 font-mono mt-1">{pendingCount} Order</div>
          <span className="text-[10px] text-slate-500">Menunggu kurir toko</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Selesai Diantar</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-lg font-black text-teal-400 font-mono mt-1">{completedCount} Order</div>
          <span className="text-[10px] text-slate-500">Transaksi sukses</span>
        </div>
      </div>

      {/* Control Bar Filter & Search */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pembeli, no order, alamat..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Semua ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🛵 Menunggu Antar ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'completed' ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ✓ Selesai ({completedCount})
          </button>
        </div>
      </div>

      {/* Daftar Pesanan Masuk */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">Belum ada pesanan online yang sesuai filter.</p>
          </div>
        ) : (
          filteredOrders.map((o) => {
            const isDone = o.status === 'completed';
            return (
              <div
                key={o.id}
                className={`bg-slate-900 border rounded-2xl p-4 space-y-3 transition-all ${
                  isDone ? 'border-slate-800/80 bg-slate-900/60' : 'border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                }`}
              >
                {/* Baris Header Pesanan */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs text-emerald-400">{o.id}</span>
                      <span className="text-xs font-bold text-white">• {o.buyer_name}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isDone ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {isDone ? '✓ Selesai Terkirim' : '🛵 Siap Diantar (COD)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-1">
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>📍 {o.address}</span>
                      </p>
                      {o.maps_url && (
                        <a
                          href={o.maps_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 text-[10px] font-bold hover:bg-blue-900 transition-colors shadow-sm"
                        >
                          <Navigation className="w-2.5 h-2.5 text-blue-400" />
                          <span>Rute Google Maps Kurir</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-white font-mono">{formatRupiah(o.grand_total)}</div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(o.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </span>
                  </div>
                </div>

                {/* Rincian Barang Belanja */}
                <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 space-y-1 text-xs">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Daftar Barang Belanjaan:</div>
                  {o.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-300 text-[11px]">
                      <span>• {item.qty}x {item.name}</span>
                      <span className="font-mono text-slate-400">{formatRupiah(item.price * item.qty)}</span>
                    </div>
                  ))}
                  {o.voucher_code && (
                    <div className="flex justify-between text-emerald-400 text-[11px] pt-1 border-t border-slate-800">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Kupon Diskon ({o.voucher_code}):</span>
                      <span className="font-mono">-{formatRupiah(o.discount)}</span>
                    </div>
                  )}
                </div>

                {/* Tombol Aksi Kasir & Template Balasan WA */}
                <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForQuickReply(selectedOrderForQuickReply?.id === o.id ? null : o)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Template Balasan WA</span>
                    </button>

                    {!isDone ? (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(o.id, 'completed')}
                        className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-950/60"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Tandai Selesai Diantar</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(o.id, 'pending_delivery')}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold"
                      >
                        Batal Selesai
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(o.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                    title="Hapus riwayat pesanan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sub-panel Template Balasan WA Kasir Cepat */}
                {selectedOrderForQuickReply?.id === o.id && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 space-y-2 animate-in fade-in">
                    <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
                      <span>Pilih Template Pesan WhatsApp untuk {o.buyer_name}:</span>
                      <span className="text-[10px] text-slate-500">Klik untuk salin teks otomatis</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyTemplate(o, 'prepared')}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-[10px] text-slate-300 space-y-1 transition-all"
                      >
                        <div className="font-bold text-amber-400 flex items-center gap-1">
                          {copiedTemplateId === `${o.id}-prepared` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>1. Pesanan Disiapkan</span>
                        </div>
                        <p className="line-clamp-2 text-slate-400">{getQuickReplyText(o, 'prepared')}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyTemplate(o, 'delivering')}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-[10px] text-slate-300 space-y-1 transition-all"
                      >
                        <div className="font-bold text-blue-400 flex items-center gap-1">
                          {copiedTemplateId === `${o.id}-delivering` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>2. Kurir Meluncur</span>
                        </div>
                        <p className="line-clamp-2 text-slate-400">{getQuickReplyText(o, 'delivering')}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyTemplate(o, 'done')}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-[10px] text-slate-300 space-y-1 transition-all"
                      >
                        <div className="font-bold text-teal-400 flex items-center gap-1">
                          {copiedTemplateId === `${o.id}-done` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>3. Terima Kasih</span>
                        </div>
                        <p className="line-clamp-2 text-slate-400">{getQuickReplyText(o, 'done')}</p>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
