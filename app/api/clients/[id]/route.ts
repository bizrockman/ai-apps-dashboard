import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../lib/database/DatabaseProvider';

/**
 * GET /api/clients/[id]
 * Gibt einen Kunden anhand seiner ID zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const clientDAO = DatabaseProvider.getInstance().getClientDAO();
    const client = await clientDAO.findById(id);
    
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error(`Error fetching client with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clients/[id]
 * Aktualisiert einen Kunden
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
    
    const clientDAO = DatabaseProvider.getInstance().getClientDAO();
    const client = await clientDAO.update({ id, ...data });
    
    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error(`Error updating client with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clients/[id]
 * Löscht einen Kunden
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    
    const clientDAO = DatabaseProvider.getInstance().getClientDAO();
    await clientDAO.delete(id);
    
    return NextResponse.json(
      { success: true, message: 'Client deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting client with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    );
  }
} 