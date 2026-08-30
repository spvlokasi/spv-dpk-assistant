import { PromoVoucher } from '../../types';
import { getSupabaseClient } from '../supabase';

export const VOUCH_KEY = 'spv_dpk_promo_vouchers';

export const sanitizeVouchers = (list: PromoVoucher[]): PromoVoucher[] => {
  return list.filter((v) => !['vouch-1', 'vouch-2'].includes(v.id));
};

export const loadPromoVouchers = (branchId?: string): PromoVoucher[] => {
  try {
    const raw = sessionStorage.getItem(VOUCH_KEY) || localStorage.getItem(VOUCH_KEY);
    if (!raw) return [];
    const list: PromoVoucher[] = sanitizeVouchers(JSON.parse(raw));
    if (!branchId || branchId === 'all') return list;
    return list.filter((v) => v.branchId === branchId || v.branchId === 'all');
  } catch {
    return [];
  }
};

export const savePromoVoucher = (voucher: PromoVoucher, branchId?: string): PromoVoucher[] => {
  const current = loadPromoVouchers('all');
  const index = current.findIndex((v) => v.id === voucher.id);
  const updated = index >= 0 ? current.map((v) => (v.id === voucher.id ? voucher : v)) : [voucher, ...current];
  sessionStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    client.from('promo_vouchers').upsert({
      id: voucher.id,
      branch_id: voucher.branchId,
      code: voucher.code,
      discount_amount: voucher.discountAmount,
      min_spend: voucher.minSpend,
      quota: voucher.quota,
      claimed_count: voucher.claimedCount || 0,
      used_count: voucher.usedCount || 0,
      valid_until: voucher.validUntil,
      is_active: voucher.isActive,
      description: voucher.description,
      funding_source: voucher.fundingSource || 'store',
      sponsor_name: voucher.sponsorName || '',
      applicable_category: voucher.applicableCategory || 'all',
      updated_at: new Date().toISOString()
    }).then(({ error }) => {
      if (error) console.error('Error upserting promo_voucher:', error);
    });
  }

  if (!branchId || branchId === 'all') return updated;
  return updated.filter((v) => v.branchId === branchId || v.branchId === 'all');
};

export const deletePromoVoucher = (id: string, branchId?: string): PromoVoucher[] => {
  const current = loadPromoVouchers('all');
  const updated = current.filter((v) => v.id !== id);
  sessionStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    client.from('promo_vouchers').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error deleting promo_voucher:', error);
    });
  }

  if (!branchId || branchId === 'all') return updated;
  return updated.filter((v) => v.branchId === branchId || v.branchId === 'all');
};

export { fetchPromoVouchersFromCloud } from './voucherCloudFetch';
