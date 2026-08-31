import { PromoProduct } from '../../types';
import { getSupabaseClient } from '../supabase';

export const PROD_KEY = 'spv_dpk_promo_products';

export const sanitizeProducts = (list: PromoProduct[]): PromoProduct[] => list;

export const loadPromoProducts = (branchId?: string): PromoProduct[] => {
  try {
    const raw = localStorage.getItem(PROD_KEY) || sessionStorage.getItem(PROD_KEY);
    if (!raw) return [];
    const list: PromoProduct[] = JSON.parse(raw);
    if (!branchId || branchId === 'all') return list;
    return list.filter((p) => p.branchId === branchId || p.branchId === 'all');
  } catch {
    return [];
  }
};

const safeUpsertProduct = async (client: any, payload: Record<string, any>, attempts = 0): Promise<void> => {
  if (attempts > 5) return;
  const { error } = await client.from('promo_products').upsert(payload);
  if (error) {
    console.warn(`Upsert promo_product error (attempt ${attempts + 1}):`, error.message);
    const match = error.message.match(/Could not find the '([^']+)' column/i);
    if (match && match[1]) {
      const badCol = match[1];
      const nextPayload = { ...payload };
      delete nextPayload[badCol];
      return safeUpsertProduct(client, nextPayload, attempts + 1);
    }
  } else {
    console.log('Berhasil sync promo_product ke Supabase:', payload.name);
  }
};

export const savePromoProduct = (product: PromoProduct, branchId?: string): PromoProduct[] => {
  const current = loadPromoProducts('all');
  const index = current.findIndex((p) => p.id === product.id);
  const updated = index >= 0 ? current.map((p) => (p.id === product.id ? product : p)) : [product, ...current];
  localStorage.setItem(PROD_KEY, JSON.stringify(updated));
  sessionStorage.setItem(PROD_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    const fullPayload: Record<string, any> = {
      id: product.id,
      branch_id: product.branchId || 'all',
      name: product.name,
      category: product.category || 'sembako',
      original_price: Number(product.originalPrice) || 0,
      promo_price: Number(product.promoPrice) || 0,
      unit: product.unit || 'Pcs',
      image_url: product.imageUrl || '',
      in_stock: product.inStock ?? true,
      is_featured: product.isFeatured ?? true,
      updated_at: new Date().toISOString()
    };

    safeUpsertProduct(client, fullPayload);
  }

  if (!branchId || branchId === 'all') return updated;
  return updated.filter((p) => p.branchId === branchId || p.branchId === 'all');
};

export const deletePromoProduct = (id: string, branchId?: string): PromoProduct[] => {
  const current = loadPromoProducts('all');
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem(PROD_KEY, JSON.stringify(updated));
  sessionStorage.setItem(PROD_KEY, JSON.stringify(updated));

  const client = getSupabaseClient();
  if (client) {
    client.from('promo_products').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('Error deleting promo_product dari Supabase:', error);
      else console.log('Berhasil menghapus promo_product dari Supabase:', id);
    });
  }

  if (!branchId || branchId === 'all') return updated;
  return updated.filter((p) => p.branchId === branchId || p.branchId === 'all');
};

export { fetchPromoProductsFromCloud } from './productCloudFetch';
