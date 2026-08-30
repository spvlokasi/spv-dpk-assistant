import React from 'react';
import { Edit3, Eye } from 'lucide-react';
import { ProposalIdentitySection } from './ProposalIdentitySection';
import { ProposalBudgetSection } from './ProposalBudgetSection';

interface ProposalEditorTabProps {
  proposalNo: string;
  setProposalNo: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  brandName: string;
  setBrandName: (v: string) => void;
  picName: string;
  setPicName: (v: string) => void;
  programTitle: string;
  setProgramTitle: (v: string) => void;
  focusProducts: string;
  setFocusProducts: (v: string) => void;
  backgroundStory: string;
  setBackgroundStory: (v: string) => void;
  discountPerUnit: number;
  setDiscountPerUnit: (v: number) => void;
  minSpend: number;
  setMinSpend: (v: number) => void;
  voucherQuota: number;
  setVoucherQuota: (v: number) => void;
  fundingScheme: 'supplier' | 'joint' | 'store';
  setFundingScheme: (v: 'supplier' | 'joint' | 'store') => void;
  spvSignName: string;
  setSpvSignName: (v: string) => void;
  ktbSignName: string;
  setKtbSignName: (v: string) => void;
  onGoPreview: () => void;
}

export const ProposalEditorTab: React.FC<ProposalEditorTabProps> = ({
  proposalNo, setProposalNo, companyName, setCompanyName, brandName, setBrandName,
  picName, setPicName, programTitle, setProgramTitle, focusProducts, setFocusProducts,
  backgroundStory, setBackgroundStory, discountPerUnit, setDiscountPerUnit,
  minSpend, setMinSpend, voucherQuota, setVoucherQuota, fundingScheme, setFundingScheme,
  spvSignName, setSpvSignName, ktbSignName, setKtbSignName, onGoPreview
}) => {
  return (
    <div className="no-print bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-4 text-xs">
      <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
        <Edit3 className="w-4 h-4" /><span>Formulir Pengeditan Proposal & Anggaran:</span>
      </h4>

      <ProposalIdentitySection proposalNo={proposalNo} setProposalNo={setProposalNo} companyName={companyName} setCompanyName={setCompanyName} brandName={brandName} setBrandName={setBrandName} picName={picName} setPicName={setPicName} programTitle={programTitle} setProgramTitle={setProgramTitle} focusProducts={focusProducts} setFocusProducts={setFocusProducts} backgroundStory={backgroundStory} setBackgroundStory={setBackgroundStory} />
      <ProposalBudgetSection discountPerUnit={discountPerUnit} setDiscountPerUnit={setDiscountPerUnit} minSpend={minSpend} setMinSpend={setMinSpend} voucherQuota={voucherQuota} setVoucherQuota={setVoucherQuota} fundingScheme={fundingScheme} setFundingScheme={setFundingScheme} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nama Supervisor (TTD)</label>
          <input type="text" value={spvSignName} onChange={(e) => setSpvSignName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nama Kepala Toko (TTD)</label>
          <input type="text" value={ktbSignName} onChange={(e) => setKtbSignName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none" />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button type="button" onClick={onGoPreview} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/60">
          <Eye className="w-4 h-4" /><span>Lihat Hasil Surat Resmi →</span>
        </button>
      </div>
    </div>
  );
};
