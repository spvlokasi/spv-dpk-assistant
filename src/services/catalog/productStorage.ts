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

    client.from('promo_products').upsert(fullPayload).then(({ error }) => {
      if (error) {
        console.warn('Gagal upsert promo_product dengan kolom lengkap, mencoba fallback dasar:', error.message);
        // Fallback jika is_featured atau updated_at belum ada di schema database
        const basePayload = {
          id: product.id,
          branch_id: product.branchId || 'all',
          name: product.name,
          category: product.category || 'sembako',
          original_price: Number(product.originalPrice) || 0,
          promo_price: Number(product.promoPrice) || 0,
          unit: product.unit || 'Pcs',
          image_url: product.imageUrl || '',
          in_stock: product.inStock ?? true
        };
        client.from('promo_products').upsert(basePayload).then(({ error: retryError }) => {
          if (retryError) console.error('Gagal upsert promo_product fallback ke Supabase:', retryError);
          else console.log('Berhasil sync promo_product ke Supabase (fallback mode)');
        });
      } else {
        console.log('Berhasil sync promo_product ke Supabase:', product.name);
      }
    });
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
