import React, { useState } from 'react';
import { Branch, FieldVisit } from '../../types';
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
}

export const FieldVisitLog: React.FC<FieldVisitLogProps> = ({
  branches,
  visits,
  selectedBranchId,
  onSaveVisit,
  onDeleteVisit,
  isOpenNewModal = false,
  onCloseNewModal
}) => {
  const [filterBranchId, setFilterBranchId] = useState<string>(selectedBranchId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(isOpenNewModal);
  const [editingVisit, setEditingVisit] = useState<FieldVisit | null>(null);

  const openIssuesCount = visits.flatMap((v) => v.issues || []).filter((i) => !i.resolved).length;

  const filteredVisits = visits.filter((v) => {
    const matchBranch = filterBranchId === 'all' || v.branchId === filterBranchId;
    const matchQuery =
      searchQuery === '' ||
      v.agenda.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.katokCoachingTopic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.summaryConclusion?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBranch && matchQuery;
  });

  const handleOpenAdd = () => {
    setEditingVisit(null);
    setShowModal(true);
  };

  const handleEdit = (visit: FieldVisit) => {
    setEditingVisit(visit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVisit(null);
    if (onCloseNewModal) onCloseNewModal();
  };

  const handleToggleIssueResolved = (visit: FieldVisit, issueId: string) => {
    const updatedIssues = (visit.issues || []).map((i) =>
      i.id === issueId ? { ...i, resolved: !i.resolved } : i
    );
    onSaveVisit({ ...visit, issues: updatedIssues });
  };

  return (
    <div className="space-y-6">
      <FieldVisitHeader
        branches={branches}
        filterBranchId={filterBranchId}
        onFilterChange={setFilterBranchId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalVisits={visits.length}
        openIssuesCount={openIssuesCount}
        onOpenAddModal={handleOpenAdd}
      />

      <div className="space-y-4">
        {filteredVisits.length === 0 ? (
          <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl mx-auto">
              📋
            </div>
            <h4 className="text-sm font-bold text-slate-300">Belum Ada Log Kunjungan</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Catat pendampingan fisik ke toko, sesi coaching KTB, dan temuan kendala operasional lapangan.
            </p>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              + Catat Kunjungan Pertama
            </button>
          </div>
        ) : (
          filteredVisits.map((visit) => (
            <FieldVisitCard
              key={visit.id}
              visit={visit}
              branch={branches.find((b) => b.id === visit.branchId)}
              onEdit={handleEdit}
              onDelete={onDeleteVisit}
              onToggleIssueResolved={handleToggleIssueResolved}
            />
          ))
        )}
      </div>

      {showModal && (
        <FieldVisitFormModal
          branches={branches}
          editingVisit={editingVisit}
          initialBranchId={filterBranchId !== 'all' ? filterBranchId : undefined}
          onSave={onSaveVisit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
