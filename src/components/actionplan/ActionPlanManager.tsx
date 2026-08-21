import React, { useState } from 'react';
import { Branch, ActionPlanMilestone, DailyPerformance, TurnaroundPhase } from '../../types';
import { generateGeminiActionPlan } from '../../services/geminiService';
import { ActionPlanHeader } from './ActionPlanHeader';
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
  branches,
  milestones,
  performance = [],
  selectedBranchId,
  onSaveMilestone,
  onDeleteMilestone
}) => {
  const [activeBranchId, setActiveBranchId] = useState<string>(
    selectedBranchId || (branches.length > 0 ? branches[0].id : '')
  );

  const [selectedPhase, setSelectedPhase] = useState<'all' | TurnaroundPhase>('all');
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});
  const [showSmartModal, setShowSmartModal] = useState(false);

  const currentBranch = branches.find((b) => b.id === activeBranchId);
  const allBranchMilestones = milestones
    .filter((m) => m.branchId === activeBranchId)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const filteredMilestones =
    selectedPhase === 'all'
      ? allBranchMilestones
      : allBranchMilestones.filter((m) => m.phase === selectedPhase);

  const toggleExpand = (id: string) => {
    setExpandedMilestones((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const handleApplySmartPlan = async () => {
    if (!currentBranch) return;
    const smartMilestones = await generateGeminiActionPlan(currentBranch, performance);
    smartMilestones.forEach((m) => {
      onSaveMilestone(m);
    });
    setShowSmartModal(false);
  };

  const handleAddNewMilestone = () => {
    if (!activeBranchId) return;
    const nextWeek = allBranchMilestones.length + 1;
    const currentPhase =
      selectedPhase === 'all'
        ? nextWeek <= 3
          ? 'fase_1'
          : nextWeek <= 6
          ? 'fase_2'
          : 'fase_3'
        : selectedPhase;

    const newMilestone: ActionPlanMilestone = {
      id: `ms-${Date.now()}`,
      branchId: activeBranchId,
      phase: currentPhase,
      monthNumber: nextWeek <= 3 ? 1 : nextWeek <= 6 ? 4 : 7,
      weekNumber: nextWeek,
      title: `Program Aksi Minggu ke-${nextWeek}`,
      targetMetric: `Target Laba Naik ke Rp ${((Number(currentBranch?.targetSalesPerDay || 1500000) * 0.95) / 1000000).toFixed(1)} Jt/hari`,
      status: 'in_progress',
      tasks: [
        {
          id: `t-${Date.now()}-1`,
          title: 'Briefing pagi KTB & evaluasi kepatuhan SOP harian toko',
          assignedTo: 'KTB',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        }
      ]
    };

    onSaveMilestone(newMilestone);
    setExpandedMilestones((prev) => ({ ...prev, [newMilestone.id]: true }));
  };

  return (
    <div className="space-y-5">
      {/* Top Header Row */}
      <ActionPlanHeader
        branches={branches}
        activeBranchId={activeBranchId}
        onSelectBranch={setActiveBranchId}
      />

      {/* 2-Column Split Screen Layout (Pilihan 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Sticky Diagnosa & Target Sidebar) */}
        {currentBranch && (
          <div className="lg:col-span-4 lg:sticky lg:top-4">
            <ActionPlanLeftSidebar
              branch={currentBranch}
              milestones={allBranchMilestones}
              onOpenSmartModal={() => setShowSmartModal(true)}
              onAddNewMilestone={handleAddNewMilestone}
            />
          </div>
        )}

        {/* Right Column (Phase Pills & Checklist Tasks) */}
        <div className={`space-y-4 ${currentBranch ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          {/* Phase Filter Tabs (Pill Buttons) */}
          <ActionPlanPhaseTabs
            allMilestones={allBranchMilestones}
            selectedPhase={selectedPhase}
            onSelectPhase={setSelectedPhase}
          />

          {/* Milestones List */}
          <div className="space-y-3.5">
            {filteredMilestones.length === 0 ? (
              <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-xl mx-auto">
                  📋
                </div>
                <h4 className="text-sm font-bold text-slate-300">Belum Ada Program Aksi</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Klik <strong className="text-emerald-400">"Muat Aksi"</strong> di samping kiri untuk memuat roadmap otomatis sesuai diagnosa toko ini.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSmartModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Muat Aksi
                </button>
              </div>
            ) : (
              filteredMilestones.map((milestone) => (
                <ActionPlanMilestoneCard
                  key={milestone.id}
                  milestone={milestone}
                  isExpanded={expandedMilestones[milestone.id] ?? true}
                  onToggleExpand={() => toggleExpand(milestone.id)}
                  onDeleteMilestone={() => onDeleteMilestone(milestone.id)}
                  onUpdateMilestone={onSaveMilestone}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Smart Contextual Generation Confirmation Modal */}
      {showSmartModal && currentBranch && (
        <ActionPlanApplyModal
          branch={currentBranch}
          performance={performance}
          onConfirm={handleApplySmartPlan}
          onClose={() => setShowSmartModal(false)}
        />
      )}
    </div>
  );
};
