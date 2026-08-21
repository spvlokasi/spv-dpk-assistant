import React from 'react';
import { Branch, FieldVisit, ActionPlanMilestone, RootCauseFactor } from '../../types';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

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
    <div className="p-5 border border-slate-300 rounded-xl space-y-4 bg-slate-50/60 break-inside-avoid">
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
          <div className="text-[11px] font-bold text-slate-600 mt-1">
            Skor Kesehatan: <strong className="text-slate-900 font-mono">{healthScore} / 5.0</strong>
          </div>
        </div>
      </div>

      {/* Financial Targets Bar */}
      <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
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

      {/* TABEL DETAIL DIAGNOSA RCA (Skala 1 - 5) */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
          📋 Hasil Audit Rincian Faktor Diagnosa RCA:
        </span>

        {branch.rootCauses && branch.rootCauses.length > 0 ? (
          <table className="w-full text-xs text-left border border-slate-300 bg-white">
            <thead className="bg-slate-100 font-bold text-slate-700 text-[10px] border-b border-slate-300 uppercase">
              <tr>
                <th className="p-1.5 border-r border-slate-300 w-1/4">Kelompok Faktor</th>
                <th className="p-1.5 border-r border-slate-300">Faktor Evaluasi</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-24">Skor (1-5)</th>
                <th className="p-1.5 text-center w-28">Kondisi / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {branch.rootCauses.map((factor, idx) => {
                const isCritical = factor.score <= 2;
                const isModerate = factor.score === 3;
                return (
                  <tr key={factor.id || idx} className={isCritical ? 'bg-rose-50/40' : ''}>
                    <td className="p-1.5 border-r border-slate-300 font-semibold text-slate-600 capitalize">
                      {factor.category === 'internal' ? 'Internal Operasional' : 'Eksternal / Pasar'}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 text-slate-800 font-medium">
                      {factor.title}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 text-center font-mono font-bold">
                      {factor.score} / 5
                    </td>
                    <td className="p-1.5 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          isCritical
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : isModerate
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {isCritical ? '⚠️ KRITIS / BOCOR' : isModerate ? '⚡ SEDANG' : '✅ BAIK / STABIL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-xs text-slate-500 italic bg-white p-2 border border-slate-200 rounded">
            Belum ada faktor diagnosa detail yang diaudit untuk cabang ini.
          </p>
        )}
      </div>

      {/* Summary & Strategy Narration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div>
          <strong className="text-slate-900 block mb-1">Ringkasan Diagnosa Permasalahan:</strong>
          <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-line">
            {branch.diagnosisSummary || 'Belum ada ringkasan diagnosa.'}
          </p>
        </div>

        <div>
          <strong className="text-slate-900 block mb-1">Rekomendasi Strategi Turnaround (180 Hari):</strong>
          <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-line">
            {branch.recommendedStrategy || 'Belum ada catatan strategi khusus.'}
          </p>
        </div>
      </div>

      {/* Program Aksi Perbaikan Tasks Breakdown */}
      {bMilestones.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-bold text-slate-900 block uppercase tracking-wider">
            🎯 Rencana Program Aksi & Progres Tugas Lapangan:
          </span>
          <div className="space-y-2">
            {bMilestones.map((ms) => {
              const completed = ms.tasks.filter((t) => t.completed).length;
              const total = ms.tasks.length;
              return (
                <div
                  key={ms.id}
                  className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900">{ms.title}</strong>
                    <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Progres: {completed}/{total} Tugas Selesai
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 italic">Target: {ms.targetMetric}</div>
                  <ul className="divide-y divide-slate-100 text-[11px]">
                    {ms.tasks.map((task) => (
                      <li key={task.id} className="py-1 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={task.completed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                            {task.completed ? '☑' : '☐'}
                          </span>
                          <span
                            className={
                              task.completed ? 'line-through text-slate-500' : 'text-slate-800 font-medium'
                            }
                          >
                            {task.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500 flex-shrink-0">
                          PIC: {task.assignedTo} ({task.frequency})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Latest Coaching / Visit Note */}
      {latestVisit && (
        <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1">
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
