import React, { useState } from 'react';
import { Branch, FieldVisit, ActionPlanMilestone, DailyPerformance, BranchGraduation, EscalationTicket, RootCauseFactor } from '../../types';
import { UserAccount } from '../../types/auth';
import { formatDateIndo } from '../../utils/formatters';
import { StorageService } from '../../services/storage';
import { ReportHeaderBar } from './ReportHeaderBar';
import { ReportSummaryTable } from './ReportSummaryTable';
import { ReportBranchDetailCard } from './ReportBranchDetailCard';
import { ReportSignatures } from './ReportSignatures';

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
  currentUser
}) => {
  const [reportType, setReportType] = useState<'all' | 'single'>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');
  const [reportPeriod, setReportPeriod] = useState<string>('Mingguan (Periode Agustus 2026)');

  const fallback = StorageService.getProfile();
  const authorName = currentUser?.fullName || fallback.name;
  const authorRole = currentUser?.roleTitle || fallback.roleTitle;
  const authorDept = currentUser?.department || fallback.department;
  const authorManager = currentUser?.businessManager || fallback.businessManager;

  const targetBranches = reportType === 'all' ? branches : branches.filter((b) => b.id === selectedBranchId);

  const calculateHealthScore = (factors?: RootCauseFactor[]) => {
    if (!factors || factors.length === 0) return 0;
    return Number((factors.reduce((acc, curr) => acc + curr.score, 0) / factors.length).toFixed(1));
  };

  return (
    <div className="space-y-6">
      <ReportHeaderBar reportType={reportType} onReportTypeChange={setReportType} selectedBranchId={selectedBranchId} onSelectBranch={setSelectedBranchId} reportPeriod={reportPeriod} onPeriodChange={setReportPeriod} branches={branches} onPrint={() => window.print()} />

      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl max-w-5xl mx-auto border border-slate-200 font-sans print:p-0 print:border-none print:shadow-none space-y-5 print:space-y-3">
        <div className="border-b-2 border-slate-900 pb-3 print:pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-black text-emerald-800 tracking-widest uppercase mb-0.5">PT. SIDOGIRI MITRA UTAMA — TOKOBASMALAH</div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 uppercase print:text-lg">Laporan Transformasi 180 Hari Penanganan Cabang DPK</h1>
              <p className="text-xs font-bold text-slate-700 mt-0.5 uppercase tracking-wider print:text-[11px]">Departemen Bisnis & Marketing — {authorRole}</p>
            </div>
            <div className="text-right text-xs text-slate-600 print:text-[11px]">
              <div>Tanggal: {formatDateIndo(new Date().toISOString())}</div>
              <div className="font-semibold text-slate-800">Periode: {reportPeriod}</div>
            </div>
          </div>

          <div className="mt-3 print:mt-2 p-2.5 print:p-2 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs print:text-[11px]">
            <div><span className="text-slate-500 block text-[10px]">Penyusun:</span><strong className="text-slate-800 font-bold">{authorName}</strong></div>
            <div><span className="text-slate-500 block text-[10px]">Jabatan:</span><strong className="text-slate-800 font-bold">{authorRole}</strong></div>
            <div><span className="text-slate-500 block text-[10px]">Atasan:</span><strong className="text-slate-800 font-bold">{authorManager}</strong></div>
            <div><span className="text-slate-500 block text-[10px]">Departemen:</span><strong className="text-slate-800 font-bold">{authorDept}</strong></div>
          </div>
        </div>

        <ReportSummaryTable branches={targetBranches} performance={performance} calculateHealthScore={calculateHealthScore} />

        <div className="space-y-2">
          <h3 className="text-sm font-black uppercase text-slate-950 mb-2 border-l-4 border-emerald-600 pl-2">II. Rincian Audit Diagnosa Akar Masalah & Aksi Turnaround</h3>
          <div className="space-y-4 print:space-y-3">
            {targetBranches.map((b) => (
              <ReportBranchDetailCard key={b.id} branch={b} milestones={milestones} visits={visits} calculateHealthScore={calculateHealthScore} />
            ))}
          </div>
        </div>

        <ReportSignatures authorName={authorName} authorRole={authorRole} authorManager={authorManager} targetBranchCount={targetBranches.length} singleBranchKtb={targetBranches.length === 1 ? targetBranches[0].kepalaToko : undefined} />
      </div>
    </div>
  );
};
