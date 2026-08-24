import { UserAccount, AuthSession } from '../../types/auth';

export const AUTH_STORAGE_KEY = 'spv_dpk_active_session';

export const DEFAULT_USERS: UserAccount[] = [
  { id: 'usr-spv', username: 'spvdpk', password: 'spvdpk1745', fullName: 'M.Maskur', roleTitle: 'Supervisor DPK', department: 'Departemen Bisnis', businessManager: 'Rusli Hitami' },
  { id: 'usr-m3017', username: 'ktb.m3017', password: 'basmalah3017', fullName: "Baida'i (KTB Bugih)", roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'Rusli Hitami', branchCode: 'M3017' },
  { id: 'usr-m3019', username: 'ktb.m3019', password: 'basmalah3019', fullName: 'Surur (KTB Pademawu)', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'Rusli Hitami', branchCode: 'M3019' },
  { id: 'usr-m3021', username: 'ktb.m3021', password: 'basmalah3021', fullName: 'Khoirul (KTB Sotabar)', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'Rusli Hitami', branchCode: 'M3021' },
  { id: 'usr-m4016', username: 'ktb.m4016', password: 'basmalah4016', fullName: 'Herman (KTB Kalianget)', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'Rusli Hitami', branchCode: 'M4016' },
  { id: 'usr-m1025', username: 'ktb.m1025', password: 'basmalah1025', fullName: 'Somad (KTB Tengket)', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'Rusli Hitami', branchCode: 'M1025' },
  { id: 'usr-m1026', username: 'ktb.m1026', password: 'basmalah1026', fullName: 'KTB TokoBASMALAH Tlangoh', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'Rusli Hitami', branchCode: 'M1026' },
  { id: 'usr-w1001', username: 'ktb.w1001', password: 'basmalah1001', fullName: 'Mughni (KTB Sidayu)', roleTitle: 'Kepala Toko', department: 'Operasional Toko', businessManager: 'Rusli Hitami', branchCode: 'W1001' }
];

export const DEFAULT_USER = DEFAULT_USERS[0];

export const AuthSessionStorage = {
  getLocalUsers(): UserAccount[] {
    return DEFAULT_USERS;
  },
  getLocalUser(): UserAccount {
    return DEFAULT_USER;
  },
  saveLocalUser(_user: UserAccount) {
    // No-op: Supabase is the primary store
  },
  getSession(): AuthSession | null {
    try {
      const data = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  },
  setSession(user: UserAccount) {
    const session: AuthSession = { token: `sess_${Date.now()}`, user, loginAt: new Date().toISOString() };
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  },
  clearSession() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem('spv_dpk_current_user_session');
    localStorage.removeItem('spv_dpk_local_users');
  }
};
