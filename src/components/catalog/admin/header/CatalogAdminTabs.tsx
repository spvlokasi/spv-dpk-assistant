import React from 'react';
import { ShoppingBag, Ticket, Truck } from 'lucide-react';

interface CatalogAdminTabsProps {
  activeTab: 'products' | 'vouchers' | 'orders';
  setActiveTab: (tab: 'products' | 'vouchers' | 'orders') => void;
  productsCount: number;
  vouchersCount: number;
}

export const CatalogAdminTabs: React.FC<CatalogAdminTabsProps> = ({
  activeTab, setActiveTab, productsCount, vouchersCount
}) => {
  return (
    <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
      <button
        onClick={() => setActiveTab('products')}
        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 ${
          activeTab === 'products'
            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Produk Promo ({productsCount})</span>
      </button>
      <button
        onClick={() => setActiveTab('vouchers')}
        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 ${
          activeTab === 'vouchers'
            ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Ticket className="w-3.5 h-3.5" />
        <span>E-Voucher Diskon ({vouchersCount})</span>
      </button>
      <button
        onClick={() => setActiveTab('orders')}
        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all flex-shrink-0 ${
          activeTab === 'orders'
            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Truck className="w-3.5 h-3.5" />
        <span>📦 Pesanan Online (COD)</span>
      </button>
    </div>
  );
};
