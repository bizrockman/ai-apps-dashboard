import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import jwt from 'jsonwebtoken';
import { checkCredentials, createUserFromCredentials } from '../../../lib/auth/users';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In Produktion sollte dies eine sichere Umgebungsvariable sein

/**
 * POST-Handler für die Benutzeranmeldung
 * @param request Die eingehende Anfrage mit Anmeldedaten
 * @returns Eine JSON-Antwort mit Erfolg oder Fehler
 */
export async function POST(request: NextRequest) {
  try {
    // Anmeldedaten aus der Anfrage extrahieren
    const { email, password, username } = await request.json();

    // Wenn Benutzername und Passwort angegeben sind, versuchen wir einen Demo-Login
    if (username && password) {
      const role = checkCredentials(username, password);
      
      if (role) {
        const user = createUserFromCredentials(username, role);
        
        // JWT-Token erstellen
        const token = jwt.sign(
          { 
            userId: user.id,
            username: user.username,
            role: user.role,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 Stunden gültig
          },
          JWT_SECRET
        );
        
        // Token im Cookie setzen
        const response = NextResponse.json({ success: true, user });
        response.cookies.set({
          name: 'auth_token',
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24, // 24 Stunden
          path: '/',
        });
        
        return response;
      }
      
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // Wenn E-Mail und Passwort angegeben sind, versuchen wir einen Supabase-Login
    if (email && password) {
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

      // Benutzer mit Supabase anmelden
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      // JWT-Token erstellen
      const token = jwt.sign(
        { 
          userId: data.user.id,
          email: data.user.email,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 Stunden gültig
        },
        JWT_SECRET
      );

      // Token im Cookie setzen
      const response = NextResponse.json({ success: true, user: data.user });
      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 Stunden
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ error: 'Email/username and password are required' }, { status: 400 });
  } catch (error) {
    console.error('Error in POST /api/auth/login:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 