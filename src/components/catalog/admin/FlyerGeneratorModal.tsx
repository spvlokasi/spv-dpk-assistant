import React, { useRef } from 'react';
import { Printer, Download, X, QrCode, Sparkles } from 'lucide-react';
import { Branch, PromoProduct, PromoVoucher } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface FlyerGeneratorModalProps {
  branch: Branch;
  products: PromoProduct[];
  vouchers: PromoVoucher[];
  onClose: () => void;
}

export const FlyerGeneratorModal: React.FC<FlyerGeneratorModalProps> = ({
  branch, products, vouchers, onClose
}) => {
  const activeVoucher = vouchers[0];
  const flyerProducts = products.slice(0, 6);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-emerald-400" /><h3 className="text-sm font-bold text-white">Generator Brosur Promo Otomatis</h3></div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"><Printer className="w-3.5 h-3.5" /><span>Cetak / PDF</span></button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Printable Flyer Content */}
        <div className="bg-emerald-900 text-slate-900 rounded-2xl p-4 sm:p-6 space-y-4 border-4 border-emerald-500 shadow-2xl relative overflow-hidden bg-gradient-to-b from-emerald-800 to-emerald-950 text-white">
          <div className="flex items-center justify-between border-b border-emerald-600/60 pb-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Basmalah" className="h-10 w-auto bg-white p-1 rounded-lg shadow" />
              <div><h2 className="text-base font-black tracking-tight uppercase text-white leading-none">PROMO HEMAT TOKOBASMALAH</h2><p className="text-[11px] text-emerald-200 font-semibold">{branch.name} • {branch.phone ? `WA: ${branch.phone}` : 'Pesan Antar Gratis'}</p></div>
            </div>
            {activeVoucher && <div className="bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl text-center font-black text-[10px] shadow"><span className="block">KLAIM KUPON:</span><span className="font-mono text-xs">{activeVoucher.code}</span></div>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {flyerProducts.map((p) => (
              <div key={p.id} className="bg-slate-900/90 border border-emerald-500/40 p-2.5 rounded-xl text-center space-y-1">
                <div className="text-[10px] font-extrabold text-amber-300 truncate">{p.name}</div>
                <div className="text-[9px] text-slate-400 line-through font-mono">{formatRupiah(p.originalPrice)}</div>
                <div className="text-xs font-black text-emerald-400 font-mono">{formatRupiah(p.promoPrice)}</div>
                <div className="text-[8px] text-slate-300 font-semibold">{p.unit}</div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-700/60 flex items-center justify-between text-[10px]">
            <div><strong className="text-white block font-bold">🛵 Pesan Antar Sampai Pintu Rumah (COD):</strong><span className="text-emerald-200">Ketik pesan belanja ke WA {branch.phone || 'Toko'}</span></div>
            <div className="flex items-center gap-1 font-bold text-amber-300 bg-emerald-900 px-2 py-1 rounded-lg"><QrCode className="w-4 h-4" /><span>Scan & Pesan</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};
