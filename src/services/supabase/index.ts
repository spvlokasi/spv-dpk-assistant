import { getSupabaseConfig, getSupabaseClient } from './supabaseClient';
import { SupabaseFetch } from './supabaseFetch';
import { SupabasePush } from './supabasePush';

export const SupabaseService = {
  isConfigured(): boolean {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    return Boolean(supabaseUrl && supabaseAnonKey);
  },

  setCredentials(url: string, key: string) {
    localStorage.setItem('spv_supabase_url', url.trim());
    localStorage.setItem('spv_supabase_anon_key', key.trim());
  },

  getCredentials() {
    return getSupabaseConfig();
  },

  async testConnection(): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'URL Supabase atau Anon Key belum diisi.' };
    }
    try {
      const { error } = await client.from('branches').select('id').limit(1);
      if (error) {
        return { success: false, message: `Koneksi gagal: ${error.message}` };
      }
      return { success: true, message: 'Koneksi ke Supabase Cloud Berhasil! Database terhubung.' };
    } catch (e: any) {
      return { success: false, message: `Error koneksi: ${e.message || e}` };
    }
  },

  ...SupabaseFetch,
  ...SupabasePush
};

export { getSupabaseClient, getSupabaseConfig };
