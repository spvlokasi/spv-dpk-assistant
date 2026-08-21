import React from 'react';
import { Database, Download, Upload, AlertTriangle } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface SettingsBackupRestoreProps {
  onDataChange: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsBackupRestore: React.FC<SettingsBackupRestoreProps> = ({
  onDataChange,
  onShowToast
}) => {
  const handleExport = () => {
    const dataStr = StorageService.exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPV_DPK_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Data Berhasil Diekspor ke File JSON!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const success = StorageService.importAllData(content);
          if (success) {
            onShowToast('Data Berhasil Diimpor & Dipulihkan!');
            onDataChange();
          } else {
            alert('Format file cadangan tidak valid.');
          }
        } catch {
          alert('Gagal membaca file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetData = () => {
    if (window.confirm('PERINGATAN: Apakah Anda yakin ingin mereset seluruh data lokal ke kondisi bawaan awal?')) {
      StorageService.resetToDefaults();
      onShowToast('Database Lokal Berhasil Direset ke Default!');
      onDataChange();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center gap-2.5">
        <Database className="w-5 h-5 text-blue-400" />
        <div>
          <h3 className="text-sm font-bold text-white">Cadangkan & Pulihkan Database (Offline JSON)</h3>
          <p className="text-xs text-slate-400">Ekspor seluruh data ke file JSON untuk cadangan manual</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={handleExport}
          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Ekspor Cadangan (Download JSON)</span>
        </button>

        <label className="cursor-pointer p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95">
          <Upload className="w-4 h-4 text-blue-400" />
          <span>Impor / Pulihkan dari File JSON</span>
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Reset Database Lokal:</span>
        </div>
        <button
          type="button"
          onClick={handleResetData}
          className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 text-xs font-bold transition-colors"
        >
          Reset ke Data Awal
        </button>
      </div>
    </div>
  );
};
