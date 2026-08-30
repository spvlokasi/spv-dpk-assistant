import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, BranchGraduation, EscalationTicket, DiagnosisLog } from '../../types';

export const mapBranchFromCloud = (b: any): Branch => ({
  id: b.id,
  code: b.code,
  name: b.name,
  address: b.address || '',
  phone: b.phone || '',
  city: b.city || 'Jawa Timur',
  latitude: b.lat != null ? Number(b.lat) : -7.1595,
  longitude: b.lng != null ? Number(b.lng) : 113.4735,
  kepalaToko: b.kepala_toko || '',
  spvArea: b.spv_area || '',
  manajerBisnis: b.manajer_bisnis || 'H. Bambang Irawan',
  entryDate: b.entry_date || new Date().toISOString().slice(0, 10),
  targetGraduationDate: b.target_graduation_date || '',
  diagnosisStartDate: b.diagnosis_start_date || '',
  diagnosisEndDate: b.diagnosis_end_date || '',
  category: b.category || 'sales_drop',
  status: b.status || 'kritis',
  urgencyLevel: b.urgency_level || 'tinggi',
  targetSalesPerDay: Number(b.target_sales_per_day) || 1500000,
  targetMarginPct: Number(b.target_margin_pct) || 15.5,
  targetMaxOpexPerMonth: Number(b.target_max_opex_per_month) || 22000000,
  rootCauses: b.root_causes || [],
  diagnosisSummary: b.diagnosis_summary || '',
  recommendedStrategy: b.recommendedStrategy || '',
  imageUrl: b.image_url || undefined
});

export const mapMilestoneFromCloud = (m: any): ActionPlanMilestone => ({
  id: m.id, branchId: m.branch_id, weekNumber: m.week_number, title: m.title,
  targetMetric: m.target_metric, status: m.status, tasks: m.tasks || []
});

export const mapVisitFromCloud = (v: any): FieldVisit => ({
  id: v.id, branchId: v.branch_id, date: v.visit_date, time: v.visit_time || '10:00',
  spvName: v.spv_name, agenda: v.agenda, katokCoachingTopic: v.katok_coaching_topic,
  katokCommitment: v.katok_commitment, crewCoachingTopic: v.crew_coaching_topic,
  spvAreaCoordinationNote: v.spv_area_coordination_note, generalRating: v.general_rating,
  summaryConclusion: v.summary_conclusion, issues: v.issues || []
});

export const mapPerformanceFromCloud = (p: any): DailyPerformance => ({
  id: p.id, branchId: p.branch_id, date: p.record_date,
  salesActual: Number(p.sales_actual) || 0, salesTarget: Number(p.sales_target) || 0,
  marginPct: Number(p.margin_pct) || 0, opex: Number(p.opex) || 0,
  trafficCount: Number(p.traffic_count) || 0, basketSize: Number(p.basket_size) || 0,
  notes: p.notes || ''
});

export const mapGraduationFromCloud = (g: any): BranchGraduation => ({
  branchId: g.branch_id, consecutiveMonthsHit: Number(g.consecutive_months_hit) || 0,
  targetMonthsRequired: Number(g.target_months_required) || 3, checklists: g.checklists || [],
  bestPracticeLearnings: g.best_practice_learnings || '', graduationDate: g.graduation_date,
  approvedByManager: Boolean(g.approved_by_manager)
});

export const mapEscalationFromCloud = (e: any): EscalationTicket => ({
  id: e.id, branchId: e.branch_id, branchName: e.branch_name, date: e.ticket_date,
  title: e.title, category: e.category, urgency: e.urgency, description: e.description,
  proposedSolution: e.proposed_solution, status: e.status, managerFeedback: e.manager_feedback
});

export const mapDiagnosisLogFromCloud = (d: any): DiagnosisLog => ({
  id: d.id, branchId: d.branch_id, periodStartDate: d.period_start_date,
  periodEndDate: d.period_end_date, category: d.category, status: d.status,
  urgencyLevel: d.urgency_level, targetSalesPerDay: Number(d.target_sales_per_day) || 0,
  targetMarginPct: Number(d.target_margin_pct) || 0, targetMaxOpexPerMonth: Number(d.target_max_opex_per_month) || 0,
  rootCauses: d.root_causes || [], diagnosisSummary: d.diagnosis_summary,
  recommendedStrategy: d.recommended_strategy, diagnosedBy: d.diagnosed_by,
  createdAt: d.created_at
});
