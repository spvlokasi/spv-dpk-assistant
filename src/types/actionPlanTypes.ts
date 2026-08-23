export interface ActionPlanTask {
  id: string;
  title: string;
  assignedTo: string;
  frequency: 'harian' | 'mingguan' | 'bulanan' | 'sekali';
  dueDate?: string;
  completed: boolean;
  verifiedBySpv: boolean;
  notes?: string;
}

export type TurnaroundPhase = 'fase_1' | 'fase_2' | 'fase_3';

export interface ActionPlanMilestone {
  id: string;
  branchId: string;
  phase?: TurnaroundPhase;
  monthNumber?: number;
  title: string;
  weekNumber: number;
  targetMetric: string;
  status: 'pending' | 'in_progress' | 'achieved' | 'failed';
  tasks: ActionPlanTask[];
}
