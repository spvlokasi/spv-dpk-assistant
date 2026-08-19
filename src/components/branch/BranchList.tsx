import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Search, 
  Filter, 
  ArrowRight, 
  MapPin, 
  Phone, 
  User, 
  Calendar,
  AlertTriangle,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { Branch, DpkCategory, DpkStatus } from '../../types';
import { StatusBadge, UrgencyBadge } from '../common/Badge';
import { formatRupiah, formatDateIndo, formatCategoryName } from '../../utils/formatters';

interface BranchListProps {
  branches: Branch[];
  onSelectBranch: (branchId: string) => void;
  onSaveBranch: (branch: Branch) => void;
  onDeleteBranch: (branchId: string) => void;
  isAddingNew?: boolean;
  onCloseNewModal?: () => void;
}

export const BranchList: React.FC<BranchListProps> = ({
  branches,
  onSelectBranch,
  onSaveBranch,
  onDeleteBranch,
  isAddingNew = false,
  onCloseNewModal
}) => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [showModal, setShowModal] = useState(isAddingNew);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Branch>>({
    code: '',
    name: '',
    address: '',
    phone: '',
    kepalaToko: '',
    spvArea: '',
    manajerBisnis: 'H. Bambang Irawan',
    entryDate: new Date().toISOString().slice(0, 10),
    targetGraduationDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
    category: 'sales_drop',
    status: 'kritis',
    urgencyLevel: 'tinggi',
    targetSalesPerDay: 12000000,
    targetMarginPct: 15.0,
    targetMaxOpexPerMonth: 20000000,
    diagnosisSummary: '',
    recommendedStrategy: '',
    rootCauses: [
      { id: 'rc-def-1', category: 'internal', title: 'Kedisiplinan SOP & Up-selling Kasir', score: 2, note: '' },
      { id: 'rc-def-2', category: 'internal', title: 'Ketersediaan Stok & Out of Stock (OOS)', score: 2, note: '' },
      { id: 'rc-def-3', category: 'eksternal', title: 'Kompetitor & Lingkungan Sekitar', score: 3, note: '' },
      { id: 'rc-def-4', category: 'internal', title: 'Display Planogram & Kebersihan 5R', score: 3, note: '' }
    ]
  });

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({
      code: `T-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      address: '',
      phone: '',
      kepalaToko: '',
      spvArea: '',
      manajerBisnis: 'H. Bambang Irawan',
      entryDate: new Date().toISOString().slice(0, 10),
      targetGraduationDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      category: 'sales_drop',
      status: 'kritis',
      urgencyLevel: 'tinggi',
      targetSalesPerDay: 12000000,
      targetMarginPct: 15.0,
      targetMaxOpexPerMonth: 20000000,
      diagnosisSummary: '',
      recommendedStrategy: '',
      rootCauses: [
        { id: `rc-${Date.now()}-1`, category: 'internal', title: 'Kedisiplinan SOP & Up-selling Kasir', score: 2, note: '' },
        { id: `rc-${Date.now()}-2`, category: 'internal', title: 'Ketersediaan Stok & Out of Stock (OOS)', score: 2, note: '' },
        { id: `rc-${Date.now()}-3`, category: 'eksternal', title: 'Kompetitor & Daya Beli Lingkungan', score: 3, note: '' },
        { id: `rc-${Date.now()}-4`, category: 'internal', title: 'Display Planogram & Kebersihan 5R', score: 3, note: '' }
      ]
    });
    setShowModal(true);
  };

  const handleOpenEdit = (branch: Branch, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBranch(branch);
    setFormData({ ...branch });
    setShowModal(true);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Hapus data ${name} dari daftar pengawasan DPK?`)) {
      onDeleteBranch(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.kepalaToko) {
      alert('Mohon isi nama cabang, kode cabang, dan nama Kepala Toko!');
      return;
    }

    const branchToSave: Branch = {
      id: editingBranch ? editingBranch.id : `br-${Date.now()}`,
      code: formData.code || 'T-XXX',
      name: formData.name || 'Cabang Baru',
      address: formData.address || '',
      phone: formData.phone || '',
      kepalaToko: formData.kepalaToko || '',
      spvArea: formData.spvArea || '',
      manajerBisnis: formData.manajerBisnis || 'H. Bambang Irawan',
      entryDate: formData.entryDate || new Date().toISOString().slice(0, 10),
      targetGraduationDate: formData.targetGraduationDate || new Date().toISOString().slice(0, 10),
      category: (formData.category as DpkCategory) || 'sales_drop',
      status: (formData.status as DpkStatus) || 'kritis',
      urgencyLevel: formData.urgencyLevel || 'tinggi',
      targetSalesPerDay: Number(formData.targetSalesPerDay) || 10000000,
      targetMarginPct: Number(formData.targetMarginPct) || 15,
      targetMaxOpexPerMonth: Number(formData.targetMaxOpexPerMonth) || 20000000,
      rootCauses: formData.rootCauses || [],
      diagnosisSummary: formData.diagnosisSummary || 'Tahap awal penugasan pengawasan khusus.',
      recommendedStrategy: formData.recommendedStrategy || 'Audit kepatuhan SOP dan susun action plan.'
    };

    onSaveBranch(branchToSave);
    setShowModal(false);
    if (onCloseNewModal) onCloseNewModal();
  };

  // Filter logic
  const filteredBranches = branches.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || 
                        b.code.toLowerCase().includes(search.toLowerCase()) ||
                        b.kepalaToko.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchCategory = filterCategory === 'all' || b.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Store className="w-6 h-6 text-emerald-400" />
            Daftar Cabang Dalam Pengawasan Khusus (DPK)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Kelola data cabang binaan, lakukan Root Cause Analysis, dan tentukan strategi turnaround.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Cabang DPK
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode cabang, nama toko, atau Kepala Toko..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 flex-1 md:flex-initial"
          >
            <option value="all">Semua Status DPK</option>
            <option value="kritis">🔴 Kritis</option>
            <option value="dalam_progres">🟡 Dalam Progres</option>
            <option value="siap_lulus">🟢 Siap Lulus</option>
            <option value="lulus_dpk">🎓 Lulus DPK</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 flex-1 md:flex-initial"
          >
            <option value="all">Semua Kategori</option>
            <option value="sales_drop">Sales Drop</option>
            <option value="margin_minus">Margin Rendah</option>
            <option value="opex_bengkak">Opex Bengkak</option>
            <option value="shrinkage_tinggi">Susut NKL</option>
          </select>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            onClick={() => onSelectBranch(branch.id)}
            className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all cursor-pointer hover:shadow-xl group flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono font-bold text-emerald-400">
                    {branch.code}
                  </span>
                  <StatusBadge status={branch.status} />
                </div>
                <UrgencyBadge urgency={branch.urgencyLevel} />
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
                {branch.name}
              </h3>

              <div className="text-xs text-slate-400 space-y-1 mb-4">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>KTB: <strong className="text-slate-300">{branch.kepalaToko}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span className="line-clamp-1">{branch.address || 'Alamat cabang'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Masuk DPK: {formatDateIndo(branch.entryDate)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-2 mb-4">
                <div className="text-[11px] font-semibold text-slate-300">
                  {formatCategoryName(branch.category)}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {branch.diagnosisSummary}
                </p>
              </div>
            </div>

            {/* Target & Action Footer */}
            <div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs mb-3">
                <span className="text-slate-400">Target Sales:</span>
                <span className="font-bold text-emerald-400">{formatRupiah(branch.targetSalesPerDay)}/hari</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleOpenEdit(branch, e)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Edit Data Toko"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(branch.id, branch.name, e)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus Toko"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Buka Diagnostik <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Branch */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-emerald-400" />
                {editingBranch ? 'Edit Data Cabang DPK' : 'Tambah Cabang DPK Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (onCloseNewModal) onCloseNewModal();
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kode Cabang *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: T-104"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nama Cabang *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Cabang Basmalah Veteran"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kepala Toko Basmalah (KTB) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama KTB (Kepala Toko Basmalah)"
                    value={formData.kepalaToko}
                    onChange={(e) => setFormData({ ...formData, kepalaToko: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Supervisor Area</label>
                  <input
                    type="text"
                    placeholder="Nama SPV Area"
                    value={formData.spvArea}
                    onChange={(e) => setFormData({ ...formData, spvArea: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Alamat Cabang</label>
                  <input
                    type="text"
                    placeholder="Alamat lengkap toko..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kategori Masalah DPK</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as DpkCategory })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="sales_drop">📉 Sales Drop / Anjlok</option>
                    <option value="margin_minus">💸 Margin Rendah / Minus</option>
                    <option value="opex_bengkak">⚡ Biaya Opex Bengkak</option>
                    <option value="shrinkage_tinggi">📦 Susut / NKL Tinggi</option>
                    <option value="traffic_rendah">🚶 Traffic Struk Rendah</option>
                    <option value="disiplin_sdm">👥 Kedisiplinan & SDM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status DPK Awal</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as DpkStatus })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="kritis">🔴 Kritis</option>
                    <option value="dalam_progres">🟡 Dalam Progres</option>
                    <option value="siap_lulus">🟢 Siap Lulus</option>
                    <option value="lulus_dpk">🎓 Lulus DPK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Sales Harian (Rp)</label>
                  <input
                    type="number"
                    value={formData.targetSalesPerDay}
                    onChange={(e) => setFormData({ ...formData, targetSalesPerDay: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Margin (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetMarginPct}
                    onChange={(e) => setFormData({ ...formData, targetMarginPct: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Ringkasan Diagnosa Awal</label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Sales anjlok akibat kompetitor baru dan kekosongan display..."
                    value={formData.diagnosisSummary}
                    onChange={(e) => setFormData({ ...formData, diagnosisSummary: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    if (onCloseNewModal) onCloseNewModal();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950"
                >
                  Simpan Data Cabang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
