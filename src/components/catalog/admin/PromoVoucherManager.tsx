import React, { useState } from 'react';
import { Ticket, Plus, Trash2, Calendar, Users, ToggleLeft, ToggleRight, Sparkles, ShieldCheck, Crown, Store, Building2, FileText, AlertCircle } from 'lucide-react';
import { Branch, PromoVoucher, UserAccount } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface PromoVoucherManagerProps {
  vouchers: PromoVoucher[];
  branchId: string;
  branches?: Branch[];
  currentUser?: UserAccount | null;
  onOpenProposalModal?: () => void;
  onSaveVoucher: (v: PromoVoucher) => void;
  onDeleteVoucher: (id: string) => void;
}

export const PromoVoucherManager: React.FC<PromoVoucherManagerProps> = ({
  vouchers,
  branchId,
  branches = [],
  currentUser,
  onOpenProposalModal,
  onSaveVoucher,
  onDeleteVoucher
}) => {
  const isSpv = !currentUser?.branchCode || currentUser?.roleTitle?.toLowerCase().includes('spv') || currentUser?.roleTitle?.toLowerCase().includes('supervisor');

  // Form states
  const [targetScope, setTargetScope] = useState<string>(isSpv ? 'all' : branchId);
  const [fundingSource, setFundingSource] = useState<'store' | 'sponsor' | 'dpk_turnaround'>(isSpv ? 'sponsor' : 'store');
  const [code, setCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState<number>(5000);
  const [minSpend, setMinSpend] = useState<number>(50000);
  const [quota, setQuota] = useState<number>(50);
  const [validUntil, setValidUntil] = useState<string>('2026-12-31');
  const [applicableCategory, setApplicableCategory] = useState<string>('all');
  const [sponsorName, setSponsorName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');

  const currentBranchObj = branches.find((b) => b.id === branchId);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const assignedBranchId = isSpv ? targetScope : branchId;

    let defaultDesc = `Potongan ${formatRupiah(discountAmount)} min belanja ${formatRupiah(minSpend)}`;
    if (fundingSource === 'sponsor' && sponsorName.trim()) {
      defaultDesc = `Promo Spesial Co-Marketing ${sponsorName.trim()} - Diskon ${formatRupiah(discountAmount)}`;
    } else if (fundingSource === 'dpk_turnaround') {
      defaultDesc = `Program Akselerasi DPK - Diskon Belanja ${formatRupiah(discountAmount)}`;
    }

    onSaveVoucher({
      id: `vouch-${Date.now()}`,
      branchId: assignedBranchId,
      code: code.trim().toUpperCase(),
      discountAmount: Number(discountAmount),
      minSpend: Number(minSpend),
      quota: Number(quota) || 50,
      claimedCount: 0,
      usedCount: 0,
      validUntil: validUntil || '2026-12-31',
      isActive: true,
      applicableCategory: applicableCategory || 'all',
      fundingSource: fundingSource,
      sponsorName: sponsorName.trim() || undefined,
      description: desc.trim() || defaultDesc
    });

    setCode('');
    setDesc('');
    if (fundingSource !== 'sponsor') setSponsorName('');
  };

  const toggleVoucherStatus = (v: PromoVoucher) => {
    onSaveVoucher({ ...v, isActive: !v.isActive });
  };

  const handleDelete = (v: PromoVoucher) => {
    const isGlobalOrSponsor = v.branchId === 'all' || v.fundingSource === 'sponsor' || v.fundingSource === 'dpk_turnaround';
    if (!isSpv && isGlobalOrSponsor) {
      alert('Voucher ini diterbitkan oleh SPV / Brand Sponsor dan hanya dapat dihapus oleh Supervisor DPK.');
      return;
    }
    if (window.confirm(`Yakin ingin menghapus voucher ${v.code}?`)) {
      onDeleteVoucher(v.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Banner Otoritas SPV vs KTB */}
      <div className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md ${
        isSpv 
          ? 'bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/40 border-amber-500/40' 
          : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isSpv ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {isSpv ? <Crown className="w-5 h-5" /> : <Store className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">
                {isSpv ? 'Pusat Otoritas Voucher & Co-Marketing SPV DPK' : `Panel Voucher Toko [${currentBranchObj?.code || 'KTB'}]`}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isSpv 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isSpv ? '⭐ Hak Akses Penuh SPV' : '🏪 Hak Akses Kepala Toko'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isSpv 
                ? 'Wewenang penuh menerbitkan voucher diskon lintas cabang, subsidi turnaround, dan kemitraan co-marketing brand.' 
                : 'Melihat dan mengaktifkan voucher promo belanja untuk pelanggan di cabang Anda.'}
            </p>
          </div>
        </div>

        {isSpv && onOpenProposalModal && (
          <button
            type="button"
            onClick={onOpenProposalModal}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-950/40 transition-all flex-shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>+ Proposal Co-Marketing</span>
          </button>
        )}
      </div>

      {/* Form Buat Voucher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>{isSpv ? 'Terbitkan Voucher Promo / Sponsor Baru' : 'Buat Kupon Diskon Cabang'}</span>
          </h4>
          <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-800/60 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Sinkronisasi Otomatis ke Cloud</span>
          </span>
        </div>

        <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
          {/* Baris Khusus SPV: Target Jangkauan & Sumber Pendanaan */}
          {isSpv && (
            <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Jangkauan Cabang */}
                <div>
                  <label className="block text-[11px] text-amber-300 font-bold mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Jangkauan Toko Target:</span>
                  </label>
                  <select
                    value={targetScope}
                    onChange={(e) => setTargetScope(e.target.value)}
                    className="w-full bg-slate-800 border border-amber-700/50 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">🌐 SEMUA CABANG BINAAN DPK (Voucher Universal)</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        🏪 Khusus Cabang [{b.code}] {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sumber Pendanaan */}
                <div>
                  <label className="block text-[11px] text-amber-300 font-bold mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tipe Pendanaan (Sumber Budget):</span>
                  </label>
                  <select
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value as any)}
                    className="w-full bg-slate-800 border border-amber-700/50 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                  >
                    <option value="sponsor">🏢 Sponsor / Co-Marketing Brand (Didanai Supplier Pabrikan)</option>
                    <option value="dpk_turnaround">💎 Subsidi Khusus Program Turnaround DPK</option>
                    <option value="store">🏪 Biaya Operasional Toko (Store Funded)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Baris Input Utama */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Kode Voucher (Kupon)</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Contoh: YAKULT5K"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Besar Potongan Diskon (Rp)</label>
              <input
                type="number"
                required
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                placeholder="5000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Minimal Belanja (Rp)</label>
              <input
                type="number"
                required
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                placeholder="50000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Berlaku Untuk Kategori Produk:</label>
              <select
                value={applicableCategory}
                onChange={(e) => setApplicableCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="all">Semua Produk (Belanja Bebas)</option>
                <option value="sembako">Khusus Sembako (Beras, Minyak, Gula)</option>
                <option value="minuman_snack">Khusus Minuman & Snack (Yakult, Kanzler, dll)</option>
                <option value="kebersihan">Khusus Kebersihan & Rumah Tangga</option>
                <option value="promo_kasir">Khusus Tebus Murah Kasir</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Nama Brand Sponsor / Keterangan</label>
              <input
                type="text"
                value={sponsorName}
                onChange={(e) => setSponsorName(e.target.value)}
                placeholder={fundingSource === 'sponsor' ? 'Wajib untuk Co-Marketing: Misal PT Yakult / Kanzler' : 'Opsional: Nama brand/kemitraan'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Batas Kuota (Jumlah Kupon)</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                placeholder="50"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Masa Berlaku (Expired)</span>
              </label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md shadow-amber-950/60 flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Terbitkan Voucher</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Daftar Voucher Aktif */}
      {vouchers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-2">
          <Ticket className="w-10 h-10 text-slate-600 mx-auto" />
          <h5 className="text-sm font-bold text-slate-300">Belum Ada Voucher Diskon Aktif</h5>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isSpv 
              ? 'Silakan gunakan form di atas untuk menerbitkan kupon diskon global atau program sponsorship untuk toko binaan.' 
              : 'Belum ada voucher yang dibuat untuk toko ini. Anda dapat membuat voucher toko baru di atas.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vouchers.map((v) => {
            const totalQuota = v.quota || 50;
            const claimed = v.claimedCount || 0;
            const remaining = Math.max(0, totalQuota - claimed);
            const isExpired = new Date(v.validUntil).getTime() < new Date().setHours(0, 0, 0, 0);
            const isGlobal = v.branchId === 'all';
            const isSponsor = v.fundingSource === 'sponsor' || Boolean(v.sponsorName);
            const isTurnaround = v.fundingSource === 'dpk_turnaround';

            return (
              <div
                key={v.id}
                className={`bg-gradient-to-r from-amber-950/30 to-slate-900 border rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-lg transition-all ${
                  !v.isActive || isExpired || remaining === 0
                    ? 'border-slate-800 opacity-60'
                    : isSponsor || isGlobal
                    ? 'border-amber-500/60 bg-slate-900/90'
                    : 'border-amber-700/50 hover:border-amber-500/80'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-mono font-extrabold text-xs tracking-wider">
                        {v.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">
                        Hemat {formatRupiah(v.discountAmount)}
                      </span>
                      {isGlobal && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-950/80 border border-blue-700/60 text-blue-300 text-[10px] font-bold">
                          🌐 Semua Cabang
                        </span>
                      )}
                      {isSponsor && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-950/80 border border-purple-700/60 text-purple-300 text-[10px] font-bold flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5" />
                          <span>{v.sponsorName || 'Sponsor Co-Marketing'}</span>
                        </span>
                      )}
                      {isTurnaround && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-bold">
                          💎 Subsidi DPK
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleVoucherStatus(v)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 hover:text-white flex-shrink-0"
                      title={v.isActive ? 'Klik untuk Nonaktifkan' : 'Klik untuk Aktifkan'}
                    >
                      {v.isActive ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                          Aktif
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <ToggleLeft className="w-5 h-5" />
                          Nonaktif
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-1">{v.description}</p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Min. Belanja: <strong className="text-slate-200">{formatRupiah(v.minSpend)}</strong></span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Calendar className="w-3 h-3 text-amber-400" />
                      <span>s/d {v.validUntil}</span>
                    </span>
                  </div>

                  {/* Progress Kuota Voucher */}
                  <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3 text-emerald-400" />
                        Sisa Kuota:
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        {remaining} / {totalQuota} Kupon
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(0, (remaining / totalQuota) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-[10px] text-slate-400">
                    {isExpired ? '⚠️ Masa aktif berakhir' : remaining === 0 ? '❌ Kuota habis' : '✅ Siap diklaim konsumen'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(v)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus Voucher"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
