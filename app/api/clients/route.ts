import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../lib/database/DatabaseProvider';

/**
 * GET /api/clients
 * Gibt alle Kunden zurück
 */
export async function GET(request: NextRequest) {
  try {
    const clientDAO = DatabaseProvider.getInstance().getClientDAO();
    const clients = await clientDAO.findAll();
    
    return NextResponse.json({ 
      success: true, 
      data: clients 
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Erstellt einen neuen Kunden
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validierung der Eingabedaten
    if (!data.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    
    const clientDAO = DatabaseProvider.getInstance().getClientDAO();
    const client = await clientDAO.create(data);
    
    return NextResponse.json(
      { success: true, data: client },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
} 