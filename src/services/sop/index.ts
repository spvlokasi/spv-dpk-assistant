import { ActionPlanMilestone } from '../../types';
import { SOP_PHASES, SopPhaseInfo } from './sopPhases';
import { getFase1Milestones } from './sopFase1Milestones';
import { getFase2Milestones } from './sopFase2Milestones';
import { getFase3Milestones } from './sopFase3Milestones';

export const generateSidogiriSopMilestones = (branchId: string): ActionPlanMilestone[] => {
  const timestamp = Date.now();
  return [
    ...getFase1Milestones(branchId, timestamp),
    ...getFase2Milestones(branchId, timestamp),
    ...getFase3Milestones(branchId, timestamp)
  ];
};

export { SOP_PHASES };
export type { SopPhaseInfo };
