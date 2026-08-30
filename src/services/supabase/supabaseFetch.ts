import { getSupabaseClient } from './supabaseClient';
import {
  mapBranchFromCloud,
  mapMilestoneFromCloud,
  mapVisitFromCloud,
  mapPerformanceFromCloud,
  mapGraduationFromCloud,
  mapEscalationFromCloud,
  mapDiagnosisLogFromCloud
} from './supabaseMappers';

export const SupabaseFetch = {
  async fetchAllFromCloud() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const [bRes, mRes, vRes, pRes, gRes, eRes, dRes] = await Promise.all([
        client.from('branches').select('*'),
        client.from('action_milestones').select('*'),
        client.from('field_visits').select('*'),
        client.from('daily_performance').select('*'),
        client.from('branch_graduations').select('*'),
        client.from('escalation_tickets').select('*'),
        client.from('diagnosis_logs').select('*')
      ]);

      return {
        branches: (bRes.data || []).map(mapBranchFromCloud),
        milestones: (mRes.data || []).map(mapMilestoneFromCloud),
        visits: (vRes.data || []).map(mapVisitFromCloud),
        performance: (pRes.data || []).map(mapPerformanceFromCloud),
        graduations: (gRes.data || []).map(mapGraduationFromCloud),
        escalations: (eRes.data || []).map(mapEscalationFromCloud),
        diagnosisLogs: (dRes.data || []).map(mapDiagnosisLogFromCloud)
      };
    } catch (e) {
      console.error('Error fetching all from Supabase:', e);
      return null;
    }
  }
};
