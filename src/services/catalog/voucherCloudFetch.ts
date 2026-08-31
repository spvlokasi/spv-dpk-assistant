import { PromoVoucher } from '../../types';
import { getSupabaseClient } from '../supabase';
import { VOUCH_KEY, loadPromoVouchers } from './voucherStorage';

export const fetchPromoVouchersFromCloud = async (branchId?: string): Promise<PromoVoucher[]> => {
  const localList = loadPromoVouchers(branchId);
  const client = getSupabaseClient();
  if (!client) return localList;

  try {
    const { data, error } = await client
      .from('promo_vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Gagal fetch live promo vouchers dari Supabase:', error.message);
      return localList;
    }

    if (data && data.length > 0) {
      const vouchers: PromoVoucher[] = data.map((v: any) => ({
        id: v.id,
        branchId: v.branch_id || 'all',
        code: v.code,
        discountAmount: Number(v.discount_amount) || 0,
        minSpend: Number(v.min_spend) || 0,
        quota: Number(v.quota) || 50,
        claimedCount: Number(v.claimed_count) || 0,
        usedCount: Number(v.used_count) || 0,
        validUntil: v.valid_until || '2026-12-31',
        isActive: v.is_active ?? true,
        description: v.description || '',
        fundingSource: v.funding_source || 'store',
        sponsorName: v.sponsor_name || '',
        applicableCategory: v.applicable_category || 'all',
        applicableProductIds: v.applicable_product_ids || undefined
      }));

      localStorage.setItem(VOUCH_KEY, JSON.stringify(vouchers));
      sessionStorage.setItem(VOUCH_KEY, JSON.stringify(vouchers));

      if (!branchId || branchId === 'all') return vouchers;
      return vouchers.filter((v) => v.branchId === branchId || v.branchId === 'all');
    }

    // Jika cloud belum ada data tapi di local ada, push local ke cloud
    const allLocal = loadPromoVouchers('all');
    if (allLocal.length > 0) {
      allLocal.forEach((v) => {
        const fullPayload: Record<string, any> = {
          id: v.id,
          branch_id: v.branchId || 'all',
          code: v.code,
          discount_amount: Number(v.discountAmount) || 0,
          min_spend: Number(v.minSpend) || 0,
          quota: Number(v.quota) || 50,
          claimed_count: Number(v.claimedCount) || 0,
          used_count: Number(v.usedCount) || 0,
          valid_until: v.validUntil || '2026-12-31',
          is_active: v.isActive ?? true,
          description: v.description || '',
          funding_source: v.fundingSource || 'store',
          sponsor_name: v.sponsorName || '',
          applicable_category: v.applicableCategory || 'all',
          applicable_product_ids: v.applicableProductIds || [],
          updated_at: new Date().toISOString()
        };
        client.from('promo_vouchers').upsert(fullPayload).then(({ error }) => {
          if (error) {
            const basePayload = {
              id: v.id,
              branch_id: v.branchId || 'all',
              code: v.code,
              discount_amount: Number(v.discountAmount) || 0,
              min_spend: Number(v.minSpend) || 0,
              quota: Number(v.quota) || 50,
              claimed_count: Number(v.claimedCount) || 0,
              used_count: Number(v.usedCount) || 0,
              valid_until: v.validUntil || '2026-12-31',
              is_active: v.isActive ?? true,
              description: v.description || ''
            };
            client.from('promo_vouchers').upsert(basePayload).then();
          }
        });
      });
    }

    return localList;
  } catch (e) {
    console.warn('Gagal fetch live promo vouchers dari Supabase:', e);
    return localList;
  }
};
