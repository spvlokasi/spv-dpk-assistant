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

  const client = getSupabaseClient();
  if (client) {
    client.from('promo_products').upsert({
      id: product.id,
      branch_id: product.branchId,
      name: product.name,
      category: product.category,
      original_price: product.originalPrice,
      promo_price: product.promoPrice,
      unit: product.unit,
      image_url: product.imageUrl || '',
      in_stock: product.inStock,
      is_featured: product.isFeatured ?? true,
      updated_at: new Date().toISOString()
    }).then();
  }

  return updated;
};

export const deletePromoProduct = (id: string): PromoProduct[] => {
  const current = loadPromoProducts('all');
  const updated = current.filter((p) => p.id !== id);
  sessionStorage.setItem(PROD_KEY, JSON.stringify(updated));
  localStorage.setItem(PROD_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    client.from('promo_products').delete().eq('id', id).then();
  }

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
    }).then();
  }

  return updated;
};

export const deletePromoVoucher = (id: string): PromoVoucher[] => {
  const current = loadPromoVouchers('all');
  const updated = current.filter((v) => v.id !== id);
  sessionStorage.setItem(VOUCH_KEY, JSON.stringify(updated));
  localStorage.setItem(VOUCH_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    client.from('promo_vouchers').delete().eq('id', id).then();
  }

  return updated;
};

// ==========================================
// ASYNC CLOUD FETCH (LIVE ALWAYS-FRESH DATA)
// ==========================================

export const fetchPromoProductsFromCloud = async (branchId?: string): Promise<PromoProduct[]> => {
  const client = getSupabaseClient();
  if (!client) return loadPromoProducts(branchId);

  try {
    const { data, error } = await client
      .from('promo_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return loadPromoProducts(branchId);
    }

    const products: PromoProduct[] = data.map((p: any) => ({
      id: p.id,
      branchId: p.branch_id || 'all',
      name: p.name,
      category: p.category || 'sembako',
      originalPrice: Number(p.original_price) || 0,
      promoPrice: Number(p.promo_price) || 0,
      unit: p.unit || 'Pcs',
      imageUrl: p.image_url || '',
      inStock: p.in_stock ?? true,
      isFeatured: p.is_featured ?? true
    }));

    // Update local cache
    sessionStorage.setItem(PROD_KEY, JSON.stringify(products));
    localStorage.setItem(PROD_KEY, JSON.stringify(products));

    if (!branchId || branchId === 'all') return products;
    const branchList = products.filter((p) => p.branchId === branchId || p.branchId === 'all');
    return branchList.length > 0 ? branchList : products;
  } catch (e) {
    console.warn('Gagal fetch live promo products dari Supabase:', e);
    return loadPromoProducts(branchId);
  }
};

export const fetchPromoVouchersFromCloud = async (branchId?: string): Promise<PromoVoucher[]> => {
  const client = getSupabaseClient();
  if (!client) return loadPromoVouchers(branchId);

  try {
    const { data, error } = await client
      .from('promo_vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return loadPromoVouchers(branchId);
    }

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
      applicableCategory: v.applicable_category || 'all'
    }));

    // Update local cache
    sessionStorage.setItem(VOUCH_KEY, JSON.stringify(vouchers));
    localStorage.setItem(VOUCH_KEY, JSON.stringify(vouchers));

    if (!branchId || branchId === 'all') return vouchers;
    const branchList = vouchers.filter((v) => v.branchId === branchId || v.branchId === 'all');
    return branchList.length > 0 ? branchList : vouchers;
  } catch (e) {
    console.warn('Gagal fetch live promo vouchers dari Supabase:', e);
    return loadPromoVouchers(branchId);
  }
};

