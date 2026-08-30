import React from 'react';
import { Ticket } from 'lucide-react';
import { Branch, PromoVoucher, UserAccount } from '../../../types';
import { VoucherAuthorityBanner } from './voucher/VoucherAuthorityBanner';
import { VoucherCreateForm } from './voucher/VoucherCreateForm';
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
  vouchers, branchId, branches = [], currentUser,
  onOpenProposalModal, onSaveVoucher, onDeleteVoucher
}) => {
  const isSpv = !currentUser?.branchCode || currentUser?.roleTitle?.toLowerCase().includes('spv') || currentUser?.roleTitle?.toLowerCase().includes('supervisor');
  const currentBranchObj = branches.find((b) => b.id === branchId);

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
      <VoucherAuthorityBanner isSpv={isSpv} currentBranchObj={currentBranchObj} onOpenProposalModal={onOpenProposalModal} />
      <VoucherCreateForm isSpv={isSpv} branchId={branchId} branches={branches} onSaveVoucher={onSaveVoucher} />

      {vouchers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
          <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
          <h5 className="text-sm font-bold text-slate-300">Belum Ada Voucher Diskon Aktif</h5>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isSpv 
              ? 'Silakan gunakan form di atas untuk menerbitkan kupon diskon global atau program sponsorship untuk toko binaan.' 
              : 'Belum ada voucher yang dibuat untuk toko ini. Anda dapat membuat voucher toko baru di atas.'}
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
