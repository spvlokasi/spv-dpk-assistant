import React, { useState } from 'react';
import { Copy, Check, Edit2 } from 'lucide-react';
import { Branch } from '../../../../types';
import { CatalogAdminActions } from './CatalogAdminActions';

interface CatalogAdminHeaderProps {
  isKtb: boolean;
  branches: Branch[];
  currentBranch: Branch;
  selectedBranchId: string;
  onSelectBranch: (id: string) => void;
  onOpenPhoneModal: () => void;
  onOpenProposalModal: () => void;
  onOpenFlyerModal: () => void;
  onOpenPublicCatalog?: (branchCode: string) => void;
}

export const CatalogAdminHeader: React.FC<CatalogAdminHeaderProps> = ({
  isKtb, branches, currentBranch, selectedBranchId, onSelectBranch,
  onOpenPhoneModal, onOpenProposalModal, onOpenFlyerModal, onOpenPublicCatalog
}) => {
  const getOfficialStoreParam = (b?: Branch) => {
    if (!b?.name) return 'TokoBasmalahBugih';
    const clean = b.name.replace(/\s+/g, '').replace(/tokobasmalah/i, '');
    return `TokoBasmalah${clean.charAt(0).toUpperCase() + clean.slice(1)}`;
  };
  const shareUrl = `https://belanja.dpk.my.id/?toko=${getOfficialStoreParam(currentBranch)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-2.5 sm:p-3 rounded-2xl flex flex-nowrap items-center justify-between gap-2 shadow-lg overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isKtb ? (
          <select
            value={selectedBranchId}
            onChange={(e) => onSelectBranch(e.target.value)}
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
            onClick={onOpenPhoneModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors shadow-sm flex-shrink-0"
            title="Klik untuk ubah nomor WhatsApp Kasir"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
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

      <CatalogAdminActions isKtb={isKtb} currentBranch={currentBranch} onOpenProposalModal={onOpenProposalModal} onOpenFlyerModal={onOpenFlyerModal} onOpenPublicCatalog={onOpenPublicCatalog} />
    </div>
  );
};
