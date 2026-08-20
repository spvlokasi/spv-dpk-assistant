import React, { useState } from 'react';
import { Branch, DpkCategory, DpkStatus } from '../../types';
import { BranchSearchBar } from './list/BranchSearchBar';
import { BranchCard } from './list/BranchCard';
import { BranchModalForm } from './list/BranchModalForm';

interface BranchListProps {
  branches: Branch[];
  onSelectBranch: (branchId: string) => void;
  onSaveBranch: (branch: Branch) => void;
  onDeleteBranch: (branchId: string) => void;
  isAddingNew?: boolean;
  onCloseNewModal?: () => void;
}

const DEFAULT_FORM_DATA: Partial<Branch> = {
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
  rootCauses: []
};

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
  const [formData, setFormData] = useState<Partial<Branch>>(DEFAULT_FORM_DATA);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({
      ...DEFAULT_FORM_DATA,
      code: `T-${Math.floor(100 + Math.random() * 900)}`,
      entryDate: new Date().toISOString().slice(0, 10),
      targetGraduationDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10)
    });
    setShowModal(true);
  };

  const handleOpenEdit = (branch: Branch, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBranch(branch);
    setFormData({ ...branch });
    setShowModal(true);
  };

  const handleDelete = (branchId: string, branchName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus data cabang "${branchName}"? Semua riwayat monitoring akan ikut terhapus.`)) {
      onDeleteBranch(branchId);
    }
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
      urgencyLevel: (formData.urgencyLevel as any) || 'tinggi',
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
      {/* 1 Single Horizontal Row Search & Filter Bar on Mobile */}
      <BranchSearchBar
        search={search}
        filterStatus={filterStatus}
        filterCategory={filterCategory}
        onSearchChange={setSearch}
        onStatusChange={setFilterStatus}
        onCategoryChange={setFilterCategory}
        onOpenAdd={handleOpenAdd}
      />

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBranches.map((branch) => (
          <BranchCard
            key={branch.id}
            branch={branch}
            onSelect={() => onSelectBranch(branch.id)}
            onEdit={(e) => handleOpenEdit(branch, e)}
            onDelete={(e) => handleDelete(branch.id, branch.name, e)}
          />
        ))}
      </div>

      {/* Modal Tambah / Edit Toko */}
      <BranchModalForm
        show={showModal}
        editingBranch={editingBranch}
        formData={formData}
        onClose={() => {
          setShowModal(false);
          if (onCloseNewModal) onCloseNewModal();
        }}
        onFormDataChange={setFormData}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
