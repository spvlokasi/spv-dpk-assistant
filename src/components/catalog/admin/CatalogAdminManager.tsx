import React, { useState, useEffect } from 'react';
import { Branch, PromoProduct, PromoVoucher } from '../../../types';
import { UserAccount } from '../../../types/auth';
import { loadPromoProducts, savePromoProduct, deletePromoProduct, loadPromoVouchers, savePromoVoucher, deletePromoVoucher, fetchPromoProductsFromCloud, fetchPromoVouchersFromCloud } from '../../../services/catalog/catalogStorage';
import { CatalogAdminHeader } from './header/CatalogAdminHeader';
import { CatalogAdminTabs } from './header/CatalogAdminTabs';
import { PromoProductList } from './PromoProductList';
import { PromoProductModal } from './PromoProductModal';
import { PromoVoucherManager } from './PromoVoucherManager';
import { FlyerGeneratorModal } from './FlyerGeneratorModal';
import { StorePhoneEditModal } from './StorePhoneEditModal';
import { SupplierProposalModal } from './SupplierProposalModal';
import { OnlineOrderLogManager } from './OnlineOrderLogManager';

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
  const isKtb = Boolean(
    currentUser?.username?.toLowerCase().startsWith('ktb.') ||
    currentUser?.roleTitle?.toLowerCase().includes('kepala toko') ||
    currentUser?.roleTitle?.toLowerCase().includes('ktb') ||
    (currentUser?.branchCode && currentUser.branchCode.length > 0)
  );
  const availableBranches = isKtb && propBranchId ? branches.filter((b) => b.id === propBranchId) : branches;
  const [selectedBranchId, setSelectedBranchId] = useState(propBranchId || branches[0]?.id || 'br-01');
  const [activeTab, setActiveTab] = useState<'products' | 'vouchers' | 'orders'>('products');
  const [products, setProducts] = useState<PromoProduct[]>(() => loadPromoProducts(selectedBranchId));
  const [vouchers, setVouchers] = useState<PromoVoucher[]>(() => loadPromoVouchers(selectedBranchId));
  const [editingProduct, setEditingProduct] = useState<PromoProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const currentBranch = availableBranches.find((b) => b.id === selectedBranchId) || availableBranches[0] || branches[0];

  useEffect(() => {
    if (propBranchId) setSelectedBranchId(propBranchId);
  }, [propBranchId]);

  useEffect(() => {
    let isMounted = true;
    setProducts(loadPromoProducts(selectedBranchId));
    setVouchers(loadPromoVouchers(selectedBranchId));

    Promise.all([
      fetchPromoProductsFromCloud(selectedBranchId),
      fetchPromoVouchersFromCloud(selectedBranchId)
    ]).then(([liveProds, liveVouchs]) => {
      if (isMounted) {
        setProducts(liveProds);
        setVouchers(liveVouchs);
      }
    });

    return () => { isMounted = false; };
  }, [selectedBranchId]);

  return (
    <div className="space-y-4">
      <CatalogAdminHeader isKtb={isKtb} branches={branches} currentBranch={currentBranch} selectedBranchId={selectedBranchId} onSelectBranch={setSelectedBranchId} onOpenPhoneModal={() => setShowPhoneModal(true)} onOpenProposalModal={() => setIsProposalOpen(true)} onOpenFlyerModal={() => setIsFlyerOpen(true)} onOpenPublicCatalog={onOpenPublicCatalog} />
      <CatalogAdminTabs activeTab={activeTab} setActiveTab={setActiveTab} productsCount={products.length} vouchersCount={vouchers.length} />

      {activeTab === 'products' ? (
        <PromoProductList products={products} onAddNew={() => { setEditingProduct(null); setIsModalOpen(true); }} onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true); }} onDelete={(id) => setProducts(deletePromoProduct(id, selectedBranchId))} onToggleStock={(p) => setProducts(savePromoProduct({ ...p, inStock: !p.inStock }, selectedBranchId))} />
      ) : activeTab === 'vouchers' ? (
        <PromoVoucherManager vouchers={vouchers} branchId={selectedBranchId} branches={branches} currentUser={currentUser} onOpenProposalModal={() => setIsProposalOpen(true)} onSaveVoucher={(v) => setVouchers(savePromoVoucher(v, selectedBranchId))} onDeleteVoucher={(id) => setVouchers(deletePromoVoucher(id, selectedBranchId))} />
      ) : (
        <OnlineOrderLogManager branch={currentBranch} />
      )}

      {isModalOpen && <PromoProductModal product={editingProduct} branchId={selectedBranchId} onSave={(p) => setProducts(savePromoProduct(p, selectedBranchId))} onClose={() => setIsModalOpen(false)} />}
      {isFlyerOpen && currentBranch && <FlyerGeneratorModal branch={currentBranch} products={products} vouchers={vouchers} onClose={() => setIsFlyerOpen(false)} />}
      {isProposalOpen && currentBranch && <SupplierProposalModal branch={currentBranch} onApplyVoucherToStore={(v) => setVouchers(savePromoVoucher(v))} onClose={() => setIsProposalOpen(false)} />}
      {showPhoneModal && currentBranch && <StorePhoneEditModal branch={currentBranch} onSaved={() => { if (onRefreshBranch) onRefreshBranch(); }} onClose={() => setShowPhoneModal(false)} />}
    </div>
  );
};
