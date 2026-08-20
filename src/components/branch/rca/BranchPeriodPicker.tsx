import React from 'react';
import { Calendar, History } from 'lucide-react';
import { DiagnosisLog } from '../../../types';

interface BranchPeriodPickerProps {
  startDate: string;
  endDate: string;
  diagnosisLogs: DiagnosisLog[];
  onChangeStartDate: (val: string) => void;
  onChangeEndDate: (val: string) => void;
  onResetDates: () => void;
  onSelectHistoryLog: (logId: string) => void;
}

export const BranchPeriodPicker: React.FC<BranchPeriodPickerProps> = ({
  startDate,
  endDate,
  diagnosisLogs,
  onChangeStartDate,
  onChangeEndDate,
  onResetDates,
  onSelectHistoryLog
}) => {
  return (
    <div className="space-y-3 bg-slate-850/50 p-3.5 rounded-xl border border-slate-800/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-200">Rentang Periode Diagnosa Cabang</span>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {startDate && endDate
                ? `Periode audit: ${new Date(startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} s/d ${new Date(endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : 'Pilih tanggal mulai dan selesai periode diagnosa'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap text-xs">
          <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => onChangeStartDate(e.target.value)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none text-xs cursor-pointer"
            />
          </div>
          <span className="text-slate-500 font-bold text-xs">s/d</span>
          <div className="flex items-center bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <input
              type="date"
              min={startDate || undefined}
              value={endDate || ''}
              onChange={(e) => onChangeEndDate(e.target.value)}
              className="bg-transparent text-emerald-400 font-semibold focus:outline-none text-xs cursor-pointer"
            />
          </div>
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={onResetDates}
              className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 text-[11px] transition-colors border border-slate-700"
              title="Reset Tanggal"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Riwayat Diagnosa Berkala / Arsip Log */}
      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
          <History className="w-3.5 h-3.5 text-blue-400" />
          <span>Arsip Riwayat: <strong className={diagnosisLogs.length > 0 ? "text-blue-400 font-bold" : "text-slate-500"}>{diagnosisLogs.length} Periode Tersimpan</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] text-slate-500">Pilih riwayat:</span>
          <select
            onChange={(e) => onSelectHistoryLog(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-blue-300 rounded-lg px-2.5 py-1 text-[11px] font-medium focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            defaultValue=""
            disabled={diagnosisLogs.length === 0}
          >
            <option value="" disabled>
              {diagnosisLogs.length > 0 ? 'Pilih Arsip Periode Diagnosa...' : 'Belum Ada Arsip (Klik Simpan Diagnosa)'}
            </option>
            {diagnosisLogs.map((log) => (
              <option key={log.id} value={log.id}>
                {log.periodStartDate ? new Date(log.periodStartDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'} s/d {log.periodEndDate ? new Date(log.periodEndDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'} ({log.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
