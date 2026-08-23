import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Target } from 'lucide-react';
import { ActionPlanMilestone, ActionPlanTask } from '../../types';
import { ActionPlanTaskItem } from './ActionPlanTaskItem';

interface ActionPlanMilestoneCardProps {
  milestone: ActionPlanMilestone;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDeleteMilestone: () => void;
  onUpdateMilestone: (updated: ActionPlanMilestone) => void;
}

export const ActionPlanMilestoneCard: React.FC<ActionPlanMilestoneCardProps> = ({
  milestone, isExpanded, onToggleExpand, onDeleteMilestone, onUpdateMilestone
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskRole, setNewTaskRole] = useState('KTB');
  const completedCount = milestone.tasks.filter((t) => t.completed).length;
  const totalCount = milestone.tasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: ActionPlanTask = { id: `t-${Date.now()}`, title: newTaskTitle.trim(), assignedTo: newTaskRole, frequency: 'harian', completed: false, verifiedBySpv: false };
    onUpdateMilestone({ ...milestone, tasks: [...milestone.tasks, newTask] });
    setNewTaskTitle('');
  };

  const handleUpdateTaskField = (taskId: string, field: keyof ActionPlanTask, val: any) => {
    onUpdateMilestone({ ...milestone, tasks: milestone.tasks.map((t) => (t.id === taskId ? { ...t, [field]: val } : t)) });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700">
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 border-b border-slate-850">
        <div className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer" onClick={onToggleExpand}>
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 font-mono flex-shrink-0">W{milestone.weekNumber}</div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-100 truncate">{milestone.title}</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5"><Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" /><span className="truncate text-slate-300 font-medium">{milestone.targetMetric}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-[11px] font-bold text-slate-200 font-mono">{completedCount}/{totalCount} <span className="text-emerald-400">({progressPct}%)</span></div>
            <div className="w-20 sm:w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPct}%` }} /></div>
          </div>
          <button type="button" onClick={onDeleteMilestone} className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-750" title="Hapus"><Trash2 className="w-3.5 h-3.5" /></button>
          <button type="button" onClick={onToggleExpand} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-3 bg-slate-900/50">
          <div className="space-y-2">
            {milestone.tasks.map((task) => (
              <ActionPlanTaskItem key={task.id} task={task} onToggleComplete={() => handleUpdateTaskField(task.id, 'completed', !task.completed)} onToggleVerified={() => handleUpdateTaskField(task.id, 'verifiedBySpv', !task.verifiedBySpv)} onDelete={() => onUpdateMilestone({ ...milestone, tasks: milestone.tasks.filter((t) => t.id !== task.id) })} onUpdateTitle={(val) => handleUpdateTaskField(task.id, 'title', val)} onUpdateAssigned={(val) => handleUpdateTaskField(task.id, 'assignedTo', val)} onUpdateFrequency={(val) => handleUpdateTaskField(task.id, 'frequency', val)} />
            ))}
          </div>
          <form onSubmit={handleAddTask} className="flex items-center gap-2 pt-2">
            <input type="text" placeholder="+ Tulis tugas aksi baru..." value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:border-emerald-500 focus:outline-none" />
            <select value={newTaskRole} onChange={(e) => setNewTaskRole(e.target.value)} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl px-2.5 py-2 focus:outline-none cursor-pointer">
              <option value="KTB">KTB</option><option value="Kasir">Kasir</option><option value="Pramuniaga">Pramuniaga</option><option value="Kru Toko">Kru Toko</option><option value="SPV Area">SPV Area</option>
            </select>
            <button type="submit" disabled={!newTaskTitle.trim()} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold active:scale-95 flex-shrink-0"><Plus className="w-3.5 h-3.5" /></button>
          </form>
        </div>
      )}
    </div>
  );
};
