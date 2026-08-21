import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Branch } from '../../../types';
import { BranchIdentityFields } from './BranchIdentityFields';
import { BranchTargetFields } from './BranchTargetFields';

interface BranchModalFormProps {
  show: boolean;
  editingBranch: Branch | null;
  formData: Partial<Branch>;
  onClose: () => void;
  onFormDataChange: (data: Partial<Branch>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BranchModalForm: React.FC<BranchModalFormProps> = ({
  show,
  editingBranch,
  formData,
  onClose,
  onFormDataChange,
  onSubmit
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl my-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-base font-bold text-white">
            {editingBranch ? 'Edit Data Cabang Binaan' : 'Registrasi Cabang DPK Baru'}
          </h3>
          <p className="text-xs text-slate-400">Identitas toko, penanggung jawab, dan target finansial</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <BranchIdentityFields formData={formData} onFormDataChange={onFormDataChange} />
          <BranchTargetFields formData={formData} onFormDataChange={onFormDataChange} />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Data Cabang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
