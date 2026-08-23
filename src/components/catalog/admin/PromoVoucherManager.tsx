import React, { useState } from 'react';
import { Ticket, Plus, Trash2, CheckCircle2 } from 'lucide-react';
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
  const [desc, setDesc] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    onSaveVoucher({
      id: `vouch-${Date.now()}`, branchId, code: code.trim().toUpperCase(),
      discountAmount: Number(discountAmount), minSpend: Number(minSpend),
      validUntil: '2026-12-31', isActive: true,
      description: desc.trim() || `Potongan ${formatRupiah(discountAmount)} min belanja ${formatRupiah(minSpend)}`
    });
    setCode(''); setDesc('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2"><Ticket className="w-4 h-4 text-amber-400" /><span>Buat Voucher Diskon Baru</span></h4>
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="KODE (Misal: BERKAH5K)" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold uppercase focus:outline-none" />
          <input type="number" required value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} placeholder="Potongan Rp" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none" />
          <input type="number" required value={minSpend} onChange={(e) => setMinSpend(Number(e.target.value))} placeholder="Min Belanja Rp" className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none" />
          <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold flex items-center justify-center gap-1"><Plus className="w-3.5 h-3.5" /><span>+ Pasang Voucher</span></button>
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {vouchers.map((v) => (
          <div key={v.id} className="bg-gradient-to-r from-amber-950/30 to-slate-900 border border-amber-800/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-mono font-extrabold text-xs tracking-wider">{v.code}</span>
                <span className="text-xs font-bold text-emerald-400">Hemat {formatRupiah(v.discountAmount)}</span>
              </div>
              <p className="text-[11px] text-slate-400">Min. Belanja: {formatRupiah(v.minSpend)}</p>
            </div>
            <button type="button" onClick={() => onDeleteVoucher(v.id)} className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};
