import React, { useState } from 'react';
import { Share2, Copy, Check, Phone, Edit2 } from 'lucide-react';
import { Branch } from '../../../types';
import { StorePhoneEditModal } from './StorePhoneEditModal';

interface CatalogShareLinkBarProps {
  branch?: Branch;
  onRefreshBranch?: () => void;
}

export const CatalogShareLinkBar: React.FC<CatalogShareLinkBarProps> = ({ branch, onRefreshBranch }) => {
  const [copied, setCopied] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const getOfficialStoreParam = (b?: Branch) => {
    if (!b?.name) return 'TokoBasmalahBugih';
    const clean = b.name.replace(/\s+/g, '').replace(/tokobasmalah/i, '');
    return `TokoBasmalah${clean.charAt(0).toUpperCase() + clean.slice(1)}`;
  };
  const shareUrl = `https://belanja.dpk.my.id/?toko=${getOfficialStoreParam(branch)}`;

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
    <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/60 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">🔗 Link Publik Katalog Toko:</span>
          {branch && (
            <button type="button" onClick={() => setShowPhoneModal(true)} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>WA Kasir: <strong className="text-emerald-400 font-mono">{branch.phone || 'Belum Diatur'}</strong></span>
              <Edit2 className="w-2.5 h-2.5 text-slate-400" />
            </button>
          )}
        </div>
        <div className="text-xs text-slate-200 font-mono font-semibold truncate select-all">{shareUrl}</div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" onClick={handleCopyLink} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700">{copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}<span>{copied ? 'Tersalin!' : 'Salin Link'}</span></button>
        <button type="button" onClick={handleShareWA} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/60"><Share2 className="w-3.5 h-3.5" /><span>Bagikan Promo</span></button>
      </div>

      {showPhoneModal && branch && <StorePhoneEditModal branch={branch} onSaved={() => { if (onRefreshBranch) onRefreshBranch(); }} onClose={() => setShowPhoneModal(false)} />}
    </div>
  );
};
