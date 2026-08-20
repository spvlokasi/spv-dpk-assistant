import { RootCauseFactor } from '../../../types';

export const getSidogiriPresetFactors = (): RootCauseFactor[] => {
  const now = Date.now();

  const internal: RootCauseFactor[] = [
    { id: `rc-int-1-${now}`, category: 'internal', title: 'Efisiensi Listrik & Energi (Suhu AC 24-25°C, Neon Box, Rawat Freezer)', score: 3, note: 'Pastikan AC tidak <24°C, matikan 1 AC saat sepi, neon box 17.30-22.00, bersihkan kondensor freezer.' },
    { id: `rc-int-2-${now}`, category: 'internal', title: 'Penertiban Stok Mati, Slow Moving & Zero Expired (FEFO & Mark-Down 10-20%)', score: 3, note: 'Audit 2 mingguan stok mati, beri diskon khusus kasir sebelum kadaluarsa untuk amankan margin.' },
    { id: `rc-int-3-${now}`, category: 'internal', title: 'Kedisiplinan SOP Kasir: Up-selling & Suggestive Selling Promo', score: 3, note: 'Wajib tawarkan produk tebus murah, cross-selling kopi+gula, target minimal +Rp2.000 per struk.' },
    { id: `rc-int-4-${now}`, category: 'internal', title: 'Ketersediaan Top 50 SKU Omzet (Zero Out-of-Stock)', score: 3, note: 'Barang fast-moving (air mineral, rokok, beras, minyak goreng) wajib selalu ada di rak display.' },
    { id: `rc-int-5-${now}`, category: 'internal', title: 'Kedisiplinan SO Parsial Harian Kategori Rawan (Rokok, Susu, Kosmetik)', score: 3, note: 'Lakukan hitung fisik harian kategori rawan selisih/hilang sebelum pergantian shift kasir.' },
    { id: `rc-int-6-${now}`, category: 'internal', title: 'Kemandirian & Kepemimpinan KTB (Briefing Pagi & Kawal Target Laba)', score: 3, note: 'KTB pimpin briefing pagi 10 menit, evaluasi target laba harian, dan pantau kepatuhan SOP crew.' }
  ];

  const external: RootCauseFactor[] = [
    { id: `rc-ext-1-${now}`, category: 'eksternal', title: 'Tekanan Kompetitor Sekitar & Selisih Promo Harga', score: 3, note: 'Pantau harga promo toko sebelah dan perkuat keunggulan pelayanan khas TokoBASMALAH.' },
    { id: `rc-ext-2-${now}`, category: 'eksternal', title: 'Aksesibilitas, Kebersihan Parkir & Penerangan Depan Toko', score: 3, note: 'Parkiran lapang, bebas sampah, dan lampu penerangan terang agar konsumen nyaman singgah.' },
    { id: `rc-ext-3-${now}`, category: 'eksternal', title: 'Potensi Canvassing Sembako ke Warung, UMKM & Komunitas Sekitar', score: 3, note: 'Jemput bola pesanan kartonan ke pesantren/warung sekitar toko untuk suntikan omzet harian.' },
    { id: `rc-ext-4-${now}`, category: 'eksternal', title: 'Daya Beli Masyarakat & Karakteristik Pelanggan Lingkungan', score: 3, note: 'Sesuaikan varian ukuran produk (kemasan sachet/ekonomis) dengan profil warga sekitar.' }
  ];

  return [...internal, ...external];
};
