import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../../../lib/database/DatabaseProvider';

interface Params {
  params: {
    clientId: string;
  };
}

/**
 * GET /api/projects/client/[clientId]
 * Ruft alle Projekte für einen bestimmten Kunden ab
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { clientId } = params;
    const projectDAO = DatabaseProvider.getInstance().getProjectDAO();
    
    // Prüfe, ob der Client existiert
    const clientDAO = DatabaseProvider.getInstance().getClientDAO();
    const client = await clientDAO.findById(clientId);
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Rufe alle Projekte für diesen Client ab
    const projects = await projectDAO.findByClient(clientId);
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error(`Error fetching projects for client ${params.clientId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch projects for client' },
      { status: 500 }
    );
  }
} 