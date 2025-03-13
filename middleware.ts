import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Definieren Sie die Routen, die geschützt werden sollen
const PROTECTED_API_ROUTES = [
  '/api/supabase/query',
  '/api/supabase/mutation',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Prüfen, ob es sich um eine geschützte API-Route handelt
  if (PROTECTED_API_ROUTES.some(route => pathname.startsWith(route))) {
    // CSRF-Schutz: Prüfen des Origin-Headers
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (!origin || !host || !origin.includes(host)) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF check failed' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Rate Limiting könnte hier implementiert werden
    
    // Authentifizierungsprüfung für API-Routen
    // Wir lassen die eigentliche Authentifizierungsprüfung in den Routen selbst,
    // da wir dort den Supabase-Client mit den richtigen Umgebungsvariablen erstellen können
  }
  
  return NextResponse.next();
}

// Konfigurieren Sie, für welche Pfade das Middleware ausgeführt werden soll
export const config = {
  matcher: [
    '/api/supabase/:path*',
  ],
}; 