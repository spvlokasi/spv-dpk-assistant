import { useState, useEffect } from 'react';
import { Branch, RootCauseFactor, DiagnosisLog } from '../../../types';
import { StorageService } from '../../../services/storage';
import { getSidogiriPresetFactors } from './rcaPresets';
import { generateGeminiDiagnosisAndStrategy } from '../../../services/geminiService';
import { getTodayStr, getAutoStatus } from './rcaHelpers';

export const useBranchRca = (branch: Branch, onSaveBranch: (b: Branch) => Promise<void> | void) => {
  const todayStr = getTodayStr();

  const [data, setData] = useState<Branch>(() => {
    const isOld = branch.diagnosisStartDate === '2026-08-01' || branch.diagnosisStartDate === '2026-06-01';
    const initRca = Array.isArray(branch.rootCauses) ? branch.rootCauses : [];
    return {
      ...branch,
      diagnosisStartDate: !branch.diagnosisStartDate || isOld ? todayStr : branch.diagnosisStartDate,
      diagnosisEndDate: !branch.diagnosisEndDate || isOld ? todayStr : branch.diagnosisEndDate,
      rootCauses: initRca,
      status: getAutoStatus(initRca, branch.status)
    };
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [diagnosisLogs, setDiagnosisLogs] = useState<DiagnosisLog[]>(() => StorageService.getDiagnosisLogs(branch.id));

  // Sync if cloud finishes loading and user has not made unsaved modifications
  useEffect(() => {
    if (!isDirty && branch) {
      setData((prev) => ({
        ...prev,
        ...branch,
        rootCauses: Array.isArray(branch.rootCauses) ? branch.rootCauses : prev.rootCauses,
        diagnosisSummary: branch.diagnosisSummary ?? prev.diagnosisSummary,
        recommendedStrategy: branch.recommendedStrategy ?? prev.recommendedStrategy
      }));
    }
  }, [branch.id, branch.rootCauses?.length, branch.status, isDirty]);

  const avgScore = data.rootCauses.length > 0 ? (data.rootCauses.reduce((acc, curr) => acc + curr.score, 0) / data.rootCauses.length).toFixed(1) : '0.0';

  const updateRootCauses = (updated: RootCauseFactor[]) => {
    setIsDirty(true);
    setData((prev) => ({ ...prev, rootCauses: updated, status: getAutoStatus(updated, prev.status) }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('saving');
      const finalStatus = getAutoStatus(data.rootCauses, data.status);
      const branchToSave = { ...data, status: finalStatus };

      await onSaveBranch(branchToSave);

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

      await StorageService.saveDiagnosisLog(logEntry);
      setDiagnosisLogs(StorageService.getDiagnosisLogs(branch.id));

      setIsDirty(false);
      setIsSaved(true);
      setSaveStatus('saved');
      setTimeout(() => {
        setIsSaved(false);
        setSaveStatus('idle');
      }, 4000);
    } catch (err) {
      console.error('Gagal menyimpan diagnosa:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    data,
    setData: (updatedData: Branch) => {
      setIsDirty(true);
      setData(updatedData);
    },
    isSaved,
    isSaving,
    isDirty,
    saveStatus,
    diagnosisLogs,
    internalFactors: data.rootCauses.filter((f) => f.category === 'internal'),
    eksternalFactors: data.rootCauses.filter((f) => f.category === 'eksternal'),
    avgScore,
    addDefaultRcaFactor: (cat: 'internal' | 'eksternal') =>
      updateRootCauses([
        ...data.rootCauses,
        {
          id: `rc-${Date.now()}`,
          category: cat,
          title: cat === 'internal' ? 'Faktor Baru' : 'Faktor Pasar Baru',
          score: 3,
          note: ''
        }
      ]),
    handleUpdateFactor: (id: string, field: keyof RootCauseFactor, value: any) =>
      updateRootCauses(data.rootCauses.map((f) => (f.id === id ? { ...f, [field]: value } : f))),
    handleRemoveFactor: (id: string) =>
      updateRootCauses(data.rootCauses.filter((f) => f.id !== id)),
    handleApplyPreset: () =>
      updateRootCauses([...getSidogiriPresetFactors(), ...data.rootCauses.filter((f) => f.category === 'eksternal')]),
    handleGenerateAISummary: async () => {
      const res = await generateGeminiDiagnosisAndStrategy(data);
      setIsDirty(true);
      setData((prev) => ({ ...prev, diagnosisSummary: res.diagnosisSummary, recommendedStrategy: res.recommendedStrategy }));
    },
    handleClearAnalysis: () => {
      setIsDirty(true);
      setData((prev) => ({ ...prev, diagnosisSummary: '', recommendedStrategy: '' }));
    },
    handleSave,
    handleSelectHistoryLog: (logId: string) => {
      const log = diagnosisLogs.find((l) => l.id === logId);
      if (log) {
        setIsDirty(true);
        setData((prev) => ({
          ...prev,
          diagnosisStartDate: log.periodStartDate,
          diagnosisEndDate: log.periodEndDate,
          rootCauses: [...log.rootCauses],
          diagnosisSummary: log.diagnosisSummary,
          recommendedStrategy: log.recommendedStrategy,
          status: getAutoStatus(log.rootCauses, log.status)
        }));
      }
    }
  };
};
