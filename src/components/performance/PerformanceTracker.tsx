import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  DollarSign, 
  Percent, 
  ShoppingCart, 
  Users, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { Branch, DailyPerformance } from '../../types';
import { SimpleLineChart } from '../common/SimpleChart';
import { formatRupiah, formatShortRupiah, formatDateIndo } from '../../utils/formatters';

interface PerformanceTrackerProps {
  branches: Branch[];
  performance: DailyPerformance[];
  selectedBranchId?: string;
  onAddPerformance: (entry: DailyPerformance) => void;
  onDeletePerformance: (id: string) => void;
}

export const PerformanceTracker: React.FC<PerformanceTrackerProps> = ({
  branches,
  performance,
  selectedBranchId,
  onAddPerformance,
  onDeletePerformance
}) => {
  const [activeBranchId, setActiveBranchId] = useState<string>(
    selectedBranchId || (branches[0]?.id || '')
  );

  const [showModal, setShowModal] = useState(false);

  const currentBranch = branches.find(b => b.id === activeBranchId);
  const branchPerf = performance
    .filter(p => p.branchId === activeBranchId)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Form State for new Daily Performance
  const [formData, setFormData] = useState<Partial<DailyPerformance>>({
    date: new Date().toISOString().slice(0, 10),
    salesActual: currentBranch?.targetSalesPerDay || 12000000,
    salesTarget: currentBranch?.targetSalesPerDay || 12000000,
    marginPct: currentBranch?.targetMarginPct || 15.0,
    opex: 700000,
    trafficCount: 300,
    basketSize: 40000,
    notes: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      salesActual: currentBranch?.targetSalesPerDay ? Math.round(currentBranch.targetSalesPerDay * 0.95) : 12000000,
      salesTarget: currentBranch?.targetSalesPerDay || 12000000,
      marginPct: currentBranch?.targetMarginPct || 15.0,
      opex: 700000,
      trafficCount: 300,
      basketSize: 40000,
      notes: ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBranchId) return;

    const entry: DailyPerformance = {
      id: `dp-${Date.now()}`,
      branchId: activeBranchId,
      date: formData.date || new Date().toISOString().slice(0, 10),
      salesActual: Number(formData.salesActual) || 0,
      salesTarget: Number(formData.salesTarget) || 0,
      marginPct: Number(formData.marginPct) || 0,
      opex: Number(formData.opex) || 0,
      trafficCount: Number(formData.trafficCount) || 0,
      basketSize: Number(formData.basketSize) || (Number(formData.trafficCount) > 0 ? Math.round(Number(formData.salesActual) / Number(formData.trafficCount)) : 0),
      notes: formData.notes || ''
    };

    onAddPerformance(entry);
    setShowModal(false);
  };

  // Aggregated KPIs
  const totalSales = branchPerf.reduce((acc, p) => acc + p.salesActual, 0);
  const avgSales = branchPerf.length > 0 ? Math.round(totalSales / branchPerf.length) : 0;
  const avgMargin = branchPerf.length > 0 ? (branchPerf.reduce((acc, p) => acc + p.marginPct, 0) / branchPerf.length).toFixed(1) : '0';
  const totalTraffic = branchPerf.reduce((acc, p) => acc + p.trafficCount, 0);
  const avgBasket = branchPerf.length > 0 ? Math.round(branchPerf.reduce((acc, p) => acc + p.basketSize, 0) / branchPerf.length) : 0;

  // Chart Data
  const chartData = branchPerf.map(p => ({
    label: formatDateIndo(p.date).slice(0, 6),
    actual: p.salesActual,
    target: p.salesTarget
  }));

  return (
    <div className="space-y-6">
      {/* Header & Branch Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Monitoring Kinerja & Finansial Cabang
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Pantau pergerakan omzet sales harian, margin keuntungan, efisiensi biaya opex, dan traffic struk.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={activeBranchId}
            onChange={(e) => setActiveBranchId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
          >
            {branches.map(b => (
              <option key={b.id} value={b.id}>
                [{b.code}] {b.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            + Input Sales Harian
          </button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400 font-medium mb-1">Rata-rata Sales Harian</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">
            {formatShortRupiah(avgSales)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target DPK: <span className="text-slate-300 font-bold">{currentBranch ? formatShortRupiah(currentBranch.targetSalesPerDay) : '-'}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400 font-medium mb-1">Rata-rata Gross Margin</div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono">
            {avgMargin}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target DPK: <span className="text-slate-300 font-bold">{currentBranch?.targetMarginPct || 0}%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400 font-medium mb-1">Total Traffic Struk</div>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-400 font-mono">
            {totalTraffic.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Dari {branchPerf.length} hari tercatat
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="text-xs text-slate-400 font-medium mb-1">Rata-rata Basket Size</div>
          <div className="text-xl sm:text-2xl font-extrabold text-teal-400 font-mono">
            {formatShortRupiah(avgBasket)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Nilai belanja per transaksi
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Grafik Tren Penjualan Harian (Aktual vs Target DPK)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cabang: <strong>{currentBranch?.name}</strong>
            </p>
          </div>
        </div>

        <SimpleLineChart data={chartData} height={240} />
      </div>

      {/* Daily Performance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Riwayat Pencapaian Harian ({branchPerf.length} Hari)
          </h3>
          <button
            onClick={handleOpenAdd}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            + Tambah Data Hari Lain
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Sales Aktual</th>
                <th className="py-3 px-4">Target DPK</th>
                <th className="py-3 px-4">Pencapaian (%)</th>
                <th className="py-3 px-4">Margin (%)</th>
                <th className="py-3 px-4">Opex/Biaya</th>
                <th className="py-3 px-4">Traffic (Struk)</th>
                <th className="py-3 px-4">Basket Size</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {branchPerf.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Belum ada input metrik harian.
                  </td>
                </tr>
              ) : (
                branchPerf.map((row) => {
                  const pct = row.salesTarget > 0 ? Math.round((row.salesActual / row.salesTarget) * 100) : 0;
                  return (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-300">
                        {formatDateIndo(row.date)}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {formatRupiah(row.salesActual)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {formatRupiah(row.salesTarget)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          pct >= 100 ? 'bg-emerald-500/20 text-emerald-300' : pct >= 80 ? 'bg-amber-500/20 text-amber-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {pct}%
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-amber-300 font-semibold">
                        {row.marginPct}%
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {formatRupiah(row.opex)}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {row.trafficCount}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {formatRupiah(row.basketSize)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeletePerformance(row.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Daily Performance */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Input Pencapaian Sales & Metrik Harian
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tanggal Data</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">Sales Aktual (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={formData.salesActual}
                    onChange={(e) => setFormData({ ...formData, salesActual: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-emerald-300 font-mono font-bold text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Sales DPK (Rp)</label>
                  <input
                    type="number"
                    required
                    value={formData.salesTarget}
                    onChange={(e) => setFormData({ ...formData, salesTarget: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-amber-400 mb-1">Margin Profit (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.marginPct}
                    onChange={(e) => setFormData({ ...formData, marginPct: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-amber-300 font-mono text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Opex / Biaya Harian (Rp)</label>
                  <input
                    type="number"
                    value={formData.opex}
                    onChange={(e) => setFormData({ ...formData, opex: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-blue-400 mb-1">Traffic Struk (Jumlah)</label>
                  <input
                    type="number"
                    value={formData.trafficCount}
                    onChange={(e) => setFormData({ ...formData, trafficCount: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-blue-300 font-mono text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-teal-400 mb-1">Basket Size Rata-rata (Rp)</label>
                  <input
                    type="number"
                    value={formData.basketSize}
                    onChange={(e) => setFormData({ ...formData, basketSize: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-teal-300 font-mono text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Catatan Khusus Hari Ini</label>
                  <input
                    type="text"
                    placeholder="Contoh: Ada promo JSM, hujan lebat sore hari..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
