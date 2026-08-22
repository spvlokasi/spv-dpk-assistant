import React from 'react';
import { formatDateIndo } from '../../utils/formatters';

interface ReportSignaturesProps {
  authorName: string;
  authorRole: string;
  authorManager: string;
  targetBranchCount: number;
  singleBranchKtb?: string;
  singleBranchSpvArea?: string;
}

export const ReportSignatures: React.FC<ReportSignaturesProps> = ({
  authorName,
  authorRole,
  authorManager,
  targetBranchCount,
  singleBranchKtb,
  singleBranchSpvArea
}) => {
  const ktbName = targetBranchCount === 1 ? (singleBranchKtb || '( Kepala Toko )') : '( Seluruh KTB Binaan )';
  const spvAreaName = targetBranchCount === 1 ? (singleBranchSpvArea || '( SPV Area )') : '( Seluruh SPV Area )';

  return (
    <div className="pt-6 mt-6 border-t border-slate-300 break-inside-avoid print:pt-4 print:mt-4">
      <div className="text-xs text-slate-600 text-right mb-5 print:mb-3">
        Dicetak pada: {formatDateIndo(new Date().toISOString())}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs print:text-[11px]">
        {/* 1. Disusun Oleh */}
        <div>
          <div className="text-slate-500 mb-14 print:mb-10">Disusun Oleh,</div>
          <div className="font-bold text-slate-900 underline">{authorName}</div>
          <div className="text-slate-600 text-[11px]">{authorRole}</div>
        </div>

        {/* 2. Mengetahui KTB */}
        <div>
          <div className="text-slate-500 mb-14 print:mb-10">Mengetahui KTB,</div>
          <div className="font-bold text-slate-900 underline">{ktbName}</div>
          <div className="text-slate-600 text-[11px]">Kepala Toko Basmalah</div>
        </div>

        {/* 3. Mengetahui SPV Area */}
        <div>
          <div className="text-slate-500 mb-14 print:mb-10">Mengetahui SPV,</div>
          <div className="font-bold text-slate-900 underline">{spvAreaName}</div>
          <div className="text-slate-600 text-[11px]">Supervisor Area</div>
        </div>

        {/* 4. Disetujui Oleh */}
        <div>
          <div className="text-slate-500 mb-14 print:mb-10">Disetujui Oleh,</div>
          <div className="font-bold text-slate-900 underline">{authorManager}</div>
          <div className="text-slate-600 text-[11px]">Manajer Bisnis</div>
        </div>
      </div>
    </div>
  );
};
