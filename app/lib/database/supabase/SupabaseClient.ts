import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Diese Klasse ist nur für serverseitige Verwendung gedacht
class SupabaseClientSingleton {
  private static instance: SupabaseClient;

  private constructor() {}

  public static getInstance(): SupabaseClient {
    if (!SupabaseClientSingleton.instance) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('SUPABASE_URL und SUPABASE_ANON_KEY müssen in den Umgebungsvariablen definiert sein');
      }
      
      SupabaseClientSingleton.instance = createClient(
        supabaseUrl,
        supabaseKey
      );
    }
    return SupabaseClientSingleton.instance;
  }
}

export default SupabaseClientSingleton;
