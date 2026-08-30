import React, { useState } from 'react';
import { Ticket, Plus, Users, Calendar, X } from 'lucide-react';
import { Branch, PromoVoucher } from '../../../../types';
import { formatRupiah } from '../../../../utils/formatters';
import { VoucherSpvScopeSection } from './VoucherSpvScopeSection';
import { VoucherDiscountInputs } from './VoucherDiscountInputs';

interface VoucherCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSpv: boolean;
  branchId: string;
  branches: Branch[];
  onSaveVoucher: (v: PromoVoucher) => void;
}

export const VoucherCreateModal: React.FC<VoucherCreateModalProps> = ({
  isOpen, onClose, isSpv, branchId, branches, onSaveVoucher
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

  if (!isOpen) return null;

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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" />
            <span>{isSpv ? 'Terbitkan Voucher Promo / Sponsor Baru' : 'Buat Kupon Diskon Cabang'}</span>
          </h4>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
          {isSpv && <VoucherSpvScopeSection targetScope={targetScope} setTargetScope={setTargetScope} fundingSource={fundingSource} setFundingSource={setFundingSource} branches={branches} />}
          <VoucherDiscountInputs code={code} setCode={setCode} discountAmount={discountAmount} setDiscountAmount={setDiscountAmount} minSpend={minSpend} setMinSpend={setMinSpend} applicableCategory={applicableCategory} setApplicableCategory={setApplicableCategory} sponsorName={sponsorName} setSponsorName={setSponsorName} fundingSource={fundingSource} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-400" /><span>Batas Kuota Penggunaan</span></label>
              <input type="number" required min={1} value={quota} onChange={(e) => setQuota(Number(e.target.value))} placeholder="50" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /><span>Masa Berlaku Kupon</span></label>
              <input type="date" required value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors">
              Batal
            </button>
            <button type="submit" className="py-2 px-5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md shadow-amber-950/60 flex items-center justify-center gap-1.5 transition-all text-xs">
              <Plus className="w-4 h-4" /><span>+ Terbitkan Voucher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
