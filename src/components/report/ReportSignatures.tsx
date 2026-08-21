import React from 'react';
import { formatDateIndo } from '../../utils/formatters';

interface ReportSignaturesProps {
  authorName: string;
  authorRole: string;
  authorManager: string;
  targetBranchCount: number;
  singleBranchKtb?: string;
}

export const ReportSignatures: React.FC<ReportSignaturesProps> = ({
  authorName,
  authorRole,
  authorManager,
  targetBranchCount,
  singleBranchKtb
}) => {
  return (
    <div className="pt-8 mt-8 border-t border-slate-300 break-inside-avoid">
      <div className="text-xs text-slate-600 text-right mb-6">
        Dicetak pada: {formatDateIndo(new Date().toISOString())}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center text-xs">
        <div>
          <div className="text-slate-500 mb-16">Disusun Oleh,</div>
          <div className="font-bold text-slate-900 underline">{authorName}</div>
          <div className="text-slate-600 text-[11px]">{authorRole}</div>
        </div>

        <div>
          <div className="text-slate-500 mb-16">Mengetahui (KTB Binaan),</div>
          <div className="font-bold text-slate-900 underline">
            {targetBranchCount === 1 ? singleBranchKtb || '( Kepala Toko )' : '( Kepala Toko Terkait )'}
          </div>
          <div className="text-slate-600 text-[11px]">Kepala Toko Basmalah</div>
        </div>

        <div>
          <div className="text-slate-500 mb-16">Disetujui Oleh,</div>
          <div className="font-bold text-slate-900 underline">{authorManager}</div>
          <div className="text-slate-600 text-[11px]">Manajer Bisnis</div>
        </div>
      </div>
    </div>
  );
};
