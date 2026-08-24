import { DailyPerformance } from '../../types';
import { KEYS, safeParse } from './storageCore';
import { getSupabaseClient } from '../supabase';

export const PerformanceStorage = {
  getPerformance(branchId?: string): DailyPerformance[] {
    const raw = localStorage.getItem(KEYS.PERFORMANCE);
    const list = raw ? safeParse<DailyPerformance[]>(KEYS.PERFORMANCE, []) : [];
    if (branchId) return list.filter((p) => p.branchId === branchId);
    return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
  savePerformance(performance: DailyPerformance[]) {
    try {
      localStorage.setItem(KEYS.PERFORMANCE, JSON.stringify(performance));
    } catch (e) {
      console.warn('savePerformance error:', e);
    }
  },
  async addPerformanceEntry(entry: DailyPerformance) {
    return this.bulkAddPerformance([entry]);
  },
  async bulkAddPerformance(entries: DailyPerformance[]) {
    const all = this.getPerformance();
    entries.forEach((entry) => {
      const idx = all.findIndex((p) => p.id === entry.id || (p.branchId === entry.branchId && p.date === entry.date));
      if (idx >= 0) all[idx] = entry;
      else all.push(entry);
    });
    this.savePerformance(all);

    const client = getSupabaseClient();
    if (client && entries.length > 0) {
      try {
        const payload = entries.map((entry) => ({
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
        }));
        await client.from('daily_performance').upsert(payload);
      } catch (e) {
        console.warn('Auto-sync bulk performance failed:', e);
      }
    }
  },
  async deletePerformanceEntry(id: string) {
    const all = this.getPerformance().filter((p) => p.id !== id);
    this.savePerformance(all);
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('daily_performance').delete().eq('id', id);
      } catch (e) {
        console.warn('Auto-sync delete performance failed:', e);
      }
    }
  }
};
