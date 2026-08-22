import React from 'react';
import { Store, AlertOctagon, Calendar, Building2, Award, Clock, Sparkles } from 'lucide-react';
import { Branch, FieldVisit } from '../../types';

interface DashboardKpiGridProps {
  branches: Branch[];
  visits: FieldVisit[];
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({ branches, visits }) => {
  const totalBranches = branches.length;
  const statusConfigs = [
    { key: 'akut', title: 'Cabang Akut', count: branches.filter((b) => b.status === 'akut').length, color: 'text-rose-400', icon: AlertOctagon, desc: 'Penanganan darurat & intervensi' },
    { key: 'kritis', title: 'Cabang Kritis', count: branches.filter((b) => b.status === 'kritis').length, color: 'text-rose-400', icon: AlertOctagon, desc: 'Butuh intervensi intensif' },
    { key: 'dalam_progres', title: 'Dalam Progres', count: branches.filter((b) => b.status === 'dalam_progres').length, color: 'text-amber-400', icon: Clock, desc: 'Pendampingan turnaround' },
    { key: 'existing', title: 'Cabang Existing', count: branches.filter((b) => b.status === 'existing').length, color: 'text-blue-400', icon: Building2, desc: 'Pemantauan rutin operasional' },
    { key: 'cabang_baru', title: 'Cabang Baru', count: branches.filter((b) => b.status === 'cabang_baru').length, color: 'text-cyan-400', icon: Sparkles, desc: 'Masa adaptasi & supervisi' },
    { key: 'siap_lulus', title: 'Siap Lulus', count: branches.filter((b) => b.status === 'siap_lulus').length, color: 'text-emerald-400', icon: Award, desc: 'Siap sidang evaluasi' },
    { key: 'lulus_dpk', title: 'Lulus Mandiri', count: branches.filter((b) => b.status === 'lulus_dpk').length, color: 'text-emerald-400', icon: Award, desc: 'Turnaround berhasil mandiri' }
  ];

  const activeStatusCards = statusConfigs.filter((s) => s.count > 0);
  const openIssues = visits.flatMap((v) => v.issues || []).filter((i) => !i.resolved);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 items-stretch">
      {/* 1. Total Cabang DPK */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col justify-between h-full min-h-[116px]">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-semibold truncate">Total Cabang DPK</span>
          <Store className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white my-1">{totalBranches}</div>
        <div className="text-[11px] text-slate-400 truncate">
          <span className="text-emerald-400 font-semibold">{totalBranches} Toko</span> terdaftar binaan
        </div>
      </div>

      {/* 2...N. Kartu Status Aktif (Otomatis Bertambah Sesuai Status yang Ada) */}
      {activeStatusCards.map((s) => {
        const IconComponent = s.icon;
        return (
          <div key={s.key} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col justify-between h-full min-h-[116px]">
            <div className={`flex items-center justify-between ${s.color}`}>
              <span className="text-xs font-semibold truncate">{s.title}</span>
              <IconComponent className="w-4 h-4 shrink-0" />
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold ${s.color} my-1`}>{s.count}</div>
            <div className="text-[11px] text-slate-400 truncate">{s.desc}</div>
          </div>
        );
      })}

      {/* Terakhir: Log Kunjungan */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg flex flex-col justify-between h-full min-h-[116px]">
        <div className="flex items-center justify-between text-amber-400">
          <span className="text-xs font-semibold truncate">Log Kunjungan</span>
          <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white my-1">{visits.length}</div>
        <div className="text-[11px] text-slate-400 truncate">
          <span className="text-rose-400 font-semibold">{openIssues.length}</span> temuan terbuka
        </div>
      </div>
    </div>
  );
};
