import React from 'react';
import { DpkStatus } from '../../../types';

interface RcaHealthScoreCardProps {
  avgScore: string;
  status: DpkStatus;
  onChangeStatus: (status: DpkStatus) => void;
}

export const RcaHealthScoreCard: React.FC<RcaHealthScoreCardProps> = ({
  avgScore,
  status,
  onChangeStatus
}) => {
  const numScore = Number(avgScore);

  const getScoreColor = (score: number) => {
    if (score <= 2.5) return 'text-rose-400';
    if (score <= 3.8) return 'text-amber-400';
    return 'text-emerald-400';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Total Nilai
        </h4>
      </div>

      <div className="text-center py-2">
        <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${getScoreColor(numScore)}`}>
          {avgScore} <span className="text-xs sm:text-sm font-normal text-slate-500">/ 5.0</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {numScore <= 2.5
            ? '🔴 Toko Butuh Intervensi Darurat'
            : numScore <= 3.8
            ? '🟡 Pembenahan Bertahap'
            : '🟢 Kondisi Menuju Sehat'}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-3">
        <label className="text-[11px] font-medium text-slate-400 block mb-1">
          Status Pengawasan
        </label>
        <select
          value={status}
          onChange={(e) => onChangeStatus(e.target.value as DpkStatus)}
          className="w-full bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="kritis">🔴 Kritis (Belum Ada Perbaikan)</option>
          <option value="dalam_progres">🟡 Dalam Progres (Pendampingan)</option>
          <option value="siap_lulus">🟢 Siap Lulus (Hasil Membaik)</option>
          <option value="lulus_dpk">🏆 Lulus (Turnaround Berhasil)</option>
          <option value="existing">🔵 Existing (Pemantauan Rutin)</option>
        </select>
      </div>
    </div>
  );
};
