import { UserAccount } from '../../types/auth';
import { getSupabaseClient } from '../supabase';
import { AuthSessionStorage } from './authSession';

export const handleUserLogin = async (
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; message: string; user?: UserAccount }> => {
  const cleanUser = usernameInput.trim();
  const cleanPass = passwordInput.trim();

  if (!cleanUser || !cleanPass) {
    return { success: false, message: 'Username dan password wajib diisi.' };
  }

  const client = getSupabaseClient();
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
          AuthSessionStorage.saveLocalUser(user);
          AuthSessionStorage.setSession(user);
          return { success: true, message: 'Login Berhasil (Cloud Database)!', user };
        } else {
          return { success: false, message: 'Password salah. Silakan coba lagi.' };
        }
      }
    } catch (e) {
      console.warn('Supabase auth fallback to local:', e);
    }
  }

  const localUser = AuthSessionStorage.getLocalUser();
  if (localUser.username === cleanUser && localUser.password === cleanPass) {
    AuthSessionStorage.setSession(localUser);
    return { success: true, message: 'Login Berhasil!', user: localUser };
  }

  return { success: false, message: 'Username atau password tidak sesuai.' };
};
