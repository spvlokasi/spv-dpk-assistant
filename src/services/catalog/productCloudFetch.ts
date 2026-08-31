import { PromoProduct } from '../../types';
import { getSupabaseClient } from '../supabase';
import { PROD_KEY, loadPromoProducts } from './productStorage';

export const fetchPromoProductsFromCloud = async (branchId?: string): Promise<PromoProduct[]> => {
  const localList = loadPromoProducts(branchId);
  const client = getSupabaseClient();
  if (!client) return localList;

  try {
    const { data, error } = await client
      .from('promo_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Gagal fetch live promo products dari Supabase:', error.message);
      return localList;
    }

    if (data && data.length > 0) {
      const cloudProducts: PromoProduct[] = data.map((p: any) => ({
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

      localStorage.setItem(PROD_KEY, JSON.stringify(cloudProducts));
      sessionStorage.setItem(PROD_KEY, JSON.stringify(cloudProducts));

      if (!branchId || branchId === 'all') return cloudProducts;
      return cloudProducts.filter((p) => p.branchId === branchId || p.branchId === 'all');
    }

    // Jika cloud belum ada data tapi di local ada, push local ke cloud
    const allLocal = loadPromoProducts('all');
    if (allLocal.length > 0) {
      allLocal.forEach((p) => {
        client.from('promo_products').upsert({
          id: p.id,
          branch_id: p.branchId,
          name: p.name,
          category: p.category,
          original_price: p.originalPrice,
          promo_price: p.promoPrice,
          unit: p.unit,
          image_url: p.imageUrl || '',
          in_stock: p.inStock,
          is_featured: p.isFeatured ?? true,
          updated_at: new Date().toISOString()
        }).then();
      });
    }

    return localList;
  } catch (e) {
    console.warn('Gagal fetch live promo products dari Supabase:', e);
    return localList;
  }
};
