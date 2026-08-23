import { Branch, DailyPerformance, ActionPlanMilestone } from '../../types';
import { detectBranchIssues } from './actionPlanIssues';
import { buildSmartFase1 } from './actionPlanFase1';
import { buildSmartFase2 } from './actionPlanFase2';
import { buildSmartFase3 } from './actionPlanFase3';

export const generateSmartActionPlan = (
  branch: Branch,
  performanceHistory: DailyPerformance[] = []
): ActionPlanMilestone[] => {
  const timestamp = Date.now();
  const ctx = detectBranchIssues(branch, performanceHistory);

  return [
    ...buildSmartFase1(branch.id, timestamp, ctx),
    ...buildSmartFase2(branch.id, timestamp, ctx),
    ...buildSmartFase3(branch.id, timestamp)
  ];
};
