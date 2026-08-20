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
  Sparkles,
  History
} from 'lucide-react';
import { Branch, RootCauseFactor, DpkStatus, DpkCategory, DiagnosisLog } from '../../types';
import { StorageService } from '../../services/storage';
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
  const getTodayStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayStr();
  const [data, setData] = useState<Branch>(() => {
    const isOldDummyDate = branch.diagnosisStartDate === '2026-08-01' || branch.diagnosisStartDate === '2026-06-01' || branch.diagnosisStartDate === '2026-05-15';
    const isOldDummyRootCauses = branch.rootCauses?.some(r => 
      ['rc-1', 'rc-2', 'rc-3', 'rc-4', 'rc-21', 'rc-22', 'rc-23', 'rc-31', 'rc-32', 'rc-33'].includes(r.id)
    );
    return {
      ...branch,
      diagnosisStartDate: (!branch.diagnosisStartDate || isOldDummyDate) ? todayStr : branch.diagnosisStartDate,
      diagnosisEndDate: (!branch.diagnosisEndDate || isOldDummyDate) ? todayStr : branch.diagnosisEndDate,
      rootCauses: isOldDummyRootCauses ? [] : (branch.rootCauses || [])
    };
  });
  const [isSaved, setIsSaved] = useState(false);
  const [diagnosisLogs, setDiagnosisLogs] = useState<DiagnosisLog[]>(() => StorageService.getDiagnosisLogs(branch.id));

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

  const loadSidogiriPresetFactors = () => {
    const sidogiriInternal: RootCauseFactor[] = [
      {
        id: `rc-int-1-${Date.now()}`,
        category: 'internal',
        title: 'Efisiensi Listrik & Energi (Suhu AC 24-25°C, Neon Box, Rawat Freezer)',
        score: 3,
        note: 'Pastikan AC tidak <24°C, matikan 1 AC saat sepi, neon box 17.30-22.00, bersihkan kondensor freezer.'
      },
      {
        id: `rc-int-2-${Date.now()}`,
        category: 'internal',
        title: 'Penertiban Stok Mati, Slow Moving & Zero Expired (FEFO & Mark-Down 10-20%)',
        score: 2,
        note: 'Audit dead stock tiap 2 minggu, barang H-30/H-60 jual cepat via bundling/mark-down di meja kasir.'
      },
      {
        id: `rc-int-3-${Date.now()}`,
        category: 'internal',
        title: 'Kinerja Kasir: Up-Selling, Add-On Sales & Suggestive Selling (+Rp2.000)',
        score: 2,
        note: 'Tawarkan produk komplementer (kopi+gula) & suggestive selling tebus murah minimal +Rp2.000/struk.'
      },
      {
        id: `rc-int-4-${Date.now()}`,
        category: 'internal',
        title: 'Ketersediaan Barang (Zero Out-of-Stock Top 50 SKU Omzet)',
        score: 3,
        note: 'Barang fast-moving (air mineral, rokok, beras, minyak goreng) wajib selalu ada di rak display.'
      },
      {
        id: `rc-int-5-${Date.now()}`,
        category: 'internal',
        title: 'Kedisiplinan SO Parsial Harian Kategori Rawan (Rokok, Susu, Kosmetik)',
        score: 3,
        note: 'Lakukan hitung fisik harian kategori rawan selisih/hilang sebelum pergantian shift kasir.'
      },
      {
        id: `rc-int-6-${Date.now()}`,
        category: 'internal',
        title: 'Kemandirian & Kepemimpinan KTB (Briefing Pagi & Kawal Target Laba)',
        score: 3,
        note: 'KTB pimpin briefing pagi 10 menit, evaluasi target laba harian, dan pantau kepatuhan SOP crew.'
      }
    ];

    const sidogiriExternal: RootCauseFactor[] = [
      {
        id: `rc-ext-1-${Date.now()}`,
        category: 'eksternal',
        title: 'Tekanan Kompetitor Sekitar & Selisih Promo Harga',
        score: 3,
        note: 'Pantau harga promo toko sebelah dan perkuat keunggulan pelayanan khas TokoBASMALAH.'
      },
      {
        id: `rc-ext-2-${Date.now()}`,
        category: 'eksternal',
        title: 'Aksesibilitas, Kebersihan Parkir & Penerangan Depan Toko',
        score: 4,
        note: 'Halaman parkir bersih, tidak terhalang pedagang liar, dan lampu penerangan toko terang malam hari.'
      },
      {
        id: `rc-ext-3-${Date.now()}`,
        category: 'eksternal',
        title: 'Potensi Canvassing Sembako ke Warung, UMKM & Komunitas Sekitar',
        score: 3,
        note: 'Kunjungan sales jemput bola ke warung kelontong sekitar, tawarkan grosir sembako (gula, minyak, beras).'
      },
      {
        id: `rc-ext-4-${Date.now()}`,
        category: 'eksternal',
        title: 'Daya Beli Masyarakat & Karakteristik Pelanggan Lingkungan',
        score: 3,
        note: 'Sesuaikan varian kemasan produk dengan daya beli warga lokal (misal: kemasan ekonomis/renceng).'
      }
    ];

    setData({
      ...data,
      rootCauses: [...sidogiriInternal, ...sidogiriExternal]
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

  const handleSave = async () => {
    onSaveBranch(data);
    if (data.diagnosisStartDate && data.diagnosisEndDate) {
      const logId = `dlog-${data.id}-${data.diagnosisStartDate}-${data.diagnosisEndDate}`;
      await StorageService.saveDiagnosisLog({
        id: logId,
        branchId: data.id,
        periodStartDate: data.diagnosisStartDate,
        periodEndDate: data.diagnosisEndDate,
        category: data.category,
        status: data.status,
        urgencyLevel: data.urgencyLevel,
        targetSalesPerDay: data.targetSalesPerDay,
        targetMarginPct: data.targetMarginPct,
        targetMaxOpexPerMonth: data.targetMaxOpexPerMonth,
        rootCauses: data.rootCauses,
        diagnosisSummary: data.diagnosisSummary,
        recommendedStrategy: data.recommendedStrategy,
        diagnosedBy: StorageService.getProfile().name,
        createdAt: new Date().toISOString()
      });
      setDiagnosisLogs(StorageService.getDiagnosisLogs(data.id));
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleSelectHistoryLog = (logId: string) => {
    if (!logId) return;
    const selected = diagnosisLogs.find(l => l.id === logId);
    if (selected) {
      setData({
        ...data,
        diagnosisStartDate: selected.periodStartDate,
        diagnosisEndDate: selected.periodEndDate,
        category: selected.category,
        status: selected.status,
        urgencyLevel: selected.urgencyLevel,
        targetSalesPerDay: selected.targetSalesPerDay,
        targetMarginPct: selected.targetMarginPct,
        targetMaxOpexPerMonth: selected.targetMaxOpexPerMonth,
        rootCauses: selected.rootCauses,
        diagnosisSummary: selected.diagnosisSummary,
        recommendedStrategy: selected.recommendedStrategy
      });
    }
  };

  const internalFactors = data.rootCauses.filter(f => f.category === 'internal');
  const externalFactors = data.rootCauses.filter(f => f.category === 'eksternal');

  // Helper to split brand prefix and branch name for responsive mobile display
  const getBranchDisplayNames = (fullName: string) => {
    const prefixMatch = fullName.match(/^(TokoBASMALAH|Cabang Basmalah|Basmalah)\s+(.+)$/i);
    if (prefixMatch) {
      return {
        prefix: prefixMatch[1],
        branchName: prefixMatch[2]
      };
    }
    return {
      prefix: '',
      branchName: fullName
    };
  };

  const { prefix, branchName } = getBranchDisplayNames(data.name);

  // Average score calculation
  const avgScore = data.rootCauses.length > 0
    ? (data.rootCauses.reduce((acc, curr) => acc + curr.score, 0) / data.rootCauses.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div className="space-y-2.5 pb-4 border-b border-slate-800">
          {/* Row 1: Title, Badges, and Navigation Buttons (Exact Same Row / Sejajar) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap overflow-x-auto py-0.5 max-w-full">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400 flex-shrink-0">
                {data.code}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight whitespace-nowrap flex-shrink-0">
                {prefix && <span className="hidden sm:inline">{prefix} </span>}
                {branchName}
              </h2>
              <div className="flex items-center gap-1.5 flex-nowrap flex-shrink-0">
                <StatusBadge status={data.status} />
                <UrgencyBadge urgency={data.urgencyLevel} />
              </div>
              {isSaved && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-semibold animate-pulse ml-1 flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan!
                </span>
              )}
            </div>

            {/* Quick Action Navigation Buttons (Aligned with Badges) */}
            <div className="flex items-center gap-1.5 flex-nowrap flex-shrink-0">
              <button
                onClick={onBack}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors whitespace-nowrap active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                Kembali
              </button>
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

          {/* Row 2: Subtext Info (KTB, SPV Area, Address - 1 Single Horizontal Row) */}
          <div className="flex items-center gap-x-3 sm:gap-x-4 text-xs text-slate-400 overflow-hidden">
            <span className="flex items-center gap-1.5 flex-shrink-0">
              <User className="w-3.5 h-3.5 text-slate-500" />
              KTB: <strong className="text-slate-200">{data.kepalaToko}</strong>
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 flex-shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              SPV Area: <strong className="text-slate-200">{data.spvArea || '-'}</strong>
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span 
              className="flex items-center gap-1.5 truncate min-w-0 cursor-default" 
              title={data.address || 'Alamat cabang belum diatur'}
            >
              <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate text-slate-300">{data.address || 'Alamat cabang belum diatur'}</span>
            </span>
          </div>
        </div>

        {/* Periode Diagnosa & Audit (Date Range Manual) */}
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 bg-slate-850/50 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-200">Rentang Periode Diagnosa Cabang</span>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {data.diagnosisStartDate && data.diagnosisEndDate 
                    ? `Periode audit: ${new Date(data.diagnosisStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} s/d ${new Date(data.diagnosisEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : 'Pilih tanggal mulai dan selesai periode diagnosa'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap text-xs">
              <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <input
                  type="date"
                  value={data.diagnosisStartDate || ''}
                  onChange={(e) => setData({ ...data, diagnosisStartDate: e.target.value })}
                  className="bg-transparent text-emerald-400 font-semibold focus:outline-none text-xs cursor-pointer"
                />
              </div>
              <span className="text-slate-500 font-bold text-xs">s/d</span>
              <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                <input
                  type="date"
                  min={data.diagnosisStartDate || undefined}
                  value={data.diagnosisEndDate || ''}
                  onChange={(e) => setData({ ...data, diagnosisEndDate: e.target.value })}
                  className="bg-transparent text-emerald-400 font-semibold focus:outline-none text-xs cursor-pointer"
                />
              </div>
              {(data.diagnosisStartDate || data.diagnosisEndDate) && (
                <button
                  type="button"
                  onClick={() => setData({ ...data, diagnosisStartDate: '', diagnosisEndDate: '' })}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-[11px] transition-colors border border-slate-700"
                  title="Reset Tanggal"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Riwayat Diagnosa Berkala / Arsip Log */}
          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Arsip Riwayat: <strong className={diagnosisLogs.length > 0 ? "text-blue-400 font-bold" : "text-slate-500"}>{diagnosisLogs.length} Periode Tersimpan</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[10px] text-slate-500">Pilih riwayat:</span>
              <select
                onChange={(e) => handleSelectHistoryLog(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-blue-300 rounded-lg px-2.5 py-1 text-[11px] font-medium focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                defaultValue=""
                disabled={diagnosisLogs.length === 0}
              >
                <option value="" disabled>
                  {diagnosisLogs.length > 0 ? 'Pilih Arsip Periode Diagnosa...' : 'Belum Ada Arsip (Klik Simpan Diagnosa)'}
                </option>
                {diagnosisLogs.map((log) => (
                  <option key={log.id} value={log.id}>
                    {log.periodStartDate ? new Date(log.periodStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'} s/d {log.periodEndDate ? new Date(log.periodEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} ({log.status.toUpperCase()})
                  </option>
                ))}
              </select>
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
            <div className="space-y-3">
              {internalFactors.length === 0 ? (
                <div className="py-7 px-4 text-center rounded-xl bg-slate-850/40 border border-dashed border-slate-800 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-400">Belum ada faktor diagnosa internal</p>
                  <p className="text-[11px] text-slate-500">
                    Klik <span className="text-emerald-400 font-semibold">"Muat Standar"</span> di bawah untuk memuat 6 SOP Sidogiri atau <span className="text-emerald-400 font-semibold">"+ Faktor"</span> untuk input manual.
                  </p>
                </div>
              ) : (
                internalFactors.map((factor) => (
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
                ))
              )}
            </div>

            {/* Bottom Action Footer for Internal Factors */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span className="text-xs font-semibold text-slate-300">Diagnosa Faktor Internal</span>
                <span className="text-[11px] text-slate-500">({internalFactors.length} faktor)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadSidogiriPresetFactors}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold border border-emerald-500 transition-colors shadow-sm active:scale-95"
                >
                  Muat Standar
                </button>
                <button
                  onClick={() => addDefaultRcaFactor('internal')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Faktor
                </button>
              </div>
            </div>
          </div>

          {/* External Factors */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
            <div className="space-y-3">
              {externalFactors.length === 0 ? (
                <div className="py-7 px-4 text-center rounded-xl bg-slate-850/40 border border-dashed border-slate-800 space-y-1.5">
                  <p className="text-xs font-semibold text-slate-400">Belum ada faktor diagnosa eksternal</p>
                  <p className="text-[11px] text-slate-500">
                    Klik <span className="text-amber-400 font-semibold">"+ Faktor"</span> di bawah untuk mencatat kondisi kompetitor atau pasar sekitar.
                  </p>
                </div>
              ) : (
                externalFactors.map((factor) => (
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
                ))
              )}
            </div>

            {/* Bottom Action Footer for External Factors */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-xs font-semibold text-slate-300">Diagnosa Faktor Eksternal</span>
                <span className="text-[11px] text-slate-500">({externalFactors.length} faktor)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addDefaultRcaFactor('eksternal')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" /> Faktor
                </button>
                <button
                  onClick={handleSave}
                  className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all active:scale-95"
                >
                  <Save className="w-3.5 h-3.5" />
                  Diagnosa
                </button>
              </div>
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
