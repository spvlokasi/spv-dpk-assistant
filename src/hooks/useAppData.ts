import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/storage';
import { Branch, ActionPlanMilestone, FieldVisit, DailyPerformance, BranchGraduation, EscalationTicket } from '../types';

export const useAppData = (isLoggedIn: boolean) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [milestones, setMilestones] = useState<ActionPlanMilestone[]>([]);
  const [visits, setVisits] = useState<FieldVisit[]>([]);
  const [performance, setPerformance] = useState<DailyPerformance[]>([]);
  const [graduations, setGraduations] = useState<BranchGraduation[]>([]);
  const [escalations, setEscalations] = useState<EscalationTicket[]>([]);

  const loadData = useCallback(async () => {
    // 1. Direct fetch from Supabase PostgreSQL as Primary Single Source of Truth
    const cloud = await StorageService.fetchLiveFromCloud();
    if (cloud) {
      setBranches(cloud.branches);
      setMilestones(cloud.milestones);
      setVisits(cloud.visits);
      setPerformance(cloud.performance);
      setGraduations(cloud.graduations);
      setEscalations(cloud.escalations);
    } else {
      // 2. Offline fallback only if disconnected
      setBranches(StorageService.getBranches());
      setMilestones(StorageService.getMilestones());
      setVisits(StorageService.getVisits());
      setPerformance(StorageService.getPerformance());
      setGraduations(StorageService.getGraduations());
      setEscalations(StorageService.getEscalations());
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn, loadData]);

  return {
    branches, milestones, visits, performance, graduations, escalations, loadData,
    handleSaveBranch: async (b: Branch) => { await StorageService.saveBranch(b); await loadData(); },
    handleDeleteBranch: async (id: string) => { await StorageService.deleteBranch(id); await loadData(); },
    handleSaveMilestone: async (m: ActionPlanMilestone) => { await StorageService.saveMilestone(m); await loadData(); },
    handleDeleteMilestone: async (id: string) => { await StorageService.deleteMilestone(id); await loadData(); },
    handleSaveVisit: async (v: FieldVisit) => { await StorageService.saveVisit(v); await loadData(); },
    handleDeleteVisit: async (id: string) => { await StorageService.deleteVisit(id); await loadData(); },
    handleAddPerformance: async (p: DailyPerformance) => { await StorageService.addPerformanceEntry(p); await loadData(); },
    handleDeletePerformance: async (id: string) => { await StorageService.deletePerformanceEntry(id); await loadData(); },
    handleSaveGraduation: async (g: BranchGraduation) => { await StorageService.saveGraduation(g); await loadData(); },
    handleUpdateBranchStatus: async (branchId: string, status: any) => {
      const branch = StorageService.getBranchById(branchId);
      if (branch) { branch.status = status; await StorageService.saveBranch(branch); await loadData(); }
    },
    handleSaveEscalation: async (e: EscalationTicket) => { await StorageService.saveEscalation(e); await loadData(); },
    handleDeleteEscalation: async (id: string) => { await StorageService.deleteEscalation(id); await loadData(); }
  };
};
