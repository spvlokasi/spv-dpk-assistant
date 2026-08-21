import React from 'react';
import { History } from 'lucide-react';
import { DiagnosisLog } from '../../../types';

interface BranchPeriodPickerProps {
  diagnosisLogs: DiagnosisLog[];
  onSelectHistoryLog: (logId: string) => void;
}

export const BranchPeriodPicker: React.FC<BranchPeriodPickerProps> = ({
  diagnosisLogs,
  onSelectHistoryLog
}) => {
  return (
    <div className="bg-slate-850/50 p-2.5 sm:p-3 rounded-xl border border-slate-800/80 shadow-sm flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
        <History className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        <span>Arsip Riwayat: <strong className={diagnosisLogs.length > 0 ? "text-blue-400 font-bold" : "text-slate-500"}>{diagnosisLogs.length} Periode Tersimpan</strong></span>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-[10px] text-slate-500 hidden sm:inline">Pilih riwayat:</span>
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
  );
};
