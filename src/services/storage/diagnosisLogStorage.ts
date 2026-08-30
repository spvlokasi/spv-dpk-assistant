import { DiagnosisLog } from '../../types';
import { safeParse } from './storageCore';
import { getSupabaseClient } from '../supabase';

const DIAGNOSIS_LOGS_KEY = 'spv_dpk_diagnosis_logs';

export const DiagnosisLogStorage = {
  getDiagnosisLogs(branchId: string): DiagnosisLog[] {
    const allLogs = safeParse<DiagnosisLog[]>(DIAGNOSIS_LOGS_KEY, []);
    return allLogs.filter((log) => log.branchId === branchId);
  },

  async saveDiagnosisLog(log: DiagnosisLog) {
    try {
      const allLogs = safeParse<DiagnosisLog[]>(DIAGNOSIS_LOGS_KEY, []);
      const index = allLogs.findIndex((l) => l.id === log.id);
      if (index >= 0) allLogs[index] = log;
      else allLogs.unshift(log);
      localStorage.setItem(DIAGNOSIS_LOGS_KEY, JSON.stringify(allLogs.slice(0, 100)));
    } catch (e) {
      console.warn('saveDiagnosisLog error:', e);
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('diagnosis_logs').upsert({
          id: log.id,
          branch_id: log.branchId,
          period_start_date: log.periodStartDate,
          period_end_date: log.periodEndDate,
          category: log.category,
          status: log.status,
          urgency_level: log.urgencyLevel,
          target_sales_per_day: Number(log.targetSalesPerDay) || 12000000,
          target_margin_pct: Number(log.targetMarginPct) || 15,
          target_max_opex_per_month: Number(log.targetMaxOpexPerMonth) || 20000000,
          root_causes: log.rootCauses || [],
          diagnosis_summary: log.diagnosisSummary || '',
          recommended_strategy: log.recommendedStrategy || '',
          diagnosed_by: log.diagnosedBy || 'Supervisor DPK',
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync diagnosis_log failed:', e);
      }
    }
  },

  async fetchDiagnosisLogsFromCloud(branchId: string): Promise<DiagnosisLog[]> {
    const client = getSupabaseClient();
    if (!client) return this.getDiagnosisLogs(branchId);

    try {
      const { data, error } = await client
        .from('diagnosis_logs')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return this.getDiagnosisLogs(branchId);
      }

      const logs: DiagnosisLog[] = data.map((d: any) => ({
        id: d.id,
        branchId: d.branch_id,
        periodStartDate: d.period_start_date,
        periodEndDate: d.period_end_date,
        category: d.category,
        status: d.status,
        urgencyLevel: d.urgency_level,
        targetSalesPerDay: Number(d.target_sales_per_day) || 12000000,
        targetMarginPct: Number(d.target_margin_pct) || 15,
        targetMaxOpexPerMonth: Number(d.target_max_opex_per_month) || 20000000,
        rootCauses: d.root_causes || [],
        diagnosisSummary: d.diagnosis_summary || '',
        recommendedStrategy: d.recommended_strategy || '',
        diagnosedBy: d.diagnosed_by || 'Supervisor DPK',
        createdAt: d.created_at
      }));

      // Cache locally
      const allLogs = safeParse<DiagnosisLog[]>(DIAGNOSIS_LOGS_KEY, []);
      const otherLogs = allLogs.filter((l) => l.branchId !== branchId);
      localStorage.setItem(DIAGNOSIS_LOGS_KEY, JSON.stringify([...logs, ...otherLogs].slice(0, 100)));

      return logs;
    } catch (e) {
      console.warn('Gagal fetch diagnosis_logs dari cloud:', e);
      return this.getDiagnosisLogs(branchId);
    }
  }
};

