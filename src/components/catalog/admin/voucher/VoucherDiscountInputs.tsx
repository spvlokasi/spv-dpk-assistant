import React from 'react';
import { PromoProduct } from '../../../../types';
import { VoucherProductSelector } from './VoucherProductSelector';

interface VoucherDiscountInputsProps {
  code: string;
  setCode: (v: string) => void;
  discountAmount: number;
  setDiscountAmount: (v: number) => void;
  minSpend: number;
  setMinSpend: (v: number) => void;
  targetType: 'all' | 'specific_products' | 'category';
  setTargetType: (v: 'all' | 'specific_products' | 'category') => void;
  applicableCategory: string;
  setApplicableCategory: (v: string) => void;
  selectedProductIds: string[];
  setSelectedProductIds: (ids: string[]) => void;
  products: PromoProduct[];
  sponsorName: string;
  setSponsorName: (v: string) => void;
  fundingSource: string;
}

export const VoucherDiscountInputs: React.FC<VoucherDiscountInputsProps> = ({
  code, setCode, discountAmount, setDiscountAmount, minSpend, setMinSpend,
  targetType, setTargetType, applicableCategory, setApplicableCategory,
  selectedProductIds, setSelectedProductIds, products,
  sponsorName, setSponsorName, fundingSource
}) => {
  const handleToggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Kode Voucher (Kupon)</label>
          <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Contoh: YAKULT5K" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold uppercase focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Besar Diskon (Rp)</label>
          <input type="number" required value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} placeholder="5000" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Min. Belanja (Rp)</label>
          <input type="number" required value={minSpend} onChange={(e) => setMinSpend(Number(e.target.value))} placeholder="50000" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Target Penerapan Diskon:</label>
          <select value={targetType} onChange={(e) => setTargetType(e.target.value as any)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-amber-500">
            <option value="all">🌐 Semua Produk Belanja Bebas</option>
            <option value="specific_products">🎯 Pilih Produk Promo Tertentu (Spesifik)</option>
            <option value="category">🏷️ Berdasarkan Kategori Produk</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Brand Sponsor / Keterangan</label>
          <input type="text" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder={fundingSource === 'sponsor' ? 'Wajib Co-Marketing: Misal PT Yakult' : 'Opsional: Nama brand'} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500" />
        </div>
      </div>

      {targetType === 'category' && (
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Kategori Produk yang Mendapat Diskon:</label>
          <select value={applicableCategory} onChange={(e) => setApplicableCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-amber-500">
            <option value="sembako">🌾 Khusus Sembako (Beras, Minyak, Gula)</option>
            <option value="minuman_snack">☕ Khusus Minuman, Kopi & Snack</option>
            <option value="biskuit_roti">🍪 Khusus Biskuit & Roti</option>
            <option value="kebersihan">🧼 Khusus Sabun & Kebersihan</option>
            <option value="frozen_food">🧊 Khusus Makanan Beku (Frozen Food)</option>
          </select>
        </div>
      )}

      {targetType === 'specific_products' && (
        <VoucherProductSelector products={products} selectedProductIds={selectedProductIds} onToggleProduct={handleToggleProduct} onSelectAll={() => setSelectedProductIds(products.map((p) => p.id))} onClearAll={() => setSelectedProductIds([])} />
      )}
    </>
  );
};
