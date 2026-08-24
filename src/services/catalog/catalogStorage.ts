import { PromoProduct, PromoVoucher } from '../../types';
import { DEFAULT_PROMO_PRODUCTS, DEFAULT_PROMO_VOUCHERS } from './mockCatalogData';
import { getSupabaseClient } from '../supabase';

const PROD_KEY = 'spv_dpk_promo_products';
const VOUCH_KEY = 'spv_dpk_promo_vouchers';

export const loadPromoProducts = (branchId?: string): PromoProduct[] => {
  try {
    const raw = sessionStorage.getItem(PROD_KEY) || localStorage.getItem(PROD_KEY);
    const list: PromoProduct[] = raw ? JSON.parse(raw) : DEFAULT_PROMO_PRODUCTS;
    if (!branchId || branchId === 'all') return list;
    const branchList = list.filter((p) => p.branchId === branchId || p.branchId === 'all');
    return branchList.length > 0 ? branchList : DEFAULT_PROMO_PRODUCTS;
  } catch {
    return DEFAULT_PROMO_PRODUCTS;
  }
};

export const savePromoProduct = (product: PromoProduct): PromoProduct[] => {
  const current = loadPromoProducts('all');
  const index = current.findIndex((p) => p.id === product.id);
  const updated = index >= 0 ? current.map((p) => (p.id === product.id ? product : p)) : [product, ...current];
  sessionStorage.setItem(PROD_KEY, JSON.stringify(updated));
  localStorage.setItem(PROD_KEY, JSON.stringify(updated));
  return updated;
};

export const deletePromoProduct = (id: string): PromoProduct[] => {
  const current = loadPromoProducts('all');
  const updated = current.filter((p) => p.id !== id);
  sessionStorage.setItem(PROD_KEY, JSON.stringify(updated));
  localStorage.setItem(PROD_KEY, JSON.stringify(updated));
  return updated;
};

export const loadPromoVouchers = (branchId?: string): PromoVoucher[] => {
  try {
    const raw = sessionStorage.getItem(VOUCH_KEY) || localStorage.getItem(VOUCH_KEY);
    const list: PromoVoucher[] = raw ? JSON.parse(raw) : DEFAULT_PROMO_VOUCHERS;
    if (!branchId || branchId === 'all') return list;
    const branchList = list.filter((v) => v.branchId === branchId || v.branchId === 'all');
    return branchList.length > 0 ? branchList : DEFAULT_PROMO_VOUCHERS;
  } catch {
    return DEFAULT_PROMO_VOUCHERS;
  }
};

export const savePromoVoucher = (voucher: PromoVoucher): PromoVoucher[] => {
  const current = loadPromoVouchers('all');
  const index = current.findIndex((v) => v.id === voucher.id);
  const updated = index >= 0 ? current.map((v) => (v.id === voucher.id ? voucher : v)) : [voucher, ...current];
  sessionStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  return updated;
};

export const deletePromoVoucher = (id: string): PromoVoucher[] => {
  const current = loadPromoVouchers('all');
  const updated = current.filter((v) => v.id !== id);
  sessionStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  return updated;
};
