import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PromoProduct } from '../../../types';
import { ProductImagePicker } from './product/ProductImagePicker';
import { ProductCategorySelector, PRESET_CATEGORIES } from './product/ProductCategorySelector';

interface PromoProductModalProps {
  product?: PromoProduct | null;
  branchId: string;
  onSave: (prod: PromoProduct) => void;
  onClose: () => void;
}

export const PromoProductModal: React.FC<PromoProductModalProps> = ({
  product, branchId, onSave, onClose
}) => {
  const [name, setName] = useState(product?.name || '');
  const initialIsCustom = Boolean(product?.category && !PRESET_CATEGORIES.some((c) => c.value === product.category));
  const [categoryMode, setCategoryMode] = useState<string>(initialIsCustom ? 'custom' : (product?.category || 'sembako'));
  const [customCategory, setCustomCategory] = useState<string>(initialIsCustom ? (product?.category || '') : '');
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 20000);
  const [promoPrice, setPromoPrice] = useState(product?.promoPrice || 17500);
  const [unit, setUnit] = useState(product?.unit || 'Pcs / Bungkus');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [inStock, setInStock] = useState(product?.inStock ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const resolvedCat = categoryMode === 'custom' ? (customCategory.trim() || 'Lainnya') : categoryMode;
    onSave({
      id: product?.id || `prod-${Date.now()}`, branchId, name: name.trim(), category: resolvedCat,
      originalPrice: Number(originalPrice), promoPrice: Number(promoPrice), unit, imageUrl, inStock, isFeatured: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">{product ? 'Edit Produk Promo' : 'Tambah Produk Promo Toko'}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Nama Produk Promo:</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Minyak Goreng 2L" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ProductCategorySelector categoryMode={categoryMode} setCategoryMode={setCategoryMode} customCategory={customCategory} setCustomCategory={setCustomCategory} />
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Satuan:</label>
              <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Misal: Pouch 2L" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Harga Normal (Rp):</label>
              <input type="number" required value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-400 font-mono line-through focus:outline-none" />
            </div>
            <div>
              <label className="text-slate-400 font-semibold mb-1 block">Harga Promo (Rp):</label>
              <input type="number" required value={promoPrice} onChange={(e) => setPromoPrice(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none" />
            </div>
          </div>

          <ProductImagePicker imageUrl={imageUrl} setImageUrl={setImageUrl} />

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="rounded text-emerald-500 focus:ring-0" />
              <span>Stok Tersedia</span>
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">Batal</button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">Simpan</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
