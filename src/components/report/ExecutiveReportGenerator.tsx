import React, { useState } from 'react';
import { 
  FileText, 
  Printer
} from 'lucide-react';
import { Branch, FieldVisit, ActionPlanMilestone, DailyPerformance, BranchGraduation, EscalationTicket } from '../../types';
import { UserAccount } from '../../types/auth';
import { formatRupiah, formatShortRupiah, formatDateIndo, formatCategoryName } from '../../utils/formatters';
import { StorageService } from '../../services/storage';

interface ExecutiveReportGeneratorProps {
  branches: Branch[];
  visits: FieldVisit[];
  milestones: ActionPlanMilestone[];
  performance: DailyPerformance[];
  graduations: BranchGraduation[];
  escalations: EscalationTicket[];
  currentUser?: UserAccount;
}

export const ExecutiveReportGenerator: React.FC<ExecutiveReportGeneratorProps> = ({
  branches,
  visits,
  milestones,
  performance,
  graduations,
  escalations,
  currentUser
}) => {
  const [reportType, setReportType] = useState<'all' | 'single'>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');
  const [reportPeriod, setReportPeriod] = useState<string>('Mingguan (Periode Agustus 2026)');

  const fallbackProfile = StorageService.getProfile();
  const authorName = currentUser?.fullName || fallbackProfile.name;
  const authorRole = currentUser?.roleTitle || fallbackProfile.roleTitle;
  const authorDept = currentUser?.department || fallbackProfile.department;
  const authorManager = currentUser?.businessManager || fallbackProfile.businessManager;

  const handlePrint = () => {
    window.print();
  };

  const targetBranches = reportType === 'all' ? branches : branches.filter(b => b.id === selectedBranchId);

  return (
    <div className="space-y-6">
      {/* Action & Filter Bar (Hidden when printing) */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 no-print shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-emerald-400" />
            Laporan Eksekutif Manajer Bisnis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate rekapitulasi progres turnaround seluruh cabang DPK siap serah / cetak ke Manajer Bisnis.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
          >
            <option value="all">Rekap Seluruh Cabang DPK</option>
            <option value="single">Laporan Khusus 1 Cabang</option>
          </select>

          {reportType === 'single' && (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          )}

          <input
            type="text"
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            placeholder="Periode Laporan..."
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none"
          />

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Cetak / Ekspor PDF
          </button>
        </div>
      </div>

      {/* Printable Paper Document (A4 Styling) */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-5xl mx-auto border border-slate-200 font-sans print:p-0 print:border-none print:shadow-none">
        {/* Header Laporan */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase">
                Laporan Perkembangan Program Perbaikan Kinerja Cabang DPK
              </h1>
              <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wider">
                {authorDept} — {authorRole}
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div>Tanggal: {formatDateIndo(new Date().toISOString())}</div>
              <div className="font-semibold text-slate-800">Periode: {reportPeriod}</div>
            </div>
          </div>

          {/* Meta Info Box */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Penyusun Laporan:</span>
              <strong className="text-slate-800 font-bold">{authorName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Jabatan:</span>
              <strong className="text-slate-800 font-bold">{authorRole}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Atasan Langsung:</span>
              <strong className="text-slate-800 font-bold">{authorManager}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Departemen:</span>
              <strong className="text-slate-800 font-bold">{authorDept}</strong>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary Table */}
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-950 mb-2 border-l-4 border-emerald-600 pl-2">
              I. Ringkasan Status Cabang Dalam Pengawasan Khusus (DPK)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-300">
                <thead className="bg-slate-100 font-bold text-slate-800 uppercase text-[10px] border-b border-slate-300">
                  <tr>
                    <th className="p-2 border-r border-slate-300">Kode</th>
                    <th className="p-2 border-r border-slate-300">Nama Cabang</th>
                    <th className="p-2 border-r border-slate-300">KTB</th>
                    <th className="p-2 border-r border-slate-300">Kategori Masalah</th>
                    <th className="p-2 border-r border-slate-300">Status</th>
                    <th className="p-2 border-r border-slate-300 text-right">Target Sales/Hari</th>
                    <th className="p-2 border-r border-slate-300 text-right">Sales Terakhir</th>
                    <th className="p-2 text-center">Pencapaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {targetBranches.map((b) => {
                    const bPerf = performance.filter(p => p.branchId === b.id);
                    const latest = bPerf.length > 0 ? bPerf[bPerf.length - 1] : null;
                    const hitPct = latest ? Math.round((latest.salesActual / b.targetSalesPerDay) * 100) : 0;
                    return (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-bold border-r border-slate-300">{b.code}</td>
                        <td className="p-2 font-semibold border-r border-slate-300">{b.name}</td>
                        <td className="p-2 border-r border-slate-300">{b.kepalaToko}</td>
                        <td className="p-2 border-r border-slate-300">{formatCategoryName(b.category)}</td>
                        <td className="p-2 border-r border-slate-300 font-bold uppercase text-[10px]">
                          {b.status.replace('_', ' ')}
                        </td>
                        <td className="p-2 text-right border-r border-slate-300 font-mono">{formatRupiah(b.targetSalesPerDay)}</td>
                        <td className="p-2 text-right border-r border-slate-300 font-mono">{latest ? formatRupiah(latest.salesActual) : '-'}</td>
                        <td className="p-2 text-center font-bold font-mono">
                          <span className={`px-1.5 py-0.5 rounded ${hitPct >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {hitPct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Detailed Store Breakdown */}
          <div>
            <h3 className="text-sm font-black uppercase text-slate-950 mb-3 border-l-4 border-emerald-600 pl-2">
              II. Diagnosa Akar Masalah & Evaluasi Progres Per Cabang
            </h3>
            
            <div className="space-y-4">
              {targetBranches.map((branch) => {
                const bMilestones = milestones.filter(m => m.branchId === branch.id);
                const bVisits = visits.filter(v => v.branchId === branch.id);
                const latestVisit = bVisits.length > 0 ? bVisits[0] : null;
                const bGrad = graduations.find(g => g.branchId === branch.id);

                return (
                  <div key={branch.id} className="p-4 border border-slate-300 rounded-xl space-y-3 bg-slate-50/50">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                      <div>
                        <div className="font-bold text-sm text-slate-900">
                          {branch.name} ({branch.code})
                        </div>
                        <span className="font-semibold text-slate-600 text-xs">
                          SPV Area: {branch.spvArea} | KTB: {branch.kepalaToko}
                        </span>
                      </div>
                      <span className="font-bold text-xs px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                        STATUS: {branch.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <strong className="text-slate-800 block mb-1">Diagnosa Akar Masalah Utama:</strong>
                        <p className="text-slate-700 bg-white p-2 rounded border border-slate-200 leading-relaxed">
                          {branch.diagnosisSummary || 'Belum ada ringkasan diagnosa.'}
                        </p>
                      </div>

                      <div>
                        <strong className="text-slate-800 block mb-1">Strategi Penyelamatan & Komitmen:</strong>
                        <p className="text-slate-700 bg-white p-2 rounded border border-slate-200 leading-relaxed">
                          {branch.recommendedStrategy || 'Belum ada catatan strategi khusus.'}
                        </p>
                      </div>
                    </div>

                    {/* Latest Coaching / Visit Note */}
                    {latestVisit && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-slate-800">Kunjungan Terakhir ({formatDateIndo(latestVisit.date)}):</span>
                        <p className="text-slate-600 mt-0.5 font-medium">Topik Coaching: "{latestVisit.katokCoachingTopic}"</p>
                        <div className="text-emerald-700 font-semibold mt-1">
                          Komitmen KTB: {latestVisit.katokCommitment}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Signature & Approval Block */}
          <div className="pt-8 mt-8 border-t border-slate-300">
            <div className="text-xs text-slate-600 text-right mb-6">
              Dicetak pada: {formatDateIndo(new Date().toISOString())}
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <div className="text-slate-500 mb-16">Disusun Oleh,</div>
                <div className="font-bold text-slate-900 underline">{authorName}</div>
                <div className="text-slate-600 text-[11px]">{authorRole}</div>
              </div>

              <div>
                <div className="text-slate-500 mb-16">Mengetahui (KTB Binaan),</div>
                <div className="font-bold text-slate-900 underline">
                  {targetBranches.length === 1 ? targetBranches[0].kepalaToko : '( Kepala Toko Terkait )'}
                </div>
                <div className="text-slate-600 text-[11px]">Kepala Toko Basmalah</div>
              </div>

              <div>
                <div className="text-slate-500 mb-16">Disetujui Oleh,</div>
                <div className="font-bold text-slate-900 underline">{authorManager}</div>
                <div className="text-slate-600 text-[11px]">Manajer Bisnis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
