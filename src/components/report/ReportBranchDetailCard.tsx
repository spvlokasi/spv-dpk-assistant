import React from 'react';
import { Branch, FieldVisit, ActionPlanMilestone, RootCauseFactor } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';
import { ReportRcaAuditTable } from './ReportRcaAuditTable';
import { ReportActionPlanList } from './ReportActionPlanList';

interface ReportBranchDetailCardProps {
  branch: Branch;
  milestones: ActionPlanMilestone[];
  visits: FieldVisit[];
  calculateHealthScore: (factors?: RootCauseFactor[]) => number;
}

export const ReportBranchDetailCard: React.FC<ReportBranchDetailCardProps> = ({
  branch,
  milestones,
  visits,
  calculateHealthScore
}) => {
  const bMilestones = milestones.filter((m) => m.branchId === branch.id);
  const bVisits = visits.filter((v) => v.branchId === branch.id);
  const latestVisit = bVisits.length > 0 ? bVisits[0] : null;
  const healthScore = calculateHealthScore(branch.rootCauses);

  return (
    <div className="p-4 sm:p-5 border border-slate-300 rounded-xl space-y-3.5 bg-slate-50/60 print:bg-white print:p-3 print:space-y-2.5">
      {/* Branch Banner */}
      <div className="flex justify-between items-start border-b border-slate-300 pb-2">
        <div>
          <div className="font-bold text-base text-slate-950">
            [{branch.code}] {branch.name}
          </div>
          <span className="font-semibold text-slate-600 text-xs">
            SPV Area: <strong className="text-slate-800">{branch.spvArea || '-'}</strong> | KTB:{' '}
            <strong className="text-slate-800">{branch.kepalaToko || '-'}</strong>
          </span>
        </div>
        <div className="text-right">
          <div className="font-bold text-xs px-2 py-0.5 bg-slate-200 text-slate-800 rounded inline-block">
            STATUS: {branch.status.toUpperCase()}
          </div>
          <div className="text-[11px] font-bold text-slate-600 mt-0.5">
            Skor Kesehatan: <strong className="text-slate-900 font-mono">{healthScore} / 5.0</strong>
          </div>
        </div>
      </div>

      {/* Financial Targets Bar */}
      <div className="grid grid-cols-3 gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs print:p-1.5">
        <div>
          <span className="text-slate-500 text-[10px] block">Target Laba Harian:</span>
          <strong className="font-mono text-emerald-800 font-bold">
            {formatRupiah(branch.targetSalesPerDay)}
          </strong>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">Target Margin:</span>
          <strong className="font-mono text-blue-800 font-bold">{branch.targetMarginPct}%</strong>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">Batas Biaya Maksimal:</span>
          <strong className="font-mono text-rose-800 font-bold">
            {formatRupiah(branch.targetMaxOpexPerMonth)}/bln
          </strong>
        </div>
      </div>

      {/* Rincian Faktor Diagnosa RCA */}
      <ReportRcaAuditTable rootCauses={branch.rootCauses} />

      {/* Summary & Strategy Narration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs print:gap-2">
        <div className="break-inside-avoid">
          <strong className="text-slate-900 block mb-1">Ringkasan Diagnosa Permasalahan:</strong>
          <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-line print:p-2 text-[11px]">
            {branch.diagnosisSummary || 'Belum ada ringkasan diagnosa.'}
          </p>
        </div>

        <div className="break-inside-avoid">
          <strong className="text-slate-900 block mb-1">Rekomendasi Strategi Turnaround (180 Hari):</strong>
          <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-line print:p-2 text-[11px]">
            {branch.recommendedStrategy || 'Belum ada catatan strategi khusus.'}
          </p>
        </div>
      </div>

      {/* Program Aksi Perbaikan Tasks */}
      <ReportActionPlanList milestones={bMilestones} />

      {/* Latest Coaching / Visit Note */}
      {latestVisit && (
        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1 break-inside-avoid print:p-2">
          <span className="font-bold text-slate-800">
            Log Kunjungan Terakhir ({formatDateIndo(latestVisit.date)}):
          </span>
          <p className="text-slate-600 font-medium">Topik Coaching: "{latestVisit.katokCoachingTopic}"</p>
          <div className="text-emerald-800 font-semibold">
            Komitmen KTB: {latestVisit.katokCommitment}
          </div>
        </div>
      )}
    </div>
  );
};
