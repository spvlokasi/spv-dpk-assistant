import { 
  Branch, 
  ActionPlanMilestone, 
  FieldVisit, 
  DailyPerformance, 
  BranchGraduation, 
  EscalationTicket 
} from '../types';
import { 
  INITIAL_BRANCHES, 
  INITIAL_MILESTONES, 
  INITIAL_FIELD_VISITS, 
  INITIAL_PERFORMANCE, 
  INITIAL_GRADUATIONS, 
  INITIAL_ESCALATIONS 
} from './mockData';
import { getSupabaseClient } from './supabase';

const KEYS = {
  BRANCHES: 'spv_dpk_branches',
  MILESTONES: 'spv_dpk_milestones',
  VISITS: 'spv_dpk_visits',
  PERFORMANCE: 'spv_dpk_performance',
  GRADUATIONS: 'spv_dpk_graduations',
  ESCALATIONS: 'spv_dpk_escalations',
  SPV_PROFILE: 'spv_dpk_profile'
};

export interface SpvProfile {
  name: string;
  department: string;
  businessManager: string;
  roleTitle: string;
}

const DEFAULT_PROFILE: SpvProfile = {
  name: 'Supervisor DPK (Turnaround)',
  department: 'Departemen Bisnis',
  businessManager: 'H. Bambang Irawan',
  roleTitle: 'Supervisor DPK'
};

function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Storage parse error for ${key}:`, e);
    return fallback;
  }
}

export const StorageService = {
  // Profile
  getProfile(): SpvProfile {
    return safeParse<SpvProfile>(KEYS.SPV_PROFILE, DEFAULT_PROFILE);
  },
  saveProfile(profile: SpvProfile) {
    try {
      localStorage.setItem(KEYS.SPV_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('saveProfile error:', e);
    }
  },

  // Branches
  getBranches(): Branch[] {
    const data = localStorage.getItem(KEYS.BRANCHES);
    if (!data) {
      this.saveBranches(INITIAL_BRANCHES);
      return INITIAL_BRANCHES;
    }
    return safeParse<Branch[]>(KEYS.BRANCHES, INITIAL_BRANCHES);
  },
  saveBranches(branches: Branch[]) {
    try {
      localStorage.setItem(KEYS.BRANCHES, JSON.stringify(branches));
    } catch (e) {
      console.warn('saveBranches error:', e);
    }
  },
  getBranchById(id: string): Branch | undefined {
    return this.getBranches().find(b => b.id === id);
  },
  async saveBranch(branch: Branch) {
    const branches = this.getBranches();
    const index = branches.findIndex(b => b.id === branch.id);
    if (index >= 0) {
      branches[index] = branch;
    } else {
      branches.push(branch);
    }
    this.saveBranches(branches);

    // Auto-Sync to Supabase Cloud
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('branches').upsert({
          id: branch.id,
          code: branch.code,
          name: branch.name,
          address: branch.address || '',
          phone: branch.phone || '',
          kepala_toko: branch.kepalaToko || '',
          spv_area: branch.spvArea || '',
          manajer_bisnis: branch.manajerBisnis || 'H. Bambang Irawan',
          entry_date: branch.entryDate,
          target_graduation_date: branch.targetGraduationDate || '',
          category: branch.category,
          status: branch.status,
          urgency_level: branch.urgencyLevel,
          target_sales_per_day: Number(branch.targetSalesPerDay) || 0,
          target_margin_pct: Number(branch.targetMarginPct) || 0,
          target_max_opex_per_month: Number(branch.targetMaxOpexPerMonth) || 0,
          root_causes: branch.rootCauses || [],
          diagnosis_summary: branch.diagnosisSummary || '',
          recommended_strategy: branch.recommendedStrategy || '',
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync branch failed:', e);
      }
    }
  },
  async deleteBranch(id: string) {
    const branches = this.getBranches().filter(b => b.id !== id);
    this.saveBranches(branches);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('branches').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete branch failed:', e);
      }
    }
  },

  // Action Plan Milestones
  getMilestones(branchId?: string): ActionPlanMilestone[] {
    const data = localStorage.getItem(KEYS.MILESTONES);
    const milestones = data ? safeParse<ActionPlanMilestone[]>(KEYS.MILESTONES, INITIAL_MILESTONES) : INITIAL_MILESTONES;
    if (!data) this.saveMilestones(INITIAL_MILESTONES);
    if (branchId) {
      return milestones.filter(m => m.branchId === branchId);
    }
    return milestones;
  },
  saveMilestones(milestones: ActionPlanMilestone[]) {
    try {
      localStorage.setItem(KEYS.MILESTONES, JSON.stringify(milestones));
    } catch (e) {
      console.warn('saveMilestones error:', e);
    }
  },
  async saveMilestone(milestone: ActionPlanMilestone) {
    const all = this.getMilestones();
    const index = all.findIndex(m => m.id === milestone.id);
    if (index >= 0) {
      all[index] = milestone;
    } else {
      all.push(milestone);
    }
    this.saveMilestones(all);

    // Auto-Sync to Supabase Cloud
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('action_milestones').upsert({
          id: milestone.id,
          branch_id: milestone.branchId,
          week_number: milestone.weekNumber,
          title: milestone.title,
          target_metric: milestone.targetMetric || '',
          status: milestone.status,
          tasks: milestone.tasks || [],
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync milestone failed:', e);
      }
    }
  },
  async deleteMilestone(id: string) {
    const all = this.getMilestones().filter(m => m.id !== id);
    this.saveMilestones(all);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('action_milestones').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete milestone failed:', e);
      }
    }
  },

  // Field Visits
  getVisits(branchId?: string): FieldVisit[] {
    const data = localStorage.getItem(KEYS.VISITS);
    const visits = data ? safeParse<FieldVisit[]>(KEYS.VISITS, INITIAL_FIELD_VISITS) : INITIAL_FIELD_VISITS;
    if (!data) this.saveVisits(INITIAL_FIELD_VISITS);
    if (branchId) {
      return visits.filter(v => v.branchId === branchId);
    }
    return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  saveVisits(visits: FieldVisit[]) {
    try {
      localStorage.setItem(KEYS.VISITS, JSON.stringify(visits));
    } catch (e) {
      console.warn('saveVisits error:', e);
    }
  },
  async saveVisit(visit: FieldVisit) {
    const all = this.getVisits();
    const index = all.findIndex(v => v.id === visit.id);
    if (index >= 0) {
      all[index] = visit;
    } else {
      all.unshift(visit);
    }
    this.saveVisits(all);

    // Auto-Sync to Supabase Cloud
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('field_visits').upsert({
          id: visit.id,
          branch_id: visit.branchId,
          visit_date: visit.date,
          visit_time: visit.time,
          spv_name: visit.spvName,
          agenda: visit.agenda,
          katok_coaching_topic: visit.katokCoachingTopic || '',
          katok_commitment: visit.katokCommitment || '',
          crew_coaching_topic: visit.crewCoachingTopic || '',
          spv_area_coordination_note: visit.spvAreaCoordinationNote || '',
          general_rating: Number(visit.generalRating) || 3,
          summary_conclusion: visit.summaryConclusion || '',
          issues: visit.issues || []
        });
      } catch (e) {
        console.warn('Auto-sync visit failed:', e);
      }
    }
  },
  async deleteVisit(id: string) {
    const all = this.getVisits().filter(v => v.id !== id);
    this.saveVisits(all);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('field_visits').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete visit failed:', e);
      }
    }
  },

  // Daily Performance
  getPerformance(branchId?: string): DailyPerformance[] {
    const data = localStorage.getItem(KEYS.PERFORMANCE);
    const list = data ? safeParse<DailyPerformance[]>(KEYS.PERFORMANCE, INITIAL_PERFORMANCE) : INITIAL_PERFORMANCE;
    if (!data) this.savePerformance(INITIAL_PERFORMANCE);
    if (branchId) {
      return list.filter(p => p.branchId === branchId).sort((a, b) => a.date.localeCompare(b.date));
    }
    return list;
  },
  savePerformance(list: DailyPerformance[]) {
    try {
      localStorage.setItem(KEYS.PERFORMANCE, JSON.stringify(list));
    } catch (e) {
      console.warn('savePerformance error:', e);
    }
  },
  async addPerformanceEntry(entry: DailyPerformance) {
    const all = this.getPerformance();
    const index = all.findIndex(p => p.branchId === entry.branchId && p.date === entry.date);
    if (index >= 0) {
      all[index] = entry;
    } else {
      all.push(entry);
    }
    this.savePerformance(all);

    // Auto-Sync to Supabase Cloud
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('daily_performance').upsert({
          id: entry.id,
          branch_id: entry.branchId,
          record_date: entry.date,
          sales_actual: Number(entry.salesActual) || 0,
          sales_target: Number(entry.salesTarget) || 0,
          margin_pct: Number(entry.marginPct) || 0,
          opex: Number(entry.opex) || 0,
          traffic_count: Number(entry.trafficCount) || 0,
          basket_size: Number(entry.basketSize) || 0,
          notes: entry.notes || ''
        });
      } catch (e) {
        console.warn('Auto-sync daily performance failed:', e);
      }
    }
  },
  async deletePerformanceEntry(id: string) {
    const all = this.getPerformance().filter(p => p.id !== id);
    this.savePerformance(all);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('daily_performance').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete daily performance failed:', e);
      }
    }
  },

  // Graduation Tracker
  getGraduations(): BranchGraduation[] {
    const data = localStorage.getItem(KEYS.GRADUATIONS);
    if (!data) {
      this.saveGraduations(INITIAL_GRADUATIONS);
      return INITIAL_GRADUATIONS;
    }
    return safeParse<BranchGraduation[]>(KEYS.GRADUATIONS, INITIAL_GRADUATIONS);
  },
  getGraduationByBranch(branchId: string): BranchGraduation | undefined {
    return this.getGraduations().find(g => g.branchId === branchId);
  },
  saveGraduations(list: BranchGraduation[]) {
    try {
      localStorage.setItem(KEYS.GRADUATIONS, JSON.stringify(list));
    } catch (e) {
      console.warn('saveGraduations error:', e);
    }
  },
  async saveGraduation(item: BranchGraduation) {
    const all = this.getGraduations();
    const index = all.findIndex(g => g.branchId === item.branchId);
    if (index >= 0) {
      all[index] = item;
    } else {
      all.push(item);
    }
    this.saveGraduations(all);

    // Auto-Sync to Supabase Cloud
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('branch_graduations').upsert({
          branch_id: item.branchId,
          consecutive_months_hit: Number(item.consecutiveMonthsHit) || 0,
          target_months_required: Number(item.targetMonthsRequired) || 3,
          checklists: item.checklists || [],
          best_practice_learnings: item.bestPracticeLearnings || '',
          graduation_date: item.graduationDate || null,
          approved_by_manager: Boolean(item.approvedByManager),
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync graduation failed:', e);
      }
    }
  },

  // Escalation Tickets
  getEscalations(branchId?: string): EscalationTicket[] {
    const data = localStorage.getItem(KEYS.ESCALATIONS);
    const list = data ? safeParse<EscalationTicket[]>(KEYS.ESCALATIONS, INITIAL_ESCALATIONS) : INITIAL_ESCALATIONS;
    if (!data) this.saveEscalations(INITIAL_ESCALATIONS);
    if (branchId) {
      return list.filter(e => e.branchId === branchId);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  saveEscalations(list: EscalationTicket[]) {
    try {
      localStorage.setItem(KEYS.ESCALATIONS, JSON.stringify(list));
    } catch (e) {
      console.warn('saveEscalations error:', e);
    }
  },
  async saveEscalation(ticket: EscalationTicket) {
    const all = this.getEscalations();
    const index = all.findIndex(e => e.id === ticket.id);
    if (index >= 0) {
      all[index] = ticket;
    } else {
      all.unshift(ticket);
    }
    this.saveEscalations(all);

    // Auto-Sync to Supabase Cloud
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('escalation_tickets').upsert({
          id: ticket.id,
          branch_id: ticket.branchId,
          branch_name: ticket.branchName,
          ticket_date: ticket.date,
          title: ticket.title,
          category: ticket.category,
          urgency: ticket.urgency,
          description: ticket.description,
          proposed_solution: ticket.proposedSolution || '',
          status: ticket.status,
          manager_feedback: ticket.managerFeedback || '',
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync escalation failed:', e);
      }
    }
  },
  async deleteEscalation(id: string) {
    const all = this.getEscalations().filter(e => e.id !== id);
    this.saveEscalations(all);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('escalation_tickets').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete escalation failed:', e);
      }
    }
  },

  // Pull latest data from Supabase Cloud on Startup
  async syncFromCloudOnStartup(): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const [bRes, mRes, vRes, pRes, gRes, eRes] = await Promise.all([
        client.from('branches').select('*'),
        client.from('action_milestones').select('*'),
        client.from('field_visits').select('*'),
        client.from('daily_performance').select('*'),
        client.from('branch_graduations').select('*'),
        client.from('escalation_tickets').select('*')
      ]);

      if (bRes.data && bRes.data.length > 0) {
        const branches: Branch[] = bRes.data.map((b: any) => ({
          id: b.id,
          code: b.code,
          name: b.name,
          address: b.address || '',
          phone: b.phone || '',
          kepalaToko: b.kepala_toko || '',
          spvArea: b.spv_area || '',
          manajerBisnis: b.manajer_bisnis || 'H. Bambang Irawan',
          entryDate: b.entry_date || new Date().toISOString().slice(0, 10),
          targetGraduationDate: b.target_graduation_date || '',
          category: b.category || 'sales_drop',
          status: b.status || 'kritis',
          urgencyLevel: b.urgency_level || 'tinggi',
          targetSalesPerDay: Number(b.target_sales_per_day) || 12000000,
          targetMarginPct: Number(b.target_margin_pct) || 15,
          targetMaxOpexPerMonth: Number(b.target_max_opex_per_month) || 20000000,
          rootCauses: b.root_causes || [],
          diagnosisSummary: b.diagnosis_summary || '',
          recommendedStrategy: b.recommended_strategy || ''
        }));
        this.saveBranches(branches);
      }

      if (mRes.data && mRes.data.length > 0) {
        const milestones: ActionPlanMilestone[] = mRes.data.map((m: any) => ({
          id: m.id,
          branchId: m.branch_id,
          weekNumber: m.week_number,
          title: m.title,
          targetMetric: m.target_metric || '',
          status: m.status,
          tasks: m.tasks || []
        }));
        this.saveMilestones(milestones);
      }

      if (vRes.data && vRes.data.length > 0) {
        const visits: FieldVisit[] = vRes.data.map((v: any) => ({
          id: v.id,
          branchId: v.branch_id,
          date: v.visit_date,
          time: v.visit_time,
          spvName: v.spv_name,
          agenda: v.agenda,
          katokCoachingTopic: v.katok_coaching_topic || '',
          katokCommitment: v.katok_commitment || '',
          crewCoachingTopic: v.crew_coaching_topic || '',
          spvAreaCoordinationNote: v.spv_area_coordination_note || '',
          generalRating: Number(v.general_rating) || 3,
          summaryConclusion: v.summary_conclusion || '',
          issues: v.issues || []
        }));
        this.saveVisits(visits);
      }

      if (pRes.data && pRes.data.length > 0) {
        const performance: DailyPerformance[] = pRes.data.map((p: any) => ({
          id: p.id,
          branchId: p.branch_id,
          date: p.record_date,
          salesActual: Number(p.sales_actual) || 0,
          salesTarget: Number(p.sales_target) || 0,
          marginPct: Number(p.margin_pct) || 0,
          opex: Number(p.opex) || 0,
          trafficCount: Number(p.traffic_count) || 0,
          basketSize: Number(p.basket_size) || 0,
          notes: p.notes || ''
        }));
        this.savePerformance(performance);
      }

      if (gRes.data && gRes.data.length > 0) {
        const graduations: BranchGraduation[] = gRes.data.map((g: any) => ({
          branchId: g.branch_id,
          consecutiveMonthsHit: Number(g.consecutive_months_hit) || 0,
          targetMonthsRequired: Number(g.target_months_required) || 3,
          checklists: g.checklists || [],
          bestPracticeLearnings: g.best_practice_learnings || '',
          graduationDate: g.graduation_date,
          approvedByManager: Boolean(g.approved_by_manager)
        }));
        this.saveGraduations(graduations);
      }

      if (eRes.data && eRes.data.length > 0) {
        const escalations: EscalationTicket[] = eRes.data.map((e: any) => ({
          id: e.id,
          branchId: e.branch_id,
          branchName: e.branch_name,
          date: e.ticket_date,
          title: e.title,
          category: e.category,
          urgency: e.urgency,
          description: e.description,
          proposedSolution: e.proposed_solution || '',
          status: e.status,
          managerFeedback: e.manager_feedback || ''
        }));
        this.saveEscalations(escalations);
      }

      return true;
    } catch (e) {
      console.warn('Initial cloud pull skipped/failed:', e);
      return false;
    }
  },

  // Backup & Restore
  exportAllData(): string {
    const backup = {
      profile: this.getProfile(),
      branches: this.getBranches(),
      milestones: this.getMilestones(),
      visits: this.getVisits(),
      performance: this.getPerformance(),
      graduations: this.getGraduations(),
      escalations: this.getEscalations(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  },
  importAllData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.branches) this.saveBranches(data.branches);
      if (data.milestones) this.saveMilestones(data.milestones);
      if (data.visits) this.saveVisits(data.visits);
      if (data.performance) this.savePerformance(data.performance);
      if (data.graduations) this.saveGraduations(data.graduations);
      if (data.escalations) this.saveEscalations(data.escalations);
      if (data.profile) this.saveProfile(data.profile);
      return true;
    } catch (e) {
      console.error("Gagal import data", e);
      return false;
    }
  },
  resetToDefaults() {
    try {
      localStorage.removeItem(KEYS.BRANCHES);
      localStorage.removeItem(KEYS.MILESTONES);
      localStorage.removeItem(KEYS.VISITS);
      localStorage.removeItem(KEYS.PERFORMANCE);
      localStorage.removeItem(KEYS.GRADUATIONS);
      localStorage.removeItem(KEYS.ESCALATIONS);
      localStorage.removeItem(KEYS.SPV_PROFILE);
    } catch (e) {
      console.warn('resetToDefaults error:', e);
    }
  }
};
