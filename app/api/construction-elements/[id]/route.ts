import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../lib/database/DatabaseProvider';

/**
 * GET /api/construction-elements/[id]
 * Gibt ein Bauelement anhand seiner ID zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const elementDAO = DatabaseProvider.getInstance().getConstructionElementDAO();
    const element = await elementDAO.findById(id);
    
    if (!element) {
      return NextResponse.json(
        { success: false, error: 'Construction element not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: element });
  } catch (error) {
    console.error(`Error fetching construction element with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch construction element' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/construction-elements/[id]
 * Aktualisiert ein Bauelement
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
    
    const elementDAO = DatabaseProvider.getInstance().getConstructionElementDAO();
    const element = await elementDAO.update({ id, ...data });
    
    return NextResponse.json({ success: true, data: element });
  } catch (error) {
    console.error(`Error updating construction element with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update construction element' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/construction-elements/[id]
 * Löscht ein Bauelement
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const elementDAO = DatabaseProvider.getInstance().getConstructionElementDAO();
    await elementDAO.delete(id);
    
    return NextResponse.json(
      { success: true, message: 'Construction element deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting construction element with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete construction element' },
      { status: 500 }
    );
  }
} 