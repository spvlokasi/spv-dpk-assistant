import React, { useState } from 'react';
import { Ticket, Plus } from 'lucide-react';
import { Branch, PromoVoucher, UserAccount } from '../../../types';
import { VoucherCreateModal } from './voucher/VoucherCreateModal';
import { VoucherListItem } from './voucher/VoucherListItem';

interface PromoVoucherManagerProps {
  vouchers: PromoVoucher[];
  branchId: string;
  branches?: Branch[];
  currentUser?: UserAccount | null;
  onOpenProposalModal?: () => void;
  onSaveVoucher: (v: PromoVoucher) => void;
  onDeleteVoucher: (id: string) => void;
}

export const PromoVoucherManager: React.FC<PromoVoucherManagerProps> = ({
  vouchers, branchId, branches = [], currentUser, onSaveVoucher, onDeleteVoucher
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSpv = !currentUser?.branchCode || currentUser?.roleTitle?.toLowerCase().includes('spv') || currentUser?.roleTitle?.toLowerCase().includes('supervisor');

  const toggleVoucherStatus = (v: PromoVoucher) => {
    onSaveVoucher({ ...v, isActive: !v.isActive });
  };

  const handleDelete = (v: PromoVoucher) => {
    const isGlobalOrSponsor = v.branchId === 'all' || v.fundingSource === 'sponsor' || v.fundingSource === 'dpk_turnaround';
    if (!isSpv && isGlobalOrSponsor) {
      alert('Voucher ini diterbitkan oleh SPV / Brand Sponsor dan hanya dapat dihapus oleh Supervisor DPK.');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus voucher ${v.code}?`)) {
      onDeleteVoucher(v.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">E-Voucher & Kupon Belanja</h4>
            <p className="text-[11px] text-slate-400">Total {vouchers.length} voucher aktif terdaftar</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="py-2 px-3.5 sm:px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md shadow-amber-950/60 flex items-center gap-1.5 transition-all text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{isSpv ? '+ Terbitkan Voucher Baru' : '+ Buat Kupon Diskon'}</span>
        </button>
      </div>

      <VoucherCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isSpv={isSpv} branchId={branchId} branches={branches} onSaveVoucher={onSaveVoucher} />

      {vouchers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
          <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
          <h5 className="text-sm font-bold text-slate-300">Belum Ada Voucher Diskon Aktif</h5>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isSpv 
              ? 'Klik tombol "+ Terbitkan Voucher Baru" di atas untuk membuat kupon potongan belanja konsumen.' 
              : 'Belum ada voucher yang dibuat untuk toko ini. Klik tombol "+ Buat Kupon Diskon" di atas untuk menambahkan kupon.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vouchers.map((v) => (
            <VoucherListItem key={v.id} voucher={v} onToggleStatus={toggleVoucherStatus} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};
