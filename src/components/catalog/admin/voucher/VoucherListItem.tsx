import React from 'react';
import { ToggleLeft, ToggleRight, Trash2, Calendar, Users, Building2 } from 'lucide-react';
import { PromoVoucher } from '../../../../types';
import { formatRupiah } from '../../../../utils/formatters';

interface VoucherListItemProps {
  voucher: PromoVoucher;
  isSpv?: boolean;
  onToggleStatus: (v: PromoVoucher) => void;
  onDelete: (v: PromoVoucher) => void;
}

export const VoucherListItem: React.FC<VoucherListItemProps> = ({
  voucher: v, isSpv = true, onToggleStatus, onDelete
}) => {
  const totalQuota = v.quota || 50;
  const claimed = v.claimedCount || 0;
  const remaining = Math.max(0, totalQuota - claimed);
  const isExpired = new Date(v.validUntil).getTime() < new Date().setHours(0, 0, 0, 0);
  const isGlobal = v.branchId === 'all';
  const isSponsor = v.fundingSource === 'sponsor' || Boolean(v.sponsorName);
  const isTurnaround = v.fundingSource === 'dpk_turnaround';

  return (
    <div className={`bg-gradient-to-r from-amber-950/30 to-slate-900 border rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg transition-all ${
      !v.isActive || isExpired || remaining === 0
        ? 'border-slate-800 opacity-60'
        : isSponsor || isGlobal ? 'border-amber-500/60 bg-slate-900/90' : 'border-amber-700/50 hover:border-amber-500/80'
    }`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-mono font-extrabold text-xs tracking-wider">
              {v.code}
            </span>
            <span className="text-xs font-bold text-emerald-400">Hemat {formatRupiah(v.discountAmount)}</span>
            {isGlobal && <span className="px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-700/60 text-blue-300 text-[10px] font-bold">🌐 Semua Cabang</span>}
            {isSponsor && (
              <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-700/60 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                <Building2 className="w-2.5 h-2.5" /><span>{v.sponsorName || 'Sponsor Co-Marketing'}</span>
              </span>
            )}
            {isTurnaround && <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-bold">💎 Subsidi DPK</span>}
          </div>

          {isSpv ? (
            <button type="button" onClick={() => onToggleStatus(v)} className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white flex-shrink-0">
              {v.isActive ? (
                <span className="text-emerald-400 flex items-center gap-1"><ToggleRight className="w-5 h-5 text-emerald-400" />Aktif</span>
              ) : (
                <span className="text-slate-500 flex items-center gap-1"><ToggleLeft className="w-5 h-5" />Nonaktif</span>
              )}
            </button>
          ) : (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${v.isActive ? 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              {v.isActive ? 'Aktif' : 'Nonaktif'}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 line-clamp-1">{v.description}</p>

        <div className="text-[11px] text-slate-400 flex items-center justify-between">
          <span>Min. Belanja: <strong className="text-slate-200">{formatRupiah(v.minSpend)}</strong></span>
          <span className="flex items-center gap-1 text-slate-400"><Calendar className="w-3 h-3 text-amber-400" /><span>s/d {v.validUntil}</span></span>
        </div>

        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-emerald-400" />Sisa Kuota Kupon:</span>
            <span className="font-mono font-bold text-emerald-400 text-xs">{remaining} / {totalQuota} Kupon</span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (remaining / totalQuota) * 100))}%` }} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
        <span className="text-[10px] text-slate-400">
          {isExpired ? '⚠️ Masa aktif berakhir' : remaining === 0 ? '❌ Kuota habis' : '✅ Siap diklaim konsumen'}
        </span>
        {isSpv && (
          <button type="button" onClick={() => onDelete(v)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors" title="Hapus Voucher">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
