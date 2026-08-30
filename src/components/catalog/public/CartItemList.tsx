import React from 'react';
import { Plus, Minus, Image as ImageIcon } from 'lucide-react';
import { CartItem } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQty: (prodId: string, qty: number) => void;
}

export const CartItemList: React.FC<CartItemListProps> = ({ items, onUpdateQty }) => {
  if (items.length === 0) {
    return <p className="text-center text-xs text-slate-500 py-10">Keranjang masih kosong.</p>;
  }

  return (
    <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
      {items.map((i) => (
        <div key={i.product.id} className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {i.product.imageUrl ? (
              <img src={i.product.imageUrl} alt={i.product.name} className="w-11 h-11 rounded-lg object-cover border border-slate-700 flex-shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 flex-shrink-0">
                <ImageIcon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-slate-200 truncate">{i.product.name}</h5>
              <div className="text-[11px] text-emerald-400 font-mono">{formatRupiah(i.product.promoPrice)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => onUpdateQty(i.product.id, i.quantity - 1)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-white font-mono min-w-[14px] text-center">{i.quantity}</span>
            <button onClick={() => onUpdateQty(i.product.id, i.quantity + 1)} className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
