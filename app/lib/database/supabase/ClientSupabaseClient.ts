'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Diese Klasse ist nur für clientseitige Verwendung gedacht
// Sie verwendet die öffentliche URL, aber nicht den ANON_KEY
class ClientSupabaseClient {
  private static instance: SupabaseClient;

  private constructor() {}

  public static getInstance(): SupabaseClient {
    if (!ClientSupabaseClient.instance) {
      // Wir verwenden nur die öffentliche URL, aber keinen API-Schlüssel
      // Alle Operationen werden über die API-Routen durchgeführt
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      
      if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL muss in den Umgebungsvariablen definiert sein');
      }
      
      // Wir erstellen einen Client ohne API-Schlüssel
      // Dieser Client kann nur für die Authentifizierung verwendet werden
      ClientSupabaseClient.instance = createClient(
        supabaseUrl,
        // Wir verwenden einen leeren String als Schlüssel
        // Dies erlaubt nur öffentliche Operationen wie Authentifizierung
        ''
      );
    }
    return ClientSupabaseClient.instance;
  }
}

export default ClientSupabaseClient; 