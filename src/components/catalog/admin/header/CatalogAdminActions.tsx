import React from 'react';
import { Printer, ExternalLink, Share2, FileText } from 'lucide-react';
import { Branch } from '../../../../types';

interface CatalogAdminActionsProps {
  isKtb: boolean;
  currentBranch: Branch;
  onOpenProposalModal: () => void;
  onOpenFlyerModal: () => void;
  onOpenPublicCatalog?: (branchCode: string) => void;
}

export const CatalogAdminActions: React.FC<CatalogAdminActionsProps> = ({
  isKtb, currentBranch, onOpenProposalModal, onOpenFlyerModal, onOpenPublicCatalog
}) => {
  const getOfficialStoreParam = (b?: Branch) => {
    if (!b?.name) return 'TokoBasmalahBugih';
    const clean = b.name.replace(/\s+/g, '').replace(/tokobasmalah/i, '');
    return `TokoBasmalah${clean.charAt(0).toUpperCase() + clean.slice(1)}`;
  };
  const shareUrl = `https://belanja.dpk.my.id/?toko=${getOfficialStoreParam(currentBranch)}`;

  const handleShareWA = () => {
    const text = `*PROMO HEMAT TOKOBASMALAH ${currentBranch?.name?.toUpperCase()}!*\n` +
      `Dapatkan sembako murah, diskon harga coret & klaim voucher potongan belanja!\n` +
      `Bisa pesan antar langsung sampai ke rumah (COD).\n\n` +
      `👉 *Buka Katalog Belanja Kami:* ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {!isKtb && (
        <button
          type="button"
          onClick={onOpenProposalModal}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-950/40 transition-all flex-shrink-0"
          title="Buat Proposal Kerjasama Supplier"
        >
          <FileText className="w-3.5 h-3.5" /><span>Proposal Supplier</span>
        </button>
      )}

      <button
        type="button"
        onClick={onOpenFlyerModal}
        className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all flex-shrink-0"
      >
        <Printer className="w-3.5 h-3.5" /><span>Brosur Flyer</span>
      </button>

      {onOpenPublicCatalog && (
        <button
          type="button"
          onClick={() => onOpenPublicCatalog(currentBranch?.code || 'M3017')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors flex-shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /><span>Buka Web</span>
        </button>
      )}

      <button
        type="button"
        onClick={handleShareWA}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/60 transition-all flex-shrink-0"
      >
        <Share2 className="w-3.5 h-3.5" /><span>Bagikan Promo</span>
      </button>
    </div>
  );
};
