import React from 'react';
import { Users, Calendar } from 'lucide-react';

interface VoucherQuotaDatesProps {
  quota: number;
  setQuota: (q: number) => void;
  validUntil: string;
  setValidUntil: (date: string) => void;
}

export const VoucherQuotaDates: React.FC<VoucherQuotaDatesProps> = ({
  quota, setQuota, validUntil, setValidUntil
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      <div>
        <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-emerald-400" /><span>Batas Kuota Penggunaan</span>
        </label>
        <input type="number" required min={1} value={quota} onChange={(e) => setQuota(Number(e.target.value))} placeholder="50" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500" />
      </div>
      <div>
        <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-amber-400" /><span>Masa Berlaku Kupon</span>
        </label>
        <input type="date" required value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500" />
      </div>
    </div>
  );
};
