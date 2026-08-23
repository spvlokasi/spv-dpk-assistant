import React from 'react';
import { DpkStatus } from '../../types';

export const StatusBadge: React.FC<{ status: DpkStatus }> = ({ status }) => {
  const configs: Record<DpkStatus, { bg: string; text: string; label: string; dot?: string }> = {
    akut: { bg: 'bg-rose-600/30 border-rose-500/50', text: 'text-rose-200', label: 'Akut', dot: 'bg-rose-400' },
    kritis: { bg: 'bg-rose-500/20 border-rose-500/30', text: 'text-rose-300', label: 'Kritis', dot: 'bg-rose-400' },
    dalam_progres: { bg: 'bg-amber-500/20 border-amber-500/30', text: 'text-amber-300', label: 'Dalam Progres', dot: 'bg-amber-400' },
    existing: { bg: 'bg-indigo-500/20 border-indigo-500/30', text: 'text-indigo-300', label: 'Existing', dot: 'bg-indigo-400' },
    cabang_baru: { bg: 'bg-cyan-500/20 border-cyan-500/30', text: 'text-cyan-300', label: 'Cabang Baru', dot: 'bg-cyan-400' },
    siap_lulus: { bg: 'bg-emerald-500/20 border-emerald-500/30', text: 'text-emerald-300', label: 'Siap Lulus', dot: 'bg-emerald-400' },
    lulus_dpk: { bg: 'bg-blue-500/20 border-blue-500/30', text: 'text-blue-300', label: 'Lulus DPK', dot: 'bg-blue-400' }
  };
  const c = configs[status] || configs.kritis;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${c.bg} ${c.text}`}>
      {c.dot && <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
      {c.label}
    </span>
  );
};

export const UrgencyBadge: React.FC<{ urgency: 'tinggi' | 'sedang' | 'rendah' | 'kritis' }> = ({ urgency }) => {
  if (urgency === 'kritis' || urgency === 'tinggi') {
    return <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/80">Urgensi Tinggi</span>;
  }
  if (urgency === 'sedang') {
    return <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/80">Urgensi Sedang</span>;
  }
  return <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/80 text-slate-400 border border-slate-700/80">Urgensi Normal</span>;
};
