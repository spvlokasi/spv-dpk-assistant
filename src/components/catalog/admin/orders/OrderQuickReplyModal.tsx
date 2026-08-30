import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { OnlineOrderLog } from '../../../../types/catalogTypes';
import { formatRupiah } from '../../../../utils/formatters';

interface OrderQuickReplyModalProps {
  order: OnlineOrderLog;
}

export const OrderQuickReplyModal: React.FC<OrderQuickReplyModalProps> = ({ order }) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const getQuickReplyText = (type: 'prepared' | 'delivering' | 'done') => {
    if (type === 'prepared') {
      return `Halo Kak *${order.buyer_name}*, pesanan online TokoBasmalah No. *${order.id}* sudah kami terima dan saat ini sedang disiapkan di kasir. Mohon ditunggu ya! 🙏`;
    }
    if (type === 'delivering') {
      return `Halo Kak *${order.buyer_name}*, pesanan Anda senilai *${formatRupiah(order.grand_total)}* sedang dalam perjalanan diantar oleh kurir kami menuju alamat Anda. Mohon siapkan uang pas COD ya. Terima kasih! 🛵`;
    }
    return `Terima kasih banyak Kak *${order.buyer_name}* telah berbelanja di TokoBasmalah! Semoga belanjaan berkah dan sehat selalu sekeluarga. Ditunggu orderan berikutnya ya! ✨`;
  };

  const handleCopy = (type: 'prepared' | 'delivering' | 'done') => {
    navigator.clipboard.writeText(getQuickReplyText(type));
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40 space-y-2 animate-in fade-in">
      <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
        <span>Pilih Template Pesan WhatsApp untuk {order.buyer_name}:</span>
        <span className="text-[10px] text-slate-500">Klik untuk salin otomatis</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleCopy('prepared')}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left space-y-1 transition-all"
        >
          <div className="text-[11px] font-bold text-amber-400 flex items-center justify-between">
            <span>1. Pesanan Disiapkan</span>
            {copiedType === 'prepared' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-2">"Pesanan sudah kami terima dan sedang disiapkan..."</p>
        </button>
        <button
          type="button"
          onClick={() => handleCopy('delivering')}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left space-y-1 transition-all"
        >
          <div className="text-[11px] font-bold text-blue-400 flex items-center justify-between">
            <span>2. Kurir Berangkat</span>
            {copiedType === 'delivering' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-2">"Pesanan sedang dalam perjalanan menuju alamat Anda..."</p>
        </button>
        <button
          type="button"
          onClick={() => handleCopy('done')}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left space-y-1 transition-all"
        >
          <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-between">
            <span>3. Ucapan Terima Kasih</span>
            {copiedType === 'done' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
          </div>
          <p className="text-[10px] text-slate-400 line-clamp-2">"Terima kasih telah berbelanja di TokoBasmalah..."</p>
        </button>
      </div>
    </div>
  );
};
