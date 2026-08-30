import React from 'react';

interface ProposalBudgetSectionProps {
  discountPerUnit: number;
  setDiscountPerUnit: (v: number) => void;
  minSpend: number;
  setMinSpend: (v: number) => void;
  voucherQuota: number;
  setVoucherQuota: (v: number) => void;
  fundingScheme: 'supplier' | 'joint' | 'store';
  setFundingScheme: (v: 'supplier' | 'joint' | 'store') => void;
}

export const ProposalBudgetSection: React.FC<ProposalBudgetSectionProps> = ({
  discountPerUnit, setDiscountPerUnit, minSpend, setMinSpend,
  voucherQuota, setVoucherQuota, fundingScheme, setFundingScheme
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
      <div>
        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Diskon per Unit (Rp)</label>
        <input type="number" value={discountPerUnit} onChange={(e) => setDiscountPerUnit(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-emerald-400 font-mono font-bold focus:outline-none" />
      </div>
      <div>
        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Min. Belanja (Rp)</label>
        <input type="number" value={minSpend} onChange={(e) => setMinSpend(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none" />
      </div>
      <div>
        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Kuota Voucher (Kupon)</label>
        <input type="number" value={voucherQuota} onChange={(e) => setVoucherQuota(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-amber-300 font-mono font-bold focus:outline-none" />
      </div>
      <div>
        <label className="block text-[10px] text-slate-400 font-semibold mb-1">Skema Pendanaan</label>
        <select value={fundingScheme} onChange={(e) => setFundingScheme(e.target.value as any)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-emerald-400 font-bold focus:outline-none">
          <option value="supplier">100% Sponsor Supplier</option>
          <option value="joint">Sharing 50:50</option>
          <option value="store">100% Mandiri Toko</option>
        </select>
      </div>
    </div>
  );
};
