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
  fundingSource?: 'store' | 'sponsor' | 'dpk_turnaround' | 'supplier' | 'joint';
  sponsorName?: string;
  applicableCategory?: string;
}

export interface CartItem {
  product: PromoProduct;
  quantity: number;
}

export interface OnlineOrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface OnlineOrderLog {
  id: string;
  branch_id?: string;
  branch_code?: string;
  branch_name?: string;
  buyer_name: string;
  address: string;
  maps_url?: string | null;
  lat?: number;
  lng?: number;
  items: OnlineOrderItem[];
  subtotal: number;
  discount: number;
  voucher_code?: string | null;
  grand_total: number;
  created_at: string;
  status: 'pending_delivery' | 'delivering' | 'completed' | 'cancelled';
}

