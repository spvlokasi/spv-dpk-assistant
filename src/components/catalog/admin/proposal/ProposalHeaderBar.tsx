import React from 'react';
import { FileText, Printer, X, Edit3, Eye, Copy, Check, CheckCircle2 } from 'lucide-react';

interface ProposalHeaderBarProps {
  activeTab: 'editor' | 'preview';
  setActiveTab: (tab: 'editor' | 'preview') => void;
  copiedWA: boolean;
  voucherInstalled: boolean;
  onPrint: () => void;
  onCopyWA: () => void;
  onInstallVoucher: () => void;
  onClose: () => void;
}

export const ProposalHeaderBar: React.FC<ProposalHeaderBarProps> = ({
  activeTab, setActiveTab, copiedWA, voucherInstalled,
  onPrint, onCopyWA, onInstallVoucher, onClose
}) => {
  return (
    <>
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-blue-950/80 border border-blue-700/60 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white">Editor Proposal Kerjasama Supplier (SPV)</h3>
            <p className="text-[11px] text-slate-400">Sesuaikan data & cetak dokumen penawaran resmi untuk Principal/Distributor</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onPrint} className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-950/60">
            <Printer className="w-3.5 h-3.5" /><span>Cetak / Simpan PDF</span>
          </button>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap no-print">
        <div className="flex gap-2">
          <button type="button" onClick={() => setActiveTab('editor')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTab === 'editor' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            <Edit3 className="w-3.5 h-3.5" /><span>✏️ Formulir Edit Proposal</span>
          </button>
          <button type="button" onClick={() => setActiveTab('preview')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTab === 'preview' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
            <Eye className="w-3.5 h-3.5" /><span>📄 Tinjau Surat Resmi (Live Preview)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onCopyWA} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700">
            {copiedWA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedWA ? 'Teks WA Tersalin!' : 'Salin Ringkasan WA'}</span>
          </button>
          <button type="button" onClick={onInstallVoucher} className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/60">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{voucherInstalled ? '✓ Voucher Terpasang di Toko!' : '+ Pasang Voucher Sponsor'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
