import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { PromoProduct } from '../../../types';

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
  const [category, setCategory] = useState<PromoProduct['category']>(product?.category || 'sembako');
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 20000);
  const [promoPrice, setPromoPrice] = useState(product?.promoPrice || 17500);
  const [unit, setUnit] = useState(product?.unit || 'Pcs / Bungkus');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const camRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 400; c.height = img.height * (400 / img.width);
        c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
        setImageUrl(c.toDataURL('image/jpeg', 0.6));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: product?.id || `prod-${Date.now()}`, branchId, name: name.trim(), category,
      originalPrice: Number(originalPrice), promoPrice: Number(promoPrice), unit, imageUrl, inStock, isFeatured: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">{product ? 'Edit Produk Promo' : 'Tambah Produk Promo Toko'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div><label className="text-slate-400 font-semibold mb-1 block">Nama Produk Promo:</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Minyak Goreng 2L" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-slate-400 font-semibold mb-1 block">Kategori:</label><select value={category} onChange={(e) => setCategory(e.target.value as any)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none"><option value="sembako">🌾 Sembako</option><option value="minuman_snack">☕ Minuman & Snack</option><option value="kebersihan">🧼 Sabun / Kebersihan</option><option value="promo_kasir">⚡ Tebus Murah Kasir</option></select></div>
            <div><label className="text-slate-400 font-semibold mb-1 block">Satuan:</label><input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Misal: Pouch 2L" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-slate-400 font-semibold mb-1 block">Harga Normal (Rp):</label><input type="number" required value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-400 font-mono line-through focus:outline-none" /></div>
            <div><label className="text-slate-400 font-semibold mb-1 block">Harga Promo Diskon (Rp):</label><input type="number" required value={promoPrice} onChange={(e) => setPromoPrice(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none" /></div>
          </div>
          <div>
            <label className="text-slate-400 font-semibold mb-1 block">Foto Produk:</label>
            <div className="flex items-center gap-2">
              {imageUrl ? <img src={imageUrl} alt="Produk" className="w-12 h-12 object-cover rounded-lg border border-slate-700" /> : <div className="w-12 h-12 rounded-lg bg-slate-800 border border-dashed border-slate-700 flex items-center justify-center text-slate-500"><ImageIcon className="w-4 h-4" /></div>}
              <button type="button" onClick={() => camRef.current?.click()} className="px-2.5 py-1.5 bg-emerald-600/20 text-emerald-300 rounded-xl border border-emerald-500/40 font-semibold flex items-center gap-1"><Camera className="w-3.5 h-3.5" /><span>Kamera 📸</span></button>
              <button type="button" onClick={() => fileRef.current?.click()} className="px-2.5 py-1.5 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 font-semibold">Pilih File</button>
              <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleImage(e.target.files?.[0])} className="hidden" /><input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleImage(e.target.files?.[0])} className="hidden" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2"><label className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="rounded text-emerald-500 focus:ring-0" /><span>Stok Tersedia</span></label><div className="flex gap-2"><button type="button" onClick={onClose} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">Batal</button><button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold">Simpan</button></div></div>
        </form>
      </div>
    </div>
  );
};
