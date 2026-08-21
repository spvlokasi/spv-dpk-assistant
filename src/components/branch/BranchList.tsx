import React, { useState } from 'react';
import { Branch } from '../../types';
import { useToast } from '../../context/ToastContext';
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

const DEFAULT_FORM: Partial<Branch> = {
  code: '', name: '', address: '', phone: '', kepalaToko: '', spvArea: '',
  manajerBisnis: 'Rusli Hitami',
  entryDate: new Date().toISOString().slice(0, 10),
  targetGraduationDate: new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
  status: 'kritis', urgencyLevel: 'tinggi',
  targetSalesPerDay: 1500000, targetMarginPct: 15.0, targetMaxOpexPerMonth: 20000000,
  diagnosisSummary: '', recommendedStrategy: '', imageUrl: '', rootCauses: []
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
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(isAddingNew);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<Partial<Branch>>(DEFAULT_FORM);

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({ ...DEFAULT_FORM, code: `M-${Math.floor(1000 + Math.random() * 9000)}` });
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
    if (window.confirm(`Hapus data cabang "${branchName}"?`)) {
      onDeleteBranch(branchId);
      showToast(`Data cabang ${branchName} berhasil dihapus`, 'warning');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.kepalaToko) {
      showToast('Isi nama cabang, kode cabang, dan nama KTB!', 'warning');
      return;
    }
    const branchToSave: Branch = {
      ...DEFAULT_FORM,
      ...formData,
      id: editingBranch ? editingBranch.id : `br-${Date.now()}`,
      code: formData.code!.trim().toUpperCase(),
      name: formData.name!.trim(),
      kepalaToko: formData.kepalaToko!.trim(),
      targetSalesPerDay: Number(formData.targetSalesPerDay) || 1500000,
      targetMarginPct: Number(formData.targetMarginPct) || 15.0,
      targetMaxOpexPerMonth: Number(formData.targetMaxOpexPerMonth) || 20000000
    } as Branch;

    onSaveBranch(branchToSave);
    showToast(editingBranch ? 'Perubahan cabang disimpan!' : 'Cabang baru didaftarkan!', 'success');
    setShowModal(false);
    if (onCloseNewModal) onCloseNewModal();
  };

  const filteredBranches = branches.map((b) => (!b.imageUrl && (b.code === 'M3017' || b.name.toLowerCase().includes('bugih')) ? { ...b, imageUrl: '/stores/bugih.jpg' } : b)).filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.code.toLowerCase().includes(search.toLowerCase()) || b.kepalaToko.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (filterStatus === 'all' || b.status === filterStatus);
  });

  return (
    <div className="space-y-4">
      <BranchSearchBar search={search} filterStatus={filterStatus} onSearchChange={setSearch} onStatusChange={setFilterStatus} onOpenAdd={handleOpenAdd} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBranches.map((b) => (
          <BranchCard key={b.id} branch={b} onSelect={() => onSelectBranch(b.id)} onEdit={(e) => handleOpenEdit(b, e)} onDelete={(e) => handleDelete(b.id, b.name, e)} />
        ))}
      </div>
      <BranchModalForm show={showModal} editingBranch={editingBranch} formData={formData} onClose={() => { setShowModal(false); if (onCloseNewModal) onCloseNewModal(); }} onFormDataChange={setFormData} onSubmit={handleSubmit} />
    </div>
  );
};
