import React from 'react';
import { PlusCircle } from 'lucide-react';

export const PRESET_CATEGORIES = [
  { value: 'sembako', label: '🌾 Sembako' },
  { value: 'minuman_snack', label: '☕ Minuman & Kopi' },
  { value: 'biskuit_roti', label: '🍪 Biskuit, Roti & Snack' },
  { value: 'bumbu_dapur', label: '🥫 Bumbu Dapur & Instan' },
  { value: 'susu_dairy', label: '🥛 Susu & Olahan Dairy' },
  { value: 'kebersihan', label: '🧼 Sabun & Kebersihan' },
  { value: 'bayi_anak', label: '👶 Perlengkapan Bayi' },
  { value: 'frozen_food', label: '🧊 Frozen Food' },
  { value: 'promo_kasir', label: '⚡ Tebus Murah Kasir' }
];

interface ProductCategorySelectorProps {
  categoryMode: string;
  setCategoryMode: (mode: string) => void;
  customCategory: string;
  setCustomCategory: (cat: string) => void;
}

export const ProductCategorySelector: React.FC<ProductCategorySelectorProps> = ({
  categoryMode, setCategoryMode, customCategory, setCustomCategory
}) => {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-slate-400 font-semibold mb-1 block">Kategori:</label>
        <select value={categoryMode} onChange={(e) => setCategoryMode(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold">
          {PRESET_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          <option value="custom">➕ + Tambah Kategori Baru...</option>
        </select>
      </div>

      {categoryMode === 'custom' && (
        <div className="p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-1 animate-in fade-in-50">
          <label className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
            <PlusCircle className="w-3.5 h-3.5 text-amber-400" /><span>Nama Kategori Baru / Bebas:</span>
          </label>
          <input type="text" required value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="Misal: Promo Ramadhan / UMKM Binaan" className="w-full bg-slate-800 border border-amber-700/60 rounded-lg px-2.5 py-1.5 text-amber-300 font-semibold focus:outline-none" />
        </div>
      )}
    </div>
  );
};
