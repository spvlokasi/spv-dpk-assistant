import React, { useState, useRef } from 'react';
import { Download, Upload, X, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { Branch, DailyPerformance } from '../../types';
import { useToast } from '../../context/ToastContext';
import { generatePerformanceCsvTemplate, parsePerformanceCsv } from './usePerformanceCsv';

interface PerformanceImportModalProps {
  branches: Branch[];
  activeBranch?: Branch;
  onImport: (entries: DailyPerformance[]) => void;
  onClose: () => void;
}

export const PerformanceImportModal: React.FC<PerformanceImportModalProps> = ({
  branches,
  activeBranch,
  onImport,
  onClose
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<DailyPerformance[]>([]);
  const [fileName, setFileName] = useState<string>('');

  const handleDownload = () => {
    const code = activeBranch?.code || branches[0]?.code || 'M3019';
    const blob = new Blob([generatePerformanceCsvTemplate(code)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Template_Kinerja_${code}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Template CSV berhasil diunduh!', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const entries = parsePerformanceCsv(event.target?.result as string, branches, activeBranch);
      if (entries.length === 0) { showToast('Format tidak sesuai / tidak ada data!', 'error'); return; }
      setParsedData(entries);
      showToast(`Membaca ${entries.length} baris data!`, 'success');
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (parsedData.length === 0) return;
    onImport(parsedData);
    showToast(`Sukses mengimpor ${parsedData.length} data masal!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <FileSpreadsheet className="w-4 h-4" /><span>Upload Masal Data Kinerja</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between"><span className="font-semibold text-slate-200">1. Unduh Template:</span><button type="button" onClick={handleDownload} className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-400 font-bold border border-slate-700 flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> Unduh CSV</button></div>
          <p className="text-[11px] text-slate-400">Kolom: Tanggal, Kode Cabang, Laba Harian, STD, APC, Catatan.</p>
        </div>

        <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <span className="font-semibold text-slate-200 block">2. Upload File CSV:</span>
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-900/50">
            <Upload className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs text-slate-300">{fileName || 'Pilih file CSV'}</p>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
        </div>

        {parsedData.length > 0 && <div className="p-2 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {parsedData.length} baris siap diimpor</div>}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Batal</button>
          <button type="button" onClick={handleSave} disabled={parsedData.length === 0} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Simpan ({parsedData.length}) Data</button>
        </div>
      </div>
    </div>
  );
};
