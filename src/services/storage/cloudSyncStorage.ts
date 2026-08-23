import { SupabaseService } from '../supabase';
import { BranchStorage } from './branchStorage';
import { MilestoneStorage } from './milestoneStorage';
import { VisitStorage } from './visitStorage';
import { PerformanceStorage } from './performanceStorage';
import { GraduationStorage } from './graduationStorage';
import { EscalationStorage } from './escalationStorage';

export const CloudSyncStorage = {
  async fetchLiveFromCloud() {
    const cloud = await SupabaseService.fetchAllFromCloud();
    if (!cloud) return null;

    // Update local offline cache in background
    BranchStorage.saveBranches(cloud.branches);
    MilestoneStorage.saveMilestones(cloud.milestones);
    VisitStorage.saveVisits(cloud.visits);
    PerformanceStorage.savePerformance(cloud.performance);
    GraduationStorage.saveGraduations(cloud.graduations);
    EscalationStorage.saveEscalations(cloud.escalations);

    return cloud;
  },

  async syncFromCloudOnStartup(): Promise<boolean> {
    const cloud = await this.fetchLiveFromCloud();
    return Boolean(cloud);
  }
};
