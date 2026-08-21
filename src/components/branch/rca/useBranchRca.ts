import { useState } from 'react';
import { Branch, RootCauseFactor, DiagnosisLog, DpkStatus } from '../../../types';
import { StorageService } from '../../../services/storage';
import { getSidogiriPresetFactors } from './rcaPresets';
import { generateGeminiDiagnosisAndStrategy } from '../../../services/geminiService';

export const useBranchRca = (branch: Branch, onSaveBranch: (b: Branch) => void) => {
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
    const isOldDummyRootCauses = branch.rootCauses?.some((r) =>
      ['rc-1', 'rc-2', 'rc-3', 'rc-4', 'rc-21', 'rc-31'].includes(r.id)
    );
    const initialRootCauses = isOldDummyRootCauses ? [] : branch.rootCauses || [];
    return {
      ...branch,
      diagnosisStartDate: !branch.diagnosisStartDate || isOldDummyDate ? todayStr : branch.diagnosisStartDate,
      diagnosisEndDate: !branch.diagnosisEndDate || isOldDummyDate ? todayStr : branch.diagnosisEndDate,
      rootCauses: initialRootCauses,
      status: getAutoStatus(initialRootCauses, branch.status)
    };
  });

  const [isSaved, setIsSaved] = useState(false);
  const [diagnosisLogs, setDiagnosisLogs] = useState<DiagnosisLog[]>(() =>
    StorageService.getDiagnosisLogs(branch.id)
  );

  const internalFactors = data.rootCauses.filter((f) => f.category === 'internal');
  const eksternalFactors = data.rootCauses.filter((f) => f.category === 'eksternal');

  const avgScore =
    data.rootCauses.length > 0
      ? (data.rootCauses.reduce((acc, curr) => acc + curr.score, 0) / data.rootCauses.length).toFixed(1)
      : '0.0';

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
    const updated = data.rootCauses.map((f) => (f.id === id ? { ...f, [field]: value } : f));
    setData({ ...data, rootCauses: updated, status: getAutoStatus(updated, data.status) });
  };

  const handleRemoveFactor = (id: string) => {
    const updated = data.rootCauses.filter((f) => f.id !== id);
    setData({ ...data, rootCauses: updated, status: getAutoStatus(updated, data.status) });
  };

  const handleApplyPreset = () => {
    const presetFactors = getSidogiriPresetFactors();
    const existingEksternal = data.rootCauses.filter((f) => f.category === 'eksternal');
    const updated = [...presetFactors, ...existingEksternal];
    setData({ ...data, rootCauses: updated, status: getAutoStatus(updated, data.status) });
  };

  const handleGenerateAISummary = async () => {
    const result = await generateGeminiDiagnosisAndStrategy(data);
    setData({
      ...data,
      diagnosisSummary: result.diagnosisSummary,
      recommendedStrategy: result.recommendedStrategy
    });
  };

  const handleClearAnalysis = () => {
    setData({ ...data, diagnosisSummary: '', recommendedStrategy: '' });
  };

  const handleSave = () => {
    const finalStatus = getAutoStatus(data.rootCauses, data.status);
    const branchToSave = { ...data, status: finalStatus };

    onSaveBranch(branchToSave);

    const logEntry: DiagnosisLog = {
      id: `diag-log-${Date.now()}`,
      branchId: branch.id,
      periodStartDate: data.diagnosisStartDate || todayStr,
      periodEndDate: data.diagnosisEndDate || todayStr,
      category: data.category,
      status: finalStatus,
      urgencyLevel: data.urgencyLevel,
      targetSalesPerDay: data.targetSalesPerDay,
      targetMarginPct: data.targetMarginPct,
      targetMaxOpexPerMonth: data.targetMaxOpexPerMonth,
      rootCauses: [...data.rootCauses],
      diagnosisSummary: data.diagnosisSummary || '',
      recommendedStrategy: data.recommendedStrategy || '',
      createdAt: new Date().toISOString()
    };

    StorageService.saveDiagnosisLog(logEntry);
    setDiagnosisLogs(StorageService.getDiagnosisLogs(branch.id));

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSelectHistoryLog = (logId: string) => {
    const log = diagnosisLogs.find((l) => l.id === logId);
    if (!log) return;
    const restoredStatus = getAutoStatus(log.rootCauses, log.status);
    setData({
      ...data,
      diagnosisStartDate: log.periodStartDate,
      diagnosisEndDate: log.periodEndDate,
      rootCauses: [...log.rootCauses],
      diagnosisSummary: log.diagnosisSummary,
      recommendedStrategy: log.recommendedStrategy,
      status: restoredStatus
    });
  };

  return {
    data,
    setData,
    isSaved,
    diagnosisLogs,
    internalFactors,
    eksternalFactors,
    avgScore,
    addDefaultRcaFactor,
    handleUpdateFactor,
    handleRemoveFactor,
    handleApplyPreset,
    handleGenerateAISummary,
    handleClearAnalysis,
    handleSave,
    handleSelectHistoryLog
  };
};
