import React, { useState } from 'react';
import { Branch, BranchGraduation } from '../../types';
import { GraduationHeader } from './GraduationHeader';
import { GraduationChecklistCard } from './GraduationChecklistCard';
import { GraduationSummaryBox } from './GraduationSummaryBox';

interface GraduationTrackerProps {
  branches: Branch[];
  graduations: BranchGraduation[];
  onSaveGraduation: (item: BranchGraduation) => void;
  onUpdateBranchStatus: (branchId: string, status: any) => void;
}

export const GraduationTracker: React.FC<GraduationTrackerProps> = ({
  branches,
  graduations,
  onSaveGraduation,
  onUpdateBranchStatus
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');

  const currentBranch = branches.find((b) => b.id === selectedBranchId);
  const currentGraduation = graduations.find((g) => g.branchId === selectedBranchId) || {
    branchId: selectedBranchId,
    consecutiveMonthsHit: 0,
    targetMonthsRequired: 3,
    approvedByManager: false,
    bestPracticeLearnings: '',
    checklists: [
      { id: 'gc-1', title: 'Target Laba Harian Stabil', targetDescription: 'Rata-rata laba >= target selama 3 bulan berturut-turut', isMet: false },
      { id: 'gc-2', title: 'Target Margin Profit Tercapai', targetDescription: 'Gross Margin >= target persentase (min. 15%)', isMet: false },
      { id: 'gc-3', title: 'Efisiensi Biaya Operasional (Opex)', targetDescription: 'Opex di bawah batas plafon bulanan', isMet: false },
      { id: 'gc-4', title: 'Skor Audit Kepatuhan SOP & 5R', targetDescription: 'Nilai audit fisik dan kebersihan min. 85 poin', isMet: false },
      { id: 'gc-5', title: 'Kemandirian KTB & Kru', targetDescription: 'KTB mampu memimpin evaluasi dan briefing harian mandiri', isMet: false }
    ]
  };

  const handleToggleChecklist = (id: string) => {
    const updated = {
      ...currentGraduation,
      checklists: currentGraduation.checklists.map((item) =>
        item.id === id ? { ...item, isMet: !item.isMet } : item
      )
    };
    onSaveGraduation(updated);
  };

  const handleUpdateConsecutiveMonths = (months: number) => {
    onSaveGraduation({ ...currentGraduation, consecutiveMonthsHit: months });
  };

  const handleUpdateLearnings = (notes: string) => {
    onSaveGraduation({ ...currentGraduation, bestPracticeLearnings: notes });
  };

  const handleGraduationApproval = () => {
    if (!currentBranch) return;
    const updated: BranchGraduation = {
      ...currentGraduation,
      approvedByManager: true,
      graduationDate: new Date().toISOString().slice(0, 10),
      graduatedBySpv: 'Supervisor DPK (Saya)'
    };
    onSaveGraduation(updated);
    onUpdateBranchStatus(currentBranch.id, 'lulus_mandiri');
  };

  return (
    <div className="space-y-6">
      <GraduationHeader
        branches={branches}
        selectedBranchId={selectedBranchId}
        onSelectBranch={setSelectedBranchId}
        currentBranch={currentBranch}
        currentGraduation={currentGraduation}
      />

      <GraduationChecklistCard
        currentGraduation={currentGraduation}
        onToggleChecklist={handleToggleChecklist}
        onUpdateConsecutiveMonths={handleUpdateConsecutiveMonths}
      />

      <GraduationSummaryBox
        branch={currentBranch}
        currentGraduation={currentGraduation}
        onUpdateLearnings={handleUpdateLearnings}
        onGraduationApproval={handleGraduationApproval}
      />
    </div>
  );
};
