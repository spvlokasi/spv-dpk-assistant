import React, { useState } from 'react';
import { Ticket, Plus, Sparkles, Users, Calendar } from 'lucide-react';
import { Branch, PromoVoucher } from '../../../../types';
import { formatRupiah } from '../../../../utils/formatters';
import { VoucherSpvScopeSection } from './VoucherSpvScopeSection';
import { VoucherDiscountInputs } from './VoucherDiscountInputs';

interface VoucherCreateFormProps {
  isSpv: boolean;
  branchId: string;
  branches: Branch[];
  onSaveVoucher: (v: PromoVoucher) => void;
}

export const VoucherCreateForm: React.FC<VoucherCreateFormProps> = ({
  isSpv, branchId, branches, onSaveVoucher
}) => {
  const [targetScope, setTargetScope] = useState<string>(isSpv ? 'all' : branchId);
  const [fundingSource, setFundingSource] = useState<'store' | 'sponsor' | 'dpk_turnaround'>(isSpv ? 'sponsor' : 'store');
  const [code, setCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(5000);
  const [minSpend, setMinSpend] = useState<number>(50000);
  const [quota, setQuota] = useState<number>(50);
  const [validUntil, setValidUntil] = useState<string>('2026-12-31');
  const [applicableCategory, setApplicableCategory] = useState<string>('all');
  const [sponsorName, setSponsorName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    let defaultDesc = `Potongan ${formatRupiah(discountAmount)} min belanja ${formatRupiah(minSpend)}`;
    if (fundingSource === 'sponsor' && sponsorName.trim()) {
      defaultDesc = `Promo Spesial Co-Marketing ${sponsorName.trim()} - Diskon ${formatRupiah(discountAmount)}`;
    } else if (fundingSource === 'dpk_turnaround') {
      defaultDesc = `Program Akselerasi DPK - Diskon Belanja ${formatRupiah(discountAmount)}`;
    }

    onSaveVoucher({
      id: `vouch-${Date.now()}`, branchId: isSpv ? targetScope : branchId,
      code: code.trim().toUpperCase(), discountAmount: Number(discountAmount),
      minSpend: Number(minSpend), quota: Number(quota) || 50, claimedCount: 0,
      usedCount: 0, validUntil: validUntil || '2026-12-31', isActive: true,
      applicableCategory: applicableCategory || 'all', fundingSource,
      sponsorName: sponsorName.trim() || undefined, description: desc.trim() || defaultDesc
    });

    setCode(''); setDesc('');
    if (fundingSource !== 'sponsor') setSponsorName('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Ticket className="w-4 h-4 text-amber-400" />
          <span>{isSpv ? 'Terbitkan Voucher Promo / Sponsor Baru' : 'Buat Kupon Diskon Cabang'}</span>
        </h4>
        <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/60 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /><span>Sinkronisasi Otomatis ke Cloud</span>
        </span>
      </div>

      <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
        {isSpv && <VoucherSpvScopeSection targetScope={targetScope} setTargetScope={setTargetScope} fundingSource={fundingSource} setFundingSource={setFundingSource} branches={branches} />}
        <VoucherDiscountInputs code={code} setCode={setCode} discountAmount={discountAmount} setDiscountAmount={setDiscountAmount} minSpend={minSpend} setMinSpend={setMinSpend} applicableCategory={applicableCategory} setApplicableCategory={setApplicableCategory} sponsorName={sponsorName} setSponsorName={setSponsorName} fundingSource={fundingSource} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-400" /><span>Batas Kuota</span></label>
            <input type="number" required min={1} value={quota} onChange={(e) => setQuota(Number(e.target.value))} placeholder="50" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /><span>Masa Berlaku</span></label>
            <input type="date" required value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full py-2 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md shadow-amber-950/60 flex items-center justify-center gap-1.5 transition-all">
              <Plus className="w-4 h-4" /><span>+ Terbitkan Voucher</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
