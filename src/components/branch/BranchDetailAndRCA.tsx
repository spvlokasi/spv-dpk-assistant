import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Store, 
  User, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Branch, RootCauseFactor, DpkStatus, DpkCategory } from '../../types';
import { StatusBadge, UrgencyBadge } from '../common/Badge';
import { ScoreBarChart } from '../common/SimpleChart';
import { formatRupiah, formatDateIndo, formatCategoryName } from '../../utils/formatters';

interface BranchDetailAndRCAProps {
  branch: Branch;
  onBack: () => void;
  onSaveBranch: (branch: Branch) => void;
  onNavigateToTab: (tab: string) => void;
}

export const BranchDetailAndRCA: React.FC<BranchDetailAndRCAProps> = ({
  branch,
  onBack,
  onSaveBranch,
  onNavigateToTab
}) => {
  const [data, setData] = useState<Branch>({ ...branch });
  const [isSaved, setIsSaved] = useState(false);

  // Quick RCA preset helper
  const addDefaultRcaFactor = (category: 'internal' | 'eksternal') => {
    const newFactor: RootCauseFactor = {
      id: `rc-${Date.now()}`,
      category,
      title: category === 'internal' ? 'Faktor Operasional Baru' : 'Faktor Lingkungan/Kompetitor Baru',
      score: 3,
      note: ''
    };
    setData({
      ...data,
      rootCauses: [...data.rootCauses, newFactor]
    });
  };

  const handleUpdateFactor = (id: string, field: keyof RootCauseFactor, value: any) => {
    setData({
      ...data,
      rootCauses: data.rootCauses.map(f => f.id === id ? { ...f, [field]: value } : f)
    });
  };

  const handleDeleteFactor = (id: string) => {
    setData({
      ...data,
      rootCauses: data.rootCauses.filter(f => f.id !== id)
    });
  };

  const handleSave = () => {
    onSaveBranch(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const internalFactors = data.rootCauses.filter(f => f.category === 'internal');
  const externalFactors = data.rootCauses.filter(f => f.category === 'eksternal');

  // Average score calculation
  const avgScore = data.rootCauses.length > 0
    ? (data.rootCauses.reduce((acc, curr) => acc + curr.score, 0) / data.rootCauses.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Perubahan Tersimpan!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Diagnosa
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div className="space-y-2.5 pb-4 border-b border-slate-800">
          {/* Row 1: Title, Badges, and Navigation Buttons (Exact Same Row / Sejajar) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-emerald-400">
                {data.code}
              </span>
              <h2 className="text-sm font-bold text-white tracking-tight">{data.name}</h2>
              <StatusBadge status={data.status} />
              <UrgencyBadge urgency={data.urgencyLevel} />
            </div>

            {/* Quick Action Navigation Buttons (Aligned with Badges) */}
            <div className="flex items-center gap-1.5 flex-nowrap flex-shrink-0">
              <button
                onClick={() => onNavigateToTab('actionplan')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors whitespace-nowrap"
              >
                <Target className="w-3.5 h-3.5 text-blue-400" />
                Aksi
              </button>
              <button
                onClick={() => onNavigateToTab('fieldvisit')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Kunjungan
              </button>
              <button
                onClick={() => onNavigateToTab('performance')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors whitespace-nowrap"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Monitor
              </button>
            </div>
          </div>

          {/* Row 2: Subtext Info (KTB, SPV Area, Address) */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              KTB: <strong className="text-slate-200">{data.kepalaToko}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              SPV Area: <strong className="text-slate-200">{data.spvArea || '-'}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {data.address || 'Alamat cabang belum diatur'}
            </span>
          </div>
        </div>

        {/* Periode Diagnosa & Audit (Date Range Manual) */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-850/50 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-slate-200">Rentang Periode Diagnosa & Bedah Cabang</div>
              <div className="text-[10px] text-slate-400">Atur tanggal mulai s/d selesai periode audit evaluasi toko ini</div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap text-xs">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium">Dari:</span>
              <input
                type="date"
                value={data.diagnosisStartDate || ''}
                onChange={(e) => setData({ ...data, diagnosisStartDate: e.target.value })}
                className="bg-transparent text-emerald-400 font-semibold focus:outline-none text-xs"
              />
            </div>
            <span className="text-slate-500 font-bold text-xs">s/d</span>
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-[11px] text-slate-400 font-medium">Sampai:</span>
              <input
                type="date"
                value={data.diagnosisEndDate || ''}
                onChange={(e) => setData({ ...data, diagnosisEndDate: e.target.value })}
                className="bg-transparent text-emerald-400 font-semibold focus:outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Target Parameters Setting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="text-[11px] font-medium text-slate-400">Target Laba Harian</label>
              <span className="text-[11px] font-semibold text-emerald-400">{formatRupiah(data.targetSalesPerDay)}/hari</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.targetSalesPerDay}
                onChange={(e) => setData({ ...data, targetSalesPerDay: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="text-[11px] font-medium text-slate-400">Target Margin Profit (%)</label>
              <span className="text-[10px] text-slate-500">Standar Target</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={data.targetMarginPct}
              onChange={(e) => setData({ ...data, targetMarginPct: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 text-amber-400 font-mono font-bold text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label className="text-[11px] font-medium text-slate-400">Target Biaya Bulanan</label>
              <span className="text-[11px] font-semibold text-rose-400">{formatRupiah(data.targetMaxOpexPerMonth)}/bulan</span>
            </div>
            <input
              type="number"
              value={data.targetMaxOpexPerMonth}
              onChange={(e) => setData({ ...data, targetMaxOpexPerMonth: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 text-rose-400 font-mono font-bold text-sm rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: RCA Analysis & Strategy Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Root Cause Factors (Internal & External) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Internal Factors */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                <h3 className="text-sm font-bold text-white">
                  Diagnosa Faktor Internal (SDM, SOP, Display, Kasir)
                </h3>
              </div>
              <button
                onClick={() => addDefaultRcaFactor('internal')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Faktor
              </button>
            </div>

            <div className="space-y-3">
              {internalFactors.map((factor) => (
                <div key={factor.id} className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={factor.title}
                      onChange={(e) => handleUpdateFactor(factor.id, 'title', e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none border-b border-transparent focus:border-emerald-500 w-full"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400">
                        Skor: {factor.score}/5
                      </span>
                      <button
                        onClick={() => handleDeleteFactor(factor.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Score Slider */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">1 (Kritis)</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={factor.score}
                      onChange={(e) => handleUpdateFactor(factor.id, 'score', Number(e.target.value))}
                      className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500">5 (Bagus)</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Catatan temuan spesifik (contoh: Kasir belum hafal promo tebus murah)..."
                    value={factor.note}
                    onChange={(e) => handleUpdateFactor(factor.id, 'note', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* External Factors */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <h3 className="text-sm font-bold text-white">
                  Diagnosa Faktor Eksternal (Kompetitor, Akses, Pasar)
                </h3>
              </div>
              <button
                onClick={() => addDefaultRcaFactor('eksternal')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Faktor
              </button>
            </div>

            <div className="space-y-3">
              {externalFactors.map((factor) => (
                <div key={factor.id} className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={factor.title}
                      onChange={(e) => handleUpdateFactor(factor.id, 'title', e.target.value)}
                      className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none border-b border-transparent focus:border-amber-500 w-full"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                        Skor: {factor.score}/5
                      </span>
                      <button
                        onClick={() => handleDeleteFactor(factor.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">1 (Berat)</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={factor.score}
                      onChange={(e) => handleUpdateFactor(factor.id, 'score', Number(e.target.value))}
                      className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500">5 (Aman)</span>
                  </div>

                  <input
                    type="text"
                    placeholder="Catatan kondisi lingkungan (contoh: Muncul minimarket baru di seberang)..."
                    value={factor.note}
                    onChange={(e) => handleUpdateFactor(factor.id, 'note', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Summary, Level Intervensi & Strategi Turnaround */}
        <div className="space-y-6">
          {/* Health Score Summary Card */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Skor Kesehatan Toko (RCA)
              </h4>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="text-center py-2">
              <div className="text-4xl font-extrabold text-white font-mono">{avgScore} <span className="text-sm font-normal text-slate-500">/ 5.0</span></div>
              <div className="text-xs text-slate-400 mt-1">
                {Number(avgScore) <= 2.5 ? '🔴 Toko Butuh Intervensi Darurat' : Number(avgScore) <= 3.8 ? '🟡 Pembenahan Bertahap' : '🟢 Kondisi Menuju Sehat'}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Ubah Status Pengawasan</label>
              <select
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value as DpkStatus })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
              >
                <option value="kritis">🔴 Kritis (Belum Ada Perbaikan)</option>
                <option value="dalam_progres">🟡 Dalam Progres Perbaikan</option>
                <option value="siap_lulus">🟢 Siap Evaluasi Kelulusan DPK</option>
                <option value="lulus_dpk">🎓 Lulus DPK (Kembali Reguler)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Tingkat Urgensi Intervensi</label>
              <select
                value={data.urgencyLevel}
                onChange={(e) => setData({ ...data, urgencyLevel: e.target.value as any })}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
              >
                <option value="tinggi">🔥 Urgensi Tinggi (Kunjungan 3x/minggu)</option>
                <option value="sedang">⚡ Urgensi Sedang (Kunjungan 1-2x/minggu)</option>
                <option value="rendah">🌱 Urgensi Normal (Monitoring berkala)</option>
              </select>
            </div>
          </div>

          {/* Form Kesimpulan Diagnosa & Rekomendasi Strategi */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Formula Strategi Turnaround SPV
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Kesimpulan Diagnosa Akar Masalah
              </label>
              <textarea
                rows={3}
                value={data.diagnosisSummary}
                onChange={(e) => setData({ ...data, diagnosisSummary: e.target.value })}
                placeholder="Rangkum penyakit utama cabang ini..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Strategi Pendampingan & Aksi Perbaikan
              </label>
              <textarea
                rows={4}
                value={data.recommendedStrategy}
                onChange={(e) => setData({ ...data, recommendedStrategy: e.target.value })}
                placeholder="Resep strategi yang wajib dieksekusi (contoh: Direct selling, perbaikan FEFO/OOS, training kasir)..."
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan Semua Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
