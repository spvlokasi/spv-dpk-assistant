import { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import { 
  Branch, 
  ActionPlanMilestone, 
  FieldVisit, 
  DailyPerformance, 
  BranchGraduation, 
  EscalationTicket 
} from '../types';

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
      StorageService.syncFromCloudOnStartup().then((synced) => {
        if (synced) loadData();
      });
    }
  }, [isLoggedIn]);

  // CRUD Handlers
  const handleSaveBranch = async (b: Branch) => {
    await StorageService.saveBranch(b);
    loadData();
  };

  const handleDeleteBranch = async (id: string) => {
    await StorageService.deleteBranch(id);
    loadData();
  };

  const handleSaveMilestone = async (m: ActionPlanMilestone) => {
    await StorageService.saveMilestone(m);
    loadData();
  };

  const handleDeleteMilestone = async (id: string) => {
    await StorageService.deleteMilestone(id);
    loadData();
  };

  const handleSaveVisit = async (v: FieldVisit) => {
    await StorageService.saveVisit(v);
    loadData();
  };

  const handleDeleteVisit = async (id: string) => {
    await StorageService.deleteVisit(id);
    loadData();
  };

  const handleAddPerformance = async (p: DailyPerformance) => {
    await StorageService.addPerformanceEntry(p);
    loadData();
  };

  const handleDeletePerformance = async (id: string) => {
    await StorageService.deletePerformanceEntry(id);
    loadData();
  };

  const handleSaveGraduation = async (g: BranchGraduation) => {
    await StorageService.saveGraduation(g);
    loadData();
  };

  const handleUpdateBranchStatus = async (branchId: string, status: any) => {
    const branch = StorageService.getBranchById(branchId);
    if (branch) {
      branch.status = status;
      await StorageService.saveBranch(branch);
      loadData();
    }
  };

  const handleSaveEscalation = async (e: EscalationTicket) => {
    await StorageService.saveEscalation(e);
    loadData();
  };

  const handleDeleteEscalation = async (id: string) => {
    await StorageService.deleteEscalation(id);
    loadData();
  };

  return {
    branches,
    milestones,
    visits,
    performance,
    graduations,
    escalations,
    loadData,
    handleSaveBranch,
    handleDeleteBranch,
    handleSaveMilestone,
    handleDeleteMilestone,
    handleSaveVisit,
    handleDeleteVisit,
    handleAddPerformance,
    handleDeletePerformance,
    handleSaveGraduation,
    handleUpdateBranchStatus,
    handleSaveEscalation,
    handleDeleteEscalation
  };
};
