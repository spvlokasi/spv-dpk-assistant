import { PromoProduct } from '../../types';
import { getSupabaseClient } from '../supabase';
import { PROD_KEY, sanitizeProducts, loadPromoProducts } from './productStorage';

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

    sessionStorage.setItem(PROD_KEY, JSON.stringify(products));
    localStorage.setItem(PROD_KEY, JSON.stringify(products));

    if (!branchId || branchId === 'all') return products;
    return products.filter((p) => p.branchId === branchId || p.branchId === 'all');
  } catch (e) {
    console.warn('Gagal fetch live promo products dari Supabase:', e);
    return loadPromoProducts(branchId);
  }
};
