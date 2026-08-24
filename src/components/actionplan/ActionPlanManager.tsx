import React, { useState, useEffect } from 'react';
import { Branch, ActionPlanMilestone, DailyPerformance, TurnaroundPhase } from '../../types';
import { generateGeminiActionPlan } from '../../services/geminiService';
import { useToast } from '../../context/ToastContext';
import { ActionPlanLeftSidebar } from './ActionPlanLeftSidebar';
import { ActionPlanPhaseTabs } from './ActionPlanPhaseTabs';
import { ActionPlanMilestoneCard } from './ActionPlanMilestoneCard';
import { ActionPlanApplyModal } from './ActionPlanApplyModal';

interface ActionPlanManagerProps {
  branches: Branch[];
  milestones: ActionPlanMilestone[];
  performance?: DailyPerformance[];
  selectedBranchId?: string;
  onSaveMilestone: (milestone: ActionPlanMilestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export const ActionPlanManager: React.FC<ActionPlanManagerProps> = ({
  branches, milestones, performance = [], selectedBranchId, onSaveMilestone, onDeleteMilestone
}) => {
  const { showToast } = useToast();
  const [activeBranchId, setActiveBranchId] = useState<string>(selectedBranchId || branches[0]?.id || '');
  const [selectedPhase, setSelectedPhase] = useState<'all' | TurnaroundPhase>('all');
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});
  const [showSmartModal, setShowSmartModal] = useState(false);

  useEffect(() => {
    const validId = selectedBranchId || branches[0]?.id || '';
    if (validId && (!activeBranchId || !branches.some((b) => b.id === activeBranchId))) {
      setActiveBranchId(validId);
    }
  }, [selectedBranchId, branches, activeBranchId]);

  const targetBranchId = activeBranchId || selectedBranchId || branches[0]?.id || '';
  const currentBranch = branches.find((b) => b.id === targetBranchId) || branches[0];
  const allBranchMilestones = milestones.filter((m) => m.branchId === targetBranchId).sort((a, b) => a.weekNumber - b.weekNumber);
  const filteredMilestones = selectedPhase === 'all' ? allBranchMilestones : allBranchMilestones.filter((m) => m.phase === selectedPhase);

  const handleApplySmartPlan = async () => {
    if (!currentBranch) return;
    const smartMilestones = await generateGeminiActionPlan(currentBranch, performance);
    smartMilestones.forEach((m: ActionPlanMilestone) => onSaveMilestone(m));
    showToast('Program Aksi Perbaikan berhasil dimuat & disinkronkan!', 'success');
    setShowSmartModal(false);
  };

  const handleAddNewMilestone = () => {
    if (!targetBranchId) return;
    const nextWeek = allBranchMilestones.length + 1;
    const phase: TurnaroundPhase = selectedPhase === 'all' ? (nextWeek <= 3 ? 'fase_1' : nextWeek <= 6 ? 'fase_2' : 'fase_3') : selectedPhase;
    const newMilestone: ActionPlanMilestone = {
      id: `ms-${Date.now()}`, branchId: targetBranchId, phase, monthNumber: nextWeek <= 3 ? 1 : nextWeek <= 6 ? 4 : 7,
      weekNumber: nextWeek, title: `Program Aksi Minggu ke-${nextWeek}`,
      targetMetric: `Target Laba Naik ke Rp ${((Number(currentBranch?.targetSalesPerDay || 1500000) * 0.95) / 1000000).toFixed(1)} Jt/hari`,
      status: 'in_progress', tasks: [{ id: `t-${Date.now()}-1`, title: 'Briefing pagi KTB & evaluasi kepatuhan SOP', assignedTo: 'KTB', frequency: 'harian', completed: false, verifiedBySpv: false }]
    };
    onSaveMilestone(newMilestone);
    setExpandedMilestones((prev) => ({ ...prev, [newMilestone.id]: true }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {currentBranch && (<div className="lg:col-span-4 lg:sticky lg:top-4"><ActionPlanLeftSidebar branch={currentBranch} milestones={allBranchMilestones} onOpenSmartModal={() => setShowSmartModal(true)} onAddNewMilestone={handleAddNewMilestone} /></div>)}
        <div className={`space-y-3.5 ${currentBranch ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <ActionPlanPhaseTabs branches={branches} activeBranchId={targetBranchId} onSelectBranch={setActiveBranchId} allMilestones={allBranchMilestones} selectedPhase={selectedPhase} onSelectPhase={setSelectedPhase} />
          <div className="space-y-3.5">
            {filteredMilestones.length === 0 ? (
              <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-3">
                <div className="text-xl">📋</div><h4 className="text-sm font-bold text-slate-300">Belum Ada Program Aksi</h4>
                <button type="button" onClick={() => setShowSmartModal(true)} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md active:scale-95">Muat Aksi</button>
              </div>
            ) : (
              filteredMilestones.map((m) => (<ActionPlanMilestoneCard key={m.id} milestone={m} isExpanded={Boolean(expandedMilestones[m.id])} onToggleExpand={() => setExpandedMilestones((prev) => ({ ...prev, [m.id]: !prev[m.id] }))} onDeleteMilestone={() => onDeleteMilestone(m.id)} onUpdateMilestone={onSaveMilestone} />))
            )}
          </div>
        </div>
      </div>
      {showSmartModal && currentBranch && <ActionPlanApplyModal branch={currentBranch} performance={performance} onConfirm={handleApplySmartPlan} onClose={() => setShowSmartModal(false)} />}
    </div>
  );
};
