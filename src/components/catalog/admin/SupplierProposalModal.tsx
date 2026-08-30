import React from 'react';
import { Sparkles } from 'lucide-react';
import { Branch, PromoVoucher } from '../../../types';
import { PROPOSAL_PRESETS } from './proposal/proposalPresetsData';
import { ProposalHeaderBar } from './proposal/ProposalHeaderBar';
import { ProposalEditorTab } from './proposal/ProposalEditorTab';
import { ProposalPreviewDoc } from './proposal/ProposalPreviewDoc';
import { useProposalForm } from './proposal/useProposalForm';

interface SupplierProposalModalProps {
  branch: Branch;
  onClose: () => void;
  onApplyVoucherToStore?: (voucher: PromoVoucher) => void;
}

export const SupplierProposalModal: React.FC<SupplierProposalModalProps> = ({
  branch, onClose, onApplyVoucherToStore
}) => {
  const form = useProposalForm(branch, onApplyVoucherToStore);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 my-auto max-h-[95vh] overflow-y-auto">
        <ProposalHeaderBar activeTab={form.activeTab} setActiveTab={form.setActiveTab} copiedWA={form.copiedWA} voucherInstalled={form.voucherInstalled} onPrint={() => window.print()} onCopyWA={form.handleCopyWA} onInstallVoucher={form.handleInstallVoucher} onClose={onClose} />

        <div className="no-print bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-amber-400" /><span>Pilih Template Brand Cepat:</span></label>
            <span className="text-[10px] text-emerald-400 font-semibold">Toko Target: {branch.name}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PROPOSAL_PRESETS.map((p) => (
              <button key={p.id} type="button" onClick={() => form.handleSelectPreset(p.id)} className={`p-2.5 rounded-xl border text-left transition-all ${form.selectedPresetId === p.id ? 'bg-blue-950/70 border-blue-500 text-white shadow-md' : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-300'}`}>
                <div className="font-bold text-xs">{p.name}</div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.focusProducts}</p>
              </button>
            ))}
          </div>
        </div>

        {form.activeTab === 'editor' ? (
          <ProposalEditorTab proposalNo={form.proposalNo} setProposalNo={form.setProposalNo} companyName={form.companyName} setCompanyName={form.setCompanyName} brandName={form.brandName} setBrandName={form.setBrandName} picName={form.picName} setPicName={form.setPicName} programTitle={form.programTitle} setProgramTitle={form.setProgramTitle} focusProducts={form.focusProducts} setFocusProducts={form.setFocusProducts} backgroundStory={form.backgroundStory} setBackgroundStory={form.setBackgroundStory} discountPerUnit={form.discountPerUnit} setDiscountPerUnit={form.setDiscountPerUnit} minSpend={form.minSpend} setMinSpend={form.setMinSpend} voucherQuota={form.voucherQuota} setVoucherQuota={form.setVoucherQuota} fundingScheme={form.fundingScheme} setFundingScheme={form.setFundingScheme} spvSignName={form.spvSignName} setSpvSignName={form.setSpvSignName} ktbSignName={form.ktbSignName} setKtbSignName={form.setKtbSignName} onGoPreview={() => form.setActiveTab('preview')} />
        ) : (
          <ProposalPreviewDoc branch={branch} proposalNo={form.proposalNo} programTitle={form.programTitle} companyName={form.companyName} brandName={form.brandName} picName={form.picName} focusProducts={form.focusProducts} backgroundStory={form.backgroundStory} discountPerUnit={form.discountPerUnit} minSpend={form.minSpend} voucherQuota={form.voucherQuota} targetSalesUnits={form.targetSalesUnits} targetOmzet={form.targetOmzet} totalSponsorBudget={form.totalSponsorBudget} supplierContribution={form.supplierContribution} spvSignName={form.spvSignName} ktbSignName={form.ktbSignName} />
        )}
      </div>
    </div>
  );
};
