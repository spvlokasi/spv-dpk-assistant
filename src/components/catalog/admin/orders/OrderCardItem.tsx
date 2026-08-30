import React from 'react';
import { CheckCircle2, MessageCircle, Trash2, Navigation, ExternalLink } from 'lucide-react';
import { OnlineOrderLog } from '../../../../types/catalogTypes';
import { formatRupiah } from '../../../../utils/formatters';

interface OrderCardItemProps {
  order: OnlineOrderLog;
  isSelectedForReply: boolean;
  onToggleReply: () => void;
  onUpdateStatus: (newStatus: 'pending_delivery' | 'completed') => void;
  onDelete: () => void;
}

export const OrderCardItem: React.FC<OrderCardItemProps> = ({
  order, isSelectedForReply: _reply, onToggleReply, onUpdateStatus, onDelete
}) => {
  const isDone = order.status === 'completed';

  return (
    <div className={`bg-slate-900 border rounded-2xl p-4 space-y-3 transition-all ${
      isDone ? 'border-slate-800/80 bg-slate-900/60' : 'border-emerald-500/50 shadow-lg shadow-emerald-950/20'
    }`}>
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-xs text-emerald-400">{order.id}</span>
            <span className="text-xs font-bold text-white">• {order.buyer_name}</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isDone ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
              {isDone ? '✓ Selesai Terkirim' : '🛵 Siap Diantar (COD)'}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1">
            <p className="text-[11px] text-slate-400 flex items-center gap-1">📍 {order.address}</p>
            {order.maps_url && (
              <a href={order.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-950/80 border border-blue-800 text-blue-300 text-[10px] font-bold hover:bg-blue-900">
                <Navigation className="w-2.5 h-2.5 text-blue-400" /><span>Rute Kurir</span><ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-white font-mono">{formatRupiah(order.grand_total)}</div>
          <span className="text-[10px] text-slate-500">{new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
        </div>
      </div>

      <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 space-y-1 text-xs">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Daftar Barang Belanjaan:</div>
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between text-slate-300 text-[11px]">
            <span>• {item.qty}x {item.name}</span><span className="font-mono text-slate-400">{formatRupiah(item.price * item.qty)}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={onToggleReply} className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /><span>Template Balasan WA</span>
          </button>
          {!isDone ? (
            <button type="button" onClick={() => onUpdateStatus('completed')} className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" /><span>Tandai Selesai Diantar</span>
            </button>
          ) : (
            <button type="button" onClick={() => onUpdateStatus('pending_delivery')} className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold">
              Batal Selesai
            </button>
          )}
        </div>
        <button type="button" onClick={onDelete} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400" title="Hapus order">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
