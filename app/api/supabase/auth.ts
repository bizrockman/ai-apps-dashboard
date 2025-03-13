import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Geheimer Schlüssel für die JWT-Verifizierung
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In Produktion sollte dies eine sichere Umgebungsvariable sein

/**
 * Prüft, ob der Benutzer authentifiziert ist
 * @param request Die Next.js-Anfrage
 * @returns true, wenn der Benutzer authentifiziert ist, sonst false
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    // Auth-Token aus den Cookies abrufen
    const authToken = request.cookies.get('auth_token');
    
    if (!authToken?.value) {
      return false;
    }
    
    try {
      // Token verifizieren
      const decoded = jwt.verify(authToken.value, JWT_SECRET);
      return !!decoded;
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return false;
    }
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

/**
 * Extrahiert die Benutzer-ID aus dem Token
 * @param request Die Next.js-Anfrage
 * @returns Die Benutzer-ID oder null, wenn nicht authentifiziert
 */
export function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const authToken = request.cookies.get('auth_token');
    
    if (!authToken?.value) {
      return null;
    }
    
    const decoded = jwt.verify(authToken.value, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    console.error('Failed to extract user ID from token:', error);
    return null;
  }
} 