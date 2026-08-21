import React, { useState } from 'react';
import { 
  Target, 
  Plus, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  BookOpen,
  Award,
  TrendingUp,
  Flame
} from 'lucide-react';
import { Branch, ActionPlanMilestone, ActionPlanTask, TurnaroundPhase } from '../../types';
import { SOP_PHASES, generateSidogiriSopMilestones } from '../../services/sopTemplates';

interface ActionPlanManagerProps {
  branches: Branch[];
  milestones: ActionPlanMilestone[];
  selectedBranchId?: string;
  onSaveMilestone: (milestone: ActionPlanMilestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export const ActionPlanManager: React.FC<ActionPlanManagerProps> = ({
  branches,
  milestones,
  selectedBranchId,
  onSaveMilestone,
  onDeleteMilestone
}) => {
  const [activeBranchId, setActiveBranchId] = useState<string>(
    selectedBranchId || (branches.length > 0 ? branches[0].id : '')
  );

  const [selectedPhase, setSelectedPhase] = useState<'all' | TurnaroundPhase>('all');
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Quick Task Template Presets based on TokoBASMALAH SOP
  const PRESET_TASKS = [
    { title: 'Pengaturan suhu AC 24-25°C & matikan 1 unit saat sepi (08.00 - 11.00)', assignedTo: 'KTB', frequency: 'harian' as const },
    { title: 'Disiplin FEFO rak display & mark-down 10-20% sebelum expired 1-2 bulan', assignedTo: 'Pramuniaga', frequency: 'harian' as const },
    { title: 'Kasir wajib Add-on sales (kopi+gula) & suggestive selling promo margin >20%', assignedTo: 'Kasir', frequency: 'harian' as const },
    { title: 'Zero Out-of-Stock: Top 50 SKU omzet tidak boleh kosong satu hari pun', assignedTo: 'KTB', frequency: 'harian' as const },
    { title: 'Stock Opname (SO) parsial harian kategori rawan (Rokok, Susu, Kosmetik)', assignedTo: 'KTB', frequency: 'harian' as const },
    { title: 'Canvassing jemput bola ke warung & UMKM sekitar untuk suplai sembako', assignedTo: 'KTB', frequency: 'mingguan' as const }
  ];

  const currentBranch = branches.find(b => b.id === activeBranchId);
  const allBranchMilestones = milestones
    .filter(m => m.branchId === activeBranchId)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const filteredMilestones = selectedPhase === 'all'
    ? allBranchMilestones
    : allBranchMilestones.filter(m => m.phase === selectedPhase);

  const toggleExpand = (id: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const handleApplySidogiriTemplate = () => {
    if (!activeBranchId) return;
    const templateMilestones = generateSidogiriSopMilestones(activeBranchId);
    templateMilestones.forEach(m => {
      onSaveMilestone(m);
    });
    setShowApplyModal(false);
  };

  const handleAddNewMilestone = () => {
    if (!activeBranchId) return;
    const nextWeek = allBranchMilestones.length + 1;
    const currentPhase = selectedPhase === 'all' ? (nextWeek <= 3 ? 'fase_1' : nextWeek <= 6 ? 'fase_2' : 'fase_3') : selectedPhase;
    
    const newMilestone: ActionPlanMilestone = {
      id: `ms-${Date.now()}`,
      branchId: activeBranchId,
      phase: currentPhase,
      monthNumber: nextWeek <= 3 ? 1 : nextWeek <= 6 ? 4 : 7,
      weekNumber: nextWeek,
      title: `Program Aksi Minggu ke-${nextWeek}`,
      targetMetric: `Target Laba Naik ke Rp ${(Number(currentBranch?.targetSalesPerDay || 10000000) * 0.95 / 1000000).toFixed(1)} Jt/hari`,
      status: 'in_progress',
      tasks: [
        {
          id: `t-${Date.now()}-1`,
          title: 'Briefing pagi target harian dan komitmen up-selling kasir',
          assignedTo: 'KTB',
          frequency: 'harian',
          completed: false,
          verifiedBySpv: false
        }
      ]
    };
    onSaveMilestone(newMilestone);
  };

  const handleAddTask = (milestone: ActionPlanMilestone, preset?: typeof PRESET_TASKS[0]) => {
    const newTask: ActionPlanTask = {
      id: `t-${Date.now()}`,
      title: preset ? preset.title : 'Tugas rencana aksi baru',
      assignedTo: preset ? preset.assignedTo : 'KTB',
      frequency: preset ? preset.frequency : 'harian',
      completed: false,
      verifiedBySpv: false
    };
    const updated = {
      ...milestone,
      tasks: [...milestone.tasks, newTask]
    };
    onSaveMilestone(updated);
  };

  const handleToggleTaskCompleted = (milestone: ActionPlanMilestone, taskId: string) => {
    const updated = {
      ...milestone,
      tasks: milestone.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
    };
    onSaveMilestone(updated);
  };

  const handleToggleSpvVerify = (milestone: ActionPlanMilestone, taskId: string) => {
    const updated = {
      ...milestone,
      tasks: milestone.tasks.map(t => t.id === taskId ? { ...t, verifiedBySpv: !t.verifiedBySpv } : t)
    };
    onSaveMilestone(updated);
  };

  const handleDeleteTask = (milestone: ActionPlanMilestone, taskId: string) => {
    const updated = {
      ...milestone,
      tasks: milestone.tasks.filter(t => t.id !== taskId)
    };
    onSaveMilestone(updated);
  };

  const handleUpdateTask = (milestone: ActionPlanMilestone, taskId: string, field: keyof ActionPlanTask, val: any) => {
    const updated = {
      ...milestone,
      tasks: milestone.tasks.map(t => t.id === taskId ? { ...t, [field]: val } : t)
    };
    onSaveMilestone(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header & Branch Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3">
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap w-full sm:w-auto justify-between sm:justify-end">
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
            onClick={() => setShowApplyModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 transition-all active:scale-95 flex-shrink-0"
            title="Muat 7 Rencana Aksi SOP Resmi Sidogiri 180 Hari"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            Template SOP Sidogiri
          </button>

          <button
            onClick={handleAddNewMilestone}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            + Tambah Aksi
          </button>
        </div>
      </div>

      {/* 180-Day Phase Filter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setSelectedPhase('all')}
          className={`p-3 rounded-2xl border text-left transition-all ${
            selectedPhase === 'all'
              ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[11px] font-bold text-slate-200">Semua Roadmap</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total {allBranchMilestones.length} Milestone Aksi</div>
        </button>

        {SOP_PHASES.map((phase) => {
          const count = allBranchMilestones.filter(m => m.phase === phase.id).length;
          const isSelected = selectedPhase === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => setSelectedPhase(phase.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${phase.badgeColor}`}>
                  {phase.duration}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{count} Aksi</span>
              </div>
              <div className="text-xs font-bold text-white mt-1.5 truncate">{phase.title}</div>
              <div className="text-[10px] text-emerald-400 font-medium truncate">{phase.subtitle}</div>
            </button>
          );
        })}
      </div>

      {/* Branch Info Ribbon */}
      {currentBranch && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-emerald-400">
              {currentBranch.code}
            </div>
            <div>
              <span className="font-bold text-slate-200">{currentBranch.name}</span>
              <span className="text-slate-500 mx-2">•</span>
              <span className="text-slate-400">KTB: <strong className="text-slate-300">{currentBranch.kepalaToko}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div>Fokus Strategi: <span className="text-amber-400 font-medium">{currentBranch.recommendedStrategy || 'Turnaround Operasional'}</span></div>
          </div>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-4">
        {filteredMilestones.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-300">Belum Ada Program Aksi untuk Kategori Ini</h4>
            <p className="text-xs text-slate-500 mt-1 mb-5 max-w-md mx-auto">
              Gunakan Template Resmi PT. Sidogiri Mitra Utama untuk langsung mengisi 7 milestone checklist perbaikan otomatis.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleApplySidogiriTemplate}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                Muat Roadmap 180 Hari Otomatis
              </button>
              <button
                onClick={handleAddNewMilestone}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700"
              >
                + Buat Manual
              </button>
            </div>
          </div>
        ) : (
          filteredMilestones.map((milestone) => {
            const isExpanded = expandedMilestones[milestone.id] !== false; // default expanded
            const completedCount = milestone.tasks.filter(t => t.completed).length;
            const verifiedCount = milestone.tasks.filter(t => t.verifiedBySpv).length;
            const total = milestone.tasks.length;
            const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

            const phaseInfo = SOP_PHASES.find(p => p.id === milestone.phase);

            return (
              <div
                key={milestone.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Milestone Header */}
                <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center font-bold text-sm text-emerald-400">
                      W{milestone.weekNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {phaseInfo && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${phaseInfo.badgeColor}`}>
                            {phaseInfo.title} ({phaseInfo.duration})
                          </span>
                        )}
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => onSaveMilestone({ ...milestone, title: e.target.value })}
                          className="bg-transparent text-sm font-bold text-white focus:outline-none border-b border-transparent focus:border-emerald-500 w-full sm:w-96"
                        />
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                        <span className="text-amber-400 font-medium">🎯 Target Metrik:</span>
                        <input
                          type="text"
                          value={milestone.targetMetric}
                          onChange={(e) => onSaveMilestone({ ...milestone, targetMetric: e.target.value })}
                          placeholder="Tentukan target metrik..."
                          className="bg-transparent text-xs text-slate-300 focus:outline-none border-b border-transparent focus:border-emerald-500 w-64 sm:w-80"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200">
                        {completedCount}/{total} Tugas ({pct}%)
                      </div>
                      <div className="text-[10px] text-emerald-400 font-medium">
                        {verifiedCount} Diverifikasi SPV
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(milestone.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onDeleteMilestone(milestone.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400"
                      title="Hapus Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Milestone Tasks Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Task Checklist Items */}
                    <div className="space-y-2.5">
                      {milestone.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            task.completed
                              ? 'bg-slate-850/50 border-slate-800 text-slate-400'
                              : 'bg-slate-850 border-slate-750 text-slate-200'
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3 flex-1">
                            <button
                              onClick={() => handleToggleTaskCompleted(milestone, task.id)}
                              className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                            >
                              {task.completed ? (
                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>

                            <input
                              type="text"
                              value={task.title}
                              onChange={(e) => handleUpdateTask(milestone, task.id, 'title', e.target.value)}
                              className={`bg-transparent text-xs w-full focus:outline-none border-b border-transparent focus:border-slate-600 ${
                                task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                              }`}
                            />
                          </div>

                          <div className="flex items-center gap-2.5 pl-8 sm:pl-0 flex-wrap sm:flex-nowrap">
                            <select
                              value={task.assignedTo}
                              onChange={(e) => handleUpdateTask(milestone, task.id, 'assignedTo', e.target.value)}
                              className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                            >
                              <option value="KTB">KTB (Kepala Toko)</option>
                              <option value="Kasir">Kasir</option>
                              <option value="Pramuniaga">Pramuniaga</option>
                              <option value="Kru Toko">Kru Toko</option>
                              <option value="SPV DPK">SPV DPK</option>
                            </select>

                            <select
                              value={task.frequency}
                              onChange={(e) => handleUpdateTask(milestone, task.id, 'frequency', e.target.value as any)}
                              className="bg-slate-800 border border-slate-700 text-slate-400 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                            >
                              <option value="harian">Harian</option>
                              <option value="mingguan">Mingguan</option>
                              <option value="sekali">Sekali</option>
                            </select>

                            <button
                              onClick={() => handleToggleSpvVerify(milestone, task.id)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 transition-all ${
                                task.verifiedBySpv
                                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                              }`}
                              title="Tandai telah diverifikasi saat kunjungan/monitoring SPV"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {task.verifiedBySpv ? 'Valid SPV' : 'Verifikasi'}
                            </button>

                            <button
                              onClick={() => handleDeleteTask(milestone, task.id)}
                              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Custom Task or Quick Presets */}
                    <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Tugas Cepat SOP:
                        </span>
                        {PRESET_TASKS.slice(0, 3).map((preset, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAddTask(milestone, preset)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10px] text-slate-300 truncate max-w-[200px]"
                            title={preset.title}
                          >
                            + {preset.title}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleAddTask(milestone)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1 self-end"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Tugas Baru
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Confirmation Modal for Applying 180-Day SOP Template */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Terapkan SOP PT. Sidogiri Mitra Utama</h3>
                <p className="text-xs text-slate-400">Target Transformasi 180 Hari TokoBASMALAH</p>
              </div>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-300">
              <p>
                Sistem akan memuat <strong>7 Program Aksi Mingguan Resmi</strong> lengkap dengan checklist tugas untuk:
              </p>
              <div className="space-y-2 bg-slate-850 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span><strong>Fase 1 (Bulan 1-3):</strong> Audit Efisiensi Energi AC/Lampu, Pangkas Dead Stock & Up-Selling Kasir (Target BEP).</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span><strong>Fase 2 (Bulan 4-6):</strong> Bedah Cabang, Zero OOS Top 50 SKU, SO Parsial Rokok/Susu & Canvassing UMKM (Target Profit).</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span><strong>Fase 3 (Bulan 7+):</strong> Standardisasi Autopilot & Re-Investasi Minuman RTD (Target Dominasi).</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleApplySidogiriTemplate}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950 flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                Muat 7 Rencana Aksi Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
