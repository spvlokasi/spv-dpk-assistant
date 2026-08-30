import { PromoProduct, PromoVoucher } from '../../types';

export const DEFAULT_PROMO_PRODUCTS: PromoProduct[] = [
  {
    id: 'prod-1', branchId: 'all', name: 'Beras Premium Basmalah 5 KG',
    category: 'sembako', originalPrice: 74000, promoPrice: 68500, unit: '5 Kg / Sak',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60',
    inStock: true, isFeatured: true
  },
  {
    id: 'prod-2', branchId: 'all', name: 'Minyak Goreng Pouch 2 Liter',
    category: 'sembako', originalPrice: 37000, promoPrice: 33500, unit: 'Pouch 2L',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
    inStock: true, isFeatured: true
  },
  {
    id: 'prod-3', branchId: 'all', name: 'Gula Pasir Kristal Putih 1 KG',
    category: 'sembako', originalPrice: 18500, promoPrice: 16900, unit: 'Bungkus 1 Kg',
    imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=500&auto=format&fit=crop&q=60',
    inStock: true, isFeatured: true
  },
  {
    id: 'prod-4', branchId: 'all', name: 'Kopi Bubuk Asli Sidogiri Basmalah',
    category: 'minuman_snack', originalPrice: 12500, promoPrice: 9900, unit: 'Pack 150g',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&auto=format&fit=crop&q=60',
    inStock: true, isFeatured: true
  },
  {
    id: 'prod-5', branchId: 'all', name: 'Tebus Murah Wafer Coklat Renyah',
    category: 'promo_kasir', originalPrice: 9500, promoPrice: 4500, unit: 'Kaleng/Box',
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&auto=format&fit=crop&q=60',
    inStock: true, isFeatured: true
  }
];

export const DEFAULT_PROMO_VOUCHERS: PromoVoucher[] = [
  {
    id: 'vouch-1', branchId: 'all', code: 'BERKAH5K',
    discountAmount: 5000, minSpend: 50000, quota: 50, claimedCount: 8, usedCount: 4,
    validUntil: '2026-12-31', isActive: true,
    description: 'Potongan Rp 5.000 belanja sembako minimal Rp 50.000'
  },
  {
    id: 'vouch-2', branchId: 'all', code: 'JUMATHEMAT',
    discountAmount: 3000, minSpend: 35000, quota: 30, claimedCount: 5, usedCount: 2,
    validUntil: '2026-12-31', isActive: true,
    description: 'Voucher hemat belanja akhir pekan minimal Rp 35.000'
  }
];
