import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { DailyPerformance, Branch } from '../../types';
import { useToast } from '../../context/ToastContext';

interface PerformanceInputModalProps {
  branch?: Branch;
  onSave: (entry: DailyPerformance) => void;
  onClose: () => void;
}

export const PerformanceInputModal: React.FC<PerformanceInputModalProps> = ({
  branch,
  onSave,
  onClose
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    salesActual: branch?.targetSalesPerDay ? Math.round(branch.targetSalesPerDay * 0.9) : 1500000,
    trafficCount: 250,
    basketSize: 35000,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branch) return;
    const entry: DailyPerformance = {
      id: `dp-${Date.now()}`,
      branchId: branch.id,
      date: formData.date,
      salesActual: Number(formData.salesActual) || 0,
      salesTarget: branch.targetSalesPerDay || 1500000,
      marginPct: 0,
      opex: 0,
      trafficCount: Number(formData.trafficCount) || 0,
      basketSize: Number(formData.basketSize) || 0,
      notes: formData.notes.trim()
    };
    onSave(entry);
    showToast('Data kinerja harian berhasil disimpan!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div><h3 className="text-sm font-bold text-white">Input Kinerja Harian</h3><p className="text-[11px] text-slate-400">[{branch?.code}] {branch?.name || '-'}</p></div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-slate-400 mb-1 font-semibold">Tanggal:</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono" /></div>
            <div><label className="block text-slate-400 mb-1 font-semibold">Laba Aktual (Rp):</label><input type="number" value={formData.salesActual} onChange={(e) => setFormData({ ...formData, salesActual: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold" /></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-slate-400 mb-1 font-semibold">STD (Struk):</label><input type="number" value={formData.trafficCount} onChange={(e) => setFormData({ ...formData, trafficCount: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono" /></div>
            <div><label className="block text-slate-400 mb-1 font-semibold">APC (Rp / Struk):</label><input type="number" value={formData.basketSize} onChange={(e) => setFormData({ ...formData, basketSize: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-purple-400 font-mono font-bold" /></div>
          </div>

          <div><label className="block text-slate-400 mb-1 font-semibold">Catatan Evaluasi:</label><input type="text" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Catatan promo/kendala..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200" /></div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold">Batal</button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg"><CheckCircle2 className="w-4 h-4" /> Simpan Data</button>
          </div>
        </form>
      </div>
    </div>
  );
};
