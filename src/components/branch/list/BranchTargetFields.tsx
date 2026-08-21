import React from 'react';
import { Branch, DpkStatus } from '../../../types';

interface BranchTargetFieldsProps {
  formData: Partial<Branch>;
  onFormDataChange: (data: Partial<Branch>) => void;
}

export const BranchTargetFields: React.FC<BranchTargetFieldsProps> = ({
  formData,
  onFormDataChange
}) => {
  return (
    <div className="space-y-3 text-xs">
      <div>
        <label className="block text-slate-400 mb-1 font-semibold">Status Progres DPK:</label>
        <select
          value={formData.status || 'kritis'}
          onChange={(e) => onFormDataChange({ ...formData, status: e.target.value as DpkStatus })}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
        >
          <option value="akut">🔴 Akut (Penanganan Darurat)</option>
          <option value="kritis">🔴 Kritis (Intervensi Khusus)</option>
          <option value="dalam_progres">🟡 Dalam Progres (Pendampingan)</option>
          <option value="existing">🏢 Existing (Pemantauan Rutin)</option>
          <option value="cabang_baru">🆕 Cabang Baru (Masa Adaptasi)</option>
          <option value="siap_lulus">🟢 Siap Lulus (Hasil Membaik)</option>
          <option value="lulus_dpk">🎓 Lulus DPK (Turnaround Berhasil)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Target Laba Bersih (Rp/hari):</label>
          <input
            type="number"
            required
            value={formData.targetSalesPerDay || 1500000}
            onChange={(e) => onFormDataChange({ ...formData, targetSalesPerDay: Number(e.target.value) })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Target Margin Min (%):</label>
          <input
            type="number"
            step="0.1"
            value={formData.targetMarginPct || 15.0}
            onChange={(e) => onFormDataChange({ ...formData, targetMarginPct: Number(e.target.value) })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-semibold">Target Biaya Maks (Rp/bln):</label>
          <input
            type="number"
            value={formData.targetMaxOpexPerMonth || 20000000}
            onChange={(e) => onFormDataChange({ ...formData, targetMaxOpexPerMonth: Number(e.target.value) })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
