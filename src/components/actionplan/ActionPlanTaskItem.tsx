import React from 'react';
import { CheckSquare, Square, Trash2, ShieldCheck, User } from 'lucide-react';
import { ActionPlanTask } from '../../types';

interface ActionPlanTaskItemProps {
  task: ActionPlanTask;
  onToggleComplete: () => void;
  onToggleVerified: () => void;
  onDelete: () => void;
  onUpdateTitle: (title: string) => void;
  onUpdateAssigned: (role: string) => void;
  onUpdateFrequency: (freq: 'harian' | 'mingguan' | 'bulanan' | 'sekali') => void;
}

export const ActionPlanTaskItem: React.FC<ActionPlanTaskItemProps> = ({
  task,
  onToggleComplete,
  onToggleVerified,
  onDelete,
  onUpdateTitle,
  onUpdateAssigned,
  onUpdateFrequency
}) => {
  return (
    <div
      className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
        task.completed
          ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
          : 'bg-slate-850/80 border-slate-800 hover:border-slate-700'
      }`}
    >
      <button
        type="button"
        onClick={onToggleComplete}
        className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
      >
        {task.completed ? (
          <CheckSquare className="w-4 h-4 text-emerald-400" />
        ) : (
          <Square className="w-4 h-4" />
        )}
      </button>

      <div className="flex-1 min-w-0 space-y-1.5">
        <input
          type="text"
          value={task.title}
          onChange={(e) => onUpdateTitle(e.target.value)}
          className={`w-full bg-transparent text-xs text-slate-200 focus:outline-none focus:bg-slate-800/80 rounded px-1.5 py-0.5 ${
            task.completed ? 'line-through text-slate-500' : 'font-medium'
          }`}
        />

        <div className="flex items-center gap-2 flex-wrap text-[10px]">
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <User className="w-3 h-3 text-slate-400" />
            <select
              value={task.assignedTo}
              onChange={(e) => onUpdateAssigned(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="KTB">KTB</option>
              <option value="Kasir">Kasir</option>
              <option value="Pramuniaga">Pramuniaga</option>
              <option value="Kru Toko">Kru Toko</option>
              <option value="SPV Area">SPV Area</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            <select
              value={task.frequency || 'harian'}
              onChange={(e) => onUpdateFrequency(e.target.value as any)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="harian">Harian</option>
              <option value="mingguan">Mingguan</option>
              <option value="bulanan">Bulanan</option>
              <option value="sekali">1x Saja</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onToggleVerified}
            className={`px-2 py-0.5 rounded flex items-center gap-1 font-semibold transition-colors ${
              task.verifiedBySpv
                ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300'
            }`}
            title="Verifikasi Validasi SPV Lapangan"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{task.verifiedBySpv ? 'Terverifikasi SPV' : 'Verifikasi SPV'}</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors flex-shrink-0"
        title="Hapus Tugas"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
