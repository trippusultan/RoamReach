import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // After Google/Apple redirect, land back on this route
      // AuthGate below handles the session from the URL hash
      detectSessionInUrl: true,
      flowType: 'implicit',
      storage: undefined,                // use default (AsyncStorage on native, localStorage on web)
    },
  }
);

export type { Database } from '../types/supabase';
