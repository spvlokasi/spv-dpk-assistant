import { PromoProduct, PromoVoucher } from '../../types';
import { getSupabaseClient } from '../supabase';

const PROD_KEY = 'spv_dpk_promo_products';
const VOUCH_KEY = 'spv_dpk_promo_vouchers';

// Helper to filter out legacy mock items (vouch-1, prod-1, etc.)
const sanitizeVouchers = (list: PromoVoucher[]): PromoVoucher[] => {
  return list.filter((v) => !['vouch-1', 'vouch-2'].includes(v.id));
};

const sanitizeProducts = (list: PromoProduct[]): PromoProduct[] => {
  return list.filter((p) => !['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5'].includes(p.id));
};

// ==========================================
// PROMO PRODUCTS
// ==========================================

export const loadPromoProducts = (branchId?: string): PromoProduct[] => {
  try {
    const raw = sessionStorage.getItem(PROD_KEY) || localStorage.getItem(PROD_KEY);
    if (!raw) return [];
    const list: PromoProduct[] = sanitizeProducts(JSON.parse(raw));
    if (!branchId || branchId === 'all') return list;
    return list.filter((p) => p.branchId === branchId || p.branchId === 'all');
  } catch {
    return [];
  }
};

export const savePromoProduct = (product: PromoProduct, branchId?: string): PromoProduct[] => {
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
    }).then(({ error }) => {
      if (error) console.error('Error upserting promo_product:', error);
    });
  }

  if (!branchId || branchId === 'all') return updated;
  return updated.filter((p) => p.branchId === branchId || p.branchId === 'all');
};

export const deletePromoProduct = (id: string, branchId?: string): PromoProduct[] => {
  const current = loadPromoProducts('all');
  const updated = current.filter((p) => p.id !== id);
  sessionStorage.setItem(PROD_KEY, JSON.stringify(updated));
  localStorage.setItem(PROD_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    client.from('promo_products').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error deleting promo_product:', error);
    });
  }

  if (!branchId || branchId === 'all') return updated;
  return updated.filter((p) => p.branchId === branchId || p.branchId === 'all');
};

// ==========================================
// PROMO VOUCHERS
// ==========================================

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

    if (error) {
      console.warn('Gagal fetch live promo products dari Supabase:', error.message);
      return loadPromoProducts(branchId);
    }

    const products: PromoProduct[] = sanitizeProducts(
      (data || []).map((p: any) => ({
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
      }))
    );

    // Update local cache
    sessionStorage.setItem(PROD_KEY, JSON.stringify(products));
    localStorage.setItem(PROD_KEY, JSON.stringify(products));

    if (!branchId || branchId === 'all') return products;
    return products.filter((p) => p.branchId === branchId || p.branchId === 'all');
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
        applicableCategory: v.applicable_category || 'all'
      }))
    );

    // Update local cache
    sessionStorage.setItem(VOUCH_KEY, JSON.stringify(vouchers));
    localStorage.setItem(VOUCH_KEY, JSON.stringify(vouchers));

    if (!branchId || branchId === 'all') return vouchers;
    return vouchers.filter((v) => v.branchId === branchId || v.branchId === 'all');
  } catch (e) {
    console.warn('Gagal fetch live promo vouchers dari Supabase:', e);
    return loadPromoVouchers(branchId);
  }
};
