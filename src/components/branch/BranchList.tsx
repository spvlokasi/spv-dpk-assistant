import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Search, 
  MapPin, 
  User, 
  Calendar, 
  Edit2, 
  Trash2, 
  X,
  Image as ImageIcon,
  Upload
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    imageUrl: '',
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
      imageUrl: '',
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

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData(prev => ({ ...prev, imageUrl: dataUrl }));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.kepalaToko) {
      alert('Mohon isi nama cabang, kode cabang, dan nama KTB!');
      return;
    }

    const branchToSave: Branch = {
      id: editingBranch ? editingBranch.id : `br-${Date.now()}`,
      code: formData.code!.trim().toUpperCase(),
      name: formData.name!.trim(),
      address: formData.address || '',
      phone: formData.phone || '',
      kepalaToko: formData.kepalaToko!.trim(),
      spvArea: formData.spvArea || 'Muzakki Ubaid',
      manajerBisnis: formData.manajerBisnis || 'H. Bambang Irawan',
      entryDate: formData.entryDate || new Date().toISOString().slice(0, 10),
      targetGraduationDate: formData.targetGraduationDate || '',
      category: (formData.category as DpkCategory) || 'sales_drop',
      status: (formData.status as DpkStatus) || 'kritis',
      urgencyLevel: formData.urgencyLevel as any || 'tinggi',
      targetSalesPerDay: Number(formData.targetSalesPerDay) || 12000000,
      targetMarginPct: Number(formData.targetMarginPct) || 15.0,
      targetMaxOpexPerMonth: Number(formData.targetMaxOpexPerMonth) || 20000000,
      diagnosisSummary: formData.diagnosisSummary || '',
      recommendedStrategy: formData.recommendedStrategy || '',
      imageUrl: formData.imageUrl || '',
      rootCauses: formData.rootCauses || []
    };

    onSaveBranch(branchToSave);
    setShowModal(false);
    if (onCloseNewModal) onCloseNewModal();
  };

  const handleDelete = (branchId: string, branchName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus data cabang "${branchName}"? Semua riwayat monitoring akan ikut terhapus.`)) {
      onDeleteBranch(branchId);
    }
  };

  // Filter Branches
  const filteredBranches = branches.map(b => {
    if (!b.imageUrl && (b.code === 'M3017' || b.name.toLowerCase().includes('bugih'))) {
      return { ...b, imageUrl: '/stores/bugih.jpg' };
    }
    return b;
  }).filter(branch => {
    const matchSearch = 
      branch.name.toLowerCase().includes(search.toLowerCase()) ||
      branch.code.toLowerCase().includes(search.toLowerCase()) ||
      branch.kepalaToko.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === 'all' || branch.status === filterStatus;
    const matchCategory = filterCategory === 'all' || branch.category === filterCategory;

    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter & Search Bar with Tambah DPK Button */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode cabang, nama toko, atau KTB..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap sm:flex-nowrap">
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

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all flex-shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah DPK
          </button>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBranches.map((branch) => (
          <div
            key={branch.id}
            onClick={() => onSelectBranch(branch.id)}
            className="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-5 rounded-2xl transition-all cursor-pointer hover:shadow-2xl flex flex-col justify-between"
          >
            {/* Background Store Photo (Opacity 65% - 85%) */}
            {branch.imageUrl && (
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:opacity-85 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{ backgroundImage: `url(${branch.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40 pointer-events-none rounded-2xl" />
              </>
            )}

            <div className="relative z-10">
              {/* Header Badges: Code & Status at Left, Category at Top-Right */}
              <div className="flex items-center justify-between gap-1.5 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/80 text-[11px] font-mono font-bold text-emerald-400 shadow-sm">
                    {branch.code}
                  </span>
                  <StatusBadge status={branch.status} />
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800/90 text-slate-200 border border-slate-700/80 shadow-sm">
                  {formatCategoryName(branch.category)}
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-1 drop-shadow-sm">
                {branch.name}
              </h3>

              <div className="text-xs text-slate-300 space-y-1 mb-4">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KTB: <strong className="text-white font-semibold">{branch.kepalaToko}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="line-clamp-1 text-slate-400">{branch.address || 'Alamat cabang'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-300">Masuk DPK: <strong className="text-white">{formatDateIndo(branch.entryDate)}</strong></span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-850/85 border border-slate-800/90 backdrop-blur-sm mb-4">
                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                  {branch.diagnosisSummary || 'Belum ada diagnosa ringkasan.'}
                </p>
              </div>
            </div>

            {/* Target & Action Footer with Urgency Badge */}
            <div className="relative z-10">
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs mb-3">
                <span className="text-slate-400">Target Sales:</span>
                <span className="font-bold text-emerald-400">{formatRupiah(branch.targetSalesPerDay)}/hari</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={(e) => handleOpenEdit(branch, e)}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Data Toko"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(branch.id, branch.name, e)}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Hapus Toko"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <UrgencyBadge urgency={branch.urgencyLevel} />
                </div>

                <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Detail →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah / Edit Toko */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                {editingBranch ? 'Edit Data Cabang DPK' : 'Daftarkan Cabang DPK Baru'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  if (onCloseNewModal) onCloseNewModal();
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Foto Toko (Background Preview) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  Foto Tampak Depan Toko (Opsional / Background Card)
                </label>
                <div className="flex items-center gap-3">
                  {formData.imageUrl ? (
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 group">
                      <img src={formData.imageUrl} alt="Toko" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imageUrl: '' })}
                        className="absolute inset-0 bg-black/70 flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : null}

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    Pilih Foto dari Perangkat
                  </button>

                  <input
                    type="text"
                    placeholder="Atau masukkan URL foto (/stores/bugih.jpg)..."
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kode Cabang *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: M3017"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nama Cabang Toko *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: TokoBASMALAH Bugih"
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
                    placeholder="Nama KTB"
                    value={formData.kepalaToko}
                    onChange={(e) => setFormData({ ...formData, kepalaToko: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">SPV Area (Wilayah)</label>
                  <input
                    type="text"
                    placeholder="Nama SPV Area"
                    value={formData.spvArea}
                    onChange={(e) => setFormData({ ...formData, spvArea: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">📅 Tanggal Masuk DPK *</label>
                  <input
                    type="date"
                    required
                    value={formData.entryDate}
                    onChange={(e) => setFormData({ ...formData, entryDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Tanggal Lulus</label>
                  <input
                    type="date"
                    value={formData.targetGraduationDate}
                    onChange={(e) => setFormData({ ...formData, targetGraduationDate: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status Progres DPK</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="kritis">🔴 Kritis (Intervensi Khusus)</option>
                    <option value="dalam_progres">🟡 Dalam Progres Perbaikan</option>
                    <option value="siap_lulus">🟢 Siap Lulus DPK</option>
                    <option value="lulus_dpk">🎓 Lulus DPK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tingkat Urgensi</label>
                  <select
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="tinggi">🚨 Urgensi Tinggi</option>
                    <option value="sedang">⚠️ Urgensi Sedang</option>
                    <option value="rendah">ℹ️ Urgensi Normal</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Alamat Lengkap Cabang</label>
                  <input
                    type="text"
                    placeholder="Jl. Raya No. ..., Kecamatan, Kabupaten"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kategori Masalah Utama</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:border-emerald-500 focus:outline-none"
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Omzet / Hari (Rp)</label>
                  <input
                    type="number"
                    value={formData.targetSalesPerDay}
                    onChange={(e) => setFormData({ ...formData, targetSalesPerDay: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Ringkasan Diagnosa Masalah</label>
                  <textarea
                    rows={2}
                    placeholder="Penjelasan singkat penyebab toko dimasukkan ke program DPK..."
                    value={formData.diagnosisSummary}
                    onChange={(e) => setFormData({ ...formData, diagnosisSummary: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-3 focus:border-emerald-500 focus:outline-none"
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
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 transition-all active:scale-95"
                >
                  Simpan Toko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
