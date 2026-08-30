import React from 'react';

interface ProposalIdentitySectionProps {
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
}

export const ProposalIdentitySection: React.FC<ProposalIdentitySectionProps> = ({
  proposalNo, setProposalNo, companyName, setCompanyName, brandName, setBrandName,
  picName, setPicName, programTitle, setProgramTitle, focusProducts, setFocusProducts,
  backgroundStory, setBackgroundStory
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nomor Surat Proposal</label>
          <input type="text" value={proposalNo} onChange={(e) => setProposalNo(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nama Perusahaan / PT</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="PT Yakult Indonesia" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nama Brand Produk</label>
          <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Yakult" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">PIC Sales Supplier</label>
          <input type="text" value={picName} onChange={(e) => setPicName(e.target.value)} placeholder="Nama & Jabatan" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Judul Program Promosi</label>
          <input type="text" value={programTitle} onChange={(e) => setProgramTitle(e.target.value)} placeholder="Nama Program" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Daftar Produk Fokus</label>
          <textarea rows={2} value={focusProducts} onChange={(e) => setFocusProducts(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 font-semibold mb-1">Latar Belakang Singkat</label>
          <textarea rows={2} value={backgroundStory} onChange={(e) => setBackgroundStory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none" />
        </div>
      </div>
    </>
  );
};
