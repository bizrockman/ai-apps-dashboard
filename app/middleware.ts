import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

// Geheimer Schlüssel für die JWT-Verifizierung
// In einer Produktionsumgebung sollte dieser in einer Umgebungsvariable gespeichert werden
const JWT_SECRET = 'your-secret-key-change-in-production';

// Pfade, die nicht geschützt werden sollen
const publicPaths = ['/login', '/api/auth/login'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Öffentliche Pfade überspringen
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next();
  }
  
  // API-Routen werden in den jeweiligen Handlern geschützt
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Auth-Token aus den Cookies abrufen
  const authToken = request.cookies.get('auth-token');
  
  // Wenn kein Token vorhanden ist, zur Login-Seite umleiten
  if (!authToken?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Token verifizieren
    verify(authToken.value, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Bei ungültigem Token zur Login-Seite umleiten
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Konfiguration für die Middleware
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 