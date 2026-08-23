import { getSupabaseClient } from './supabaseClient';

export const SupabaseFetch = {
  async fetchAllFromCloud() {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const [bRes, mRes, vRes, pRes, gRes, eRes] = await Promise.all([
        client.from('branches').select('*'),
        client.from('action_milestones').select('*'),
        client.from('field_visits').select('*'),
        client.from('daily_performance').select('*'),
        client.from('branch_graduations').select('*'),
        client.from('escalation_tickets').select('*')
      ]);

      return {
        branches: bRes.data || [],
        milestones: mRes.data || [],
        visits: vRes.data || [],
        performance: pRes.data || [],
        graduations: gRes.data || [],
        escalations: eRes.data || []
      };
    } catch (e) {
      console.error('Gagal fetch data dari Supabase:', e);
      return null;
    }
  }
};
