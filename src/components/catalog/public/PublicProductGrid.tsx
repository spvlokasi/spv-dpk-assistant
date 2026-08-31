import React from 'react';
import { Plus, Check, Image as ImageIcon } from 'lucide-react';
import { PromoProduct } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface PublicProductGridProps {
  products: PromoProduct[];
  cartCounts: Record<string, number>;
  onAddToCart: (prod: PromoProduct) => void;
}

export const PublicProductGrid: React.FC<PublicProductGridProps> = ({
  products, cartCounts, onAddToCart
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {products.map((p) => {
        const diskonPct = Math.round(((p.originalPrice - p.promoPrice) / p.originalPrice) * 100);
        const inCart = cartCounts[p.id] || 0;

        return (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group">
            <div className="relative aspect-square bg-slate-850 flex items-center justify-center overflow-hidden">
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <ImageIcon className="w-10 h-10 text-slate-700" />
              )}
              {diskonPct > 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-rose-600 text-white font-black text-[10px] shadow">
                  Diskon {diskonPct}%
                </span>
              )}
            </div>

            <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-semibold uppercase">{p.category || 'Promo'}</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">{p.name}</h4>
                <span className="text-[10px] text-slate-400 block mt-0.5">{p.unit}</span>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-500 line-through font-mono">{formatRupiah(p.originalPrice)}</div>
                  <div className="text-sm font-extrabold text-emerald-400 font-mono">{formatRupiah(p.promoPrice)}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onAddToCart(p)}
                  className={`w-full py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    inCart > 0
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {inCart > 0 ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{inCart > 0 ? `+${inCart} di Keranjang` : '+ Tambah'}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
