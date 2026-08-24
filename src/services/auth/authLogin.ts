import { UserAccount } from '../../types/auth';
import { getSupabaseClient } from '../supabase';
import { AuthSessionStorage } from './authSession';

export const handleUserLogin = async (
  usernameInput: string,
  passwordInput: string
): Promise<{ success: boolean; message: string; user?: UserAccount }> => {
  const cleanUser = usernameInput.trim().toLowerCase();
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
        .ilike('username', cleanUser)
        .single();

      if (data && !error && data.password === cleanPass) {
        const user: UserAccount = {
          id: data.id,
          username: data.username,
          password: data.password,
          fullName: data.full_name || 'Kepala Toko',
          roleTitle: data.role_title || 'Kepala Toko',
          department: data.department || 'Operasional Toko',
          businessManager: data.business_manager || 'H. Bambang Irawan',
          branchCode: data.branch_code,
          createdAt: data.created_at
        };
        AuthSessionStorage.saveLocalUser(user);
        AuthSessionStorage.setSession(user);
        return { success: true, message: 'Login Berhasil (Cloud Database)!', user };
      }
    } catch (e) {
      console.warn('Supabase auth fallback:', e);
    }
  }

  const users = AuthSessionStorage.getLocalUsers();
  const matched = users.find((u) => u.username.toLowerCase() === cleanUser && u.password === cleanPass);
  if (matched) {
    AuthSessionStorage.setSession(matched);
    return { success: true, message: 'Login Berhasil!', user: matched };
  }

  return { success: false, message: 'Username atau password tidak sesuai.' };
};
