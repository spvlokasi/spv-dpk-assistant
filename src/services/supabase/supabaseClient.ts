import { createClient } from '@supabase/supabase-js';

export const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem('spv_supabase_url');
  const customKey = localStorage.getItem('spv_supabase_anon_key');

  const supabaseUrl = customUrl || import.meta.env.VITE_SUPABASE_URL || 'https://umtmjabmbbchxyvfrzrj.supabase.co';
  const supabaseAnonKey = customKey || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_edmE-mnVn581ArJNJCuKqw__O7OBWaX';

  return { supabaseUrl, supabaseAnonKey };
};

export const getSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.error('Gagal inisialisasi Supabase client:', e);
    return null;
  }
};
