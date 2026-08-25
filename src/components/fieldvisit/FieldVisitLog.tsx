import React, { useState } from 'react';
import { Branch, FieldVisit } from '../../types';
import { UserAccount } from '../../types/auth';
import { FieldVisitHeader } from './FieldVisitHeader';
import { FieldVisitCard } from './FieldVisitCard';
import { FieldVisitFormModal } from './FieldVisitFormModal';

interface FieldVisitLogProps {
  branches: Branch[];
  visits: FieldVisit[];
  selectedBranchId?: string;
  onSaveVisit: (visit: FieldVisit) => void;
  onDeleteVisit: (id: string) => void;
  isOpenNewModal?: boolean;
  onCloseNewModal?: () => void;
  currentUser?: UserAccount;
}

export const FieldVisitLog: React.FC<FieldVisitLogProps> = ({
  branches, visits, selectedBranchId, onSaveVisit, onDeleteVisit,
  isOpenNewModal = false, onCloseNewModal, currentUser
}) => {
  const isKtb = currentUser?.username.startsWith('ktb.') || currentUser?.roleTitle === 'Kepala Toko';
  const [filterBranchId, setFilterBranchId] = useState<string>(selectedBranchId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(isOpenNewModal);
  const [editingVisit, setEditingVisit] = useState<FieldVisit | null>(null);

  const openIssuesCount = visits.flatMap((v) => v.issues || []).filter((i) => !i.resolved).length;
  const filteredVisits = visits.filter((v) => {
    const matchBranch = filterBranchId === 'all' || v.branchId === filterBranchId;
    const matchQuery = !searchQuery || v.agenda.toLowerCase().includes(searchQuery.toLowerCase()) || v.katokCoachingTopic?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBranch && matchQuery;
  });

  const handleOpenAdd = () => { if (!isKtb) { setEditingVisit(null); setShowModal(true); } };
  const handleEdit = (visit: FieldVisit) => { if (!isKtb) { setEditingVisit(visit); setShowModal(true); } };
  const handleCloseModal = () => { setShowModal(false); setEditingVisit(null); if (onCloseNewModal) onCloseNewModal(); };

  const handleToggleIssueResolved = (visit: FieldVisit, issueId: string) => {
    const updatedIssues = (visit.issues || []).map((i) => (i.id === issueId ? { ...i, resolved: !i.resolved } : i));
    onSaveVisit({ ...visit, issues: updatedIssues });
  };

  return (
    <div className="space-y-6">
      <FieldVisitHeader branches={branches} filterBranchId={filterBranchId} onFilterChange={setFilterBranchId} searchQuery={searchQuery} onSearchChange={setSearchQuery} totalVisits={visits.length} openIssuesCount={openIssuesCount} onOpenAddModal={handleOpenAdd} isKtb={isKtb} />

      <div className="space-y-4">
        {filteredVisits.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="text-xl">📋</div>
            <h4 className="text-sm font-bold text-slate-300">Belum Ada Catatan Supervisi</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{isKtb ? 'Supervisor belum mencatat kunjungan supervisi untuk gerai toko ini.' : 'Mulai catat agenda kunjungan dan temuan masalah lapangan.'}</p>
            {!isKtb && <button type="button" onClick={handleOpenAdd} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md active:scale-95">+ Catat Kunjungan</button>}
          </div>
        ) : (
          filteredVisits.map((v) => (
            <FieldVisitCard key={v.id} visit={v} branch={branches.find((b) => b.id === v.branchId)} onEdit={handleEdit} onDelete={onDeleteVisit} onToggleIssueResolved={handleToggleIssueResolved} isKtb={isKtb} />
          ))
        )}
      </div>

      {showModal && !isKtb && <FieldVisitFormModal branches={branches} editingVisit={editingVisit} onSave={onSaveVisit} onClose={handleCloseModal} />}
    </div>
  );
};
