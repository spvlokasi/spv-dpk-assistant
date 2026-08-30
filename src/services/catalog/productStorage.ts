import { PromoProduct } from '../../types';
import { getSupabaseClient } from '../supabase';

export const PROD_KEY = 'spv_dpk_promo_products';

export const sanitizeProducts = (list: PromoProduct[]): PromoProduct[] => {
  return list.filter((p) => !['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5'].includes(p.id));
};

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

export { fetchPromoProductsFromCloud } from './productCloudFetch';
