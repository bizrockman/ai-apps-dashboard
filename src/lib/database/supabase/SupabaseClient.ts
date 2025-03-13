import { createClient, SupabaseClient } from '@supabase/supabase-js';

class SupabaseClientSingleton {
  private static instance: SupabaseClient;

  private constructor() {}

  public static getInstance(): SupabaseClient {
    if (!SupabaseClientSingleton.instance) {
      // Für Next.js-Umgebung
      if (typeof process !== 'undefined' && process.env) {
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
      // Für Vite-Umgebung
      else if (typeof import.meta !== 'undefined' && import.meta.env) {
        SupabaseClientSingleton.instance = createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        );
      }
      else {
        throw new Error('Keine Umgebungsvariablen für Supabase gefunden');
      }
    }
    return SupabaseClientSingleton.instance;
  }
}

export default SupabaseClientSingleton;
