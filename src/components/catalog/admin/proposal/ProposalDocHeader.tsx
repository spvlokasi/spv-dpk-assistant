import React from 'react';
import { Branch } from '../../../../types';

interface ProposalDocHeaderProps {
  branch: Branch;
  proposalNo: string;
  programTitle: string;
  companyName: string;
  brandName: string;
}

export const ProposalDocHeader: React.FC<ProposalDocHeaderProps> = ({
  branch, proposalNo, programTitle, companyName, brandName
}) => {
  return (
    <>
      <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Basmalah" className="h-12 w-auto object-contain" />
          <div>
            <h1 className="text-base font-black tracking-tight text-emerald-900 font-sans uppercase">DEPARTEMEN BISNIS & PENGAWASAN KHUSUS (DPK)</h1>
            <h2 className="text-xs font-extrabold text-slate-800 font-sans">JARINGAN RETAIL MODERN TOKOBASMALAH JAWA TIMUR</h2>
            <p className="text-[10px] text-slate-600 font-sans mt-0.5">Unit Layanan: {branch.name} • Wilayah: {branch.city || 'Jawa Timur'}</p>
          </div>
        </div>
        <div className="text-right text-[10px] font-sans text-slate-600">
          <div className="font-bold text-slate-800">DOKUMEN RESMI</div>
          <div>No: {proposalNo}</div>
          <div>Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      <div className="space-y-2 text-center pt-2">
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-sans text-[11px] font-black tracking-wider uppercase inline-block">
          PROPOSAL KERJASAMA CO-MARKETING & TRADE PROMOTION
        </span>
        <h3 className="text-base font-black text-slate-950 font-sans">{programTitle}</h3>
        <p className="text-[11px] text-slate-600 font-sans italic">
          Kemitraan Strategis Bersama: <strong>{companyName}</strong> ({brandName}) & <strong>{branch.name}</strong>
        </p>
      </div>
    </>
  );
};
