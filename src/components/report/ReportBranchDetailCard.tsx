import React from 'react';
import { Branch, FieldVisit, ActionPlanMilestone, RootCauseFactor } from '../../types';
import { formatDateIndo } from '../../utils/formatters';
import { ReportRcaAuditTable } from './ReportRcaAuditTable';
import { ReportActionPlanList } from './ReportActionPlanList';

interface ReportBranchDetailCardProps {
  branch: Branch;
  milestones: ActionPlanMilestone[];
  visits: FieldVisit[];
  calculateHealthScore?: (factors?: RootCauseFactor[]) => number;
}

export const ReportBranchDetailCard: React.FC<ReportBranchDetailCardProps> = ({
  branch,
  milestones,
  visits
}) => {
  const bMilestones = milestones.filter((m) => m.branchId === branch.id);
  const bVisits = visits.filter((v) => v.branchId === branch.id);
  const latestVisit = bVisits.length > 0 ? bVisits[0] : null;

  return (
    <div className="p-4 sm:p-5 border border-slate-300 rounded-xl space-y-3 bg-slate-50/60 print:bg-white print:p-3 print:space-y-2.5">
      {/* Header Bersih Rincian Hasil Audit Cabang */}
      <div className="border-b-2 border-slate-800 pb-1.5 flex items-center justify-between">
        <div className="font-bold text-sm text-slate-950 uppercase tracking-wide flex items-center gap-1.5">
          <span>📋 HASIL AUDIT CABANG :</span>
          <span className="text-emerald-800">[{branch.code}] {branch.name}</span>
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
