import { ActionPlanMilestone } from '../../types';
import { KEYS, safeParse } from './storageCore';
import { getSupabaseClient } from '../supabase';

export const MilestoneStorage = {
  getMilestones(branchId?: string): ActionPlanMilestone[] {
    const raw = localStorage.getItem(KEYS.MILESTONES);
    const list = raw ? safeParse<ActionPlanMilestone[]>(KEYS.MILESTONES, []) : [];
    if (branchId) return list.filter((m) => m.branchId === branchId);
    return list.sort((a, b) => a.weekNumber - b.weekNumber);
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
    const index = all.findIndex((m) => m.id === milestone.id);
    if (index >= 0) all[index] = milestone;
    else all.push(milestone);
    this.saveMilestones(all);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('action_milestones').upsert({
          id: milestone.id,
          branch_id: milestone.branchId,
          week_number: milestone.weekNumber,
          title: milestone.title,
          target_metric: milestone.targetMetric,
          status: milestone.status,
          tasks: milestone.tasks,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync milestone failed:', e);
      }
    }
  },
  async deleteMilestone(id: string) {
    const all = this.getMilestones().filter((m) => m.id !== id);
    this.saveMilestones(all);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('action_milestones').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete milestone failed:', e);
      }
    }
  }
};
