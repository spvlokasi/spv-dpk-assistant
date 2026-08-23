export const KEYS = {
  BRANCHES: 'spv_dpk_branches',
  BRANCH_IMAGES: 'spv_dpk_branch_images',
  DIAGNOSIS_LOGS: 'spv_dpk_diagnosis_logs',
  MILESTONES: 'spv_dpk_milestones',
  VISITS: 'spv_dpk_visits',
  PERFORMANCE: 'spv_dpk_performance',
  GRADUATIONS: 'spv_dpk_graduations',
  ESCALATIONS: 'spv_dpk_escalations',
  SPV_PROFILE: 'spv_dpk_profile'
};

export interface SpvProfile {
  name: string;
  department: string;
  businessManager: string;
  roleTitle: string;
}

export const DEFAULT_PROFILE: SpvProfile = {
  name: 'Supervisor DPK (Turnaround)',
  department: 'Departemen Bisnis',
  businessManager: 'H. Bambang Irawan',
  roleTitle: 'Supervisor DPK'
};

export function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Storage parse error for ${key}:`, e);
    return fallback;
  }
}

export const ProfileStorage = {
  getProfile(): SpvProfile {
    const fromAuth = safeParse<any>('spv_dpk_local_users', null);
    if (fromAuth && fromAuth.fullName) {
      return {
        name: fromAuth.fullName,
        department: fromAuth.department || 'Departemen Bisnis',
        businessManager: fromAuth.businessManager || 'H. Bambang Irawan',
        roleTitle: fromAuth.roleTitle || 'Supervisor DPK'
      };
    }
    return safeParse<SpvProfile>(KEYS.SPV_PROFILE, DEFAULT_PROFILE);
  },
  saveProfile(profile: SpvProfile) {
    try {
      localStorage.setItem(KEYS.SPV_PROFILE, JSON.stringify(profile));
      const localUser = safeParse<any>('spv_dpk_local_users', null);
      if (localUser) {
        const updated = {
          ...localUser,
          fullName: profile.name,
          roleTitle: profile.roleTitle,
          department: profile.department,
          businessManager: profile.businessManager
        };
        localStorage.setItem('spv_dpk_local_users', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('saveProfile error:', e);
    }
  }
};
