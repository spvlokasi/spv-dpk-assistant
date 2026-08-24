import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Branch } from '../../../types';

interface CatalogShareLinkBarProps {
  branch?: Branch;
}

export const CatalogShareLinkBar: React.FC<CatalogShareLinkBarProps> = ({ branch }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://basmalahbelanja.vercel.app/?toko=${branch?.code || 'M3017'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWA = () => {
    const text = `*PROMO HEMAT TOKOBASMALAH ${branch?.name?.toUpperCase()}!*\n` +
      `Dapatkan sembako murah, diskon harga coret & klaim voucher potongan belanja!\n` +
      `Bisa pesan antar langsung sampai ke rumah (COD).\n\n` +
      `👉 *Buka Katalog Belanja Kami:* ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/60 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2.5">
      <div className="min-w-0 flex-1"><span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">🔗 Link Publik Katalog Toko Ini (Khusus Pembeli):</span><div className="text-xs text-slate-200 font-mono font-semibold truncate select-all">{shareUrl}</div></div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={handleCopyLink} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700">{copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}<span>{copied ? 'Tersalin!' : 'Salin Link'}</span></button>
        <button type="button" onClick={handleShareWA} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/60"><Share2 className="w-3.5 h-3.5" /><span>Bagikan ke WhatsApp</span></button>
      </div>
    </div>
  );
};
