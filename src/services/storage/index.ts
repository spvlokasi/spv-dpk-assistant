import { ProfileStorage, SpvProfile, DEFAULT_PROFILE, KEYS } from './storageCore';
import { BranchStorage } from './branchStorage';
import { MilestoneStorage } from './milestoneStorage';
import { VisitStorage } from './visitStorage';
import { PerformanceStorage } from './performanceStorage';
import { EscalationStorage } from './escalationStorage';
import { GraduationStorage } from './graduationStorage';
import { CloudSyncStorage } from './cloudSyncStorage';
import { DiagnosisLogStorage } from './diagnosisLogStorage';
import { INITIAL_BRANCHES, INITIAL_MILESTONES, INITIAL_PERFORMANCE, INITIAL_GRADUATIONS } from '../mockData';

export const StorageService = {
  ...ProfileStorage,
  ...BranchStorage,
  ...MilestoneStorage,
  ...VisitStorage,
  ...PerformanceStorage,
  ...EscalationStorage,
  ...GraduationStorage,
  ...CloudSyncStorage,
  ...DiagnosisLogStorage,

  resetToDefaults() {
    BranchStorage.saveBranches(INITIAL_BRANCHES);
    MilestoneStorage.saveMilestones(INITIAL_MILESTONES);
    VisitStorage.saveVisits([]);
    PerformanceStorage.savePerformance(INITIAL_PERFORMANCE);
    GraduationStorage.saveGraduations(INITIAL_GRADUATIONS);
    EscalationStorage.saveEscalations([]);
  },

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
      if (data.branchImages) localStorage.setItem(KEYS.BRANCH_IMAGES, JSON.stringify(data.branchImages));
      if (data.milestones) this.saveMilestones(data.milestones);
      if (data.visits) this.saveVisits(data.visits);
      if (data.performance) this.savePerformance(data.performance);
      if (data.graduations) this.saveGraduations(data.graduations);
      if (data.escalations) this.saveEscalations(data.escalations);
      if (data.profile) this.saveProfile(data.profile);
      return true;
    } catch (e) {
      console.error('Import data failed:', e);
      return false;
    }
  }
};

export type { SpvProfile };
export { DEFAULT_PROFILE, KEYS };
