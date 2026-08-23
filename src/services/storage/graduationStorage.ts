import { BranchGraduation } from '../../types';
import { KEYS, safeParse } from './storageCore';
import { getSupabaseClient } from '../supabase';

export const GraduationStorage = {
  getGraduations(): BranchGraduation[] {
    const raw = localStorage.getItem(KEYS.GRADUATIONS);
    return raw ? safeParse<BranchGraduation[]>(KEYS.GRADUATIONS, []) : [];
  },
  getGraduationByBranchId(branchId: string): BranchGraduation | undefined {
    return this.getGraduations().find((g) => g.branchId === branchId);
  },
  saveGraduations(graduations: BranchGraduation[]) {
    try {
      localStorage.setItem(KEYS.GRADUATIONS, JSON.stringify(graduations));
    } catch (e) {
      console.warn('saveGraduations error:', e);
    }
  },
  async saveGraduation(item: BranchGraduation) {
    const all = this.getGraduations();
    const index = all.findIndex((g) => g.branchId === item.branchId);
    if (index >= 0) all[index] = item;
    else all.push(item);
    this.saveGraduations(all);

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
  }
};
