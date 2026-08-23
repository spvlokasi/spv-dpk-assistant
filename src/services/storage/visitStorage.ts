import { FieldVisit } from '../../types';
import { KEYS, safeParse } from './storageCore';
import { getSupabaseClient } from '../supabase';

export const VisitStorage = {
  getVisits(branchId?: string): FieldVisit[] {
    const raw = localStorage.getItem(KEYS.VISITS);
    let list = raw ? safeParse<FieldVisit[]>(KEYS.VISITS, []) : [];
    list = list.filter((v) => !['fv-01', 'fv-02'].includes(v.id));
    if (branchId) return list.filter((v) => v.branchId === branchId);
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
    const index = all.findIndex((v) => v.id === visit.id);
    if (index >= 0) all[index] = visit;
    else all.unshift(visit);
    this.saveVisits(all);

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
          katok_coaching_topic: visit.katokCoachingTopic,
          katok_commitment: visit.katokCommitment,
          crew_coaching_topic: visit.crewCoachingTopic,
          spv_area_coordination_note: visit.spvAreaCoordinationNote,
          general_rating: visit.generalRating,
          summary_conclusion: visit.summaryConclusion,
          issues: visit.issues,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Auto-sync visit failed:', e);
      }
    }
  },
  async deleteVisit(id: string) {
    const all = this.getVisits().filter((v) => v.id !== id);
    this.saveVisits(all);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('field_visits').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete visit failed:', e);
      }
    }
  }
};
