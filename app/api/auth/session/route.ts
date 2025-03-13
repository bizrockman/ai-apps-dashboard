import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createUserFromCredentials } from '../../../lib/auth/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In Produktion sollte dies eine sichere Umgebungsvariable sein

/**
 * GET-Handler für die Abfrage der aktuellen Benutzersitzung
 * @param request Die eingehende Anfrage
 * @returns Eine JSON-Antwort mit dem Benutzer oder einem Fehler
 */
export async function GET(request: NextRequest) {
  try {
    // Auth-Token aus den Cookies abrufen
    const authToken = request.cookies.get('auth_token');
    
    if (!authToken?.value) {
      return NextResponse.json({ user: null });
    }
    
    try {
      // Token verifizieren
      const decoded = jwt.verify(authToken.value, JWT_SECRET) as any;
      
      // Wenn es sich um einen Demo-Benutzer handelt
      if (decoded.username && decoded.role) {
        const user = createUserFromCredentials(decoded.username, decoded.role);
        return NextResponse.json({ user });
      }
      
      // Wenn es sich um einen Supabase-Benutzer handelt
      if (decoded.userId && decoded.email) {
        // Supabase-Client erstellen
        const cookieStore = cookies();
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              get(name: string) {
                return cookieStore.get(name)?.value;
              },
              set(name: string, value: string, options: any) {
                cookieStore.set({ name, value, ...options });
              },
              remove(name: string, options: any) {
                cookieStore.set({ name, value: '', ...options });
              },
            },
          }
        );
        
        // Benutzer von Supabase abrufen
        const { data, error } = await supabase.auth.getUser();
        
        if (error || !data.user) {
          return NextResponse.json({ user: null });
        }
        
        const user = {
          id: data.user.id,
          email: data.user.email,
          displayName: data.user.user_metadata?.name || data.user.email
        };
        
        return NextResponse.json({ user });
      }
      
      return NextResponse.json({ user: null });
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 