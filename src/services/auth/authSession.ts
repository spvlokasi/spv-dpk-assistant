import { UserAccount, AuthSession } from '../../types/auth';

export const AUTH_STORAGE_KEY = 'spv_dpk_current_user_session';
export const LOCAL_USERS_KEY = 'spv_dpk_local_users';

export const DEFAULT_USERS: UserAccount[] = [
  { id: 'usr-spv', username: 'spvdpk', password: 'spvdpk1745', fullName: 'Supervisor DPK (Turnaround)', roleTitle: 'Supervisor DPK', department: 'Departemen Bisnis', businessManager: 'H. Bambang Irawan' },
  { id: 'usr-m3017', username: 'ktb.m3017', password: 'basmalah3017', fullName: 'KTB TokoBASMALAH Bugih', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'H. Bambang Irawan', branchCode: 'M3017' },
  { id: 'usr-m3019', username: 'ktb.m3019', password: 'basmalah3019', fullName: 'KTB TokoBASMALAH Pademawu', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'H. Bambang Irawan', branchCode: 'M3019' },
  { id: 'usr-m3021', username: 'ktb.m3021', password: 'basmalah3021', fullName: 'KTB TokoBASMALAH Sotabar', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'H. Bambang Irawan', branchCode: 'M3021' },
  { id: 'usr-m4016', username: 'ktb.m4016', password: 'basmalah4016', fullName: 'KTB TokoBASMALAH Kalianget', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'H. Bambang Irawan', branchCode: 'M4016' },
  { id: 'usr-m1025', username: 'ktb.m1025', password: 'basmalah1025', fullName: 'KTB TokoBASMALAH Tengket', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'H. Bambang Irawan', branchCode: 'M1025' },
  { id: 'usr-m1026', username: 'ktb.m1026', password: 'basmalah1026', fullName: 'KTB TokoBASMALAH Tlangoh', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'H. Bambang Irawan', branchCode: 'M1026' },
  { id: 'usr-w1001', username: 'ktb.w1001', password: 'basmalah1001', fullName: 'KTB TokoBASMALAH Sidayu', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'H. Bambang Irawan', branchCode: 'W1001' }
];

export const DEFAULT_USER = DEFAULT_USERS[0];

export const AuthSessionStorage = {
  getLocalUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(LOCAL_USERS_KEY);
      return data ? JSON.parse(data) : DEFAULT_USERS;
    } catch { return DEFAULT_USERS; }
  },
  getLocalUser(): UserAccount {
    return this.getLocalUsers()[0] || DEFAULT_USER;
  },
  saveLocalUser(user: UserAccount) {
    const list = this.getLocalUsers();
    const idx = list.findIndex((u) => u.username.toLowerCase() === user.username.toLowerCase());
    const updated = idx >= 0 ? list.map((u, i) => (i === idx ? user : u)) : [...list, user];
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updated));
  },
  getSession(): AuthSession | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },
  setSession(user: UserAccount) {
    const session: AuthSession = { token: `sess_${Date.now()}`, user, loginAt: new Date().toISOString() };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  },
  clearSession() { localStorage.removeItem(AUTH_STORAGE_KEY); }
};
