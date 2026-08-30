import React from 'react';
import { ShoppingBag, CheckCircle2, Clock } from 'lucide-react';
import { OnlineOrderLog } from '../../../../types/catalogTypes';
import { formatRupiah } from '../../../../utils/formatters';

interface OrderStatsSummaryProps {
  orders: OnlineOrderLog[];
}

export const OrderStatsSummary: React.FC<OrderStatsSummaryProps> = ({ orders }) => {
  const pendingCount = orders.filter((o) => o.status === 'pending_delivery').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalOmset = orders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.grand_total, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-400">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-semibold">Menunggu Antar (COD)</div>
          <div className="text-base font-black text-amber-300 font-mono">{pendingCount} Pesanan</div>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-semibold">Selesai Terkirim</div>
          <div className="text-base font-black text-teal-300 font-mono">{completedCount} Pesanan</div>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400">
          <ShoppingBag className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] text-slate-400 font-semibold">Omset Terkirim</div>
          <div className="text-base font-black text-emerald-300 font-mono">{formatRupiah(totalOmset)}</div>
        </div>
      </div>
    </div>
  );
};
