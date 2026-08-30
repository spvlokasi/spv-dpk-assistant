import { UserAccount } from '../../types/auth';
import { getSupabaseClient } from '../supabase';
import { AuthSessionStorage } from './authSession';

export const handleUpdateAccount = async (
  updatedData: Partial<UserAccount>
): Promise<{ success: boolean; message: string; user?: UserAccount }> => {
  const currentSession = AuthSessionStorage.getSession();
  const currentUser = currentSession?.user || AuthSessionStorage.getLocalUser();
  const newUser: UserAccount = {
    ...currentUser,
    ...updatedData
  };

  AuthSessionStorage.saveLocalUser(newUser);
  AuthSessionStorage.setSession(newUser);

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
        branch_code: newUser.branchCode || null,
        updated_at: new Date().toISOString()
      });
    } catch (e) {
      console.error('Gagal sync akun ke Supabase:', e);
    }
  }

  return { success: true, message: 'Profil dan Akun Berhasil Diperbarui!', user: newUser };
};

