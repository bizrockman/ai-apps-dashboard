import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../supabase/auth';
import { DatabaseProvider } from '../../lib/database/DatabaseProvider';

/**
 * GET-Handler für die Abfrage aller Dokument-Typen
 */
export async function GET(request: NextRequest) {
  // Authentifizierung prüfen
  if (!await isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    // DAO über den DatabaseProvider abrufen
    const dbProvider = DatabaseProvider.getInstance();
    const documentTypeDAO = dbProvider.getDocumentTypeDAO();
    
    // Alle Dokument-Typen abrufen
    const documentTypes = await documentTypeDAO.findAll();
    
    return NextResponse.json({ data: documentTypes });
  } catch (error) {
    console.error('Error fetching document types:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST-Handler für die Erstellung eines neuen Dokument-Typs
 */
export async function POST(request: NextRequest) {
  // Authentifizierung prüfen
  if (!await isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const data = await request.json();
    
    // DAO über den DatabaseProvider abrufen
    const dbProvider = DatabaseProvider.getInstance();
    const documentTypeDAO = dbProvider.getDocumentTypeDAO();
    
    // Neuen Dokument-Typ erstellen
    const documentType = await documentTypeDAO.create(data);
    
    return NextResponse.json({ data: documentType });
  } catch (error) {
    console.error('Error creating document type:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 