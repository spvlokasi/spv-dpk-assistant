export interface PromoProduct {
  id: string;
  branchId: string;
  name: string;
  category: 'sembako' | 'minuman_snack' | 'kebersihan' | 'fresh_dairy' | 'promo_kasir';
  originalPrice: number;
  promoPrice: number;
  unit: string;
  imageUrl?: string;
  inStock: boolean;
  isFeatured?: boolean;
}

export interface PromoVoucher {
  id: string;
  branchId: string;
  code: string;
  discountAmount: number;
  minSpend: number;
  quota: number;
  claimedCount?: number;
  usedCount?: number;
  validUntil: string;
  isActive: boolean;
  description: string;
}

export interface CartItem {
  product: PromoProduct;
  quantity: number;
}
