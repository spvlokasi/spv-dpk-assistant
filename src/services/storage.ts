import { 
  Branch, 
  DiagnosisLog,
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
  BRANCH_IMAGES: 'spv_dpk_branch_images',
  DIAGNOSIS_LOGS: 'spv_dpk_diagnosis_logs',
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
    const fromAuth = safeParse<any>('spv_dpk_local_users', null);
    if (fromAuth && fromAuth.fullName) {
      return {
        name: fromAuth.fullName,
        department: fromAuth.department || 'Departemen Bisnis',
        businessManager: fromAuth.businessManager || 'H. Bambang Irawan',
        roleTitle: fromAuth.roleTitle || 'Supervisor DPK'
      };
    }
    return safeParse<SpvProfile>(KEYS.SPV_PROFILE, DEFAULT_PROFILE);
  },
  saveProfile(profile: SpvProfile) {
    try {
      localStorage.setItem(KEYS.SPV_PROFILE, JSON.stringify(profile));
      const localUser = safeParse<any>('spv_dpk_local_users', null);
      if (localUser) {
        const updated = {
          ...localUser,
          fullName: profile.name,
          roleTitle: profile.roleTitle,
          department: profile.department,
          businessManager: profile.businessManager
        };
        localStorage.setItem('spv_dpk_local_users', JSON.stringify(updated));
        const sess = safeParse<any>('spv_dpk_current_user_session', null);
        if (sess) {
          sess.user = updated;
          localStorage.setItem('spv_dpk_current_user_session', JSON.stringify(sess));
        }
      }
    } catch (e) {
      console.warn('saveProfile error:', e);
    }
  },

  // Branch Images Persistent Store
  getBranchImages(): Record<string, string> {
    return safeParse<Record<string, string>>(KEYS.BRANCH_IMAGES, {});
  },
  saveBranchImage(branchId: string, imageUrl: string) {
    try {
      const images = this.getBranchImages();
      if (imageUrl) {
        images[branchId] = imageUrl;
      } else {
        delete images[branchId];
      }
      localStorage.setItem(KEYS.BRANCH_IMAGES, JSON.stringify(images));
    } catch (e) {
      console.warn('saveBranchImage error:', e);
    }
  },

  // Branches
  getBranches(): Branch[] {
    const data = localStorage.getItem(KEYS.BRANCHES);
    const images = this.getBranchImages();
    if (!data) {
      this.saveBranches(INITIAL_BRANCHES);
      return INITIAL_BRANCHES;
    }
    const list = safeParse<Branch[]>(KEYS.BRANCHES, INITIAL_BRANCHES);
    return list.map(b => {
      // Clean legacy dummy factors so stores always start fresh
      const hasLegacyDummy = b.rootCauses?.some(r => 
        ['rc-1', 'rc-2', 'rc-3', 'rc-4', 'rc-21', 'rc-22', 'rc-23', 'rc-31', 'rc-32', 'rc-33'].includes(r.id)
      );
      return {
        ...b,
        rootCauses: hasLegacyDummy ? [] : (b.rootCauses || []),
        imageUrl: b.imageUrl || images[b.id] || (b.code === 'M3017' || b.name?.toLowerCase().includes('bugih') ? '/stores/bugih.jpg' : '')
      };
    });
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

    // Save image to dedicated persistent cache
    if (branch.imageUrl) {
      this.saveBranchImage(branch.id, branch.imageUrl);
    }

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
          image_url: branch.imageUrl || '',
          diagnosis_start_date: branch.diagnosisStartDate || '',
          diagnosis_end_date: branch.diagnosisEndDate || '',
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
    this.saveBranchImage(id, '');

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('branches').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete branch failed:', e);
      }
    }
  },

  // Diagnosis Logs (Riwayat Diagnosa Berkala)
  getDiagnosisLogs(branchId?: string): DiagnosisLog[] {
    const logs = safeParse<DiagnosisLog[]>(KEYS.DIAGNOSIS_LOGS, []);
    if (branchId) {
      return logs.filter(l => l.branchId === branchId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return logs.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  saveDiagnosisLogs(logs: DiagnosisLog[]) {
    try {
      localStorage.setItem(KEYS.DIAGNOSIS_LOGS, JSON.stringify(logs));
    } catch (e) {
      console.warn('saveDiagnosisLogs error:', e);
    }
  },
  async saveDiagnosisLog(log: DiagnosisLog) {
    const all = this.getDiagnosisLogs();
    const index = all.findIndex(l => l.id === log.id || (l.branchId === log.branchId && l.periodStartDate === log.periodStartDate && l.periodEndDate === log.periodEndDate));
    if (index >= 0) {
      all[index] = { ...all[index], ...log };
    } else {
      all.unshift(log);
    }
    this.saveDiagnosisLogs(all);

    // Auto-Sync to Supabase Cloud
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
          target_sales_per_day: Number(log.targetSalesPerDay) || 0,
          target_margin_pct: Number(log.targetMarginPct) || 0,
          target_max_opex_per_month: Number(log.targetMaxOpexPerMonth) || 0,
          root_causes: log.rootCauses || [],
          diagnosis_summary: log.diagnosisSummary || '',
          recommended_strategy: log.recommendedStrategy || '',
          diagnosed_by: log.diagnosedBy || 'Supervisor DPK',
          created_at: log.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync diagnosis_log failed:', e);
      }
    }
  },
  async deleteDiagnosisLog(id: string) {
    const all = this.getDiagnosisLogs().filter(l => l.id !== id);
    this.saveDiagnosisLogs(all);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('diagnosis_logs').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete diagnosis_log failed:', e);
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
          phase: milestone.phase || 'fase_1',
          month_number: milestone.monthNumber || 1,
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
    const rawVisits = data ? safeParse<FieldVisit[]>(KEYS.VISITS, []) : [];
    // Auto-purge legacy dummy visits (fv-01, fv-02)
    const visits = rawVisits.filter(v => v.id !== 'fv-01' && v.id !== 'fv-02');
    if (visits.length !== rawVisits.length) {
      this.saveVisits(visits);
    }
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
      const [uRes, bRes, dlRes, mRes, vRes, pRes, gRes, eRes] = await Promise.all([
        client.from('user_accounts').select('*'),
        client.from('branches').select('*'),
        client.from('diagnosis_logs').select('*'),
        client.from('action_milestones').select('*'),
        client.from('field_visits').select('*'),
        client.from('daily_performance').select('*'),
        client.from('branch_graduations').select('*'),
        client.from('escalation_tickets').select('*')
      ]);

      if (uRes.data && uRes.data.length > 0) {
        const u = uRes.data[0];
        const cloudUser = {
          id: u.id,
          username: u.username,
          password: u.password,
          fullName: u.full_name,
          roleTitle: u.role_title,
          department: u.department,
          businessManager: u.business_manager,
          createdAt: u.created_at
        };
        localStorage.setItem('spv_dpk_local_users', JSON.stringify(cloudUser));
        const sess = safeParse<any>('spv_dpk_current_user_session', null);
        if (sess) {
          sess.user = cloudUser;
          localStorage.setItem('spv_dpk_current_user_session', JSON.stringify(sess));
        }
      }

      const persistentImages = this.getBranchImages();

      if (bRes.data && bRes.data.length > 0) {
        const branches: Branch[] = bRes.data.map((b: any) => {
          const rawRootCauses = b.root_causes || [];
          const isLegacyDummy = Array.isArray(rawRootCauses) && rawRootCauses.some((r: any) => 
            ['rc-1', 'rc-2', 'rc-3', 'rc-4', 'rc-21', 'rc-22', 'rc-23', 'rc-31', 'rc-32', 'rc-33'].includes(r.id)
          );
          const isOldDummyDate = b.diagnosis_start_date === '2026-08-01' || b.diagnosis_start_date === '2026-06-01' || b.diagnosis_start_date === '2026-05-15';
          return {
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
            rootCauses: isLegacyDummy ? [] : rawRootCauses,
            diagnosisSummary: b.diagnosis_summary || '',
            recommendedStrategy: b.recommended_strategy || '',
            imageUrl: b.image_url || persistentImages[b.id] || (b.code === 'M3017' || b.name?.toLowerCase().includes('bugih') ? '/stores/bugih.jpg' : ''),
            diagnosisStartDate: isOldDummyDate ? '' : (b.diagnosis_start_date || ''),
            diagnosisEndDate: isOldDummyDate ? '' : (b.diagnosis_end_date || '')
          };
        });
        this.saveBranches(branches);
      }

      if (dlRes.data && dlRes.data.length > 0) {
        const diagnosisLogs: DiagnosisLog[] = dlRes.data.map((dl: any) => ({
          id: dl.id,
          branchId: dl.branch_id,
          periodStartDate: dl.period_start_date,
          periodEndDate: dl.period_end_date,
          category: dl.category || 'sales_drop',
          status: dl.status || 'kritis',
          urgencyLevel: dl.urgency_level || 'tinggi',
          targetSalesPerDay: Number(dl.target_sales_per_day) || 12000000,
          targetMarginPct: Number(dl.target_margin_pct) || 15,
          targetMaxOpexPerMonth: Number(dl.target_max_opex_per_month) || 20000000,
          rootCauses: dl.root_causes || [],
          diagnosisSummary: dl.diagnosis_summary || '',
          recommendedStrategy: dl.recommended_strategy || '',
          diagnosedBy: dl.diagnosed_by || 'Supervisor DPK',
          createdAt: dl.created_at || new Date().toISOString()
        }));
        this.saveDiagnosisLogs(diagnosisLogs);
      }

      if (mRes.data && mRes.data.length > 0) {
        const milestones: ActionPlanMilestone[] = mRes.data.map((m: any) => ({
          id: m.id,
          branchId: m.branch_id,
          phase: m.phase || (m.week_number <= 3 ? 'fase_1' : m.week_number <= 6 ? 'fase_2' : 'fase_3'),
          monthNumber: m.month_number || (m.week_number <= 3 ? 1 : m.week_number <= 6 ? 4 : 7),
          weekNumber: m.week_number,
          title: m.title,
          targetMetric: m.target_metric || '',
          status: m.status,
          tasks: m.tasks || []
        }));
        this.saveMilestones(milestones);
      }

      if (vRes.data && vRes.data.length > 0) {
        const cleanVData = vRes.data.filter((v: any) => v.id !== 'fv-01' && v.id !== 'fv-02');
        const visits: FieldVisit[] = cleanVData.map((v: any) => ({
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

        // Delete legacy dummy visits from Supabase Cloud if present
        if (cleanVData.length !== vRes.data.length) {
          try {
            await client.from('field_visits').delete().in('id', ['fv-01', 'fv-02']);
          } catch (e) {
            console.warn('Purge dummy cloud visits error:', e);
          }
        }
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
      branchImages: this.getBranchImages(),
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
      if (data.branchImages) {
        localStorage.setItem(KEYS.BRANCH_IMAGES, JSON.stringify(data.branchImages));
      }
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
      localStorage.removeItem(KEYS.BRANCH_IMAGES);
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
