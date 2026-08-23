import { useState } from 'react';
import { Branch, RootCauseFactor, DiagnosisLog } from '../../../types';
import { StorageService } from '../../../services/storage';
import { getSidogiriPresetFactors } from './rcaPresets';
import { generateGeminiDiagnosisAndStrategy } from '../../../services/geminiService';
import { getTodayStr, getAutoStatus } from './rcaHelpers';

export const useBranchRca = (branch: Branch, onSaveBranch: (b: Branch) => void) => {
  const todayStr = getTodayStr();

  const [data, setData] = useState<Branch>(() => {
    const isOld = branch.diagnosisStartDate === '2026-08-01' || branch.diagnosisStartDate === '2026-06-01';
    const initRca = branch.rootCauses?.some((r) => ['rc-1', 'rc-2', 'rc-3', 'rc-4'].includes(r.id)) ? [] : branch.rootCauses || [];
    return {
      ...branch,
      diagnosisStartDate: !branch.diagnosisStartDate || isOld ? todayStr : branch.diagnosisStartDate,
      diagnosisEndDate: !branch.diagnosisEndDate || isOld ? todayStr : branch.diagnosisEndDate,
      rootCauses: initRca, status: getAutoStatus(initRca, branch.status)
    };
  });

  const [isSaved, setIsSaved] = useState(false);
  const [diagnosisLogs, setDiagnosisLogs] = useState<DiagnosisLog[]>(() => StorageService.getDiagnosisLogs(branch.id));

  const avgScore = data.rootCauses.length > 0 ? (data.rootCauses.reduce((acc, curr) => acc + curr.score, 0) / data.rootCauses.length).toFixed(1) : '0.0';

  const updateRootCauses = (updated: RootCauseFactor[]) => {
    setData({ ...data, rootCauses: updated, status: getAutoStatus(updated, data.status) });
  };

  const handleSave = () => {
    const finalStatus = getAutoStatus(data.rootCauses, data.status);
    onSaveBranch({ ...data, status: finalStatus });

    const logEntry: DiagnosisLog = {
      id: `diag-log-${Date.now()}`, branchId: branch.id, periodStartDate: data.diagnosisStartDate || todayStr,
      periodEndDate: data.diagnosisEndDate || todayStr, category: data.category, status: finalStatus,
      urgencyLevel: data.urgencyLevel, targetSalesPerDay: data.targetSalesPerDay, targetMarginPct: data.targetMarginPct,
      targetMaxOpexPerMonth: data.targetMaxOpexPerMonth, rootCauses: [...data.rootCauses], diagnosisSummary: data.diagnosisSummary || '',
      recommendedStrategy: data.recommendedStrategy || '', createdAt: new Date().toISOString()
    };
    StorageService.saveDiagnosisLog(logEntry);
    setDiagnosisLogs(StorageService.getDiagnosisLogs(branch.id));
    setIsSaved(true); setTimeout(() => setIsSaved(false), 3000);
  };

  return {
    data, setData, isSaved, diagnosisLogs,
    internalFactors: data.rootCauses.filter((f) => f.category === 'internal'),
    eksternalFactors: data.rootCauses.filter((f) => f.category === 'eksternal'),
    avgScore,
    addDefaultRcaFactor: (cat: 'internal' | 'eksternal') => updateRootCauses([...data.rootCauses, { id: `rc-${Date.now()}`, category: cat, title: cat === 'internal' ? 'Faktor Baru' : 'Faktor Pasar Baru', score: 3, note: '' }]),
    handleUpdateFactor: (id: string, field: keyof RootCauseFactor, value: any) => updateRootCauses(data.rootCauses.map((f) => (f.id === id ? { ...f, [field]: value } : f))),
    handleRemoveFactor: (id: string) => updateRootCauses(data.rootCauses.filter((f) => f.id !== id)),
    handleApplyPreset: () => updateRootCauses([...getSidogiriPresetFactors(), ...data.rootCauses.filter((f) => f.category === 'eksternal')]),
    handleGenerateAISummary: async () => {
      const res = await generateGeminiDiagnosisAndStrategy(data);
      setData({ ...data, diagnosisSummary: res.diagnosisSummary, recommendedStrategy: res.recommendedStrategy });
    },
    handleClearAnalysis: () => setData({ ...data, diagnosisSummary: '', recommendedStrategy: '' }),
    handleSave,
    handleSelectHistoryLog: (logId: string) => {
      const log = diagnosisLogs.find((l) => l.id === logId);
      if (log) setData({ ...data, diagnosisStartDate: log.periodStartDate, diagnosisEndDate: log.periodEndDate, rootCauses: [...log.rootCauses], diagnosisSummary: log.diagnosisSummary, recommendedStrategy: log.recommendedStrategy, status: getAutoStatus(log.rootCauses, log.status) });
    }
  };
};
