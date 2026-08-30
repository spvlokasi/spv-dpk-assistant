import React, { useState } from 'react';
import { FileText, Printer, X, Copy, Check, Sparkles, CheckCircle2, Edit3, Eye, Building2, Users, Calendar, DollarSign, Target, MessageSquare } from 'lucide-react';
import { Branch, PromoVoucher } from '../../../types';
import { formatRupiah } from '../../../utils/formatters';

interface SupplierProposalModalProps {
  branch: Branch;
  onClose: () => void;
  onApplyVoucherToStore?: (voucher: PromoVoucher) => void;
}

interface ProposalPreset {
  id: string;
  name: string;
  companyName: string;
  brandName: string;
  picName: string;
  programTitle: string;
  focusProducts: string;
  productCategory: string;
  discountPerUnit: number;
  minSpend: number;
  voucherQuota: number;
  targetSalesUnits: number;
  targetOmzet: number;
  fundingScheme: 'supplier' | 'joint' | 'store';
  backgroundStory: string;
  spvSignName: string;
  ktbSignName: string;
}

const PROPOSAL_PRESETS: ProposalPreset[] = [
  {
    id: 'yakult',
    name: '🍶 PT Yakult Indonesia Persada',
    companyName: 'PT Yakult Indonesia Persada',
    brandName: 'Yakult',
    picName: 'Bpk. Hendra Gunawan (Area Sales Manager)',
    programTitle: 'Program Co-Marketing "Keluarga Sehat & Berkah TokoBasmalah"',
    focusProducts: 'Yakult Minuman Probiotik Fermentasi (Pack isi 5 botol)',
    productCategory: 'Minuman Segar & Sehat',
    discountPerUnit: 2000,
    minSpend: 25000,
    voucherQuota: 100,
    targetSalesUnits: 500,
    targetOmzet: 5500000,
    fundingScheme: 'supplier',
    backgroundStory: 'Peningkatan penetrasi konsumsi harian keluarga binaan TokoBasmalah melalui bundling sembako digital dan potongan harga khusus yang didukung penuh oleh Principal.',
    spvSignName: 'M. Maskur',
    ktbSignName: 'Kepala Toko'
  },
  {
    id: 'kanzler',
    name: '🌭 PT Macroprima Panganutama (Kanzler)',
    companyName: 'PT Macroprima Panganutama (Cimory Group)',
    brandName: 'Kanzler',
    picName: 'Ibu Ratna Dewi (Key Account Executive Jatim)',
    programTitle: 'Festival Gebyar Frozen Food & Sosis Siap Saji Hemat',
    focusProducts: 'Kanzler Singles (Original, Keju, Hot, Crispy) & Kanzler Cocktail Sausage',
    productCategory: 'Makanan Siap Saji & Olahan Daging',
    discountPerUnit: 3500,
    minSpend: 35000,
    voucherQuota: 150,
    targetSalesUnits: 750,
    targetOmzet: 9750000,
    fundingScheme: 'supplier',
    backgroundStory: 'Pemasaran intensif produk ready-to-eat & sosis viral Kanzler pada etalase katalog utama dengan voucher potongan harga instan via WhatsApp delivery.',
    spvSignName: 'M. Maskur',
    ktbSignName: 'Kepala Toko'
  },
  {
    id: 'unilever',
    name: '🧴 PT Unilever Indonesia Tbk',
    companyName: 'PT Unilever Indonesia Tbk',
    brandName: 'Unilever',
    picName: 'Bpk. Firman Syah (Distributor Trade Specialist)',
    programTitle: 'Program Rumah Bersih & Keluarga Higienis Basmalah',
    focusProducts: 'Sunlight Jeruk Nipis 700ml, Rinso Molto 770g, Lifebuoy Sabun 4x110g',
    productCategory: 'Kebutuhan Kebersihan Rumah Tangga',
    discountPerUnit: 3000,
    minSpend: 40000,
    voucherQuota: 120,
    targetSalesUnits: 600,
    targetOmzet: 8400000,
    fundingScheme: 'joint',
    backgroundStory: 'Program sharing margin 50:50 untuk mendongkrak basket size belanja ibu rumah tangga pada kategori fast moving home care.',
    spvSignName: 'M. Maskur',
    ktbSignName: 'Kepala Toko'
  }
];

export const SupplierProposalModal: React.FC<SupplierProposalModalProps> = ({
  branch, onClose, onApplyVoucherToStore
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('yakult');
  const [activePreset, setActivePreset] = useState<ProposalPreset>(PROPOSAL_PRESETS[0]);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [copiedWA, setCopiedWA] = useState(false);
  const [voucherInstalled, setVoucherInstalled] = useState(false);

  // Fully Editable Form States
  const [companyName, setCompanyName] = useState(activePreset.companyName);
  const [brandName, setBrandName] = useState(activePreset.brandName);
  const [picName, setPicName] = useState(activePreset.picName);
  const [programTitle, setProgramTitle] = useState(activePreset.programTitle);
  const [focusProducts, setFocusProducts] = useState(activePreset.focusProducts);
  const [backgroundStory, setBackgroundStory] = useState(activePreset.backgroundStory);
  const [discountPerUnit, setDiscountPerUnit] = useState(activePreset.discountPerUnit);
  const [minSpend, setMinSpend] = useState(activePreset.minSpend);
  const [voucherQuota, setVoucherQuota] = useState(activePreset.voucherQuota);
  const [targetSalesUnits, setTargetSalesUnits] = useState(activePreset.targetSalesUnits);
  const [targetOmzet, setTargetOmzet] = useState(activePreset.targetOmzet);
  const [fundingScheme, setFundingScheme] = useState<'supplier' | 'joint' | 'store'>(activePreset.fundingScheme);
  const [proposalNo, setProposalNo] = useState(`047/PROP-DPK/BASMALAH/${new Date().getFullYear()}`);
  const [spvSignName, setSpvSignName] = useState(activePreset.spvSignName);
  const [ktbSignName, setKtbSignName] = useState(branch.name);

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = PROPOSAL_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setActivePreset(found);
      setCompanyName(found.companyName);
      setBrandName(found.brandName);
      setPicName(found.picName);
      setProgramTitle(found.programTitle);
      setFocusProducts(found.focusProducts);
      setBackgroundStory(found.backgroundStory);
      setDiscountPerUnit(found.discountPerUnit);
      setMinSpend(found.minSpend);
      setVoucherQuota(found.voucherQuota);
      setTargetSalesUnits(found.targetSalesUnits);
      setTargetOmzet(found.targetOmzet);
      setFundingScheme(found.fundingScheme);
      setSpvSignName(found.spvSignName);
      setKtbSignName(branch.name);
      setVoucherInstalled(false);
    }
  };

  const totalSponsorBudget = discountPerUnit * voucherQuota;
  const supplierContribution = fundingScheme === 'supplier' ? totalSponsorBudget : fundingScheme === 'joint' ? totalSponsorBudget / 2 : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWA = () => {
    const text = `*PROPOSAL KERJASAMA TRADE PROMO TOKOBASMALAH*\n\n` +
      `Kepada Yth.\n*${companyName}*\nU.p. ${picName}\n\n` +
      `Assalamu'alaikum Wr. Wb.\n` +
      `Sehubungan dengan program akselerasi omzet gerai *${branch.name}*, kami mengajukan penawaran program promosi *${programTitle}*:\n\n` +
      `📌 *Detail Program:*\n` +
      `• Produk Fokus: ${focusProducts}\n` +
      `• Target Penjualan: ${targetSalesUnits} unit / estimasi omzet ${formatRupiah(targetOmzet)}\n` +
      `• Bentuk Promo: Kupon Diskon ${formatRupiah(discountPerUnit)} (Kuota ${voucherQuota} kupon)\n` +
      `• Skema Dana: ${fundingScheme === 'supplier' ? '100% Sponsor Principal' : fundingScheme === 'joint' ? 'Sharing 50:50 Toko & Supplier' : 'Mandiri Toko'}\n` +
      `• Media Promosi: Banner Utama Katalog Belanja Online & Broadcast WA Warga (~2.000 pelanggan aktif).\n\n` +
      `Besar harapan kami untuk dapat merealisasikan program sinergi ini. Dokumen proposal lengkap siap kami kirimkan.\n\n` +
      `Wassalamu'alaikum Wr. Wb.\n` +
      `*${spvSignName} (Supervisor DPK)* & *Kepala Toko ${branch.name}*`;

    navigator.clipboard.writeText(text);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2500);
  };

  const handleInstallVoucher = () => {
    if (onApplyVoucherToStore) {
      const vCode = `${brandName.replace(/\s+/g, '').toUpperCase().slice(0, 5)}${Math.round(discountPerUnit / 1000)}K`;
      const newVoucher: PromoVoucher = {
        id: `vouch-supp-${Date.now()}`,
        branchId: branch.id,
        code: vCode,
        discountAmount: discountPerUnit,
        minSpend: minSpend,
        quota: voucherQuota,
        claimedCount: 0,
        usedCount: 0,
        validUntil: '2026-12-31',
        isActive: true,
        description: `Promo Spesial ${brandName} - Potongan ${formatRupiah(discountPerUnit)} min. belanja ${formatRupiah(minSpend)}`,
        fundingSource: fundingScheme,
        sponsorName: brandName
      };
      onApplyVoucherToStore(newVoucher);
      setVoucherInstalled(true);
      setTimeout(() => setVoucherInstalled(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl animate-in zoom-in-95 my-auto max-h-[95vh] overflow-y-auto">
        {/* Header Modal (No Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-950/80 border border-blue-700/60 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">Editor Proposal Kerjasama Supplier (SPV)</h3>
              <p className="text-[11px] text-slate-400">Sesuaikan data & cetak dokumen penawaran resmi untuk Principal/Distributor</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-950/60"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigasi Mode: Form Editor vs Preview Surat (No Print) */}
        <div className="flex items-center justify-between gap-2 flex-wrap no-print">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'editor'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/60'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>✏️ Formulir Edit Proposal</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'preview'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>📄 Tinjau Surat Resmi (Live Preview)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyWA}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
            >
              {copiedWA ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWA ? 'Teks WA Tersalin!' : 'Salin Ringkasan WA'}</span>
            </button>
            <button
              type="button"
              onClick={handleInstallVoucher}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/60"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{voucherInstalled ? '✓ Voucher Terpasang di Toko!' : '+ Pasang Voucher Sponsor'}</span>
            </button>
          </div>
        </div>

        {/* Panel Pilihan Template Instan (No Print) */}
        <div className="no-print bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Pilih Template Brand Cepat:</span>
            </label>
            <span className="text-[10px] text-emerald-400 font-semibold">Toko Target: {branch.name}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PROPOSAL_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedPresetId === p.id
                    ? 'bg-blue-950/70 border-blue-500 text-white shadow-md'
                    : 'bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">{p.name}</div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.focusProducts}</p>
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: FORMULIR EDIT LENGKAP SPV */}
        {activeTab === 'editor' && (
          <div className="no-print bg-slate-950/40 p-4 rounded-2xl border border-slate-800 space-y-4 text-xs">
            <h4 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Edit3 className="w-4 h-4" />
              <span>Formulir Pengeditan Proposal & Anggaran:</span>
            </h4>

            {/* Bagian 1: Identitas Surat & Supplier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nomor Surat Proposal</label>
                <input
                  type="text"
                  value={proposalNo}
                  onChange={(e) => setProposalNo(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nama Perusahaan / PT Supplier</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Contoh: PT Yakult Indonesia Persada"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nama Brand / Merk Produk</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Contoh: Yakult"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Bagian 2: PIC Supplier & Program Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Penerima / PIC Sales Supplier</label>
                <input
                  type="text"
                  value={picName}
                  onChange={(e) => setPicName(e.target.value)}
                  placeholder="Nama & Jabatan PIC Supplier"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Judul / Nama Program Promosi</label>
                <input
                  type="text"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  placeholder="Nama Program Kerjasama"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Bagian 3: Produk Fokus & Latar Belakang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Daftar Produk Fokus yang Dipromosikan</label>
                <textarea
                  rows={2}
                  value={focusProducts}
                  onChange={(e) => setFocusProducts(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Deskripsi Singkat / Latar Belakang</label>
                <textarea
                  rows={2}
                  value={backgroundStory}
                  onChange={(e) => setBackgroundStory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            {/* Bagian 4: Anggaran, Diskon & Target Penjualan */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Diskon per Unit (Rp)</label>
                <input
                  type="number"
                  value={discountPerUnit}
                  onChange={(e) => setDiscountPerUnit(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-emerald-400 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Min. Belanja (Rp)</label>
                <input
                  type="number"
                  value={minSpend}
                  onChange={(e) => setMinSpend(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Kuota Voucher (Kupon)</label>
                <input
                  type="number"
                  value={voucherQuota}
                  onChange={(e) => setVoucherQuota(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-amber-300 font-mono font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-semibold mb-1">Skema Pendanaan</label>
                <select
                  value={fundingScheme}
                  onChange={(e) => setFundingScheme(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-emerald-400 font-bold focus:outline-none"
                >
                  <option value="supplier">100% Sponsor Supplier</option>
                  <option value="joint">Sharing 50:50 Toko & Supplier</option>
                  <option value="store">100% Mandiri Toko</option>
                </select>
              </div>
            </div>

            {/* Bagian 5: Nama Tanda Tangan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nama Supervisor DPK (Penandatangan)</label>
                <input
                  type="text"
                  value={spvSignName}
                  onChange={(e) => setSpvSignName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 font-semibold mb-1">Nama Kepala Toko (Penandatangan)</label>
                <input
                  type="text"
                  value={ktbSignName}
                  onChange={(e) => setKtbSignName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950/60"
              >
                <Eye className="w-4 h-4" />
                <span>Lihat Hasil Surat Resmi →</span>
              </button>
            </div>
          </div>
        )}

        {/* DOKUMEN PROPOSAL RESMI (PRINTABLE LAYOUT & LIVE PREVIEW) */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl border-4 border-slate-200 font-serif text-xs leading-relaxed max-w-4xl mx-auto printable-proposal">
          {/* Kop Surat Resmi */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Basmalah" className="h-12 w-auto object-contain" />
              <div>
                <h1 className="text-base font-black tracking-tight text-emerald-900 font-sans uppercase">DEPARTEMEN BISNIS & PENGAWASAN KHUSUS (DPK)</h1>
                <h2 className="text-xs font-extrabold text-slate-800 font-sans">JARINGAN RETAIL MODERN TOKOBASMALAH JAWA TIMUR</h2>
                <p className="text-[10px] text-slate-600 font-sans mt-0.5">Unit Layanan: {branch.name} • Wilayah Kerja: {branch.city || 'Jawa Timur'}</p>
              </div>
            </div>
            <div className="text-right text-[10px] font-sans text-slate-600">
              <div className="font-bold text-slate-800">DOKUMEN RESMI</div>
              <div>No: {proposalNo}</div>
              <div>Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

          {/* Judul & Tujuan Proposal */}
          <div className="space-y-2 text-center pt-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-sans text-[11px] font-black tracking-wider uppercase inline-block">
              PROPOSAL KERJASAMA CO-MARKETING & TRADE PROMOTION
            </span>
            <h3 className="text-base font-black text-slate-950 font-sans">{programTitle}</h3>
            <p className="text-[11px] text-slate-600 font-sans italic">
              Kemitraan Strategis Bersama: <strong>{companyName}</strong> ({brandName}) & <strong>{branch.name}</strong>
            </p>
          </div>

          {/* Bagian 1: Latar Belakang & Potensi Pasar */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide border-l-4 border-emerald-600 pl-2">
              1. Latar Belakang & Potensi Pasar
            </h4>
            <p className="text-justify text-slate-700">
              Gerai <strong>{branch.name}</strong> merupakan salah satu sentra perbelanjaan masyarakat yang melayani kebutuhan sembako dan kebutuhan harian warga sekitar dengan rata-rata kunjungan 150–250 transaksi/hari serta basis pelanggan digital WhatsApp aktif mencapai lebih dari 1.500 kepala keluarga. {backgroundStory} Melalui sistem katalog digital dan layanan pesan antar sampai rumah (COD), TokoBasmalah siap mendorong peningkatan volume penjualan produk unggulan <strong>{brandName}</strong> secara terukur dan tepat sasaran.
            </p>
          </div>

          {/* Bagian 2: Skema Program & Mekanisme Promosi Digital */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide border-l-4 border-emerald-600 pl-2">
              2. Skema & Mekanisme Program Promosi
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Produk Fokus Kerjasama:</span>
                <strong className="text-slate-900 block font-bold mt-0.5">{focusProducts}</strong>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Mekanisme Voucher Belanja:</span>
                <strong className="text-emerald-700 block font-bold mt-0.5">Potongan {formatRupiah(discountPerUnit)} (Min. Belanja {formatRupiah(minSpend)})</strong>
              </div>
            </div>
            <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1">
              <li>Penempatan produk di <strong>Banner Utama Katalog Online</strong> ([basmalahbelanja.vercel.app](https://basmalahbelanja.vercel.app)).</li>
              <li>Pemberian <strong>Kupon Voucher Diskon Eksklusif</strong> dengan masa reservasi 24 jam untuk menciptakan urgensi belanja.</li>
              <li>Sosialisasi masif via <strong>Broadcast WhatsApp Kasir & Status Toko</strong> ke seluruh pelanggan sekitar gerai.</li>
            </ul>
          </div>

          {/* Bagian 3: Rincian Anggaran & Target Penjualan */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide border-l-4 border-emerald-600 pl-2">
              3. Rincian Anggaran Partisipasi & Proyeksi Penjualan
            </h4>
            <table className="w-full border-collapse border border-slate-300 text-[11px] font-sans">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th className="border border-slate-300 p-2 text-left">Komponen Program</th>
                  <th className="border border-slate-300 p-2 text-center">Volume / Kuota</th>
                  <th className="border border-slate-300 p-2 text-right">Nilai Satuan</th>
                  <th className="border border-slate-300 p-2 text-right">Total Anggaran</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">Voucher Diskon Konsumen ({brandName})</td>
                  <td className="border border-slate-300 p-2 text-center">{voucherQuota} Kupon</td>
                  <td className="border border-slate-300 p-2 text-right">{formatRupiah(discountPerUnit)}</td>
                  <td className="border border-slate-300 p-2 text-right font-bold text-emerald-800">{formatRupiah(totalSponsorBudget)}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border border-slate-300 p-2">Penempatan Listing Digital & Promosi WA</td>
                  <td className="border border-slate-300 p-2 text-center">1 Bulan Promo</td>
                  <td className="border border-slate-300 p-2 text-right">Gratis (Dukungan Toko)</td>
                  <td className="border border-slate-300 p-2 text-right text-slate-500">Rp 0 (In-Kind)</td>
                </tr>
                <tr className="bg-emerald-50 font-bold text-emerald-950">
                  <td className="border border-slate-300 p-2" colSpan={3}>Dukungan Dana Yang Diajukan ke Principal ({companyName}):</td>
                  <td className="border border-slate-300 p-2 text-right text-xs">{formatRupiah(supplierContribution)}</td>
                </tr>
                <tr className="bg-slate-100 font-bold text-slate-900">
                  <td className="border border-slate-300 p-2" colSpan={3}>Target Estimasi Omzet Penjualan Produk:</td>
                  <td className="border border-slate-300 p-2 text-right text-xs text-blue-900">{formatRupiah(targetOmzet)} ({targetSalesUnits} Unit)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bagian 4: Lembar Persetujuan & Tanda Tangan */}
          <div className="pt-6 border-t border-slate-300 font-sans">
            <p className="text-center text-[11px] text-slate-600 mb-6">
              Demikian proposal ini kami sampaikan sebagai bentuk komitmen sinergi berkelanjutan demi peningkatan omzet bersama.
            </p>
            <div className="grid grid-cols-3 text-center gap-4 text-[11px]">
              <div>
                <span className="text-slate-500 block mb-12">Diajukan oleh,<br /><strong>Supervisor DPK Basmalah</strong></span>
                <strong className="block border-t border-slate-800 pt-1 text-slate-900">( {spvSignName} )</strong>
                <span className="text-[10px] text-slate-500">Supervisor Pengawasan Khusus</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-12">Mengetahui,<br /><strong>Kepala Toko Basmalah</strong></span>
                <strong className="block border-t border-slate-800 pt-1 text-slate-900">( {ktbSignName} )</strong>
                <span className="text-[10px] text-slate-500">Penanggung Jawab Gerai</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-12">Disetujui oleh,<br /><strong>Principal / Supplier</strong></span>
                <strong className="block border-t border-slate-800 pt-1 text-slate-900">( {picName.split('(')[0].trim() || 'Key Account Manager'} )</strong>
                <span className="text-[10px] text-slate-500">{companyName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
