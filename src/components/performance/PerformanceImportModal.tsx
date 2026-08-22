import React, { useState, useRef } from 'react';
import { Download, Upload, X, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { Branch, DailyPerformance } from '../../types';
import { useToast } from '../../context/ToastContext';
import { downloadPerformanceExcelTemplate, parsePerformanceExcelOrCsv } from './usePerformanceExcel';

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
    downloadPerformanceExcelTemplate(activeBranch);
    showToast('Template Excel (.xlsx) Toko Basmalah berhasil diunduh!', 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      const entries = parsePerformanceExcelOrCsv(buffer, branches, activeBranch);
      if (entries.length === 0) {
        showToast('Format file tidak dikenali atau kosong! Pastikan file rekap Toko Basmalah.', 'error');
        return;
      }
      setParsedData(entries);
      showToast(`Berhasil membaca ${entries.length} baris data kinerja Excel!`, 'success');
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSave = () => {
    if (parsedData.length === 0) return;
    onImport(parsedData);
    showToast(`Sukses mengimpor ${parsedData.length} data kinerja masal!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <FileSpreadsheet className="w-4 h-4" /><span>Import Rekap Excel Toko Basmalah</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">1. Unduh Template Excel (.xlsx):</span>
            <button type="button" onClick={handleDownload} className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md active:scale-95">
              <Download className="w-3.5 h-3.5" /> Unduh Excel
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Format standar POS: NO, Tanggal, KD Cabang, Nama Cabang, R/L, STD, APC, Catatan.</p>
        </div>

        <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <span className="font-semibold text-slate-200 block">2. Upload File Rekap (.xlsx / .xls / .csv):</span>
          <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-5 text-center cursor-pointer bg-slate-900/50">
            <Upload className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs text-slate-300 font-medium">{fileName || 'Klik untuk upload file Excel / Rekap Cabang'}</p>
            <p className="text-[10px] text-slate-500">Mendukung format export rekap Toko Basmalah langsung</p>
          </div>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
        </div>

        {parsedData.length > 0 && (
          <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> {parsedData.length} baris data rekap siap dimasukkan
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold">Batal</button>
          <button type="button" onClick={handleSave} disabled={parsedData.length === 0} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Simpan ({parsedData.length}) Data
          </button>
        </div>
      </div>
    </div>
  );
};
