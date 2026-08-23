import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, BranchGraduation, EscalationTicket } from '../types';

export const useAppData = (isLoggedIn: boolean) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [milestones, setMilestones] = useState<ActionPlanMilestone[]>([]);
  const [visits, setVisits] = useState<FieldVisit[]>([]);
  const [performance, setPerformance] = useState<DailyPerformance[]>([]);
  const [graduations, setGraduations] = useState<BranchGraduation[]>([]);
  const [escalations, setEscalations] = useState<EscalationTicket[]>([]);

  const loadData = () => {
    setBranches(StorageService.getBranches());
    setMilestones(StorageService.getMilestones());
    setVisits(StorageService.getVisits());
    setPerformance(StorageService.getPerformance());
    setGraduations(StorageService.getGraduations());
    setEscalations(StorageService.getEscalations());
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
      StorageService.syncFromCloudOnStartup().then((synced) => { if (synced) loadData(); });
    }
  }, [isLoggedIn]);

  return {
    branches, milestones, visits, performance, graduations, escalations, loadData,
    handleSaveBranch: async (b: Branch) => { await StorageService.saveBranch(b); loadData(); },
    handleDeleteBranch: async (id: string) => { await StorageService.deleteBranch(id); loadData(); },
    handleSaveMilestone: async (m: ActionPlanMilestone) => { await StorageService.saveMilestone(m); loadData(); },
    handleDeleteMilestone: async (id: string) => { await StorageService.deleteMilestone(id); loadData(); },
    handleSaveVisit: async (v: FieldVisit) => { await StorageService.saveVisit(v); loadData(); },
    handleDeleteVisit: async (id: string) => { await StorageService.deleteVisit(id); loadData(); },
    handleAddPerformance: async (p: DailyPerformance) => { await StorageService.addPerformanceEntry(p); loadData(); },
    handleDeletePerformance: async (id: string) => { await StorageService.deletePerformanceEntry(id); loadData(); },
    handleSaveGraduation: async (g: BranchGraduation) => { await StorageService.saveGraduation(g); loadData(); },
    handleUpdateBranchStatus: async (branchId: string, status: any) => {
      const branch = StorageService.getBranchById(branchId);
      if (branch) { branch.status = status; await StorageService.saveBranch(branch); loadData(); }
    },
    handleSaveEscalation: async (e: EscalationTicket) => { await StorageService.saveEscalation(e); loadData(); },
    handleDeleteEscalation: async (id: string) => { await StorageService.deleteEscalation(id); loadData(); }
  };
};
