import React from 'react';
import { DpkStatus, DpkCategory } from '../../types';

interface BadgeProps {
  status?: DpkStatus;
  urgency?: 'tinggi' | 'sedang' | 'rendah' | 'kritis';
  category?: DpkCategory | string;
  customColor?: string;
  children?: React.ReactNode;
}

export const StatusBadge: React.FC<{ status: DpkStatus }> = ({ status }) => {
  switch (status) {
    case 'kritis':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
          Kritis
        </span>
      );
    case 'dalam_progres':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          Dalam Progres
        </span>
      );
    case 'siap_lulus':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Siap Lulus DPK
        </span>
      );
    case 'lulus_dpk':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          🎓 Lulus DPK
        </span>
      );
    default:
      return null;
  }
};

export const UrgencyBadge: React.FC<{ urgency: 'tinggi' | 'sedang' | 'rendah' | 'kritis' }> = ({ urgency }) => {
  switch (urgency) {
    case 'kritis':
    case 'tinggi':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
          Urgensi Tinggi
        </span>
      );
    case 'sedang':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-950 text-amber-400 border border-amber-800">
          Urgensi Sedang
        </span>
      );
    case 'rendah':
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
          Urgensi Normal
        </span>
      );
  }
};
