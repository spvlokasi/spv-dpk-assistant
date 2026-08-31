import { PromoVoucher } from '../../types';
import { getSupabaseClient } from '../supabase';

export const VOUCH_KEY = 'spv_dpk_promo_vouchers';

export const sanitizeVouchers = (list: PromoVoucher[]): PromoVoucher[] => list;

export const loadPromoVouchers = (branchId?: string): PromoVoucher[] => {
  try {
    const raw = localStorage.getItem(VOUCH_KEY) || sessionStorage.getItem(VOUCH_KEY);
    if (!raw) return [];
    const list: PromoVoucher[] = JSON.parse(raw);
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
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  sessionStorage.setItem(VOUCH_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    const fullPayload: Record<string, any> = {
      id: voucher.id,
      branch_id: voucher.branchId || 'all',
      code: voucher.code,
      discount_amount: Number(voucher.discountAmount) || 0,
      min_spend: Number(voucher.minSpend) || 0,
      quota: Number(voucher.quota) || 50,
      claimed_count: Number(voucher.claimedCount) || 0,
      used_count: Number(voucher.usedCount) || 0,
      valid_until: voucher.validUntil || '2026-12-31',
      is_active: voucher.isActive ?? true,
      description: voucher.description || '',
      funding_source: voucher.fundingSource || 'store',
      sponsor_name: voucher.sponsorName || '',
      applicable_category: voucher.applicableCategory || 'all',
      applicable_product_ids: voucher.applicableProductIds || [],
      updated_at: new Date().toISOString()
    };

    client.from('promo_vouchers').upsert(fullPayload).then(({ error }) => {
      if (error) {
        console.warn('Gagal upsert promo_voucher dengan kolom lengkap, mencoba fallback dasar:', error.message);
        const basePayload = {
          id: voucher.id,
          branch_id: voucher.branchId || 'all',
          code: voucher.code,
          discount_amount: Number(voucher.discountAmount) || 0,
          min_spend: Number(voucher.minSpend) || 0,
          quota: Number(voucher.quota) || 50,
          claimed_count: Number(voucher.claimedCount) || 0,
          used_count: Number(voucher.usedCount) || 0,
          valid_until: voucher.validUntil || '2026-12-31',
          is_active: voucher.isActive ?? true,
          description: voucher.description || ''
        };
        client.from('promo_vouchers').upsert(basePayload).then(({ error: retryError }) => {
          if (retryError) console.error('Gagal upsert promo_voucher fallback ke Supabase:', retryError);
          else console.log('Berhasil sync promo_voucher ke Supabase (fallback mode)');
        });
      } else {
        console.log('Berhasil sync promo_voucher ke Supabase:', voucher.code);
      }
    });
  }

  if (!branchId || branchId === 'all') return updated;
  return updated.filter((v) => v.branchId === branchId || v.branchId === 'all');
};

export const deletePromoVoucher = (id: string, branchId?: string): PromoVoucher[] => {
  const current = loadPromoVouchers('all');
  const updated = current.filter((v) => v.id !== id);
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  sessionStorage.setItem(VOUCH_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    client.from('promo_vouchers').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error deleting promo_voucher dari Supabase:', error);
      else console.log('Berhasil menghapus promo_voucher dari Supabase:', id);
    });
  }

  if (!branchId || branchId === 'all') return updated;
  return updated.filter((v) => v.branchId === branchId || v.branchId === 'all');
};

export { fetchPromoVouchersFromCloud } from './voucherCloudFetch';
