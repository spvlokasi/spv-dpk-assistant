import React, { useState } from 'react';
import { Branch, RootCauseFactor, DiagnosisLog } from '../../types';
import { StorageService } from '../../services/storage';
import { BranchHeaderProfile } from './rca/BranchHeaderProfile';
import { BranchPeriodPicker } from './rca/BranchPeriodPicker';
import { BranchFinancialTargets } from './rca/BranchFinancialTargets';
import { RcaFactorSection } from './rca/RcaFactorSection';
import { RcaHealthScoreCard } from './rca/RcaHealthScoreCard';
import { RcaStrategyPlan } from './rca/RcaStrategyPlan';

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
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getTodayStr();
  const [data, setData] = useState<Branch>(() => {
    const isOldDummyDate = branch.diagnosisStartDate === '2026-08-01' || branch.diagnosisStartDate === '2026-06-01' || branch.diagnosisStartDate === '2026-05-15';
    const isOldDummyRootCauses = branch.rootCauses?.some(r => ['rc-1', 'rc-2', 'rc-3', 'rc-4', 'rc-21', 'rc-22', 'rc-23', 'rc-31', 'rc-32', 'rc-33'].includes(r.id));
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
    setData({ ...data, rootCauses: [...data.rootCauses, newFactor] });
  };

  const loadSidogiriPresetFactors = () => {
    const sidogiriInternal: RootCauseFactor[] = [
      { id: `rc-int-1-${Date.now()}`, category: 'internal', title: 'Efisiensi Listrik & Energi (Suhu AC 24-25°C, Neon Box, Rawat Freezer)', score: 3, note: 'Pastikan AC tidak <24°C, matikan 1 AC saat sepi, neon box 17.30-22.00, bersihkan kondensor freezer.' },
      { id: `rc-int-2-${Date.now()}`, category: 'internal', title: 'Penertiban Stok Mati, Slow Moving & Zero Expired (FEFO & Mark-Down 10-20%)', score: 3, note: 'Audit 2 mingguan stok mati, beri diskon khusus kasir sebelum kadaluarsa untuk amankan margin.' },
      { id: `rc-int-3-${Date.now()}`, category: 'internal', title: 'Kedisiplinan SOP Kasir: Up-selling & Suggestive Selling Promo', score: 3, note: 'Wajib tawarkan produk tebus murah, cross-selling kopi+gula, target minimal +Rp2.000 per struk.' },
      { id: `rc-int-4-${Date.now()}`, category: 'internal', title: 'Ketersediaan Top 50 SKU Omzet (Zero Out-of-Stock)', score: 3, note: 'Barang fast-moving (air mineral, rokok, beras, minyak goreng) wajib selalu ada di rak display.' },
      { id: `rc-int-5-${Date.now()}`, category: 'internal', title: 'Kedisiplinan SO Parsial Harian Kategori Rawan (Rokok, Susu, Kosmetik)', score: 3, note: 'Lakukan hitung fisik harian kategori rawan selisih/hilang sebelum pergantian shift kasir.' },
      { id: `rc-int-6-${Date.now()}`, category: 'internal', title: 'Kemandirian & Kepemimpinan KTB (Briefing Pagi & Kawal Target Laba)', score: 3, note: 'KTB pimpin briefing pagi 10 menit, evaluasi target laba harian, dan pantau kepatuhan SOP crew.' }
    ];

    const sidogiriExternal: RootCauseFactor[] = [
      { id: `rc-ext-1-${Date.now()}`, category: 'eksternal', title: 'Tekanan Kompetitor Sekitar & Selisih Promo Harga', score: 3, note: 'Pantau harga promo toko sebelah dan perkuat keunggulan pelayanan khas TokoBASMALAH.' },
      { id: `rc-ext-2-${Date.now()}`, category: 'eksternal', title: 'Aksesibilitas, Kebersihan Parkir & Penerangan Depan Toko', score: 3, note: 'Parkiran lapang, bebas sampah, dan lampu penerangan terang agar konsumen nyaman singgah.' },
      { id: `rc-ext-3-${Date.now()}`, category: 'eksternal', title: 'Potensi Canvassing Sembako ke Warung, UMKM & Komunitas Sekitar', score: 3, note: 'Jemput bola pesanan kartonan ke pesantren/warung sekitar toko untuk suntikan omzet harian.' },
      { id: `rc-ext-4-${Date.now()}`, category: 'eksternal', title: 'Daya Beli Masyarakat & Karakteristik Pelanggan Lingkungan', score: 3, note: 'Sesuaikan varian ukuran produk (kemasan sachet/ekonomis) dengan profil warga sekitar.' }
    ];

    setData({ ...data, rootCauses: [...sidogiriInternal, ...sidogiriExternal] });
  };

  const handleUpdateFactor = (id: string, field: keyof RootCauseFactor, value: any) => {
    setData({ ...data, rootCauses: data.rootCauses.map(f => f.id === id ? { ...f, [field]: value } : f) });
  };

  const handleDeleteFactor = (id: string) => {
    setData({ ...data, rootCauses: data.rootCauses.filter(f => f.id !== id) });
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
  const avgScore = data.rootCauses.length > 0
    ? (data.rootCauses.reduce((acc, curr) => acc + curr.score, 0) / data.rootCauses.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Header Profile Card with Embedded Actions */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl space-y-4">
        <BranchHeaderProfile
          data={data}
          isSaved={isSaved}
          onBack={onBack}
          onNavigateToTab={onNavigateToTab}
        />

        {/* Date Range Picker & History Logs */}
        <BranchPeriodPicker
          startDate={data.diagnosisStartDate || ''}
          endDate={data.diagnosisEndDate || ''}
          diagnosisLogs={diagnosisLogs}
          onChangeStartDate={(val) => setData({ ...data, diagnosisStartDate: val })}
          onChangeEndDate={(val) => setData({ ...data, diagnosisEndDate: val })}
          onResetDates={() => setData({ ...data, diagnosisStartDate: '', diagnosisEndDate: '' })}
          onSelectHistoryLog={handleSelectHistoryLog}
        />

        {/* Financial Targets */}
        <BranchFinancialTargets
          targetSalesPerDay={data.targetSalesPerDay}
          targetMarginPct={data.targetMarginPct}
          targetMaxOpexPerMonth={data.targetMaxOpexPerMonth}
          onChangeTargetSales={(val) => setData({ ...data, targetSalesPerDay: val })}
          onChangeTargetMargin={(val) => setData({ ...data, targetMarginPct: val })}
          onChangeTargetOpex={(val) => setData({ ...data, targetMaxOpexPerMonth: val })}
        />
      </div>

      {/* Main Grid: RCA Analysis & Strategy Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Root Cause Factors (Internal & External) */}
        <div className="lg:col-span-2 space-y-6">
          <RcaFactorSection
            category="internal"
            factors={internalFactors}
            onAddFactor={() => addDefaultRcaFactor('internal')}
            onUpdateFactor={handleUpdateFactor}
            onDeleteFactor={handleDeleteFactor}
            onLoadPreset={loadSidogiriPresetFactors}
          />
          <RcaFactorSection
            category="eksternal"
            factors={externalFactors}
            onAddFactor={() => addDefaultRcaFactor('eksternal')}
            onUpdateFactor={handleUpdateFactor}
            onDeleteFactor={handleDeleteFactor}
            onSaveDiagnosa={handleSave}
          />
        </div>

        {/* Right Col: Summary, Health Score & Strategy Plan */}
        <div className="space-y-6">
          <RcaHealthScoreCard
            avgScore={avgScore}
            status={data.status}
            onChangeStatus={(st) => setData({ ...data, status: st })}
          />
          <RcaStrategyPlan
            diagnosisSummary={data.diagnosisSummary}
            recommendedStrategy={data.recommendedStrategy}
            onChangeSummary={(val) => setData({ ...data, diagnosisSummary: val })}
            onChangeStrategy={(val) => setData({ ...data, recommendedStrategy: val })}
          />
        </div>
      </div>
    </div>
  );
};
