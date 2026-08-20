import React, { useState } from 'react';
import { Branch, RootCauseFactor, DiagnosisLog, DpkStatus } from '../../types';
import { StorageService } from '../../services/storage';
import { getSidogiriPresetFactors } from './rca/rcaPresets';
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

  const getAutoStatus = (factors: RootCauseFactor[], currentStatus: DpkStatus): DpkStatus => {
    if (currentStatus === 'lulus_dpk') return 'lulus_dpk';
    if (!factors || factors.length === 0) return currentStatus;
    const avg = factors.reduce((acc, curr) => acc + curr.score, 0) / factors.length;
    if (avg <= 2.5) return 'kritis';
    if (avg <= 3.8) return 'dalam_progres';
    return 'siap_lulus';
  };

  const [data, setData] = useState<Branch>(() => {
    const isOldDummyDate = branch.diagnosisStartDate === '2026-08-01' || branch.diagnosisStartDate === '2026-06-01';
    const isOldDummyRootCauses = branch.rootCauses?.some(r => ['rc-1', 'rc-2', 'rc-3', 'rc-4', 'rc-21', 'rc-31'].includes(r.id));
    const initialRootCauses = isOldDummyRootCauses ? [] : (branch.rootCauses || []);
    return {
      ...branch,
      diagnosisStartDate: (!branch.diagnosisStartDate || isOldDummyDate) ? todayStr : branch.diagnosisStartDate,
      diagnosisEndDate: (!branch.diagnosisEndDate || isOldDummyDate) ? todayStr : branch.diagnosisEndDate,
      rootCauses: initialRootCauses,
      status: getAutoStatus(initialRootCauses, branch.status)
    };
  });
  const [isSaved, setIsSaved] = useState(false);
  const [diagnosisLogs, setDiagnosisLogs] = useState<DiagnosisLog[]>(() => StorageService.getDiagnosisLogs(branch.id));

  const addDefaultRcaFactor = (category: 'internal' | 'eksternal') => {
    const newFactor: RootCauseFactor = {
      id: `rc-${Date.now()}`,
      category,
      title: category === 'internal' ? 'Faktor Operasional Baru' : 'Faktor Lingkungan/Kompetitor Baru',
      score: 3,
      note: ''
    };
    const updated = [...data.rootCauses, newFactor];
    setData({ ...data, rootCauses: updated, status: getAutoStatus(updated, data.status) });
  };

  const handleUpdateFactor = (id: string, field: keyof RootCauseFactor, value: any) => {
    const updated = data.rootCauses.map(f => f.id === id ? { ...f, [field]: value } : f);
    setData({ ...data, rootCauses: updated, status: getAutoStatus(updated, data.status) });
  };

  const handleDeleteFactor = (id: string) => {
    const updated = data.rootCauses.filter(f => f.id !== id);
    setData({ ...data, rootCauses: updated, status: getAutoStatus(updated, data.status) });
  };

  const handleLoadPreset = () => {
    const preset = getSidogiriPresetFactors();
    setData({ ...data, rootCauses: preset, status: getAutoStatus(preset, data.status) });
  };

  const handleSave = async () => {
    onSaveBranch(data);
    if (data.diagnosisStartDate && data.diagnosisEndDate) {
      await StorageService.saveDiagnosisLog({
        id: `dlog-${data.id}-${data.diagnosisStartDate}-${data.diagnosisEndDate}`,
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
            onLoadPreset={handleLoadPreset}
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
