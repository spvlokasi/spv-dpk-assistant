import { getSupabaseClient } from './supabaseClient';
import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, BranchGraduation, EscalationTicket, DiagnosisLog, PromoProduct, PromoVoucher } from '../../types';
import {
  toBranchPayload, toMilestonePayload, toVisitPayload, toPerformancePayload,
  toGraduationPayload, toEscalationPayload, toDiagnosisLogPayload,
  toPromoProductPayload, toPromoVoucherPayload
} from './supabasePushPayloads';

export const SupabasePush = {
  async syncLocalToCloud(payload: {
    branches: Branch[];
    milestones: ActionPlanMilestone[];
    visits: FieldVisit[];
    performance: DailyPerformance[];
    graduations: BranchGraduation[];
    escalations: EscalationTicket[];
    diagnosisLogs?: DiagnosisLog[];
    promoProducts?: PromoProduct[];
    promoVouchers?: PromoVoucher[];
  }) {
    const client = getSupabaseClient();
    if (!client) return { success: false, message: 'Supabase belum terkonfigurasi' };

    try {
      if (payload.branches.length > 0) await client.from('branches').upsert(payload.branches.map(toBranchPayload));
      if (payload.milestones.length > 0) await client.from('action_milestones').upsert(payload.milestones.map(toMilestonePayload));
      if (payload.visits.length > 0) await client.from('field_visits').upsert(payload.visits.map(toVisitPayload));
      if (payload.performance.length > 0) await client.from('daily_performance').upsert(payload.performance.map(toPerformancePayload));
      if (payload.graduations.length > 0) await client.from('branch_graduations').upsert(payload.graduations.map(toGraduationPayload));
      if (payload.escalations.length > 0) await client.from('escalation_tickets').upsert(payload.escalations.map(toEscalationPayload));
      if (payload.diagnosisLogs && payload.diagnosisLogs.length > 0) await client.from('diagnosis_logs').upsert(payload.diagnosisLogs.map(toDiagnosisLogPayload));
      if (payload.promoProducts && payload.promoProducts.length > 0) await client.from('promo_products').upsert(payload.promoProducts.map(toPromoProductPayload));
      if (payload.promoVouchers && payload.promoVouchers.length > 0) await client.from('promo_vouchers').upsert(payload.promoVouchers.map(toPromoVoucherPayload));

      return { success: true, message: 'Semua data aplikasi & katalog berhasil disinkronkan ke Cloud Supabase!' };
    } catch (e: any) {
      console.error('Error sync ke Supabase:', e);
      return { success: false, message: `Gagal sinkron: ${e.message || e}` };
    }
  }
};
