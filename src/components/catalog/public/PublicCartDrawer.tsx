import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { Branch, CartItem, PromoVoucher } from '../../../types';
import { CartItemList } from './CartItemList';
import { CartCheckoutForm } from './CartCheckoutForm';

interface PublicCartDrawerProps {
  branch: Branch;
  items: CartItem[];
  appliedVoucher: PromoVoucher | null;
  onUpdateQty: (prodId: string, qty: number) => void;
  onClose: () => void;
}

export const PublicCartDrawer: React.FC<PublicCartDrawerProps> = ({
  branch, items, appliedVoucher, onUpdateQty, onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-4 sm:p-5 shadow-2xl animate-in slide-in-from-right">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Keranjang Belanja ({items.length})</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <CartItemList items={items} onUpdateQty={onUpdateQty} />
        <CartCheckoutForm branch={branch} items={items} appliedVoucher={appliedVoucher} />
      </div>
    </div>
  );
};
