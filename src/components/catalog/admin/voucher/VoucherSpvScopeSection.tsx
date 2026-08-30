import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import { Branch } from '../../../../types';

interface VoucherSpvScopeSectionProps {
  targetScope: string;
  setTargetScope: (scope: string) => void;
  fundingSource: 'store' | 'sponsor' | 'dpk_turnaround';
  setFundingSource: (source: 'store' | 'sponsor' | 'dpk_turnaround') => void;
  branches: Branch[];
}

export const VoucherSpvScopeSection: React.FC<VoucherSpvScopeSectionProps> = ({
  targetScope, setTargetScope, fundingSource, setFundingSource, branches
}) => {
  return (
    <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] text-amber-300 font-bold mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-400" /><span>Jangkauan Toko Target:</span>
          </label>
          <select value={targetScope} onChange={(e) => setTargetScope(e.target.value)} className="w-full bg-slate-800 border border-amber-700/50 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400">
            <option value="all">🌐 SEMUA CABANG BINAAN DPK (Voucher Universal)</option>
            {branches.map((b) => <option key={b.id} value={b.id}>🏪 Khusus Cabang [{b.code}] {b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-amber-300 font-bold mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /><span>Tipe Pendanaan (Sumber Budget):</span>
          </label>
          <select value={fundingSource} onChange={(e) => setFundingSource(e.target.value as any)} className="w-full bg-slate-800 border border-amber-700/50 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400">
            <option value="sponsor">🏢 Sponsor / Co-Marketing Brand (Supplier)</option>
            <option value="dpk_turnaround">💎 Subsidi Program Turnaround DPK</option>
            <option value="store">🏪 Biaya Operasional Toko (Store)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
