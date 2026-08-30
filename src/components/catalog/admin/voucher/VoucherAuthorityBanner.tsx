import React from 'react';
import { Crown, Store, FileText } from 'lucide-react';
import { Branch } from '../../../../types';

interface VoucherAuthorityBannerProps {
  isSpv: boolean;
  currentBranchObj?: Branch;
  onOpenProposalModal?: () => void;
}

export const VoucherAuthorityBanner: React.FC<VoucherAuthorityBannerProps> = ({
  isSpv, currentBranchObj, onOpenProposalModal
}) => {
  return (
    <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
      isSpv 
        ? 'bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/40 border-amber-500/40' 
        : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl border ${
          isSpv ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        }`}>
          {isSpv ? <Crown className="w-5 h-5" /> : <Store className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-white">
              {isSpv ? 'Pusat Otoritas Voucher & Co-Marketing SPV DPK' : `Panel Voucher Toko [${currentBranchObj?.code || 'KTB'}]`}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isSpv 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isSpv ? '⭐ Hak Akses Penuh SPV' : '🏪 Hak Akses Kepala Toko'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isSpv 
              ? 'Wewenang penuh menerbitkan voucher diskon lintas cabang, subsidi turnaround, dan kemitraan co-marketing brand.' 
              : 'Melihat dan mengaktifkan voucher promo belanja untuk pelanggan di cabang Anda.'}
          </p>
        </div>
      </div>

      {isSpv && onOpenProposalModal && (
        <button
          type="button"
          onClick={onOpenProposalModal}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-950/40 transition-all flex-shrink-0"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>+ Proposal Co-Marketing</span>
        </button>
      )}
    </div>
  );
};
