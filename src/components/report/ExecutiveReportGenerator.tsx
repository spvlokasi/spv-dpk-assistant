import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  User, 
  Store, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Branch, FieldVisit, ActionPlanMilestone, DailyPerformance, BranchGraduation, EscalationTicket } from '../../types';
import { formatRupiah, formatShortRupiah, formatDateIndo, formatCategoryName } from '../../utils/formatters';
import { StorageService, SpvProfile } from '../../services/storage';

interface ExecutiveReportGeneratorProps {
  branches: Branch[];
  visits: FieldVisit[];
  milestones: ActionPlanMilestone[];
  performance: DailyPerformance[];
  graduations: BranchGraduation[];
  escalations: EscalationTicket[];
}

export const ExecutiveReportGenerator: React.FC<ExecutiveReportGeneratorProps> = ({
  branches,
  visits,
  milestones,
  performance,
  graduations,
  escalations
}) => {
  const [reportType, setReportType] = useState<'all' | 'single'>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');
  const [reportPeriod, setReportPeriod] = useState<string>('Mingguan (Periode Agustus 2026)');

  const profile = StorageService.getProfile();

  const handlePrint = () => {
    window.print();
  };

  const currentBranch = branches.find(b => b.id === selectedBranchId);
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
                <option key={b.id} value={b.id}>
                  [{b.code}] {b.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Cetak / Download PDF Laporan
          </button>
        </div>
      </div>

      {/* Printable Report Document Sheet */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-200 print:shadow-none print:border-none print:p-0 max-w-5xl mx-auto print:max-w-full">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight uppercase text-slate-900">
                LAPORAN PERKEMBANGAN PROGRAM PERBAIKAN KINERJA CABANG DPK
              </h1>
              <div className="text-sm font-semibold text-slate-600 mt-1">
                DEPARTEMEN BISNIS — SUPERVISOR DPK
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-500">
              <div>Tanggal: {formatDateIndo(new Date().toISOString().slice(0, 10))}</div>
              <div>Periode: {reportPeriod}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-xl text-xs border border-slate-200">
            <div>
              <span className="text-slate-500 block">Penyusun Laporan:</span>
              <strong className="text-slate-900">{profile.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Jabatan:</span>
              <strong className="text-slate-900">{profile.roleTitle}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Atasan Langsung:</span>
              <strong className="text-slate-900">{profile.businessManager}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Departemen:</span>
              <strong className="text-slate-900">{profile.department}</strong>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary Table */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-l-4 border-emerald-600 pl-2">
            I. RINGKASAN STATUS CABANG DALAM PENGAWASAN KHUSUS (DPK)
          </h2>
          <table className="w-full text-xs text-left border border-slate-300">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300">Kode & Cabang</th>
                <th className="p-2 border-r border-slate-300">Kepala Toko</th>
                <th className="p-2 border-r border-slate-300">Kategori DPK</th>
                <th className="p-2 border-r border-slate-300">Status</th>
                <th className="p-2 border-r border-slate-300">Target Sales</th>
                <th className="p-2 border-r border-slate-300">Sales Rata-rata</th>
                <th className="p-2">Capaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {targetBranches.map((branch) => {
                const bPerf = performance.filter(p => p.branchId === branch.id);
                const avgS = bPerf.length > 0 ? Math.round(bPerf.reduce((a, b) => a + b.salesActual, 0) / bPerf.length) : 0;
                const pct = branch.targetSalesPerDay > 0 ? Math.round((avgS / branch.targetSalesPerDay) * 100) : 0;
                return (
                  <tr key={branch.id}>
                    <td className="p-2 border-r border-slate-300 font-semibold font-mono">[{branch.code}] {branch.name}</td>
                    <td className="p-2 border-r border-slate-300">{branch.kepalaToko}</td>
                    <td className="p-2 border-r border-slate-300">{formatCategoryName(branch.category)}</td>
                    <td className="p-2 border-r border-slate-300 font-bold">
                      {branch.status === 'kritis' && '🔴 Kritis'}
                      {branch.status === 'dalam_progres' && '🟡 Dalam Progres'}
                      {branch.status === 'siap_lulus' && '🟢 Siap Lulus'}
                      {branch.status === 'lulus_dpk' && '🎓 Lulus DPK'}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-mono">{formatShortRupiah(branch.targetSalesPerDay)}</td>
                    <td className="p-2 border-r border-slate-300 font-mono font-bold text-slate-900">{formatShortRupiah(avgS)}</td>
                    <td className="p-2 font-bold font-mono">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 2: Detailed Branch Progress & Action Plan */}
        <div className="space-y-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-l-4 border-blue-600 pl-2">
            II. DETAIL EVALUASI PROGRAM PERBAIKAN & DIAGNOSA
          </h2>

          {targetBranches.map((branch) => {
            const branchMilestones = milestones.filter(m => m.branchId === branch.id);
            const branchVisits = visits.filter(v => v.branchId === branch.id);
            const latestVisit = branchVisits[0];
            const branchGrad = graduations.find(g => g.branchId === branch.id);

            return (
              <div key={branch.id} className="p-4 border border-slate-300 rounded-xl bg-slate-50/50 print-break-inside text-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <div className="font-bold text-sm text-slate-900">
                    {branch.name} ({branch.code})
                  </div>
                  <span className="font-semibold text-slate-600">
                    SPV Area: {branch.spvArea} | KTB: {branch.kepalaToko}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <strong className="text-slate-800">Diagnosa Akar Masalah:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{branch.diagnosisSummary}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800">Strategi Turnaround yang Dijalankan:</strong>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{branch.recommendedStrategy}</p>
                  </div>
                </div>

                {/* Progress Milestones */}
                <div>
                  <strong className="text-slate-800">Capaian Action Plan Mingguan:</strong>
                  <ul className="list-disc list-inside text-slate-600 mt-1 space-y-0.5">
                    {branchMilestones.map(m => (
                      <li key={m.id}>
                        <span className="font-semibold">Minggu ke-{m.weekNumber} ({m.title}):</span> {m.targetMetric} — {m.tasks.filter(t => t.completed).length}/{m.tasks.length} Tugas Selesai
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Latest Visit Note */}
                {latestVisit && (
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-800">Kunjungan Terakhir ({formatDateIndo(latestVisit.date)}):</span>
                    <p className="text-slate-600 mt-0.5">"{latestVisit.summaryConclusion}"</p>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                      Komitmen KTB: {latestVisit.katokCommitment}
                    </div>
                  </div>
                )}

                {/* Best Practice Note if any */}
                {branchGrad?.bestPracticeLearnings && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900">
                    <strong>Formula Best Practice Terbukti:</strong> {branchGrad.bestPracticeLearnings}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section 3: Escalations & Management Support Required */}
        <div className="mb-10 print-break-inside">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-l-4 border-rose-600 pl-2">
            III. PERMOHONAN KEPUTUSAN & ESKALASI KE MANAJER BISNIS
          </h2>
          <div className="space-y-2.5">
            {escalations.map((esc) => (
              <div key={esc.id} className="p-3 border border-slate-300 rounded-lg bg-slate-50 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900">[{esc.branchName}] {esc.title}</span>
                  <span className="font-bold text-rose-700 uppercase">{esc.urgency}</span>
                </div>
                <p className="text-slate-600">{esc.description}</p>
                <div className="mt-1 text-slate-800">
                  <strong>Usulan SPV DPK:</strong> {esc.proposedSolution}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-300 text-center text-xs print-break-inside">
          <div>
            <div className="text-slate-500 mb-16">Disusun Oleh,</div>
            <div className="font-bold underline text-slate-900">{profile.name}</div>
            <div className="text-slate-500">{profile.roleTitle}</div>
          </div>

          <div>
            <div className="text-slate-500 mb-16">Mengetahui & Menyetujui,</div>
            <div className="font-bold underline text-slate-900">{profile.businessManager}</div>
            <div className="text-slate-500">Manajer Bisnis</div>
          </div>
        </div>
      </div>
    </div>
  );
};
