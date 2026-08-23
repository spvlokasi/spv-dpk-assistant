import React from 'react';
import { Ticket, CheckCircle2 } from 'lucide-react';
import { PromoVoucher } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface PublicVoucherBannerProps {
  vouchers: PromoVoucher[];
  appliedVoucherCode: string | null;
  onApplyVoucher: (v: PromoVoucher) => void;
}

export const PublicVoucherBanner: React.FC<PublicVoucherBannerProps> = ({
  vouchers, appliedVoucherCode, onApplyVoucher
}) => {
  if (vouchers.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5"><Ticket className="w-3.5 h-3.5" /><span>Klaim Kupon Diskon Belanja Hari Ini:</span></h3>
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {vouchers.map((v) => {
          const isApplied = appliedVoucherCode === v.code;
          return (
            <div key={v.id} className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-600/40 rounded-2xl p-3 flex-shrink-0 min-w-[220px] flex items-center justify-between gap-2 shadow-lg">
              <div className="space-y-0.5">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-mono font-black text-[10px]">{v.code}</span>
                <div className="text-xs font-bold text-white">Hemat {formatRupiah(v.discountAmount)}</div>
                <div className="text-[10px] text-slate-400">Min. {formatRupiah(v.minSpend)}</div>
              </div>
              <button
                type="button"
                onClick={() => onApplyVoucher(v)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  isApplied ? 'bg-emerald-600 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {isApplied ? '✓ Dipakai' : 'Klaim'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
