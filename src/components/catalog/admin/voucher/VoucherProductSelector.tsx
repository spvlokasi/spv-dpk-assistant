import React from 'react';
import { CheckSquare, Square, Tag } from 'lucide-react';
import { PromoProduct } from '../../../../types';
import { formatRupiah } from '../../../../utils/formatters';

interface VoucherProductSelectorProps {
  products: PromoProduct[];
  selectedProductIds: string[];
  onToggleProduct: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const VoucherProductSelector: React.FC<VoucherProductSelectorProps> = ({
  products, selectedProductIds, onToggleProduct, onSelectAll, onClearAll
}) => {
  if (products.length === 0) {
    return (
      <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center text-slate-400 text-xs">
        Belum ada produk promo yang terdaftar. Tambahkan produk promo terlebih dahulu.
      </div>
    );
  }

  return (
    <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" />
          <span>Pilih Produk Promo yang Mendapat Diskon ({selectedProductIds.length} Terpilih):</span>
        </label>
        <div className="flex items-center gap-2 text-[10px]">
          <button type="button" onClick={onSelectAll} className="text-emerald-400 hover:underline font-semibold">Pilih Semua</button>
          <span className="text-slate-600">•</span>
          <button type="button" onClick={onClearAll} className="text-slate-400 hover:underline">Hapus Pilihan</button>
        </div>
      </div>

      <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
        {products.map((p) => {
          const isSelected = selectedProductIds.includes(p.id);
          return (
            <div
              key={p.id}
              onClick={() => onToggleProduct(p.id)}
              className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500/60 text-white'
                  : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {isSelected ? <CheckSquare className="w-4 h-4 text-amber-400 flex-shrink-0" /> : <Square className="w-4 h-4 text-slate-500 flex-shrink-0" />}
                <span className="text-xs font-semibold truncate">{p.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({p.unit})</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 flex-shrink-0">{formatRupiah(p.promoPrice)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
