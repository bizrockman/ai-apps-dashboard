import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../lib/database/DatabaseProvider';

/**
 * GET /api/documents
 * Gibt alle Dokumente zurück
 */
export async function GET(request: NextRequest) {
  try {
    const documentDAO = DatabaseProvider.getInstance().getDocumentDAO();
    const documents = await documentDAO.findAll();
    
    return NextResponse.json({ 
      success: true, 
      data: documents 
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents
 * Erstellt ein neues Dokument
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validierung der Eingabedaten
    if (!data.title || !data.projectId || !data.typeId) {
      return NextResponse.json(
        { success: false, error: 'Title, projectId and typeId are required' },
        { status: 400 }
      );
    }
    
    const documentDAO = DatabaseProvider.getInstance().getDocumentDAO();
    const document = await documentDAO.create(data);
    
    return NextResponse.json(
      { success: true, data: document },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create document' },
      { status: 500 }
    );
  }
} 