import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../lib/database/DatabaseProvider';

/**
 * GET /api/documents/[id]
 * Gibt ein Dokument anhand seiner ID zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const documentDAO = DatabaseProvider.getInstance().getDocumentDAO();
    const document = await documentDAO.findById(id);
    
    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: document });
  } catch (error) {
    console.error(`Error fetching document with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/documents/[id]
 * Aktualisiert ein Dokument
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const data = await request.json();
    
    const documentDAO = DatabaseProvider.getInstance().getDocumentDAO();
    const document = await documentDAO.update({ id, ...data });
    
    return NextResponse.json({ success: true, data: document });
  } catch (error) {
    console.error(`Error updating document with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/documents/[id]
 * Löscht ein Dokument
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const documentDAO = DatabaseProvider.getInstance().getDocumentDAO();
    await documentDAO.delete(id);
    
    return NextResponse.json(
      { success: true, message: 'Document deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting document with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 