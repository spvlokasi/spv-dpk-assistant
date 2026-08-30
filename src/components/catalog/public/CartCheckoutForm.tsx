import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Branch, CartItem, PromoVoucher } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';
import { getSupabaseClient } from '../../../services/supabase';

interface CartCheckoutFormProps {
  branch: Branch;
  items: CartItem[];
  appliedVoucher: PromoVoucher | null;
}

export const CartCheckoutForm: React.FC<CartCheckoutFormProps> = ({
  branch, items, appliedVoucher
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [address, setAddress] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.product.promoPrice * i.quantity, 0);
  const discount = appliedVoucher && subtotal >= appliedVoucher.minSpend ? appliedVoucher.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discount);

  const handleCheckoutWA = () => {
    if (!buyerName.trim() || !address.trim()) {
      alert('Silakan masukkan nama dan alamat antar Anda terlebih dahulu.');
      return;
    }
    const lines = items.map((i) => `• ${i.quantity}x ${i.product.name} (${formatRupiah(i.product.promoPrice * i.quantity)})`);
    let msg = `*PESANAN BELANJA ONLINE TOKOBASMALAH*\n` +
      `🏪 Cabang: ${branch.name}\n` +
      `👤 Pembeli: ${buyerName.trim()}\n` +
      `📍 Alamat Antar: ${address.trim()}\n\n` +
      `*Daftar Barang:*\n${lines.join('\n')}\n\n` +
      `Subtotal: ${formatRupiah(subtotal)}\n`;
    if (discount > 0) msg += `🎟️ Voucher (${appliedVoucher?.code}): -${formatRupiah(discount)}\n`;
    msg += `*TOTAL BAYAR: ${formatRupiah(grandTotal)} (COD/Bayar di Tempat)*\n\n` +
      `Mohon segera diproses dan diantar ya TokoBasmalah. Terima kasih!`;

    const client = getSupabaseClient();
    const orderId = `ord-${Date.now()}`;
    const orderPayload = {
      id: orderId, branch_id: branch.id, branch_code: branch.code,
      branch_name: branch.name, buyer_name: buyerName.trim(), address: address.trim(),
      items: items.map((i) => ({ id: i.product.id, name: i.product.name, unit: i.product.unit, quantity: i.quantity, promoPrice: i.product.promoPrice })),
      subtotal, discount, voucher_code: appliedVoucher?.code || '', grand_total: grandTotal,
      status: 'pending_delivery', created_at: new Date().toISOString(), updated_at: new Date().toISOString()
    };

    if (client) {
      client.from('online_orders').insert(orderPayload).then();
      if (appliedVoucher) {
        client.from('promo_vouchers').update({ used_count: (appliedVoucher.usedCount || 0) + 1, updated_at: new Date().toISOString() }).eq('id', appliedVoucher.id).then();
      }
    }

    try {
      const STORAGE_ORDERS_KEY = 'basmalah_customer_orders';
      const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify([orderPayload, ...existing]));
    } catch {}

    const phone = (branch.phone || '6281234567890').replace(/\D/g, '');
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="pt-3 border-t border-slate-800 space-y-2.5 text-xs">
      <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="Nama Lengkap Anda..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat Pengiriman (Jalan, RT/RW, Patokan)..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500" />
      <div className="flex justify-between text-slate-400"><span>Subtotal:</span><strong className="text-slate-200 font-mono">{formatRupiah(subtotal)}</strong></div>
      {discount > 0 && <div className="flex justify-between text-emerald-400"><span>Voucher ({appliedVoucher?.code}):</span><strong className="font-mono">-{formatRupiah(discount)}</strong></div>}
      <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-800"><span>Total Tagihan:</span><strong className="text-emerald-400 font-mono text-base">{formatRupiah(grandTotal)}</strong></div>
      <button onClick={handleCheckoutWA} disabled={items.length === 0} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 active:scale-95 transition-all">
        <Send className="w-4 h-4" /><span>Kirim Pesanan via WhatsApp</span>
      </button>
    </div>
  );
};
