import { PromoProduct, PromoVoucher } from '../../types';

export const DEFAULT_PROMO_PRODUCTS: PromoProduct[] = [
  {
    id: 'prod-1', branchId: 'br-01', name: 'Beras Premium Basmalah 5 KG',
    category: 'sembako', originalPrice: 74000, promoPrice: 68500, unit: '5 Kg / Sak', inStock: true, isFeatured: true
  },
  {
    id: 'prod-2', branchId: 'br-01', name: 'Minyak Goreng Pouch 2 Liter',
    category: 'sembako', originalPrice: 36000, promoPrice: 33500, unit: 'Pouch 2L', inStock: true, isFeatured: true
  },
  {
    id: 'prod-3', branchId: 'br-01', name: 'Gula Pasir Kristal Putih 1 KG',
    category: 'sembako', originalPrice: 18500, promoPrice: 17200, unit: 'Bungkus 1 Kg', inStock: true, isFeatured: true
  },
  {
    id: 'prod-4', branchId: 'br-01', name: 'Kopi Bubuk Asli Sidogiri Basmalah',
    category: 'minuman_snack', originalPrice: 12000, promoPrice: 9900, unit: 'Pack 150g', inStock: true, isFeatured: true
  },
  {
    id: 'prod-5', branchId: 'br-01', name: 'Deterjen Bubuk Konsentrat 800g',
    category: 'kebersihan', originalPrice: 22500, promoPrice: 18900, unit: 'Bag 800g', inStock: true, isFeatured: false
  },
  {
    id: 'prod-6', branchId: 'br-01', name: 'Tebus Murah Wafer Coklat Renyah',
    category: 'promo_kasir', originalPrice: 8500, promoPrice: 4500, unit: 'Kaleng/Box', inStock: true, isFeatured: true
  }
];

export const DEFAULT_PROMO_VOUCHERS: PromoVoucher[] = [
  {
    id: 'vouch-1', branchId: 'br-01', code: 'BERKAH5K',
    discountAmount: 5000, minSpend: 50000, validUntil: '2026-12-31', isActive: true,
    description: 'Potongan Rp 5.000 belanja sembako minimal Rp 50.000'
  },
  {
    id: 'vouch-2', branchId: 'br-01', code: 'JUMATHEMAT',
    discountAmount: 3000, minSpend: 35000, validUntil: '2026-12-31', isActive: true,
    description: 'Voucher hemat belanja akhir pekan minimal Rp 35.000'
  }
];
