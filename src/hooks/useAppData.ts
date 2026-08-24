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
    const cloud = await StorageService.fetchLiveFromCloud();
    if (cloud) {
      setBranches(cloud.branches);
      setMilestones(cloud.milestones);
      setVisits(cloud.visits);
      setPerformance(cloud.performance);
      setGraduations(cloud.graduations);
      setEscalations(cloud.escalations);
    } else {
      setBranches(StorageService.getBranches());
      setMilestones(StorageService.getMilestones());
      setVisits(StorageService.getVisits());
      setPerformance(StorageService.getPerformance());
      setGraduations(StorageService.getGraduations());
      setEscalations(StorageService.getEscalations());
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) loadData();
  }, [isLoggedIn, loadData]);

  return {
    branches, milestones, visits, performance, graduations, escalations, loadData,
    handleSaveBranch: async (b: Branch) => { await StorageService.saveBranch(b); await loadData(); },
    handleDeleteBranch: async (id: string) => { await StorageService.deleteBranch(id); await loadData(); },
    handleSaveMilestone: async (m: ActionPlanMilestone) => { await StorageService.saveMilestone(m); await loadData(); },
    handleDeleteMilestone: async (id: string) => { await StorageService.deleteMilestone(id); await loadData(); },
    handleSaveVisit: async (v: FieldVisit) => { await StorageService.saveVisit(v); await loadData(); },
    handleDeleteVisit: async (id: string) => { await StorageService.deleteVisit(id); await loadData(); },
    handleAddPerformance: async (p: DailyPerformance) => {
      setPerformance((prev) => {
        const idx = prev.findIndex((x) => x.id === p.id || (x.branchId === p.branchId && x.date === p.date));
        return idx >= 0 ? prev.map((x, i) => (i === idx ? p : x)) : [p, ...prev];
      });
      await StorageService.addPerformanceEntry(p);
      await loadData();
    },
    handleBulkAddPerformance: async (entries: DailyPerformance[]) => {
      setPerformance((prev) => {
        const copy = [...prev];
        entries.forEach((e) => {
          const idx = copy.findIndex((x) => x.id === e.id || (x.branchId === e.branchId && x.date === e.date));
          if (idx >= 0) copy[idx] = e;
          else copy.unshift(e);
        });
        return copy;
      });
      await StorageService.bulkAddPerformance(entries);
      await loadData();
    },
    handleDeletePerformance: async (id: string) => {
      setPerformance((prev) => prev.filter((x) => x.id !== id));
      await StorageService.deletePerformanceEntry(id);
      await loadData();
    },
    handleSaveGraduation: async (g: BranchGraduation) => { await StorageService.saveGraduation(g); await loadData(); },
    handleSaveEscalation: async (e: EscalationTicket) => { await StorageService.saveEscalation(e); await loadData(); },
    handleDeleteEscalation: async (id: string) => { await StorageService.deleteEscalation(id); await loadData(); }
  };
};
