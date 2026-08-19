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

export const StorageService = {
  // Profile
  getProfile(): SpvProfile {
    const data = localStorage.getItem(KEYS.SPV_PROFILE);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  },
  saveProfile(profile: SpvProfile) {
    localStorage.setItem(KEYS.SPV_PROFILE, JSON.stringify(profile));
  },

  // Branches
  getBranches(): Branch[] {
    const data = localStorage.getItem(KEYS.BRANCHES);
    if (!data) {
      this.saveBranches(INITIAL_BRANCHES);
      return INITIAL_BRANCHES;
    }
    return JSON.parse(data);
  },
  saveBranches(branches: Branch[]) {
    localStorage.setItem(KEYS.BRANCHES, JSON.stringify(branches));
  },
  getBranchById(id: string): Branch | undefined {
    return this.getBranches().find(b => b.id === id);
  },
  saveBranch(branch: Branch) {
    const branches = this.getBranches();
    const index = branches.findIndex(b => b.id === branch.id);
    if (index >= 0) {
      branches[index] = branch;
    } else {
      branches.push(branch);
    }
    this.saveBranches(branches);
  },
  deleteBranch(id: string) {
    const branches = this.getBranches().filter(b => b.id !== id);
    this.saveBranches(branches);
  },

  // Action Plan Milestones
  getMilestones(branchId?: string): ActionPlanMilestone[] {
    const data = localStorage.getItem(KEYS.MILESTONES);
    const milestones: ActionPlanMilestone[] = data ? JSON.parse(data) : INITIAL_MILESTONES;
    if (!data) this.saveMilestones(INITIAL_MILESTONES);
    if (branchId) {
      return milestones.filter(m => m.branchId === branchId);
    }
    return milestones;
  },
  saveMilestones(milestones: ActionPlanMilestone[]) {
    localStorage.setItem(KEYS.MILESTONES, JSON.stringify(milestones));
  },
  saveMilestone(milestone: ActionPlanMilestone) {
    const all = this.getMilestones();
    const index = all.findIndex(m => m.id === milestone.id);
    if (index >= 0) {
      all[index] = milestone;
    } else {
      all.push(milestone);
    }
    this.saveMilestones(all);
  },
  deleteMilestone(id: string) {
    const all = this.getMilestones().filter(m => m.id !== id);
    this.saveMilestones(all);
  },

  // Field Visits
  getVisits(branchId?: string): FieldVisit[] {
    const data = localStorage.getItem(KEYS.VISITS);
    const visits: FieldVisit[] = data ? JSON.parse(data) : INITIAL_FIELD_VISITS;
    if (!data) this.saveVisits(INITIAL_FIELD_VISITS);
    if (branchId) {
      return visits.filter(v => v.branchId === branchId);
    }
    return visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  saveVisits(visits: FieldVisit[]) {
    localStorage.setItem(KEYS.VISITS, JSON.stringify(visits));
  },
  saveVisit(visit: FieldVisit) {
    const all = this.getVisits();
    const index = all.findIndex(v => v.id === visit.id);
    if (index >= 0) {
      all[index] = visit;
    } else {
      all.unshift(visit);
    }
    this.saveVisits(all);
  },
  deleteVisit(id: string) {
    const all = this.getVisits().filter(v => v.id !== id);
    this.saveVisits(all);
  },

  // Daily Performance
  getPerformance(branchId?: string): DailyPerformance[] {
    const data = localStorage.getItem(KEYS.PERFORMANCE);
    const list: DailyPerformance[] = data ? JSON.parse(data) : INITIAL_PERFORMANCE;
    if (!data) this.savePerformance(INITIAL_PERFORMANCE);
    if (branchId) {
      return list.filter(p => p.branchId === branchId).sort((a, b) => a.date.localeCompare(b.date));
    }
    return list;
  },
  savePerformance(list: DailyPerformance[]) {
    localStorage.setItem(KEYS.PERFORMANCE, JSON.stringify(list));
  },
  addPerformanceEntry(entry: DailyPerformance) {
    const all = this.getPerformance();
    const index = all.findIndex(p => p.branchId === entry.branchId && p.date === entry.date);
    if (index >= 0) {
      all[index] = entry;
    } else {
      all.push(entry);
    }
    this.savePerformance(all);
  },
  deletePerformanceEntry(id: string) {
    const all = this.getPerformance().filter(p => p.id !== id);
    this.savePerformance(all);
  },

  // Graduation Tracker
  getGraduations(): BranchGraduation[] {
    const data = localStorage.getItem(KEYS.GRADUATIONS);
    if (!data) {
      this.saveGraduations(INITIAL_GRADUATIONS);
      return INITIAL_GRADUATIONS;
    }
    return JSON.parse(data);
  },
  getGraduationByBranch(branchId: string): BranchGraduation | undefined {
    return this.getGraduations().find(g => g.branchId === branchId);
  },
  saveGraduations(list: BranchGraduation[]) {
    localStorage.setItem(KEYS.GRADUATIONS, JSON.stringify(list));
  },
  saveGraduation(item: BranchGraduation) {
    const all = this.getGraduations();
    const index = all.findIndex(g => g.branchId === item.branchId);
    if (index >= 0) {
      all[index] = item;
    } else {
      all.push(item);
    }
    this.saveGraduations(all);
  },

  // Escalation Tickets
  getEscalations(branchId?: string): EscalationTicket[] {
    const data = localStorage.getItem(KEYS.ESCALATIONS);
    const list: EscalationTicket[] = data ? JSON.parse(data) : INITIAL_ESCALATIONS;
    if (!data) this.saveEscalations(INITIAL_ESCALATIONS);
    if (branchId) {
      return list.filter(e => e.branchId === branchId);
    }
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
  saveEscalations(list: EscalationTicket[]) {
    localStorage.setItem(KEYS.ESCALATIONS, JSON.stringify(list));
  },
  saveEscalation(ticket: EscalationTicket) {
    const all = this.getEscalations();
    const index = all.findIndex(e => e.id === ticket.id);
    if (index >= 0) {
      all[index] = ticket;
    } else {
      all.unshift(ticket);
    }
    this.saveEscalations(all);
  },
  deleteEscalation(id: string) {
    const all = this.getEscalations().filter(e => e.id !== id);
    this.saveEscalations(all);
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
    localStorage.removeItem(KEYS.BRANCHES);
    localStorage.removeItem(KEYS.MILESTONES);
    localStorage.removeItem(KEYS.VISITS);
    localStorage.removeItem(KEYS.PERFORMANCE);
    localStorage.removeItem(KEYS.GRADUATIONS);
    localStorage.removeItem(KEYS.ESCALATIONS);
    localStorage.removeItem(KEYS.SPV_PROFILE);
  }
};
