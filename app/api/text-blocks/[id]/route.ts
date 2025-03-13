import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../../supabase/auth';
import { DatabaseProvider } from '../../../lib/database/DatabaseProvider';

/**
 * GET-Handler für die Abfrage eines einzelnen Textblocks
 * @param request Die eingehende Anfrage
 * @param params Die Parameter aus der URL (enthält die ID)
 * @returns Eine JSON-Antwort mit dem Textblock oder einen Fehler
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Überprüfen, ob der Benutzer authentifiziert ist
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Textblock über das DAO-Pattern abrufen
    const databaseProvider = new DatabaseProvider();
    const textBlockDAO = databaseProvider.getTextBlockDAO();
    const textBlock = await textBlockDAO.findById(id);

    if (!textBlock) {
      return NextResponse.json({ error: 'Text block not found' }, { status: 404 });
    }

    return NextResponse.json({ data: textBlock });
  } catch (error) {
    console.error(`Error in GET /api/text-blocks/${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PUT-Handler für die Aktualisierung eines Textblocks
 * @param request Die eingehende Anfrage
 * @param params Die Parameter aus der URL (enthält die ID)
 * @returns Eine JSON-Antwort mit dem aktualisierten Textblock oder einen Fehler
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Überprüfen, ob der Benutzer authentifiziert ist
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await request.json();

    // Textblock über das DAO-Pattern aktualisieren
    const databaseProvider = new DatabaseProvider();
    const textBlockDAO = databaseProvider.getTextBlockDAO();
    const updatedTextBlock = await textBlockDAO.update({ ...data, id });

    return NextResponse.json({ data: updatedTextBlock });
  } catch (error) {
    console.error(`Error in PUT /api/text-blocks/${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE-Handler für das Löschen eines Textblocks
 * @param request Die eingehende Anfrage
 * @param params Die Parameter aus der URL (enthält die ID)
 * @returns Eine JSON-Antwort mit dem Erfolg oder einen Fehler
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Überprüfen, ob der Benutzer authentifiziert ist
    const authenticated = await isAuthenticated(request);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Textblock über das DAO-Pattern löschen
    const databaseProvider = new DatabaseProvider();
    const textBlockDAO = databaseProvider.getTextBlockDAO();
    const success = await textBlockDAO.delete(id);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete text block' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error in DELETE /api/text-blocks/${params.id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 