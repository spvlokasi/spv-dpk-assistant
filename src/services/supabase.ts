import { createClient } from '@supabase/supabase-js';
import { 
  Branch, 
  ActionPlanMilestone, 
  FieldVisit, 
  DailyPerformance, 
  BranchGraduation, 
  EscalationTicket 
} from '../types';

// Read from localStorage config first (allows user to enter keys directly in UI) or fallback to Vite env
const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem('spv_supabase_url');
  const customKey = localStorage.getItem('spv_supabase_anon_key');

  const supabaseUrl = customUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return { supabaseUrl, supabaseAnonKey };
};

export const getSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('Gagal inisialisasi Supabase client:', e);
    return null;
  }
};

export const SupabaseService = {
  isConfigured(): boolean {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    return Boolean(supabaseUrl && supabaseAnonKey);
  },

  setCredentials(url: string, key: string) {
    localStorage.setItem('spv_supabase_url', url.trim());
    localStorage.setItem('spv_supabase_anon_key', key.trim());
  },

  getCredentials() {
    return getSupabaseConfig();
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'URL Supabase atau Anon Key belum diisi.' };
    }
    try {
      const { data, error } = await client.from('branches').select('id').limit(1);
      if (error) {
        return { success: false, message: `Koneksi gagal: ${error.message}` };
      }
      return { success: true, message: 'Koneksi ke Supabase Cloud Berhasil! Database terhubung.' };
    } catch (e: any) {
      return { success: false, message: `Error koneksi: ${e.message || e}` };
    }
  },

  // Fetch all from cloud
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
  },

  // Push local data to cloud
  async syncLocalToCloud(payload: {
    branches: Branch[];
    milestones: ActionPlanMilestone[];
    visits: FieldVisit[];
    performance: DailyPerformance[];
    graduations: BranchGraduation[];
    escalations: EscalationTicket[];
  }) {
    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase belum terkonfigurasi' };

    try {
      // Upsert branches
      if (payload.branches.length > 0) {
        const branchesData = payload.branches.map(b => ({
          id: b.id,
          code: b.code,
          name: b.name,
          address: b.address,
          phone: b.phone,
          kepala_toko: b.kepalaToko,
          spv_area: b.spvArea,
          manajer_bisnis: b.manajerBisnis,
          entry_date: b.entryDate,
          target_graduation_date: b.targetGraduationDate,
          category: b.category,
          status: b.status,
          urgency_level: b.urgencyLevel,
          target_sales_per_day: b.targetSalesPerDay,
          target_margin_pct: b.targetMarginPct,
          target_max_opex_per_month: b.targetMaxOpexPerMonth,
          root_causes: b.rootCauses,
          diagnosis_summary: b.diagnosisSummary,
          recommended_strategy: b.recommendedStrategy
        }));
        await client.from('branches').upsert(branchesData);
      }

      // Upsert milestones
      if (payload.milestones.length > 0) {
        const milestoneData = payload.milestones.map(m => ({
          id: m.id,
          branch_id: m.branchId,
          week_number: m.weekNumber,
          title: m.title,
          target_metric: m.targetMetric,
          status: m.status,
          tasks: m.tasks
        }));
        await client.from('action_milestones').upsert(milestoneData);
      }

      // Upsert visits
      if (payload.visits.length > 0) {
        const visitData = payload.visits.map(v => ({
          id: v.id,
          branch_id: v.branchId,
          visit_date: v.date,
          visit_time: v.time,
          spv_name: v.spvName,
          agenda: v.agenda,
          katok_coaching_topic: v.katokCoachingTopic,
          katok_commitment: v.katokCommitment,
          crew_coaching_topic: v.crewCoachingTopic,
          spv_area_coordination_note: v.spvAreaCoordinationNote,
          general_rating: v.generalRating,
          summary_conclusion: v.summaryConclusion,
          issues: v.issues
        }));
        await client.from('field_visits').upsert(visitData);
      }

      // Upsert daily performance
      if (payload.performance.length > 0) {
        const perfData = payload.performance.map(p => ({
          id: p.id,
          branch_id: p.branchId,
          record_date: p.date,
          sales_actual: p.salesActual,
          sales_target: p.salesTarget,
          margin_pct: p.marginPct,
          opex: p.opex,
          traffic_count: p.trafficCount,
          basket_size: p.basketSize,
          notes: p.notes
        }));
        await client.from('daily_performance').upsert(perfData);
      }

      // Upsert graduations
      if (payload.graduations.length > 0) {
        const gradData = payload.graduations.map(g => ({
          branch_id: g.branchId,
          consecutive_months_hit: g.consecutiveMonthsHit,
          target_months_required: g.targetMonthsRequired,
          checklists: g.checklists,
          best_practice_learnings: g.bestPracticeLearnings,
          graduation_date: g.graduationDate,
          approved_by_manager: g.approvedByManager
        }));
        await client.from('branch_graduations').upsert(gradData);
      }

      // Upsert escalations
      if (payload.escalations.length > 0) {
        const escData = payload.escalations.map(e => ({
          id: e.id,
          branch_id: e.branchId,
          branch_name: e.branchName,
          ticket_date: e.date,
          title: e.title,
          category: e.category,
          urgency: e.urgency,
          description: e.description,
          proposed_solution: e.proposedSolution,
          status: e.status,
          manager_feedback: e.managerFeedback
        }));
        await client.from('escalation_tickets').upsert(escData);
      }

      return { success: true, message: 'Sinkronisasi data ke Cloud Supabase Berhasil!' };
    } catch (e: any) {
      console.error('Error sync ke Supabase:', e);
      return { success: false, message: `Gagal sinkron: ${e.message || e}` };
    }
  }
};
