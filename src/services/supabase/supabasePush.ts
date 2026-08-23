import { getSupabaseClient } from './supabaseClient';
import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, BranchGraduation, EscalationTicket } from '../../types';

export const SupabasePush = {
  async syncLocalToCloud(payload: {
    branches: Branch[];
    milestones: ActionPlanMilestone[];
    visits: FieldVisit[];
    performance: DailyPerformance[];
    graduations: BranchGraduation[];
    escalations: EscalationTicket[];
  }) {
    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase belum terkonfigurasi' };

    try {
      if (payload.branches.length > 0) {
        await client.from('branches').upsert(payload.branches.map(b => ({
          id: b.id, code: b.code, name: b.name, address: b.address, phone: b.phone,
          kepala_toko: b.kepalaToko, spv_area: b.spvArea, manajer_bisnis: b.manajerBisnis,
          entry_date: b.entryDate, target_graduation_date: b.targetGraduationDate,
          category: b.category, status: b.status, urgency_level: b.urgencyLevel,
          target_sales_per_day: b.targetSalesPerDay, target_margin_pct: b.targetMarginPct,
          target_max_opex_per_month: b.targetMaxOpexPerMonth, root_causes: b.rootCauses,
          diagnosis_summary: b.diagnosisSummary, recommended_strategy: b.recommendedStrategy
        })));
      }

      if (payload.milestones.length > 0) {
        await client.from('action_milestones').upsert(payload.milestones.map(m => ({
          id: m.id, branch_id: m.branchId, week_number: m.weekNumber, title: m.title,
          target_metric: m.targetMetric, status: m.status, tasks: m.tasks
        })));
      }

      if (payload.visits.length > 0) {
        await client.from('field_visits').upsert(payload.visits.map(v => ({
          id: v.id, branch_id: v.branchId, visit_date: v.date, visit_time: v.time,
          spv_name: v.spvName, agenda: v.agenda, katok_coaching_topic: v.katokCoachingTopic,
          katok_commitment: v.katokCommitment, crew_coaching_topic: v.crewCoachingTopic,
          spv_area_coordination_note: v.spvAreaCoordinationNote, general_rating: v.generalRating,
          summary_conclusion: v.summaryConclusion, issues: v.issues
        })));
      }

      if (payload.performance.length > 0) {
        await client.from('daily_performance').upsert(payload.performance.map(p => ({
          id: p.id, branch_id: p.branchId, record_date: p.date, sales_actual: p.salesActual,
          sales_target: p.salesTarget, margin_pct: p.marginPct, opex: p.opex,
          traffic_count: p.trafficCount, basket_size: p.basketSize, notes: p.notes
        })));
      }

      if (payload.graduations.length > 0) {
        await client.from('branch_graduations').upsert(payload.graduations.map(g => ({
          branch_id: g.branchId, consecutive_months_hit: g.consecutiveMonthsHit,
          target_months_required: g.targetMonthsRequired, checklists: g.checklists,
          best_practice_learnings: g.bestPracticeLearnings, graduation_date: g.graduationDate,
          approved_by_manager: g.approvedByManager
        })));
      }

      if (payload.escalations.length > 0) {
        await client.from('escalation_tickets').upsert(payload.escalations.map(e => ({
          id: e.id, branch_id: e.branchId, branch_name: e.branchName, ticket_date: e.date,
          title: e.title, category: e.category, urgency: e.urgency, description: e.description,
          proposed_solution: e.proposedSolution, status: e.status, manager_feedback: e.managerFeedback
        })));
      }

      return { success: true, message: 'Sinkronisasi data ke Cloud Supabase Berhasil!' };
    } catch (e: any) {
      console.error('Error sync ke Supabase:', e);
      return { success: false, message: `Gagal sinkron: ${e.message || e}` };
    }
  }
};
