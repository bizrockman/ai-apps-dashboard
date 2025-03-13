import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * POST-Handler für die Benutzerabmeldung
 * @param request Die eingehende Anfrage
 * @returns Eine JSON-Antwort mit Erfolg oder Fehler
 */
export async function POST(request: NextRequest) {
  try {
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

    // Benutzer bei Supabase abmelden
    await supabase.auth.signOut();

    // Token aus dem Cookie entfernen
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Sofort ablaufen lassen
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error in POST /api/auth/logout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 