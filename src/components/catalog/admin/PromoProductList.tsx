import React from 'react';
import { Edit2, Trash2, Tag, Image as ImageIcon, Plus } from 'lucide-react';
import { PromoProduct } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface PromoProductListProps {
  products: PromoProduct[];
  onAddNew: () => void;
  onEdit: (prod: PromoProduct) => void;
  onDelete: (id: string) => void;
  onToggleStock: (prod: PromoProduct) => void;
}

export const PromoProductList: React.FC<PromoProductListProps> = ({
  products, onAddNew, onEdit, onDelete, onToggleStock
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h4 className="text-sm font-bold text-white">Daftar Produk Promo Toko ({products.length})</h4><p className="text-xs text-slate-400">Produk yang ditampilkan di website katalog belanja pembeli</p></div>
        <button onClick={onAddNew} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40"><Plus className="w-3.5 h-3.5" /><span>+ Tambah Produk</span></button>
      </div>
      {products.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-900 border border-dashed border-slate-800 rounded-2xl">Belum ada produk promo yang diinput. Klik "+ Tambah Produk" untuk mulai.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p) => {
            const diskonPct = Math.round(((p.originalPrice - p.promoPrice) / p.originalPrice) * 100);
            return (
              <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-2.5 shadow-lg relative group">
                <div className="flex gap-3 items-start">
                  {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-16 h-16 object-cover rounded-xl border border-slate-800 flex-shrink-0" /> : <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0"><ImageIcon className="w-6 h-6" /></div>}
                  <div className="min-w-0 flex-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-[10px] font-bold text-emerald-400">Hemat {diskonPct}%</span>
                    <h5 className="text-xs font-bold text-slate-200 mt-1 line-clamp-1">{p.name}</h5>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <span className="text-[11px] text-slate-500 line-through font-mono">{formatRupiah(p.originalPrice)}</span>
                      <strong className="text-emerald-400 font-mono font-bold">{formatRupiah(p.promoPrice)}</strong>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <button type="button" onClick={() => onToggleStock(p)} className={`px-2 py-0.5 rounded-md font-semibold ${p.inStock ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>{p.inStock ? '✓ Ada Stok' : '✕ Habis'}</button>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => onEdit(p)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={() => onDelete(p.id)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
