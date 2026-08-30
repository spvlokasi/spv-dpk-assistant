import { Branch } from '../../types';
import { KEYS, safeParse } from './storageCore';
import { getSupabaseClient } from '../supabase';

export const BranchStorage = {
  getBranchImages(): Record<string, string> {
    return safeParse<Record<string, string>>(KEYS.BRANCH_IMAGES, {});
  },
  saveBranchImage(branchId: string, imageUrl: string) {
    try {
      const images = this.getBranchImages();
      images[branchId] = imageUrl;
      localStorage.setItem(KEYS.BRANCH_IMAGES, JSON.stringify(images));
    } catch (e) { console.warn('saveBranchImage error:', e); }
  },
  getBranches(): Branch[] {
    const raw = localStorage.getItem(KEYS.BRANCHES);
    let list = raw ? safeParse<Branch[]>(KEYS.BRANCHES, []) : [];
    const images = this.getBranchImages();
    return list.map((b) => ({ ...b, imageUrl: images[b.id] || b.imageUrl }));
  },
  getBranchById(id: string): Branch | undefined {
    return this.getBranches().find((b) => b.id === id);
  },
  saveBranches(branches: Branch[]) {
    try { localStorage.setItem(KEYS.BRANCHES, JSON.stringify(branches)); } catch (e) { console.warn('saveBranches error:', e); }
  },
  async saveBranch(branch: Branch) {
    const branches = this.getBranches();
    const index = branches.findIndex((b) => b.id === branch.id);
    if (branch.imageUrl) this.saveBranchImage(branch.id, branch.imageUrl);
    if (index >= 0) branches[index] = branch; else branches.unshift(branch);
    this.saveBranches(branches);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('branches').upsert({
          id: branch.id,
          code: branch.code,
          name: branch.name,
          address: branch.address || '',
          phone: branch.phone || '',
          city: branch.city || 'Jawa Timur',
          lat: branch.latitude ?? -7.1595,
          lng: branch.longitude ?? 113.4735,
          kepala_toko: branch.kepalaToko || '',
          spv_area: branch.spvArea || '',
          manajer_bisnis: branch.manajerBisnis || 'H. Bambang Irawan',
          entry_date: branch.entryDate || new Date().toISOString().slice(0, 10),
          target_graduation_date: branch.targetGraduationDate || null,
          diagnosis_start_date: branch.diagnosisStartDate || null,
          diagnosis_end_date: branch.diagnosisEndDate || null,
          category: branch.category || 'sales_drop',
          status: branch.status || 'kritis',
          urgency_level: branch.urgencyLevel || 'tinggi',
          target_sales_per_day: Number(branch.targetSalesPerDay) || 1500000,
          target_margin_pct: Number(branch.targetMarginPct) || 15.5,
          target_max_opex_per_month: Number(branch.targetMaxOpexPerMonth) || 22000000,
          root_causes: branch.rootCauses || [],
          diagnosis_summary: branch.diagnosisSummary || '',
          recommended_strategy: branch.recommendedStrategy || '',
          image_url: branch.imageUrl || null,
          updated_at: new Date().toISOString()
        });
      } catch (e) { console.warn('Auto-sync branch failed:', e); }
    }
  },
  async deleteBranch(id: string) {
    const branches = this.getBranches().filter((b) => b.id !== id);
    this.saveBranches(branches);
    const client = getSupabaseClient();
    if (client) {
      try { await client.from('branches').delete().eq('id', id); } catch (e) { console.warn('Auto-sync delete branch failed:', e); }
    }
  }
};
