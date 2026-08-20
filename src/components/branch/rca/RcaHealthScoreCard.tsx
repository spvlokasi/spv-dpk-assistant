import React from 'react';
import { Activity } from 'lucide-react';
import { DpkStatus } from '../../../types';

interface RcaHealthScoreCardProps {
  avgScore: string;
  status: DpkStatus;
}

export const RcaHealthScoreCard: React.FC<RcaHealthScoreCardProps> = ({
  avgScore,
  status
}) => {
  const numScore = Number(avgScore);

  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-slate-400';
    if (score <= 2.5) return 'text-rose-400';
    if (score <= 3.8) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getStatusInfo = (st: DpkStatus) => {
    switch (st) {
      case 'kritis':
        return {
          icon: '🔴',
          title: 'Kritis (Intervensi Khusus)',
          desc: 'Nilai ≤ 2.5 • Dampingi 3x seminggu',
          style: 'bg-rose-950/40 border-rose-800/60 text-rose-300'
        };
      case 'dalam_progres':
        return {
          icon: '🟡',
          title: 'Dalam Progres (Pendampingan)',
          desc: 'Nilai 2.6 - 3.8 • Kawal target laba',
          style: 'bg-amber-950/40 border-amber-800/60 text-amber-300'
        };
      case 'siap_lulus':
        return {
          icon: '🟢',
          title: 'Siap Lulus (Hasil Membaik)',
          desc: 'Nilai > 3.8 • Siapkan sidang kelulusan',
          style: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
        };
      case 'lulus_dpk':
        return {
          icon: '🏆',
          title: 'Lulus DPK (Turnaround Berhasil)',
          desc: 'Toko mandiri dan stabil',
          style: 'bg-blue-950/40 border-blue-800/60 text-blue-300'
        };
      default:
        return {
          icon: '🏢',
          title: 'Existing (Pemantauan Rutin)',
          desc: 'Monitoring berkala SOP toko',
          style: 'bg-slate-800/60 border-slate-700 text-slate-300'
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const scoreStatusDesc = numScore === 0
    ? 'Belum ada penilaian faktor'
    : numScore <= 2.5
    ? '🔴 Toko Butuh Intervensi Darurat'
    : numScore <= 3.8
    ? '🟡 Pembenahan Bertahap'
    : '🟢 Kondisi Menuju Sehat';

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-lg">
      {/* 1 Single Horizontal Aligned Row: Total Nilai, Keterangan & Skor with Hover Tooltip */}
      <div
        className="flex items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-850/70 border border-slate-800/80 group cursor-help transition-colors hover:border-slate-700"
        title={`Rincian: Total Nilai ${avgScore} dari skala 5.0 (${scoreStatusDesc})`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Total Nilai
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 truncate" title={scoreStatusDesc}>
            {scoreStatusDesc}
          </div>
        </div>

        {/* Sleek Colored Score Badge on Right */}
        <div className="flex items-baseline gap-1 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700/80 flex-shrink-0 shadow-inner">
          <span className={`text-xl sm:text-2xl font-extrabold font-mono ${getScoreColor(numScore)}`}>
            {avgScore}
          </span>
          <span className="text-[11px] font-normal text-slate-500 font-mono">
            / 5.0
          </span>
        </div>
      </div>

      {/* Automatic Status Pengawasan with Hover Tooltip */}
      <div className="border-t border-slate-800 pt-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-slate-400">Status Pengawasan</span>
          <span className="text-[10px] text-slate-500 font-mono">Dihitung Otomatis</span>
        </div>

        <div
          className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-help ${statusInfo.style}`}
          title={`Status Pengawasan Otomatis: ${statusInfo.title} - ${statusInfo.desc}`}
        >
          <span className="text-base flex-shrink-0">{statusInfo.icon}</span>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate">{statusInfo.title}</div>
            <div className="text-[10px] opacity-80 mt-0.5">{statusInfo.desc}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
