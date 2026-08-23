import { PromoProduct, PromoVoucher } from '../../types';
import { DEFAULT_PROMO_PRODUCTS, DEFAULT_PROMO_VOUCHERS } from './mockCatalogData';

const PROD_KEY = 'spv_dpk_promo_products';
const VOUCH_KEY = 'spv_dpk_promo_vouchers';

export const loadPromoProducts = (branchId?: string): PromoProduct[] => {
  try {
    const raw = localStorage.getItem(PROD_KEY);
    const list: PromoProduct[] = raw ? JSON.parse(raw) : DEFAULT_PROMO_PRODUCTS;
    if (!branchId || branchId === 'all') return list;
    return list.filter((p) => p.branchId === branchId);
  } catch {
    return DEFAULT_PROMO_PRODUCTS;
  }
};

export const savePromoProduct = (product: PromoProduct): PromoProduct[] => {
  const current = loadPromoProducts('all');
  const index = current.findIndex((p) => p.id === product.id);
  const updated = index >= 0 ? current.map((p) => (p.id === product.id ? product : p)) : [product, ...current];
  localStorage.setItem(PROD_KEY, JSON.stringify(updated));
  return updated;
};

export const deletePromoProduct = (id: string): PromoProduct[] => {
  const current = loadPromoProducts('all');
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(PROD_KEY, JSON.stringify(updated));
  return updated;
};

export const loadPromoVouchers = (branchId?: string): PromoVoucher[] => {
  try {
    const raw = localStorage.getItem(VOUCH_KEY);
    const list: PromoVoucher[] = raw ? JSON.parse(raw) : DEFAULT_PROMO_VOUCHERS;
    if (!branchId || branchId === 'all') return list;
    return list.filter((v) => v.branchId === branchId);
  } catch {
    return DEFAULT_PROMO_VOUCHERS;
  }
};

export const savePromoVoucher = (voucher: PromoVoucher): PromoVoucher[] => {
  const current = loadPromoVouchers('all');
  const index = current.findIndex((v) => v.id === voucher.id);
  const updated = index >= 0 ? current.map((v) => (v.id === voucher.id ? voucher : v)) : [voucher, ...current];
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  return updated;
};

export const deletePromoVoucher = (id: string): PromoVoucher[] => {
  const current = loadPromoVouchers('all');
  const updated = current.filter((v) => v.id !== id);
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  return updated;
};
