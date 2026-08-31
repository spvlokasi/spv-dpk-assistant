import { PromoVoucher } from '../../types';
import { getSupabaseClient } from '../supabase';
import { VOUCH_KEY, sanitizeVouchers, loadPromoVouchers } from './voucherStorage';

export const fetchPromoVouchersFromCloud = async (branchId?: string): Promise<PromoVoucher[]> => {
  const client = getSupabaseClient();
  if (!client) return loadPromoVouchers(branchId);

  try {
    const { data, error } = await client
      .from('promo_vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Gagal fetch live promo vouchers dari Supabase:', error.message);
      return loadPromoVouchers(branchId);
    }

    const vouchers: PromoVoucher[] = sanitizeVouchers(
      (data || []).map((v: any) => ({
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
      }))
    );

    sessionStorage.setItem(VOUCH_KEY, JSON.stringify(vouchers));
    localStorage.setItem(VOUCH_KEY, JSON.stringify(vouchers));

    if (!branchId || branchId === 'all') return vouchers;
    return vouchers.filter((v) => v.branchId === branchId || v.branchId === 'all');
  } catch (e) {
    console.warn('Gagal fetch live promo vouchers dari Supabase:', e);
    return loadPromoVouchers(branchId);
  }
};
