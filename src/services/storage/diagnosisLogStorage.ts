import { DiagnosisLog } from '../../types';
import { safeParse } from './storageCore';

const DIAGNOSIS_LOGS_KEY = 'spv_dpk_diagnosis_logs';

export const DiagnosisLogStorage = {
  getDiagnosisLogs(branchId: string): DiagnosisLog[] {
    const allLogs = safeParse<DiagnosisLog[]>(DIAGNOSIS_LOGS_KEY, []);
    return allLogs.filter((log) => log.branchId === branchId);
  },

  saveDiagnosisLog(log: DiagnosisLog) {
    try {
      const allLogs = safeParse<DiagnosisLog[]>(DIAGNOSIS_LOGS_KEY, []);
      allLogs.unshift(log);
      localStorage.setItem(DIAGNOSIS_LOGS_KEY, JSON.stringify(allLogs.slice(0, 50)));
    } catch (e) {
      console.warn('saveDiagnosisLog error:', e);
    }
  }
};
