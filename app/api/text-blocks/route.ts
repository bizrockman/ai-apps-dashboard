import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../supabase/auth';
import { DatabaseProvider } from '../../lib/database/DatabaseProvider';

/**
 * GET-Handler für die Abfrage aller Textblöcke
 * @param request Die eingehende Anfrage
 * @returns Eine JSON-Antwort mit allen Textblöcken oder einen Fehler
 */
export async function GET(request: NextRequest) {
  try {
    // Überprüfen, ob der Benutzer authentifiziert ist
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Textblöcke über das DAO-Pattern abrufen
    const databaseProvider = new DatabaseProvider();
    const textBlockDAO = databaseProvider.getTextBlockDAO();
    const textBlocks = await textBlockDAO.findAll();

    return NextResponse.json({ data: textBlocks });
  } catch (error) {
    console.error('Error in GET /api/text-blocks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST-Handler für das Erstellen eines neuen Textblocks
 * @param request Die eingehende Anfrage
 * @returns Eine JSON-Antwort mit dem erstellten Textblock oder einen Fehler
 */
export async function POST(request: NextRequest) {
  try {
    // Überprüfen, ob der Benutzer authentifiziert ist
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Daten aus der Anfrage extrahieren
    const data = await request.json();

    // Textblock über das DAO-Pattern erstellen
    const databaseProvider = new DatabaseProvider();
    const textBlockDAO = databaseProvider.getTextBlockDAO();
    const textBlock = await textBlockDAO.create(data);

    return NextResponse.json({ data: textBlock });
  } catch (error) {
    console.error('Error in POST /api/text-blocks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 