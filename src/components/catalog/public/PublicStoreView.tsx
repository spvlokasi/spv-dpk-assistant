import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Branch, PromoProduct, PromoVoucher, CartItem } from '../../../types';
import { loadPromoProducts, loadPromoVouchers } from '../../../services/catalog/catalogStorage';
import { PublicCatalogHeader } from './PublicCatalogHeader';
import { PublicVoucherBanner } from './PublicVoucherBanner';
import { PublicProductGrid } from './PublicProductGrid';
import { PublicCartDrawer } from './PublicCartDrawer';
import { formatRupiah } from '../../../utils/formatters';

interface PublicStoreViewProps {
  branch: Branch;
  onBackToApp?: () => void;
}

export const PublicStoreView: React.FC<PublicStoreViewProps> = ({ branch, onBackToApp }) => {
  const [products, setProducts] = useState<PromoProduct[]>([]);
  const [vouchers, setVouchers] = useState<PromoVoucher[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedVoucher, setAppliedVoucher] = useState<PromoVoucher | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setProducts(loadPromoProducts(branch.id));
    const loadedVouchers = loadPromoVouchers(branch.id);
    setVouchers(loadedVouchers);
    if (loadedVouchers.length > 0) setAppliedVoucher(loadedVouchers[0]);
  }, [branch.id]);

  const handleAddToCart = (product: PromoProduct) => {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) setCart(cart.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)));
    else setCart([...cart, { product, quantity: 1 }]);
  };

  const handleUpdateQty = (prodId: string, qty: number) => {
    if (qty <= 0) setCart(cart.filter((i) => i.product.id !== prodId));
    else setCart(cart.map((i) => (i.product.id === prodId ? { ...i, quantity: qty } : i)));
  };

  const cartCounts = cart.reduce((acc, i) => ({ ...acc, [i.product.id]: i.quantity }), {} as Record<string, number>);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.product.promoPrice * i.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <PublicCatalogHeader branch={branch} onBackToApp={onBackToApp} />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Baris Badge Ringkas (Opsi 2) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-[11px] font-semibold text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 flex-shrink-0 shadow-sm">
            <span>🚚</span>
            <span>Bayar di Tempat (COD)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 flex-shrink-0 shadow-sm">
            <span>🏷️</span>
            <span>Harga Coret Promo</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-teal-300 flex-shrink-0 shadow-sm">
            <span>💬</span>
            <span>Pesan Cepat via WA</span>
          </div>
        </div>

        <PublicVoucherBanner vouchers={vouchers} appliedVoucherCode={appliedVoucher?.code || null} onApplyVoucher={(v) => setAppliedVoucher(v)} />
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-white">🔥 Produk Sembako & Promo Hemat Hari Ini:</h3>
          <PublicProductGrid products={products} cartCounts={cartCounts} onAddToCart={handleAddToCart} />
        </div>
      </main>

      {totalItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
          <button onClick={() => setIsCartOpen(true)} className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-between shadow-2xl shadow-emerald-950/80 active:scale-95 transition-all">
            <div className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /><span className="text-xs bg-white text-emerald-900 px-2 py-0.5 rounded-full font-extrabold font-mono">{totalItems}</span><span>Lihat Keranjang</span></div>
            <strong className="font-mono text-sm">{formatRupiah(subtotal)}</strong>
          </button>
        </div>
      )}

      {isCartOpen && <PublicCartDrawer branch={branch} items={cart} appliedVoucher={appliedVoucher} onUpdateQty={handleUpdateQty} onClose={() => setIsCartOpen(false)} />}
    </div>
  );
};
