import React, { useState, useEffect } from 'react';
import { ShoppingBag, Ticket, Printer, ExternalLink, Share2, Copy, Check, Phone, Edit2 } from 'lucide-react';
import { Branch, PromoProduct, PromoVoucher } from '../../../types';
import { UserAccount } from '../../../types/auth';
import { loadPromoProducts, savePromoProduct, deletePromoProduct, loadPromoVouchers, savePromoVoucher, deletePromoVoucher } from '../../../services/catalog/catalogStorage';
import { PromoProductList } from './PromoProductList';
import { PromoProductModal } from './PromoProductModal';
import { PromoVoucherManager } from './PromoVoucherManager';
import { FlyerGeneratorModal } from './FlyerGeneratorModal';
import { StorePhoneEditModal } from './StorePhoneEditModal';

interface CatalogAdminManagerProps {
  branches: Branch[];
  selectedBranchId?: string | null;
  currentUser?: UserAccount;
  onRefreshBranch?: () => void;
  onOpenPublicCatalog?: (branchCode: string) => void;
}

export const CatalogAdminManager: React.FC<CatalogAdminManagerProps> = ({
  branches, selectedBranchId: propBranchId, currentUser, onRefreshBranch, onOpenPublicCatalog
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
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentBranch = availableBranches.find((b) => b.id === selectedBranchId) || availableBranches[0] || branches[0];
  const shareUrl = `https://basmalahbelanja.vercel.app/?toko=${currentBranch?.code || 'M3017'}`;

  useEffect(() => {
    if (propBranchId) setSelectedBranchId(propBranchId);
  }, [propBranchId]);

  useEffect(() => {
    setProducts(loadPromoProducts(selectedBranchId));
    setVouchers(loadPromoVouchers(selectedBranchId));
  }, [selectedBranchId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWA = () => {
    const text = `*PROMO HEMAT TOKOBASMALAH ${currentBranch?.name?.toUpperCase()}!*\n` +
      `Dapatkan sembako murah, diskon harga coret & klaim voucher potongan belanja!\n` +
      `Bisa pesan antar langsung sampai ke rumah (COD).\n\n` +
      `👉 *Buka Katalog Belanja Kami:* ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Satu Control Bar Tunggal yang Rapi, Padat, 1 Baris Penuh */}
      <div className="bg-slate-900 border border-slate-800 p-2.5 sm:p-3 rounded-2xl flex flex-nowrap items-center justify-between gap-2 shadow-lg overflow-x-auto scrollbar-none">
        {/* Sisi Kiri: Identitas Toko, WA Kasir, & Salin Link Cepat */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isKtb ? (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs font-bold focus:outline-none focus:border-emerald-500 shadow-sm flex-shrink-0"
            >
              {branches.map((b) => <option key={b.id} value={b.id}>[{b.code}] {b.name}</option>)}
            </select>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-bold flex-shrink-0">
              [{currentBranch?.code}] {currentBranch?.name}
            </div>
          )}

          {currentBranch && (
            <button
              type="button"
              onClick={() => setShowPhoneModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors shadow-sm flex-shrink-0"
              title="Klik untuk ubah nomor WhatsApp Kasir"
            >
              <svg className="w-3.5 h-3.5 text-emerald-400 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.11 7.44C8.94 7.44 8.68 7.5 8.46 7.74C8.24 7.97 7.62 8.56 7.62 9.75C7.62 10.94 8.49 12.08 8.61 12.24C8.73 12.4 10.3 14.83 12.72 15.87C14.73 16.74 15.14 16.56 15.58 16.52C16.02 16.48 17 15.94 17.2 15.38C17.4 14.81 17.4 14.33 17.34 14.23C17.28 14.12 17.12 14.07 16.87 13.94C16.63 13.82 15.42 13.23 15.2 13.14C14.97 13.06 14.81 13.02 14.65 13.27C14.48 13.51 14.01 14.07 13.87 14.23C13.72 14.39 13.58 14.41 13.34 14.29C13.09 14.17 12.3 13.91 11.36 13.07C10.63 12.42 10.13 11.61 9.99 11.37C9.85 11.12 9.97 10.99 10.1 10.87C10.21 10.76 10.35 10.58 10.47 10.44C10.59 10.3 10.63 10.19 10.71 10.03C10.79 9.87 10.75 9.73 10.69 9.61C10.63 9.49 10.13 8.28 9.93 7.78C9.73 7.29 9.53 7.36 9.38 7.35C9.24 7.35 9.11 7.44 9.11 7.44Z"/>
              </svg>
              <strong className="text-emerald-400 font-mono text-[11px]">{currentBranch.phone || 'Atur WA'}</strong>
              <Edit2 className="w-2.5 h-2.5 text-slate-400" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors shadow-sm flex-shrink-0"
            title="Salin Link Web Pembeli"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-[11px] font-semibold">{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>
        </div>

        {/* Sisi Kanan: Tombol-tombol Aksi Cepat */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsFlyerOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all flex-shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Brosur Flyer</span>
          </button>

          {onOpenPublicCatalog && (
            <button
              type="button"
              onClick={() => onOpenPublicCatalog(currentBranch?.code || 'M3017')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Buka Web</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShareWA}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/60 transition-all flex-shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan Promo</span>
          </button>
        </div>
      </div>

      {/* Tab Navigasi Produk & Voucher */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'products'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Produk Promo ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('vouchers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            activeTab === 'vouchers'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>E-Voucher Diskon ({vouchers.length})</span>
        </button>
      </div>

      {/* Konten Tab */}
      {activeTab === 'products' ? (
        <PromoProductList
          products={products}
          onAddNew={() => { setEditingProduct(null); setIsModalOpen(true); }}
          onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
          onDelete={(id) => setProducts(deletePromoProduct(id))}
          onToggleStock={(p) => setProducts(savePromoProduct({ ...p, inStock: !p.inStock }))}
        />
      ) : (
        <PromoVoucherManager
          vouchers={vouchers}
          branchId={selectedBranchId}
          onSaveVoucher={(v) => setVouchers(savePromoVoucher(v))}
          onDeleteVoucher={(id) => setVouchers(deletePromoVoucher(id))}
        />
      )}

      {isModalOpen && (
        <PromoProductModal
          product={editingProduct}
          branchId={selectedBranchId}
          onSave={(p) => setProducts(savePromoProduct(p))}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isFlyerOpen && currentBranch && (
        <FlyerGeneratorModal
          branch={currentBranch}
          products={products}
          vouchers={vouchers}
          onClose={() => setIsFlyerOpen(false)}
        />
      )}

      {showPhoneModal && currentBranch && (
        <StorePhoneEditModal
          branch={currentBranch}
          onSaved={() => { if (onRefreshBranch) onRefreshBranch(); }}
          onClose={() => setShowPhoneModal(false)}
        />
      )}
    </div>
  );
};
