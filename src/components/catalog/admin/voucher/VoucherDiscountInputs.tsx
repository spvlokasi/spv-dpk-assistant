import React from 'react';

interface VoucherDiscountInputsProps {
  code: string;
  setCode: (v: string) => void;
  discountAmount: number;
  setDiscountAmount: (v: number) => void;
  minSpend: number;
  setMinSpend: (v: number) => void;
  applicableCategory: string;
  setApplicableCategory: (v: string) => void;
  sponsorName: string;
  setSponsorName: (v: string) => void;
  fundingSource: string;
}

export const VoucherDiscountInputs: React.FC<VoucherDiscountInputsProps> = ({
  code, setCode, discountAmount, setDiscountAmount, minSpend, setMinSpend,
  applicableCategory, setApplicableCategory, sponsorName, setSponsorName, fundingSource
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Kode Voucher (Kupon)</label>
          <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Contoh: YAKULT5K" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold uppercase focus:outline-none focus:border-amber-500" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Besar Diskon (Rp)</label>
          <input type="number" required value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} placeholder="5000" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Min. Belanja (Rp)</label>
          <input type="number" required value={minSpend} onChange={(e) => setMinSpend(Number(e.target.value))} placeholder="50000" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Kategori Produk:</label>
          <select value={applicableCategory} onChange={(e) => setApplicableCategory(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-amber-500">
            <option value="all">Semua Produk (Belanja Bebas)</option>
            <option value="sembako">Khusus Sembako (Beras, Minyak, Gula)</option>
            <option value="minuman_snack">Khusus Minuman & Snack (Yakult, Kanzler, dll)</option>
            <option value="kebersihan">Khusus Kebersihan & Rumah Tangga</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Brand Sponsor / Keterangan</label>
          <input type="text" value={sponsorName} onChange={(e) => setSponsorName(e.target.value)} placeholder={fundingSource === 'sponsor' ? 'Wajib Co-Marketing: Misal PT Yakult' : 'Opsional: Nama brand'} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500" />
        </div>
      </div>
    </>
  );
};
