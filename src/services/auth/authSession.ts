import { UserAccount, AuthSession } from '../../types/auth';

export const AUTH_STORAGE_KEY = 'spv_dpk_current_user_session';
export const LOCAL_USERS_KEY = 'spv_dpk_local_users';

export const DEFAULT_USER: UserAccount = {
  id: 'usr-admin-01',
  username: 'spvdpk',
  password: 'spvdpk1745',
  fullName: 'Supervisor DPK (Turnaround)',
  roleTitle: 'Supervisor DPK',
  department: 'Departemen Bisnis',
  businessManager: 'H. Bambang Irawan',
  createdAt: new Date().toISOString()
};

export const AuthSessionStorage = {
  getLocalUser(): UserAccount {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    if (!data) {
      this.saveLocalUser(DEFAULT_USER);
      return DEFAULT_USER;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_USER;
    }
  },

  saveLocalUser(user: UserAccount) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(user));
  },

  getSession(): AuthSession | null {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setSession(user: UserAccount) {
    const session: AuthSession = {
      token: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      user,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  },

  clearSession() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};
