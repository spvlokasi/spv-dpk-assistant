import React, { useState, useEffect } from 'react';
import { ShoppingBag, Ticket, Printer, ExternalLink } from 'lucide-react';
import { Branch, PromoProduct, PromoVoucher } from '../../../types';
import { UserAccount } from '../../../types/auth';
import { loadPromoProducts, savePromoProduct, deletePromoProduct, loadPromoVouchers, savePromoVoucher, deletePromoVoucher } from '../../../services/catalog/catalogStorage';
import { PromoProductList } from './PromoProductList';
import { PromoProductModal } from './PromoProductModal';
import { PromoVoucherManager } from './PromoVoucherManager';
import { FlyerGeneratorModal } from './FlyerGeneratorModal';
import { CatalogShareLinkBar } from './CatalogShareLinkBar';

interface CatalogAdminManagerProps {
  branches: Branch[];
  selectedBranchId?: string | null;
  currentUser?: UserAccount;
  onOpenPublicCatalog?: (branchCode: string) => void;
}

export const CatalogAdminManager: React.FC<CatalogAdminManagerProps> = ({
  branches, selectedBranchId: propBranchId, currentUser, onOpenPublicCatalog
}) => {
  const isKtb = currentUser?.username.startsWith('ktb.') || currentUser?.roleTitle === 'Kepala Toko';
  const availableBranches = isKtb && propBranchId ? branches.filter((b) => b.id === propBranchId) : branches;
  const [selectedBranchId, setSelectedBranchId] = useState(propBranchId || branches[0]?.id || 'br-01');
  const [activeTab, setActiveTab] = useState<'products' | 'vouchers'>('products');
  const [products, setProducts] = useState<PromoProduct[]>([]);
  const [vouchers, setVouchers] = useState<PromoVoucher[]>([]);
  const [editingProduct, setEditingProduct] = useState<PromoProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);

  const currentBranch = availableBranches.find((b) => b.id === selectedBranchId) || availableBranches[0] || branches[0];

  useEffect(() => {
    if (propBranchId) setSelectedBranchId(propBranchId);
  }, [propBranchId]);

  useEffect(() => {
    setProducts(loadPromoProducts(selectedBranchId));
    setVouchers(loadPromoVouchers(selectedBranchId));
  }, [selectedBranchId]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400"><ShoppingBag className="w-5 h-5" /></div>
          <div><h2 className="text-base sm:text-lg font-extrabold text-white">Katalog Promo & E-Voucher</h2><p className="text-xs text-slate-400">{isKtb ? `Gerai: ${currentBranch?.name}` : 'Pilih cabang toko untuk mengelola promo'}</p></div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!isKtb && (
            <select value={selectedBranchId} onChange={(e) => setSelectedBranchId(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs font-semibold focus:outline-none">
              {branches.map((b) => <option key={b.id} value={b.id}>[{b.code}] {b.name}</option>)}
            </select>
          )}
          <button onClick={() => setIsFlyerOpen(true)} className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"><Printer className="w-3.5 h-3.5" /><span>Brosur Flyer</span></button>
          {onOpenPublicCatalog && <button onClick={() => onOpenPublicCatalog(currentBranch?.code || 'M3017')} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-1 border border-slate-700"><ExternalLink className="w-3.5 h-3.5" /><span>Buka Web Pembeli</span></button>}
        </div>
      </div>

      <CatalogShareLinkBar branch={currentBranch} />

      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${activeTab === 'products' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'}`}><ShoppingBag className="w-3.5 h-3.5" /><span>Produk Promo ({products.length})</span></button>
        <button onClick={() => setActiveTab('vouchers')} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${activeTab === 'vouchers' ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'}`}><Ticket className="w-3.5 h-3.5" /><span>E-Voucher Diskon ({vouchers.length})</span></button>
      </div>

      {activeTab === 'products' ? (
        <PromoProductList products={products} onAddNew={() => { setEditingProduct(null); setIsModalOpen(true); }} onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }} onDelete={(id) => setProducts(deletePromoProduct(id))} onToggleStock={(p) => setProducts(savePromoProduct({ ...p, inStock: !p.inStock }))} />
      ) : (
        <PromoVoucherManager vouchers={vouchers} branchId={selectedBranchId} onSaveVoucher={(v) => setVouchers(savePromoVoucher(v))} onDeleteVoucher={(id) => setVouchers(deletePromoVoucher(id))} />
      )}

      {isModalOpen && <PromoProductModal product={editingProduct} branchId={selectedBranchId} onSave={(p) => setProducts(savePromoProduct(p))} onClose={() => setIsModalOpen(false)} />}
      {isFlyerOpen && currentBranch && <FlyerGeneratorModal branch={currentBranch} products={products} vouchers={vouchers} onClose={() => setIsFlyerOpen(false)} />}
    </div>
  );
};
