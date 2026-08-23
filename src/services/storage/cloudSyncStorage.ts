import { getSupabaseClient } from '../supabase';
import { BranchStorage } from './branchStorage';
import { MilestoneStorage } from './milestoneStorage';
import { VisitStorage } from './visitStorage';
import { PerformanceStorage } from './performanceStorage';
import { GraduationStorage } from './graduationStorage';
import { EscalationStorage } from './escalationStorage';

export const CloudSyncStorage = {
  async syncFromCloudOnStartup(): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const [uRes, bRes, mRes, vRes, pRes, gRes, eRes] = await Promise.all([
        client.from('users').select('*').limit(1),
        client.from('branches').select('*'),
        client.from('action_milestones').select('*'),
        client.from('field_visits').select('*'),
        client.from('daily_performance').select('*'),
        client.from('branch_graduations').select('*'),
        client.from('escalation_tickets').select('*')
      ]);

      if (uRes.data?.[0]) {
        const u = uRes.data[0];
        localStorage.setItem('spv_dpk_local_users', JSON.stringify({
          id: u.id, username: u.username, password: u.password, fullName: u.full_name,
          roleTitle: u.role_title, department: u.department, businessManager: u.business_manager, createdAt: u.created_at
        }));
      }

      if (bRes.data) {
        BranchStorage.saveBranches(bRes.data.map((b: any) => ({
          id: b.id, code: b.code, name: b.name, address: b.address || '', phone: b.phone || '',
          kepalaToko: b.kepala_toko || '', spvArea: b.spv_area || '', manajerBisnis: b.manajer_bisnis || 'H. Bambang Irawan',
          entryDate: b.entry_date || new Date().toISOString().slice(0, 10), targetGraduationDate: b.target_graduation_date || '',
          category: b.category || 'sales_drop', status: b.status || 'kritis', urgencyLevel: b.urgency_level || 'tinggi',
          targetSalesPerDay: Number(b.target_sales_per_day) || 1500000, targetMarginPct: Number(b.target_margin_pct) || 15.5,
          targetMaxOpexPerMonth: Number(b.target_max_opex_per_month) || 22000000, rootCauses: b.root_causes || [],
          diagnosisSummary: b.diagnosis_summary || '', recommendedStrategy: b.recommended_strategy || '', imageUrl: b.image_url || undefined
        })));
      }

      if (mRes.data) MilestoneStorage.saveMilestones(mRes.data.map((m: any) => ({ id: m.id, branchId: m.branch_id, weekNumber: m.week_number, title: m.title, targetMetric: m.target_metric, status: m.status, tasks: m.tasks || [] })));
      if (vRes.data) VisitStorage.saveVisits(vRes.data.map((v: any) => ({ id: v.id, branchId: v.branch_id, date: v.visit_date, time: v.visit_time || '10:00', spvName: v.spv_name, agenda: v.agenda, katokCoachingTopic: v.katok_coaching_topic, katokCommitment: v.katok_commitment, crewCoachingTopic: v.crew_coaching_topic, spvAreaCoordinationNote: v.spv_area_coordination_note, generalRating: v.general_rating, summaryConclusion: v.summary_conclusion, issues: v.issues || [] })));
      if (pRes.data) PerformanceStorage.savePerformance(pRes.data.map((p: any) => ({ id: p.id, branchId: p.branch_id, date: p.record_date, salesActual: Number(p.sales_actual) || 0, salesTarget: Number(p.sales_target) || 0, marginPct: Number(p.margin_pct) || 0, opex: Number(p.opex) || 0, trafficCount: Number(p.traffic_count) || 0, basketSize: Number(p.basket_size) || 0, notes: p.notes || '' })));
      if (gRes.data) GraduationStorage.saveGraduations(gRes.data.map((g: any) => ({ branchId: g.branch_id, consecutiveMonthsHit: Number(g.consecutive_months_hit) || 0, targetMonthsRequired: Number(g.target_months_required) || 3, checklists: g.checklists || [], bestPracticeLearnings: g.best_practice_learnings || '', graduationDate: g.graduation_date, approvedByManager: Boolean(g.approved_by_manager) })));
      if (eRes.data) EscalationStorage.saveEscalations(eRes.data.filter((e: any) => !['esc-01', 'esc-02'].includes(e.id)).map((e: any) => ({ id: e.id, branchId: e.branch_id, branchName: e.branch_name, date: e.ticket_date, title: e.title, category: e.category, urgency: e.urgency, description: e.description, proposedSolution: e.proposed_solution || '', status: e.status, managerFeedback: e.manager_feedback || '' })));

      return true;
    } catch (e) {
      console.warn('Initial cloud pull skipped/failed:', e);
      return false;
    }
  }
};
