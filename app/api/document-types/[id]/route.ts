import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../../supabase/auth';
import { DatabaseProvider } from '../../../lib/database/DatabaseProvider';

interface Params {
  params: {
    id: string;
  };
}

/**
 * GET-Handler für die Abfrage eines einzelnen Dokument-Typs
 */
export async function GET(request: NextRequest, { params }: Params) {
  // Authentifizierung prüfen
  if (!await isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { id } = params;
    
    // DAO über den DatabaseProvider abrufen
    const dbProvider = DatabaseProvider.getInstance();
    const documentTypeDAO = dbProvider.getDocumentTypeDAO();
    
    // Dokument-Typ abrufen
    const documentType = await documentTypeDAO.findById(id);
    
    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: documentType });
  } catch (error) {
    console.error(`Error fetching document type ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PUT-Handler für die Aktualisierung eines Dokument-Typs
 */
export async function PUT(request: NextRequest, { params }: Params) {
  // Authentifizierung prüfen
  if (!await isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { id } = params;
    const data = await request.json();
    
    // DAO über den DatabaseProvider abrufen
    const dbProvider = DatabaseProvider.getInstance();
    const documentTypeDAO = dbProvider.getDocumentTypeDAO();
    
    // Dokument-Typ aktualisieren
    const documentType = await documentTypeDAO.update({
      id,
      ...data
    });
    
    return NextResponse.json({ data: documentType });
  } catch (error) {
    console.error(`Error updating document type ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE-Handler für das Löschen eines Dokument-Typs
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  // Authentifizierung prüfen
  if (!await isAuthenticated(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const { id } = params;
    
    // DAO über den DatabaseProvider abrufen
    const dbProvider = DatabaseProvider.getInstance();
    const documentTypeDAO = dbProvider.getDocumentTypeDAO();
    
    // Dokument-Typ löschen
    const success = await documentTypeDAO.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete document type' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting document type ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 