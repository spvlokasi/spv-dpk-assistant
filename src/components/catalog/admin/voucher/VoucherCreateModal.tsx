import React, { useState } from 'react';
import { Ticket, Plus, X } from 'lucide-react';
import { Branch, PromoVoucher } from '../../../../types';
import { formatRupiah } from '../../../../utils/formatters';
import { loadPromoProducts } from '../../../../services/catalog/productStorage';
import { VoucherSpvScopeSection } from './VoucherSpvScopeSection';
import { VoucherDiscountInputs } from './VoucherDiscountInputs';
import { VoucherQuotaDates } from './VoucherQuotaDates';

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
  const [targetType, setTargetType] = useState<'all' | 'specific_products' | 'category'>('all');
  const [applicableCategory, setApplicableCategory] = useState<string>('sembako');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [sponsorName, setSponsorName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const products = loadPromoProducts(targetScope);
  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    let defaultDesc = `Potongan ${formatRupiah(discountAmount)} min belanja ${formatRupiah(minSpend)}`;
    if (targetType === 'specific_products' && selectedProductIds.length > 0) {
      defaultDesc = `Diskon ${formatRupiah(discountAmount)} untuk ${selectedProductIds.length} produk promo pilihan`;
    } else if (fundingSource === 'sponsor' && sponsorName.trim()) {
      defaultDesc = `Promo Spesial ${sponsorName.trim()} - Diskon ${formatRupiah(discountAmount)}`;
    }

    onSaveVoucher({
      id: `vouch-${Date.now()}`, branchId: isSpv ? targetScope : branchId,
      code: code.trim().toUpperCase(), discountAmount: Number(discountAmount),
      minSpend: Number(minSpend), quota: Number(quota) || 50, claimedCount: 0,
      usedCount: 0, validUntil: validUntil || '2026-12-31', isActive: true,
      applicableCategory: targetType === 'category' ? applicableCategory : 'all',
      applicableProductIds: targetType === 'specific_products' ? selectedProductIds : undefined,
      fundingSource, sponsorName: sponsorName.trim() || undefined,
      description: desc.trim() || defaultDesc
    });

    setCode(''); setDesc(''); setSelectedProductIds([]);
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
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
          {isSpv && <VoucherSpvScopeSection targetScope={targetScope} setTargetScope={setTargetScope} fundingSource={fundingSource} setFundingSource={setFundingSource} branches={branches} />}
          <VoucherDiscountInputs code={code} setCode={setCode} discountAmount={discountAmount} setDiscountAmount={setDiscountAmount} minSpend={minSpend} setMinSpend={setMinSpend} targetType={targetType} setTargetType={setTargetType} applicableCategory={applicableCategory} setApplicableCategory={setApplicableCategory} selectedProductIds={selectedProductIds} setSelectedProductIds={setSelectedProductIds} products={products} sponsorName={sponsorName} setSponsorName={setSponsorName} fundingSource={fundingSource} />
          <VoucherQuotaDates quota={quota} setQuota={setQuota} validUntil={validUntil} setValidUntil={setValidUntil} />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors">Batal</button>
            <button type="submit" className="py-2 px-5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md shadow-amber-950/60 flex items-center justify-center gap-1.5 transition-all text-xs">
              <Plus className="w-4 h-4" /><span>+ Terbitkan Voucher</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
