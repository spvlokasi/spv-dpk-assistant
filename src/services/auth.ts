import { UserAccount, AuthSession } from '../types/auth';
import { getSupabaseClient } from './supabase';

const AUTH_STORAGE_KEY = 'spv_dpk_current_user_session';
const LOCAL_USERS_KEY = 'spv_dpk_local_users';

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

export const AuthService = {
  // Get stored local user accounts
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

  // Check active session
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
  },

  // Authenticate (Login)
  async login(usernameInput: string, passwordInput: string): Promise<{ success: boolean; message: string; user?: UserAccount }> {
    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, message: 'Username dan password wajib diisi.' };
    }

    const client = getSupabaseClient();

    // 1. Try checking in Supabase Cloud
    if (client) {
      try {
        const { data, error } = await client
          .from('user_accounts')
          .select('*')
          .eq('username', cleanUser)
          .single();

        if (data && !error) {
          if (data.password === cleanPass) {
            const user: UserAccount = {
              id: data.id,
              username: data.username,
              password: data.password,
              fullName: data.full_name || 'Supervisor DPK',
              roleTitle: data.role_title || 'Supervisor DPK',
              department: data.department || 'Departemen Bisnis',
              businessManager: data.business_manager || 'H. Bambang Irawan',
              createdAt: data.created_at
            };
            this.saveLocalUser(user);
            this.setSession(user);
            return { success: true, message: 'Login Berhasil (Cloud Database)!', user };
          } else {
            return { success: false, message: 'Password salah. Silakan coba lagi.' };
          }
        }
      } catch (e) {
        console.warn('Supabase auth fallback to local:', e);
      }
    }

    // 2. Fallback to LocalStorage
    const localUser = this.getLocalUser();
    if (localUser.username === cleanUser && localUser.password === cleanPass) {
      this.setSession(localUser);
      return { success: true, message: 'Login Berhasil!', user: localUser };
    }

    return { success: false, message: 'Username atau password tidak sesuai.' };
  },

  // Update Account Profile, Username or Password
  async updateAccount(updatedData: Partial<UserAccount>): Promise<{ success: boolean; message: string; user?: UserAccount }> {
    const currentUser = this.getLocalUser();
    const newUser: UserAccount = {
      ...currentUser,
      ...updatedData
    };

    // Save to local storage
    this.saveLocalUser(newUser);
    this.setSession(newUser);

    // Sync to Supabase Cloud
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('user_accounts').upsert({
          id: newUser.id,
          username: newUser.username,
          password: newUser.password,
          full_name: newUser.fullName,
          role_title: newUser.roleTitle,
          department: newUser.department,
          business_manager: newUser.businessManager,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.error('Gagal sync akun ke Supabase:', e);
      }
    }

    return { success: true, message: 'Profil dan Akun Berhasil Diperbarui!', user: newUser };
  }
};
