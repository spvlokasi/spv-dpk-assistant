import React, { useState, useMemo } from 'react';
import { Branch, FieldVisit, ActionPlanMilestone, DailyPerformance, BranchGraduation, EscalationTicket, RootCauseFactor } from '../../types';
import { UserAccount } from '../../types/auth';
import { formatDateIndo, formatMonthYearIndo } from '../../utils/formatters';
import { StorageService } from '../../services/storage';
import { ReportHeaderBar } from './ReportHeaderBar';
import { ReportSummaryTable } from './ReportSummaryTable';
import { ReportBranchDetailCard } from './ReportBranchDetailCard';
import { ReportEscalationSection } from './ReportEscalationSection';
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
  branches, visits, milestones, performance, escalations, currentUser
}) => {
  const currentYm = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentYm);
  const [reportType, setReportType] = useState<'all' | 'single'>('all');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    set.add(currentYm);
    performance.forEach((p) => { if (p.date && p.date.length >= 7) set.add(p.date.slice(0, 7)); });
    for (let i = 1; i <= 5; i++) {
      const d = new Date(); d.setMonth(d.getMonth() - i); set.add(d.toISOString().slice(0, 7));
    }
    return Array.from(set).sort().reverse();
  }, [performance, currentYm]);

  const fallback = StorageService.getProfile();
  const authorName = currentUser?.fullName || fallback.name;
  const authorRole = currentUser?.roleTitle || fallback.roleTitle;
  const authorManager = currentUser?.businessManager || fallback.businessManager;
  const targetBranches = reportType === 'all' ? branches : branches.filter((b) => b.id === selectedBranchId);

  const calculateHealthScore = (factors?: RootCauseFactor[]) => {
    if (!factors || factors.length === 0) return 0;
    return Number((factors.reduce((acc, curr) => acc + curr.score, 0) / factors.length).toFixed(1));
  };

  return (
    <div className="space-y-6">
      <ReportHeaderBar reportType={reportType} onReportTypeChange={setReportType} selectedBranchId={selectedBranchId} onSelectBranch={setSelectedBranchId} selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} availableMonths={availableMonths} branches={branches} onPrint={() => window.print()} />
      <div className="relative bg-white text-slate-900 pt-28 sm:pt-36 pb-24 sm:pb-32 px-6 sm:px-12 rounded-2xl shadow-2xl max-w-5xl mx-auto border border-slate-200 font-sans print:p-0 print:pt-24 print:pb-20 print:px-6 print:border-none print:shadow-none space-y-5 print:space-y-3.5 report-official-letterhead" style={{ backgroundImage: "url('/templates/kop_sidogiri.png')", backgroundSize: '100% auto', backgroundPosition: 'top center', backgroundRepeat: 'no-repeat' }}>
        <div className="border-b-2 border-slate-900 pb-2.5 flex justify-between items-end">
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-950 uppercase print:text-base">Laporan Supervisi Cabang DPK</h1>
            <p className="text-xs font-bold text-emerald-800 mt-0.5 uppercase tracking-wider print:text-[10px]">PT Sidogiri Mitra Utama — {authorRole}</p>
          </div>
          <div className="text-right text-xs text-slate-600 print:text-[10px]">
            <div>Tanggal: {formatDateIndo(new Date().toISOString())}</div>
            <div className="font-semibold text-slate-900">Periode: {formatMonthYearIndo(selectedMonth)}</div>
          </div>
        </div>
        <ReportSummaryTable branches={targetBranches} performance={performance} selectedMonth={selectedMonth} calculateHealthScore={calculateHealthScore} />
        <div className="space-y-2">
          <h3 className="text-sm font-black uppercase text-slate-950 mb-2 border-l-4 border-emerald-600 pl-2">II. Rincian Audit, Diagnosa, Akar Masalah & Aksi Perbaikan</h3>
          <div className="space-y-4 print:space-y-3">
            {targetBranches.map((b) => (<ReportBranchDetailCard key={b.id} branch={b} milestones={milestones} visits={visits} calculateHealthScore={calculateHealthScore} />))}
          </div>
        </div>
        <ReportEscalationSection escalations={escalations} targetBranches={targetBranches} />
        <ReportSignatures authorName={authorName} authorRole={authorRole} authorManager={authorManager} targetBranchCount={targetBranches.length} singleBranchKtb={targetBranches.length === 1 ? targetBranches[0].kepalaToko : undefined} singleBranchSpvArea={targetBranches.length === 1 ? targetBranches[0].spvArea : undefined} />
      </div>
    </div>
  );
};
