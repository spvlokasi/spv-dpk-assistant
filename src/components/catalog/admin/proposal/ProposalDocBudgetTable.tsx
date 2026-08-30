import React from 'react';
import { formatRupiah } from '../../../../utils/formatters';

interface ProposalDocBudgetTableProps {
  brandName: string;
  voucherQuota: number;
  discountPerUnit: number;
  totalSponsorBudget: number;
  companyName: string;
  supplierContribution: number;
  targetOmzet: number;
  targetSalesUnits: number;
  spvSignName: string;
  ktbSignName: string;
  picName: string;
}

export const ProposalDocBudgetTable: React.FC<ProposalDocBudgetTableProps> = ({
  brandName, voucherQuota, discountPerUnit, totalSponsorBudget, companyName,
  supplierContribution, targetOmzet, targetSalesUnits, spvSignName, ktbSignName, picName
}) => {
  return (
    <>
      <div className="space-y-2">
        <h4 className="font-bold text-slate-900 font-sans text-xs uppercase tracking-wide border-l-4 border-emerald-600 pl-2">
          3. Rincian Anggaran Partisipasi & Proyeksi Penjualan
        </h4>
        <table className="w-full border-collapse border border-slate-300 text-[11px] font-sans">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th className="border border-slate-300 p-2 text-left">Komponen Program</th>
              <th className="border border-slate-300 p-2 text-center">Volume</th>
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
              <td className="border border-slate-300 p-2">Listing Digital & Promosi WA</td>
              <td className="border border-slate-300 p-2 text-center">1 Bulan</td>
              <td className="border border-slate-300 p-2 text-right">Gratis (Dukungan Toko)</td>
              <td className="border border-slate-300 p-2 text-right text-slate-500">Rp 0</td>
            </tr>
            <tr className="bg-emerald-50 font-bold text-emerald-950">
              <td className="border border-slate-300 p-2" colSpan={3}>Dukungan Diajukan ke Principal ({companyName}):</td>
              <td className="border border-slate-300 p-2 text-right text-xs">{formatRupiah(supplierContribution)}</td>
            </tr>
            <tr className="bg-slate-100 font-bold text-slate-900">
              <td className="border border-slate-300 p-2" colSpan={3}>Target Estimasi Omzet Penjualan Produk:</td>
              <td className="border border-slate-300 p-2 text-right text-xs text-blue-900">{formatRupiah(targetOmzet)} ({targetSalesUnits} Unit)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="pt-6 border-t border-slate-300 font-sans">
        <p className="text-center text-[11px] text-slate-600 mb-6">
          Demikian proposal ini kami sampaikan sebagai bentuk komitmen sinergi berkelanjutan.
        </p>
        <div className="grid grid-cols-3 text-center gap-4 text-[11px]">
          <div>
            <span className="text-slate-500 block mb-12">Diajukan oleh,<br /><strong>Supervisor DPK Basmalah</strong></span>
            <strong className="block border-t border-slate-800 pt-1 text-slate-900">( {spvSignName} )</strong>
            <span className="text-[10px] text-slate-500">Supervisor Pengawasan</span>
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
    </>
  );
};
