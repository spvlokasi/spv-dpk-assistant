import React from 'react';
import { Store, AlertOctagon, Calendar, Building2, Target } from 'lucide-react';
import { Branch, FieldVisit } from '../../types';

interface DashboardKpiGridProps {
  branches: Branch[];
  visits: FieldVisit[];
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({ branches, visits }) => {
  const totalBranches = branches.length;
  const statusConfigs = [
    { key: 'akut', title: 'Cabang Akut', count: branches.filter((b) => b.status === 'akut').length, color: 'text-rose-400', desc: 'Penanganan darurat & intervensi' },
    { key: 'kritis', title: 'Cabang Kritis', count: branches.filter((b) => b.status === 'kritis').length, color: 'text-rose-400', desc: 'Butuh intervensi intensif' },
    { key: 'dalam_progres', title: 'Dalam Progres', count: branches.filter((b) => b.status === 'dalam_progres').length, color: 'text-amber-400', desc: 'Pendampingan turnaround aktif' },
    { key: 'existing', title: 'Cabang Existing', count: branches.filter((b) => b.status === 'existing').length, color: 'text-blue-400', desc: 'Pemantauan rutin operasional' },
    { key: 'cabang_baru', title: 'Cabang Baru', count: branches.filter((b) => b.status === 'cabang_baru').length, color: 'text-cyan-400', desc: 'Masa adaptasi & supervisi' },
    { key: 'siap_lulus', title: 'Siap Lulus', count: branches.filter((b) => b.status === 'siap_lulus').length, color: 'text-emerald-400', desc: 'Siap sidang evaluasi' },
    { key: 'lulus_dpk', title: 'Lulus Mandiri', count: branches.filter((b) => b.status === 'lulus_dpk').length, color: 'text-emerald-400', desc: 'Turnaround berhasil mandiri' }
  ];

  const activeGroups = statusConfigs.filter((s) => s.count > 0);
  const card2 = activeGroups[0] || { title: 'Status Cabang', count: 0, color: 'text-slate-400', desc: 'Belum ada data cabang' };
  const card3 = activeGroups[1] || (
    totalBranches > 0
      ? { title: 'Target Turnaround', count: totalBranches, color: 'text-purple-400', desc: 'Target kelulusan 180 hari' }
      : { title: 'Siap Lulus', count: 0, color: 'text-emerald-400', desc: '0 toko siap evaluasi' }
  );

  const openIssues = visits.flatMap((v) => v.issues || []).filter((i) => !i.resolved);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Cabang DPK */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-semibold">Total Cabang DPK</span>
          <Store className="w-4 h-4 text-slate-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalBranches}</div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="text-emerald-400 font-semibold">{totalBranches} Toko</span> terdaftar binaan
        </div>
      </div>

      {/* 2. Kartu Status Utama / Urgensi */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className={`flex items-center justify-between ${card2.color} mb-2`}>
          <span className="text-xs font-semibold">{card2.title}</span>
          <AlertOctagon className="w-4 h-4" />
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold ${card2.color}`}>{card2.count}</div>
        <div className="text-[11px] text-slate-400 mt-1">{card2.desc}</div>
      </div>

      {/* 3. Kartu Status Kedua / Existing / Progres */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className={`flex items-center justify-between ${card3.color} mb-2`}>
          <span className="text-xs font-semibold">{card3.title}</span>
          <Building2 className="w-4 h-4" />
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold ${card3.color}`}>{card3.count}</div>
        <div className="text-[11px] text-slate-400 mt-1">{card3.desc}</div>
      </div>

      {/* 4. Log Kunjungan */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between text-amber-400 mb-2">
          <span className="text-xs font-semibold">Log Kunjungan</span>
          <Calendar className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white">{visits.length}</div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="text-rose-400 font-semibold">{openIssues.length}</span> temuan terbuka
        </div>
      </div>
    </div>
  );
};
