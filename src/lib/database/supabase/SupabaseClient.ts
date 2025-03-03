import { createClient, SupabaseClient } from '@supabase/supabase-js';

class SupabaseClientSingleton {
  private static instance: SupabaseClient;

  private constructor() {}

  public static getInstance(): SupabaseClient {
    if (!SupabaseClientSingleton.instance) {
      SupabaseClientSingleton.instance = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
    }
    return SupabaseClientSingleton.instance;
  }
}

export default SupabaseClientSingleton;
