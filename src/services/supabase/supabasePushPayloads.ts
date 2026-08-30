import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, BranchGraduation, EscalationTicket, DiagnosisLog, PromoProduct, PromoVoucher } from '../../types';

export const toBranchPayload = (b: Branch) => ({
  id: b.id, code: b.code, name: b.name, address: b.address || '', phone: b.phone || '',
  city: b.city || 'Jawa Timur', lat: b.latitude ?? -7.1595, lng: b.longitude ?? 113.4735,
  kepala_toko: b.kepalaToko, spv_area: b.spvArea, manajer_bisnis: b.manajerBisnis,
  entry_date: b.entryDate, target_graduation_date: b.targetGraduationDate || null,
  diagnosis_start_date: b.diagnosisStartDate || null, diagnosis_end_date: b.diagnosisEndDate || null,
  category: b.category, status: b.status, urgency_level: b.urgencyLevel,
  target_sales_per_day: b.targetSalesPerDay, target_margin_pct: b.targetMarginPct,
  target_max_opex_per_month: b.targetMaxOpexPerMonth, root_causes: b.rootCauses,
  diagnosis_summary: b.diagnosisSummary, recommended_strategy: b.recommendedStrategy,
  image_url: b.imageUrl || null, updated_at: new Date().toISOString()
});

export const toMilestonePayload = (m: ActionPlanMilestone) => ({
  id: m.id, branch_id: m.branchId, week_number: m.weekNumber, title: m.title,
  target_metric: m.targetMetric, status: m.status, tasks: m.tasks, updated_at: new Date().toISOString()
});

export const toVisitPayload = (v: FieldVisit) => ({
  id: v.id, branch_id: v.branchId, visit_date: v.date, visit_time: v.time,
  spv_name: v.spvName, agenda: v.agenda, katok_coaching_topic: v.katokCoachingTopic,
  katok_commitment: v.katokCommitment, crew_coaching_topic: v.crewCoachingTopic,
  spv_area_coordination_note: v.spvAreaCoordinationNote, general_rating: v.generalRating,
  summary_conclusion: v.summaryConclusion, issues: v.issues
});

export const toPerformancePayload = (p: DailyPerformance) => ({
  id: p.id, branch_id: p.branchId, record_date: p.date, sales_actual: p.salesActual,
  sales_target: p.salesTarget, margin_pct: p.marginPct, opex: p.opex,
  traffic_count: p.trafficCount, basket_size: p.basketSize, notes: p.notes
});

export const toGraduationPayload = (g: BranchGraduation) => ({
  branch_id: g.branchId, consecutive_months_hit: g.consecutiveMonthsHit,
  target_months_required: g.targetMonthsRequired, checklists: g.checklists,
  best_practice_learnings: g.bestPracticeLearnings, graduation_date: g.graduationDate,
  approved_by_manager: g.approvedByManager, updated_at: new Date().toISOString()
});

export const toEscalationPayload = (e: EscalationTicket) => ({
  id: e.id, branch_id: e.branchId, branch_name: e.branchName, ticket_date: e.date,
  title: e.title, category: e.category, urgency: e.urgency, description: e.description,
  proposed_solution: e.proposedSolution, status: e.status, manager_feedback: e.managerFeedback,
  updated_at: new Date().toISOString()
});

export const toDiagnosisLogPayload = (d: DiagnosisLog) => ({
  id: d.id, branch_id: d.branchId, period_start_date: d.periodStartDate,
  period_end_date: d.periodEndDate, category: d.category, status: d.status,
  urgency_level: d.urgencyLevel, target_sales_per_day: d.targetSalesPerDay,
  target_margin_pct: d.targetMarginPct, target_max_opex_per_month: d.targetMaxOpexPerMonth,
  root_causes: d.rootCauses, diagnosis_summary: d.diagnosisSummary,
  recommended_strategy: d.recommendedStrategy, diagnosed_by: d.diagnosedBy,
  updated_at: new Date().toISOString()
});

export const toPromoProductPayload = (p: PromoProduct) => ({
  id: p.id, branch_id: p.branchId, name: p.name, category: p.category,
  original_price: p.originalPrice, promo_price: p.promoPrice, unit: p.unit,
  image_url: p.imageUrl || '', in_stock: p.inStock, is_featured: p.isFeatured ?? true,
  updated_at: new Date().toISOString()
});

export const toPromoVoucherPayload = (v: PromoVoucher) => ({
  id: v.id, branch_id: v.branchId, code: v.code, discount_amount: v.discountAmount,
  min_spend: v.minSpend, quota: v.quota, claimed_count: v.claimedCount || 0,
  used_count: v.usedCount || 0, valid_until: v.validUntil, is_active: v.isActive,
  description: v.description, funding_source: v.fundingSource || 'store',
  sponsor_name: v.sponsorName || '', applicable_category: v.applicableCategory || 'all',
  updated_at: new Date().toISOString()
});
