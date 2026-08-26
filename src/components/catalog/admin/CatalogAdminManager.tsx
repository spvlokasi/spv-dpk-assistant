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
      {/* Satu Control Bar Tunggal yang Rapi, Padat, & Elegan */}
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Sisi Kiri: Identitas Toko, WA Kasir, & Salin Link Cepat */}
        <div className="flex items-center gap-2 flex-wrap">
          {!isKtb ? (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-100 text-xs font-bold focus:outline-none focus:border-emerald-500 shadow-sm"
            >
              {branches.map((b) => <option key={b.id} value={b.id}>[{b.code}] {b.name}</option>)}
            </select>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-bold">
              [{currentBranch?.code}] {currentBranch?.name}
            </div>
          )}

          {currentBranch && (
            <button
              type="button"
              onClick={() => setShowPhoneModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors shadow-sm"
              title="Ubah Nomor WhatsApp Kasir"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">WA Kasir: <strong className="text-emerald-400 font-mono">{currentBranch.phone || 'Belum Diatur'}</strong></span>
              <Edit2 className="w-2.5 h-2.5 text-slate-400" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors shadow-sm"
            title="Salin Link Web Pembeli"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span className="text-[11px] font-semibold">{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>
        </div>

        {/* Sisi Kanan: Tombol-tombol Aksi Cepat */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          <button
            type="button"
            onClick={() => setIsFlyerOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Brosur Flyer</span>
          </button>

          {onOpenPublicCatalog && (
            <button
              type="button"
              onClick={() => onOpenPublicCatalog(currentBranch?.code || 'M3017')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Buka Web</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleShareWA}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/60 transition-all"
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
