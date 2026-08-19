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
  ChevronUp
} from 'lucide-react';
import { Branch, ActionPlanMilestone, ActionPlanTask } from '../../types';

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

  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});

  // Quick Task Template Presets
  const PRESET_TASKS = [
    { title: 'Briefing pagi & simulasi roleplay penawaran promo kasir (PWP)', assignedTo: 'Kepala Toko', frequency: 'harian' as const },
    { title: 'Re-display rak eye-level depan untuk snack promo & minuman margin > 20%', assignedTo: 'Pramuniaga', frequency: 'sekali' as const },
    { title: 'Penyebaran 300 leaflet promo ke perumahan sekitar radius 500m', assignedTo: 'Pramuniaga', frequency: 'mingguan' as const },
    { title: 'Audit expired barang (FEFO) dan input retur BAP ke DC', assignedTo: 'Kepala Toko', frequency: 'harian' as const },
    { title: 'Pembersihan mika rak, lantai lorong, dan kaca depan (5R)', assignedTo: 'Kru Toko', frequency: 'harian' as const },
    { title: 'Cek suhu chiller dan matikan lampu kanopi toko tepat jam 06:00', assignedTo: 'Kru Toko', frequency: 'harian' as const }
  ];

  const currentBranch = branches.find(b => b.id === activeBranchId);
  const branchMilestones = milestones
    .filter(m => m.branchId === activeBranchId)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const toggleExpand = (id: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id]
    }));
  };

  const handleAddNewMilestone = () => {
    if (!activeBranchId) return;
    const nextWeek = branchMilestones.length + 1;
    const newMilestone: ActionPlanMilestone = {
      id: `ms-${Date.now()}`,
      branchId: activeBranchId,
      weekNumber: nextWeek,
      title: `Program Aksi Minggu ke-${nextWeek}`,
      targetMetric: `Target Penjualan Naik ke Rp ${(Number(currentBranch?.targetSalesPerDay || 10000000) * 0.95 / 1000000).toFixed(1)} Jt/hari`,
      status: 'in_progress',
      tasks: [
        {
          id: `t-${Date.now()}-1`,
          title: 'Briefing pagi target harian dan komitmen up-selling kasir',
          assignedTo: 'Kepala Toko',
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
      assignedTo: preset ? preset.assignedTo : 'Kepala Toko',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Target className="w-6 h-6 text-blue-400" />
            Program Aksi Perbaikan (Turnaround Roadmap)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Susun target milestone mingguan, tugaskan PIC, dan verifikasi kepatuhan eksekusi di toko.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            onClick={handleAddNewMilestone}
            className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-950 transition-all active:scale-95 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            + Tambah Minggu Aksi
          </button>
        </div>
      </div>

      {/* Branch Info Ribbon */}
      {currentBranch && (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-blue-400">
              {currentBranch.code}
            </div>
            <div>
              <span className="font-bold text-slate-200">{currentBranch.name}</span>
              <span className="text-slate-500 mx-2">•</span>
              <span className="text-slate-400">KaTok: <strong className="text-slate-300">{currentBranch.kepalaToko}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div>Fokus Strategi: <span className="text-amber-400 font-medium">{currentBranch.recommendedStrategy}</span></div>
          </div>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-4">
        {branchMilestones.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-300">Belum Ada Program Aksi untuk Toko Ini</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Mulai susun rencana aksi mingguan untuk memandu Kepala Toko dan kru.
            </p>
            <button
              onClick={handleAddNewMilestone}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow"
            >
              + Buat Minggu ke-1
            </button>
          </div>
        ) : (
          branchMilestones.map((milestone) => {
            const isExpanded = expandedMilestones[milestone.id] !== false; // default expanded
            const completedCount = milestone.tasks.filter(t => t.completed).length;
            const verifiedCount = milestone.tasks.filter(t => t.verifiedBySpv).length;
            const total = milestone.tasks.length;
            const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

            return (
              <div
                key={milestone.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Milestone Header */}
                <div className="p-4 sm:p-5 bg-slate-850 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-bold text-sm text-blue-400">
                      W{milestone.weekNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) => onSaveMilestone({ ...milestone, title: e.target.value })}
                          className="bg-transparent text-sm font-bold text-white focus:outline-none border-b border-transparent focus:border-blue-500 w-full"
                        />
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-amber-400 font-medium">🎯 Target:</span>
                        <input
                          type="text"
                          value={milestone.targetMetric}
                          onChange={(e) => onSaveMilestone({ ...milestone, targetMetric: e.target.value })}
                          placeholder="Tentukan target metrik..."
                          className="bg-transparent text-xs text-slate-300 focus:outline-none border-b border-transparent focus:border-blue-500 w-64 sm:w-80"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200">
                        {completedCount}/{total} Tugas ({pct}%)
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {verifiedCount} Terverifikasi SPV
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(milestone.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onDeleteMilestone(milestone.id)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-500 hover:text-rose-400"
                      title="Hapus Milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tasks Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-3">
                    {/* Quick Presets Picker */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[11px]">
                      <span className="text-slate-500 font-semibold flex-shrink-0 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Template Cepat:
                      </span>
                      {PRESET_TASKS.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddTask(milestone, preset)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 whitespace-nowrap transition-colors flex-shrink-0"
                        >
                          + {preset.title.slice(0, 30)}...
                        </button>
                      ))}
                    </div>

                    {/* Task Rows */}
                    <div className="space-y-2">
                      {milestone.tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            task.completed
                              ? 'bg-slate-850/80 border-slate-800 opacity-90'
                              : 'bg-slate-800/60 border-slate-700/70'
                          }`}
                        >
                          {/* Task Checkbox & Title */}
                          <div className="flex items-start sm:items-center gap-3 flex-1">
                            <button
                              onClick={() => handleToggleTaskCompleted(milestone, task.id)}
                              className="mt-0.5 sm:mt-0 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                              title={task.completed ? 'Tandai Belum Selesai' : 'Tandai Selesai oleh Toko'}
                            >
                              {task.completed ? (
                                <CheckSquare className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Square className="w-5 h-5 text-slate-500" />
                              )}
                            </button>

                            <div className="flex-1">
                              <input
                                type="text"
                                value={task.title}
                                onChange={(e) => handleUpdateTask(milestone, task.id, 'title', e.target.value)}
                                className={`w-full bg-transparent text-xs focus:outline-none border-b border-transparent focus:border-blue-500 ${
                                  task.completed ? 'line-through text-slate-400' : 'font-medium text-slate-200'
                                }`}
                              />
                            </div>
                          </div>

                          {/* Meta: AssignedTo, Frequency, SPV Verification */}
                          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
                            <select
                              value={task.assignedTo}
                              onChange={(e) => handleUpdateTask(milestone, task.id, 'assignedTo', e.target.value)}
                              className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                            >
                              <option value="Kepala Toko">👤 Kepala Toko</option>
                              <option value="Kasir">💳 Kasir</option>
                              <option value="Pramuniaga">📦 Pramuniaga</option>
                              <option value="Kru Toko">👥 Semua Kru</option>
                              <option value="SPV DPK">⭐ SPV DPK</option>
                            </select>

                            <select
                              value={task.frequency}
                              onChange={(e) => handleUpdateTask(milestone, task.id, 'frequency', e.target.value as any)}
                              className="bg-slate-900 border border-slate-700 text-slate-300 text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                            >
                              <option value="harian">Setiap Hari</option>
                              <option value="mingguan">Mingguan</option>
                              <option value="sekali">1x Saja</option>
                            </select>

                            {/* SPV Verification Badge Button */}
                            <button
                              onClick={() => handleToggleSpvVerify(milestone, task.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition-all ${
                                task.verifiedBySpv
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                              }`}
                              title="Verifikasi SPV saat kunjungan toko"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {task.verifiedBySpv ? 'Valid SPV' : 'Cek SPV'}
                            </button>

                            <button
                              onClick={() => handleDeleteTask(milestone, task.id)}
                              className="p-1 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAddTask(milestone)}
                      className="w-full py-2 border border-dashed border-slate-700 hover:border-blue-500 text-slate-400 hover:text-blue-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-2"
                    >
                      <Plus className="w-4 h-4" /> Tambah Baris Tugas Manual
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
