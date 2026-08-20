import React from 'react';
import { Plus, Save } from 'lucide-react';
import { RootCauseFactor } from '../../../types';
import { RcaFactorItem } from './RcaFactorItem';

interface RcaFactorSectionProps {
  category: 'internal' | 'eksternal';
  factors: RootCauseFactor[];
  onAddFactor: () => void;
  onUpdateFactor: (id: string, field: keyof RootCauseFactor, value: any) => void;
  onDeleteFactor: (id: string) => void;
  onLoadPreset?: () => void;
  onSaveDiagnosa?: () => void;
}

export const RcaFactorSection: React.FC<RcaFactorSectionProps> = ({
  category,
  factors,
  onAddFactor,
  onUpdateFactor,
  onDeleteFactor,
  onLoadPreset,
  onSaveDiagnosa
}) => {
  const isInternal = category === 'internal';

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
      <div className="space-y-3">
        {factors.length === 0 ? (
          <div className="py-7 px-4 text-center rounded-xl bg-slate-850/40 border border-dashed border-slate-800 space-y-1.5">
            <p className="text-xs font-semibold text-slate-400">
              {isInternal ? 'Belum ada faktor diagnosa internal' : 'Belum ada faktor diagnosa eksternal'}
            </p>
            <p className="text-[11px] text-slate-500">
              {isInternal ? (
                <>Klik <span className="text-emerald-400 font-semibold">"Muat Standar"</span> di bawah untuk memuat konsep atau <span className="text-emerald-400 font-semibold">"+ Faktor"</span> untuk input manual.</>
              ) : (
                <>Klik <span className="text-amber-400 font-semibold">"+ Faktor"</span> di bawah untuk mencatat kondisi kompetitor atau pasar sekitar.</>
              )}
            </p>
          </div>
        ) : (
          factors.map((factor) => (
            <RcaFactorItem
              key={factor.id}
              factor={factor}
              onUpdate={(field, val) => onUpdateFactor(factor.id, field, val)}
              onDelete={() => onDeleteFactor(factor.id)}
            />
          ))
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isInternal ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
          <span className="text-xs font-semibold text-slate-300">
            {isInternal ? 'Diagnosa Faktor Internal' : 'Diagnosa Faktor Eksternal'}
          </span>
          <span className="text-[11px] text-slate-500">({factors.length} faktor)</span>
        </div>

        <div className="flex items-center gap-2">
          {isInternal && onLoadPreset && (
            <button
              onClick={onLoadPreset}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold border border-emerald-500 transition-colors shadow-sm active:scale-95"
            >
              Muat Standar
            </button>
          )}
          <button
            onClick={onAddFactor}
            className={`px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors active:scale-95 ${
              isInternal ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Faktor
          </button>
          {!isInternal && onSaveDiagnosa && (
            <button
              onClick={onSaveDiagnosa}
              className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Diagnosa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
