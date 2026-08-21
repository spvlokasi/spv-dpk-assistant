import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { DailyPerformance, Branch } from '../../types';

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
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    salesActual: branch?.targetSalesPerDay ? Math.round(branch.targetSalesPerDay * 0.9) : 1500000,
    salesTarget: branch?.targetSalesPerDay || 1500000,
    marginPct: branch?.targetMarginPct || 15.0,
    opex: 700000,
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
      salesTarget: Number(formData.salesTarget) || branch.targetSalesPerDay,
      marginPct: Number(formData.marginPct) || 15,
      opex: Number(formData.opex) || 0,
      trafficCount: Number(formData.trafficCount) || 0,
      basketSize: Number(formData.basketSize) || 0,
      notes: formData.notes.trim()
    };

    onSave(entry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="text-base font-bold text-white">Input Kinerja Harian Cabang</h3>
          <p className="text-xs text-slate-400">Cabang: {branch?.name || '-'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Tanggal:</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Laba Aktual (Rp):</label>
              <input
                type="number"
                value={formData.salesActual}
                onChange={(e) => setFormData({ ...formData, salesActual: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Margin Aktual (%):</label>
              <input
                type="number"
                step="0.1"
                value={formData.marginPct}
                onChange={(e) => setFormData({ ...formData, marginPct: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Beban Harian / Opex (Rp):</label>
              <input
                type="number"
                value={formData.opex}
                onChange={(e) => setFormData({ ...formData, opex: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Jumlah Struk (Traffic):</label>
              <input
                type="number"
                value={formData.trafficCount}
                onChange={(e) => setFormData({ ...formData, trafficCount: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Basket Size (Rp/Struk):</label>
              <input
                type="number"
                value={formData.basketSize}
                onChange={(e) => setFormData({ ...formData, basketSize: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-purple-400 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Catatan Lapangan / Evaluasi:</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Contoh: Ada promo tebus murah minyak goreng & sabun"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Data Kinerja
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
