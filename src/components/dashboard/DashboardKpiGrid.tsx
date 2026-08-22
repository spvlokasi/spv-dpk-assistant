import React from 'react';
import { Store, AlertOctagon, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { Branch, FieldVisit } from '../../types';

interface DashboardKpiGridProps {
  branches: Branch[];
  visits: FieldVisit[];
}

export const DashboardKpiGrid: React.FC<DashboardKpiGridProps> = ({ branches, visits }) => {
  const totalBranches = branches.length;
  const akut = branches.filter((b) => b.status === 'akut');
  const kritis = branches.filter((b) => b.status === 'kritis');
  const inProgress = branches.filter((b) => b.status === 'dalam_progres');
  const existing = branches.filter((b) => b.status === 'existing');
  const baru = branches.filter((b) => b.status === 'cabang_baru');
  const siapLulus = branches.filter((b) => b.status === 'siap_lulus');
  const lulus = branches.filter((b) => b.status === 'lulus_dpk');
  const openIssues = visits.flatMap((v) => v.issues || []).filter((i) => !i.resolved);

  // Dynamic Urgency Card (Opsi 1: Otomatis mendeteksi level terparah yang aktif)
  const urgencyCard = akut.length > 0
    ? { title: 'Cabang Akut', count: akut.length, color: 'text-rose-400', desc: 'Penanganan darurat & intervensi' }
    : kritis.length > 0
    ? { title: 'Cabang Kritis', count: kritis.length, color: 'text-rose-400', desc: 'Butuh intervensi intensif' }
    : inProgress.length > 0
    ? { title: 'Dalam Progres', count: inProgress.length, color: 'text-amber-400', desc: 'Pendampingan turnaround aktif' }
    : existing.length > 0
    ? { title: 'Cabang Existing', count: existing.length, color: 'text-blue-400', desc: 'Pemantauan rutin operasional' }
    : baru.length > 0
    ? { title: 'Cabang Baru', count: baru.length, color: 'text-cyan-400', desc: 'Masa adaptasi & supervisi awal' }
    : { title: 'Kondisi Toko', count: totalBranches, color: 'text-emerald-400', desc: 'Semua cabang stabil & sehat' };

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

      {/* 2. Kartu Sakti Dinamis (Deteksi Status Urgensi Terparah) */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className={`flex items-center justify-between ${urgencyCard.color} mb-2`}>
          <span className="text-xs font-semibold">{urgencyCard.title}</span>
          <AlertOctagon className="w-4 h-4" />
        </div>
        <div className={`text-2xl sm:text-3xl font-extrabold ${urgencyCard.color}`}>{urgencyCard.count}</div>
        <div className="text-[11px] text-slate-400 mt-1">{urgencyCard.desc}</div>
      </div>

      {/* 3. Status Siap Lulus / Lulus */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between text-emerald-400 mb-2">
          <span className="text-xs font-semibold">Siap Lulus / Lulus</span>
          <Award className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
          {siapLulus.length + lulus.length}
        </div>
        <div className="text-[11px] text-emerald-400/80 mt-1">
          {siapLulus.length > 0 ? `${siapLulus.length} toko siap sidang evaluasi` : `${lulus.length} toko lulus mandiri`}
        </div>
      </div>

      {/* 4. Log Kunjungan & Temuan */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between text-amber-400 mb-2">
          <span className="text-xs font-semibold">Log Kunjungan</span>
          <Calendar className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-white">{visits.length}</div>
        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
          <span className="text-rose-400 font-semibold">{openIssues.length}</span> temuan fisik terbuka
        </div>
      </div>
    </div>
  );
};
