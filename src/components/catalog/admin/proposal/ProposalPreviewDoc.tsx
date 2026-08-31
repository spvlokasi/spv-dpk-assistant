import React from 'react';
import { Branch } from '../../../../types';
import { formatRupiah } from '../../../../utils/formatters';
import { ProposalDocHeader } from './ProposalDocHeader';
import { ProposalDocBudgetTable } from './ProposalDocBudgetTable';

interface ProposalPreviewDocProps {
  branch: Branch;
  proposalNo: string;
  programTitle: string;
  companyName: string;
  brandName: string;
  picName: string;
  focusProducts: string;
  backgroundStory: string;
  discountPerUnit: number;
  minSpend: number;
  voucherQuota: number;
  targetSalesUnits: number;
  targetOmzet: number;
  totalSponsorBudget: number;
  supplierContribution: number;
  spvSignName: string;
  ktbSignName: string;
}

export const ProposalPreviewDoc: React.FC<ProposalPreviewDocProps> = ({
  branch, proposalNo, programTitle, companyName, brandName, picName, focusProducts,
  backgroundStory, discountPerUnit, minSpend, voucherQuota, targetSalesUnits, targetOmzet,
  totalSponsorBudget, supplierContribution, spvSignName, ktbSignName
}) => {
  return (
    <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 space-y-6 shadow-2xl border-4 border-slate-200 font-serif text-xs leading-relaxed max-w-4xl mx-auto printable-proposal">
      <ProposalDocHeader branch={branch} proposalNo={proposalNo} programTitle={programTitle} companyName={companyName} brandName={brandName} />

      <div className="space-y-1.5">
        <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide border-l-4 border-emerald-600 pl-2">
          1. Latar Belakang & Potensi Pasar
        </h4>
        <p className="text-justify text-slate-700">
          Gerai <strong>{branch.name}</strong> merupakan salah satu sentra perbelanjaan masyarakat yang melayani kebutuhan sembako dan kebutuhan harian warga sekitar dengan rata-rata kunjungan 150–250 transaksi/hari serta basis pelanggan digital WhatsApp aktif mencapai lebih dari 1.500 kepala keluarga. {backgroundStory} Melalui sistem katalog digital dan layanan pesan antar sampai rumah (COD), TokoBasmalah siap mendorong peningkatan volume penjualan produk unggulan <strong>{brandName}</strong> secara terukur dan tepat sasaran.
        </p>
      </div>

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
          <li>Penempatan produk di <strong>Banner Utama Katalog Online</strong> (belanja.dpk.my.id).</li>
          <li>Pemberian <strong>Kupon Voucher Diskon Eksklusif</strong> dengan masa reservasi 24 jam untuk menciptakan urgensi belanja.</li>
          <li>Sosialisasi masif via <strong>Broadcast WhatsApp Kasir & Status Toko</strong> ke seluruh pelanggan sekitar gerai.</li>
        </ul>
      </div>

      <ProposalDocBudgetTable brandName={brandName} voucherQuota={voucherQuota} discountPerUnit={discountPerUnit} totalSponsorBudget={totalSponsorBudget} companyName={companyName} supplierContribution={supplierContribution} targetOmzet={targetOmzet} targetSalesUnits={targetSalesUnits} spvSignName={spvSignName} ktbSignName={ktbSignName} picName={picName} />
    </div>
  );
};
