import React, { useState, useEffect } from 'react';
import { Plus, Minus, Image as ImageIcon } from 'lucide-react';
import { CartItem } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface CartItemListProps {
  items: CartItem[];
  onUpdateQty: (prodId: string, qty: number) => void;
}

const QuantityInput: React.FC<{
  quantity: number;
  onUpdate: (qty: number) => void;
}> = ({ quantity, onUpdate }) => {
  const [val, setVal] = useState(quantity.toString());

  useEffect(() => {
    setVal(quantity.toString());
  }, [quantity]);

  const commitValue = () => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setVal('1');
      onUpdate(1);
    } else {
      setVal(parsed.toString());
      onUpdate(parsed);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={val}
      onFocus={(e) => e.target.select()}
      onChange={(e) => setVal(e.target.value.replace(/[^0-9]/g, ''))}
      onBlur={commitValue}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        }
      }}
      className="w-10 h-7 text-center font-mono font-bold text-xs text-white bg-slate-900 border border-slate-700 hover:border-slate-500 focus:border-emerald-500 focus:bg-slate-950 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none transition-all select-all"
      title="Ketik angka langsung untuk mengubah jumlah"
    />
  );
};

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
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onUpdateQty(i.product.id, i.quantity - 1)}
              className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Kurangi 1"
            >
              <Minus className="w-3 h-3" />
            </button>
            <QuantityInput
              quantity={i.quantity}
              onUpdate={(qty) => onUpdateQty(i.product.id, qty)}
            />
            <button
              onClick={() => onUpdateQty(i.product.id, i.quantity + 1)}
              className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Tambah 1"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
