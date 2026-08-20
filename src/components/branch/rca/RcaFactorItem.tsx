import React from 'react';
import { Trash2 } from 'lucide-react';
import { RootCauseFactor } from '../../../types';
import { BasmalahRating } from './BasmalahRating';

interface RcaFactorItemProps {
  factor: RootCauseFactor;
  onUpdate: (field: keyof RootCauseFactor, value: any) => void;
  onDelete: () => void;
}

export const RcaFactorItem: React.FC<RcaFactorItemProps> = ({ factor, onUpdate, onDelete }) => {
  const isInternal = factor.category === 'internal';

  return (
    <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={factor.title}
          onChange={(e) => onUpdate('title', e.target.value)}
          className={`bg-transparent text-xs font-semibold text-slate-200 focus:outline-none border-b border-transparent w-full ${
            isInternal ? 'focus:border-emerald-500' : 'focus:border-amber-500'
          }`}
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 ${
            isInternal ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            Skor: {factor.score}/5
          </span>
          <button
            onClick={onDelete}
            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
            title="Hapus Faktor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <BasmalahRating
        score={factor.score}
        category={factor.category}
        onChangeScore={(s) => onUpdate('score', s)}
      />

      <input
        type="text"
        placeholder={isInternal ? 'Catatan temuan spesifik (contoh: Kasir belum hafal promo tebus murah)...' : 'Catatan kondisi lingkungan (contoh: Muncul minimarket baru di seberang)...'}
        value={factor.note}
        onChange={(e) => onUpdate('note', e.target.value)}
        className={`w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none ${
          isInternal ? 'focus:border-emerald-500' : 'focus:border-amber-500'
        }`}
      />
    </div>
  );
};
