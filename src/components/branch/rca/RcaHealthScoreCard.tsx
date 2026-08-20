import React from 'react';
import { Sparkles } from 'lucide-react';
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

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-lg">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Skor Kesehatan Toko (RCA)
        </h4>
        <Sparkles className="w-4 h-4 text-emerald-400" />
      </div>

      <div className="text-center py-2">
        <div className="text-4xl font-extrabold text-white font-mono">
          {avgScore} <span className="text-sm font-normal text-slate-500">/ 5.0</span>
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
          Ubah Status Pengawasan
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
