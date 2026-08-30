import React, { useState } from 'react';
import { Ticket, Plus, Trash2, Calendar, Users, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { PromoVoucher } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface PromoVoucherManagerProps {
  vouchers: PromoVoucher[];
  branchId: string;
  onSaveVoucher: (v: PromoVoucher) => void;
  onDeleteVoucher: (id: string) => void;
}

export const PromoVoucherManager: React.FC<PromoVoucherManagerProps> = ({
  vouchers, branchId, onSaveVoucher, onDeleteVoucher
}) => {
  const [code, setCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(5000);
  const [minSpend, setMinSpend] = useState(50000);
  const [quota, setQuota] = useState(50);
  const [validUntil, setValidUntil] = useState('2026-12-31');
  const [desc, setDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    onSaveVoucher({
      id: `vouch-${Date.now()}`,
      branchId,
      code: code.trim().toUpperCase(),
      discountAmount: Number(discountAmount),
      minSpend: Number(minSpend),
      quota: Number(quota) || 50,
      claimedCount: 0,
      usedCount: 0,
      validUntil: validUntil || '2026-12-31',
      isActive: true,
      description: desc.trim() || `Potongan ${formatRupiah(discountAmount)} min belanja ${formatRupiah(minSpend)}`
    });
    setCode('');
    setDesc('');
  };

  const toggleVoucherStatus = (v: PromoVoucher) => {
    onSaveVoucher({ ...v, isActive: !v.isActive });
  };

  return (
    <div className="space-y-4">
      {/* Form Buat Voucher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>Pasang Voucher Diskon Baru</span>
          </h4>
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800/60">
            ⏳ Auto-Release 24 Jam Aktif
          </span>
        </div>

        <form onSubmit={handleAdd} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Kode Voucher</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: BERKAH5K"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Besar Potongan (Rp)</label>
              <input
                type="number"
                required
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                placeholder="5000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Minimal Belanja (Rp)</label>
              <input
                type="number"
                required
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                placeholder="50000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Batas Kuota (Jumlah Kupon)</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                placeholder="Misal: 50"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Masa Berlaku (Expired)</span>
              </label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md shadow-amber-950/60 flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Terbitkan Voucher</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Daftar Voucher Aktif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {vouchers.map((v) => {
          const totalQuota = v.quota || 50;
          const claimed = v.claimedCount || 0;
          const remaining = Math.max(0, totalQuota - claimed);
          const isExpired = new Date(v.validUntil).getTime() < new Date().setHours(0, 0, 0, 0);

          return (
            <div
              key={v.id}
              className={`bg-gradient-to-r from-amber-950/30 to-slate-900 border rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg transition-all ${
                !v.isActive || isExpired || remaining === 0
                  ? 'border-slate-800 opacity-60'
                  : 'border-amber-700/50 hover:border-amber-500/80'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-mono font-extrabold text-xs tracking-wider">
                      {v.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      Hemat {formatRupiah(v.discountAmount)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleVoucherStatus(v)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white"
                    title={v.isActive ? 'Klik untuk Nonaktifkan' : 'Klik untuk Aktifkan'}
                  >
                    {v.isActive ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ToggleRight className="w-5 h-5 text-emerald-400" />
                        Aktif
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <ToggleLeft className="w-5 h-5" />
                        Nonaktif
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Min. Belanja: <strong className="text-slate-200">{formatRupiah(v.minSpend)}</strong></span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>s/d {v.validUntil}</span>
                  </span>
                </div>

                {/* Progress Kuota Voucher */}
                <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-400" />
                      Sisa Kuota:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      {remaining} / {totalQuota} Kupon
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, (remaining / totalQuota) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="text-[10px] text-slate-400">
                  {isExpired ? '⚠️ Masa aktif berakhir' : remaining === 0 ? '❌ Kuota habis' : '✅ Siap diklaim konsumen'}
                </span>
                <button
                  type="button"
                  onClick={() => onDeleteVoucher(v.id)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Hapus Voucher"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
