import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProvider } from '../../../../lib/database/DatabaseProvider';

/**
 * GET /api/contact-persons/client/[clientId]
 * Gibt alle Kontaktpersonen für einen bestimmten Kunden zurück
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    // Params als Promise behandeln
    const resolvedParams = await Promise.resolve(params);
    const { clientId } = resolvedParams;
    
    const contactPersonDAO = DatabaseProvider.getInstance().getContactPersonDAO();
    const contactPersons = await contactPersonDAO.findByClient(clientId);
    
    return NextResponse.json({ 
      success: true, 
      data: contactPersons 
    });
  } catch (error) {
    console.error(`Error fetching contact persons for client ${params.clientId}:`, error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact persons for client' },
      { status: 500 }
    );
  }
} 